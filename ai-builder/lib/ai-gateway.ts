import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'

export type AIProvider = 'openai' | 'deepseek' | 'anthropic' | 'qwen' | 'openrouter'

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
  qwen: {
    'qwen3-coder-plus': { input: 0.3, output: 1.5 },
  },
  openrouter: {
    'qwen/qwen-2.5-coder-32b-instruct': { input: 0.1, output: 0.1 },
  },
}

// Credit conversion: 1 credit = $0.01
export const CREDIT_VALUE = 0.01

class AIGateway {
  // Lazy clients — built on first use so an empty/missing key for one provider
  // never crashes the module and breaks all other providers at startup
  private _openai: OpenAI | null = null
  private _deepseek: OpenAI | null = null
  private _anthropic: Anthropic | null = null
  private _qwen: OpenAI | null = null
  private _openrouter: OpenAI | null = null

  private get openai(): OpenAI {
    if (!this._openai) {
      const key = process.env.OPENAI_API_KEY
      if (!key) throw new Error('OPENAI_API_KEY is not set')
      this._openai = new OpenAI({ apiKey: key })
    }
    return this._openai
  }

  private get deepseek(): OpenAI {
    if (!this._deepseek) {
      const key = process.env.DEEPSEEK_API_KEY
      if (!key) throw new Error('DEEPSEEK_API_KEY is not set')
      this._deepseek = new OpenAI({ apiKey: key, baseURL: 'https://api.deepseek.com' })
    }
    return this._deepseek
  }

  private get anthropic(): Anthropic {
    if (!this._anthropic) {
      const key = process.env.ANTHROPIC_API_KEY
      if (!key) throw new Error('ANTHROPIC_API_KEY is not set')
      this._anthropic = new Anthropic({ apiKey: key })
    }
    return this._anthropic
  }

  private get qwen(): OpenAI {
    if (!this._qwen) {
      const key = process.env.DASHSCOPE_API_KEY
      if (!key) throw new Error('DASHSCOPE_API_KEY is not set')
      this._qwen = new OpenAI({ apiKey: key, baseURL: 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1' })
    }
    return this._qwen
  }

  private get openrouter(): OpenAI {
    if (!this._openrouter) {
      const key = process.env.OPENROUTER_API_KEY
      if (!key) throw new Error('OPENROUTER_API_KEY is not set')
      this._openrouter = new OpenAI({ apiKey: key, baseURL: 'https://openrouter.ai/api/v1' })
    }
    return this._openrouter
  }

  constructor() {}

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
      case 'qwen':
        return this.chatQwen(messages, model || 'qwen3-coder-plus', temperature, maxTokens)
      case 'openrouter':
        return this.chatOpenRouter(messages, model || 'qwen/qwen-2.5-coder-32b-instruct', temperature, maxTokens)
      default:
        throw new Error(`Unsupported provider: ${provider}`)
    }
  }

