import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'

export type AIProvider = 'openai' | 'deepseek' | 'anthropic'

export interface AIMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface AIGatewayConfig {
  provider: AIProvider
  model?: string
  temperature?: number
  maxTokens?: number
}

// Cost per 1M tokens (input/output)
export const AI_COSTS = {
  openai: {
    'gpt-4': { input: 30, output: 60 },
    'gpt-3.5-turbo': { input: 0.5, output: 1.5 },
  },
  deepseek: {
    'deepseek-chat': { input: 0.27, output: 1.1 },
    'deepseek-coder': { input: 0.27, output: 1.1 },
  },
  anthropic: {
    'claude-3-5-sonnet-20241022': { input: 3, output: 15 },
    'claude-3-haiku-20240307': { input: 0.25, output: 1.25 },
  },
}

// Credit conversion: 1 credit = $0.01
export const CREDIT_VALUE = 0.01

class AIGateway {
  private openai: OpenAI
  private deepseek: OpenAI
  private anthropic: Anthropic

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    this.deepseek = new OpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY,
      baseURL: 'https://api.deepseek.com',
    })

    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })
  }

  async chat(
    messages: AIMessage[],
    config: AIGatewayConfig
  ): Promise<{
    content: string
    usage: {
      inputTokens: number
      outputTokens: number
      cost: number
      credits: number
    }
  }> {
    const { provider, model, temperature = 0.7, maxTokens = 8000 } = config

    switch (provider) {
      case 'openai':
        return this.chatOpenAI(messages, model || 'gpt-3.5-turbo', temperature, maxTokens)
      case 'deepseek':
        return this.chatDeepSeek(messages, model || 'deepseek-coder', temperature, maxTokens)
      case 'anthropic':
        return this.chatAnthropic(messages, model || 'claude-3-haiku-20240307', temperature, maxTokens)
      default:
        throw new Error(`Unsupported provider: ${provider}`)
    }
  }

  private async chatOpenAI(
    messages: AIMessage[],
    model: string,
    temperature: number,
    maxTokens: number
  ) {
    const response = await this.openai.chat.completions.create({
      model,
      messages: messages as any,
      temperature,
      max_tokens: maxTokens,
    })

    const usage = response.usage!
    const cost = this.calculateCost('openai', model, usage.prompt_tokens, usage.completion_tokens)

    return {
      content: response.choices[0].message.content || '',
      usage: {
        inputTokens: usage.prompt_tokens,
        outputTokens: usage.completion_tokens,
        cost,
        credits: Math.ceil(cost / CREDIT_VALUE),
      },
    }
  }

  private async chatDeepSeek(
    messages: AIMessage[],
    model: string,
    temperature: number,
    maxTokens: number
  ) {
    const response = await this.deepseek.chat.completions.create({
      model,
      messages: messages as any,
      temperature,
      max_tokens: maxTokens,
    })

    const usage = response.usage!
    const cost = this.calculateCost('deepseek', model, usage.prompt_tokens, usage.completion_tokens)

    return {
      content: response.choices[0].message.content || '',
      usage: {
        inputTokens: usage.prompt_tokens,
        outputTokens: usage.completion_tokens,
        cost,
        credits: Math.ceil(cost / CREDIT_VALUE),
      },
    }
  }

  private async chatAnthropic(
    messages: AIMessage[],
    model: string,
    temperature: number,
    maxTokens: number
  ) {
    // Extract system message if present
    const systemMessage = messages.find(m => m.role === 'system')
    const conversationMessages = messages.filter(m => m.role !== 'system')

    const response = await this.anthropic.messages.create({
      model,
      system: systemMessage?.content,
      messages: conversationMessages.map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      temperature,
      max_tokens: maxTokens,
    })

    const inputTokens = response.usage.input_tokens
    const outputTokens = response.usage.output_tokens
    const cost = this.calculateCost('anthropic', model, inputTokens, outputTokens)

    return {
      content: response.content[0].type === 'text' ? response.content[0].text : '',
      usage: {
        inputTokens,
        outputTokens,
        cost,
        credits: Math.ceil(cost / CREDIT_VALUE),
      },
    }
  }

  private calculateCost(
    provider: AIProvider,
    model: string,
    inputTokens: number,
    outputTokens: number
  ): number {
    const costs = AI_COSTS[provider][model as keyof typeof AI_COSTS[typeof provider]]
    if (!costs) {
      throw new Error(`Unknown model ${model} for provider ${provider}`)
    }

    const inputCost = (inputTokens / 1_000_000) * costs.input
    const outputCost = (outputTokens / 1_000_000) * costs.output

    return inputCost + outputCost
  }

  estimateCost(
    provider: AIProvider,
    model: string,
    estimatedInputTokens: number,
    estimatedOutputTokens: number
  ): { cost: number; credits: number } {
    const cost = this.calculateCost(provider, model, estimatedInputTokens, estimatedOutputTokens)
    return {
      cost,
      credits: Math.ceil(cost / CREDIT_VALUE),
    }
  }
}

export const aiGateway = new AIGateway()