  // ── Streaming variant ────────────────────────────────────────────────────
  async *chatStream(
    messages: AIMessage[],
    config: AIGatewayConfig
  ): AsyncGenerator<
    | { delta: string; done?: never; usage?: never }
    | { done: true; delta?: never; usage: { inputTokens: number; outputTokens: number; cost: number; credits: number } }
  > {
    const { provider, model, temperature = 0.7, maxTokens = 8000 } = config

    // Anthropic has its own streaming SDK
    if (provider === 'anthropic') {
      const systemMessage = messages.find(m => m.role === 'system')
      const conversationMessages = messages.filter(m => m.role !== 'system')
      const stream = this.anthropic.messages.stream({
        model: model || 'claude-3-haiku-20240307',
        system: systemMessage?.content,
        messages: conversationMessages.map(m => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
        temperature,
        max_tokens: maxTokens,
      })
      for await (const event of stream) {
        if (
          event.type === 'content_block_delta' &&
          (event as any).delta?.type === 'text_delta'
        ) {
          yield { delta: (event as any).delta.text as string }
        }
      }
      const final = await stream.finalMessage()
      const inputTokens = final.usage.input_tokens
      const outputTokens = final.usage.output_tokens
      const cost = this.calculateCost('anthropic', model || 'claude-3-haiku-20240307', inputTokens, outputTokens)
      yield { done: true, usage: { inputTokens, outputTokens, cost, credits: Math.max(1, Math.ceil(cost / CREDIT_VALUE)) } }
      return
    }

    // OpenAI-compatible: qwen, openai, deepseek, openrouter
    // Use switch — NOT an object literal, which would eagerly call all getters
    // and throw "X_API_KEY is not set" for every unused provider on the server.
    let client: OpenAI
    switch (provider) {
      case 'qwen':        client = this.qwen;       break
      case 'openai':      client = this.openai;     break
      case 'deepseek':    client = this.deepseek;   break
      case 'openrouter':  client = this.openrouter; break
      default: throw new Error(`Unsupported provider: ${provider}`)
    }

    const params: any = {
      model: model || 'qwen3-coder-plus',
      messages: messages as any,
      temperature,
      max_tokens: maxTokens,
      stream: true,
      stream_options: { include_usage: true }, // real token counts in final chunk
    }
    if (provider === 'qwen') params.enable_thinking = false

    const stream = await client.chat.completions.create(params)

    let inputTokens = 0
    let outputTokens = 0
    for await (const chunk of stream as any) {
      const delta: string = chunk.choices?.[0]?.delta?.content || ''
      if (delta) yield { delta }
      // Final chunk from stream_options.include_usage carries real token counts
      if (chunk.usage) {
        inputTokens = chunk.usage.prompt_tokens || 0
        outputTokens = chunk.usage.completion_tokens || 0
      }
    }

    const cost = this.calculateCost(provider as AIProvider, model || 'qwen3-coder-plus', inputTokens, outputTokens)
    yield { done: true, usage: { inputTokens, outputTokens, cost, credits: Math.max(1, Math.ceil(cost / CREDIT_VALUE)) } }
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

  private async chatQwen(
    messages: AIMessage[],
    model: string,
    temperature: number,
    maxTokens: number
  ) {
    // Disable thinking mode — qwen3 models default to extended thinking which adds 2-3 minutes.
    // For code generation we want a direct, fast response.
    const params: any = {
      model,
      messages: messages as any,
      temperature,
      max_tokens: maxTokens,
      enable_thinking: false,
    }
    const response = await this.qwen.chat.completions.create(params)

    const usage = response.usage!
    const cost = this.calculateCost('qwen', model, usage.prompt_tokens, usage.completion_tokens)

    // Strip any <think>...</think> blocks that may leak through despite disable flag
    let content = (response.choices[0].message.content || '').replace(/<think>[\s\S]*?<\/think>/g, '').trim()

    return {
      content,
      usage: {
        inputTokens: usage.prompt_tokens,
        outputTokens: usage.completion_tokens,
        cost,
        credits: Math.ceil(cost / CREDIT_VALUE),
      },
    }
  }

  private async chatOpenRouter(
    messages: AIMessage[],
    model: string,
    temperature: number,
    maxTokens: number
  ) {
    const response = await this.openrouter.chat.completions.create({
      model,
      messages: messages as any,
      temperature,
      max_tokens: maxTokens,
    })

    const usage = response.usage!
    const cost = this.calculateCost('openrouter', model, usage.prompt_tokens, usage.completion_tokens)

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

  private calculateCost(
    provider: AIProvider,
    model: string,
    inputTokens: number,
    outputTokens: number
  ): number {
    const providerCosts = AI_COSTS[provider]
    const costs = providerCosts[model as keyof typeof providerCosts] as { input: number; output: number } | undefined
    
    // Fall back to cheapest rate for unknown/new models — never crash on a missing cost entry
    const rate = costs ?? { input: 0.1, output: 0.1 }

    const inputCost = (inputTokens / 1_000_000) * rate.input
    const outputCost = (outputTokens / 1_000_000) * rate.output

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
