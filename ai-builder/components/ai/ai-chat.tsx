'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Sparkles } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface AIChatProps {
  projectId: string
  onCodeGenerated?: (code: string) => void
  initialMessage?: string
}

const AI_PROVIDERS = [
  { value: 'auto', label: '✨ Auto (Smart Selection)', model: 'auto', credits: 'x1-x5' },
  { value: 'deepseek', label: 'DeepSeek Coder', model: 'deepseek-coder', credits: 'x1' },
  { value: 'anthropic', label: 'Claude 3 Haiku', model: 'claude-3-haiku-20240307', credits: 'x2' },
  { value: 'openai', label: 'GPT-3.5 Turbo', model: 'gpt-3.5-turbo', credits: 'x2' },
  { value: 'anthropic', label: 'Claude 3.5 Sonnet', model: 'claude-3-5-sonnet-20241022', credits: 'x5' },
  { value: 'openai', label: 'GPT-4', model: 'gpt-4', credits: 'x5' },
]

type AIMode = 'planner' | 'agent' | 'chat'

export function AIChat({ projectId, onCodeGenerated, initialMessage }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState('auto|auto')
  const [credits, setCredits] = useState<number | null>(null)
  const [hasInitialized, setHasInitialized] = useState(false)
  const [aiMode, setAiMode] = useState<AIMode>('agent')
  const [savedBuildConversation, setSavedBuildConversation] = useState<Message[]>([])
  const [showImplementButton, setShowImplementButton] = useState(false)

  // Load conversation from localStorage on mount
  useEffect(() => {
    const storageKey = `ai-chat-${projectId}`
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setMessages(data.messages || [])
        setAiMode(data.aiMode || 'agent')
        setHasInitialized(true) // Mark as initialized to prevent auto-prompt
      } catch (error) {
        console.error('Failed to load conversation:', error)
      }
    }
  }, [projectId])

  // Save conversation to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      const storageKey = `ai-chat-${projectId}`
      localStorage.setItem(storageKey, JSON.stringify({
        messages,
        aiMode,
        timestamp: Date.now()
      }))
    }
  }, [messages, aiMode, projectId])

  // Load user credits on mount
  useEffect(() => {
    const loadCredits = async () => {
      try {
        const res = await fetch('/api/user/credits')
        if (res.ok) {
          const data = await res.json()
          setCredits(data.credits)
        }
      } catch (error) {
        console.error('Failed to load credits:', error)
      }
    }
    loadCredits()
  }, [])

  const handleSendWithMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return

    const userMessage: Message = { role: 'user', content: messageText }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const [provider, model] = selectedProvider.split('|')
      
      // Get system prompt based on AI mode
      let systemPrompt = ''
      if (aiMode === 'agent') {
        systemPrompt = `You are a professional website builder AI agent. Your ONLY job is to build complete websites.

CRITICAL RULES YOU MUST FOLLOW:
1. ALWAYS respond with ONLY the HTML code - no explanations, no text before or after
2. Your ENTIRE response must be wrapped in \`\`\`html and \`\`\`
3. Generate a COMPLETE, production-ready HTML file in a SINGLE response
4. Include ALL CSS inside <style> tags in the <head>
5. Include ALL JavaScript inside <script> tags before </body>
6. Make it professional, modern, and responsive with proper file structure
7. Use modern design with gradients, shadows, animations, and professional layouts
8. NO INCOMPLETE CODE - every tag must be closed, every section must be complete
9. Start your response IMMEDIATELY with \`\`\`html - nothing else
10. Create a complete workspace with all necessary sections: header, navigation, hero, about, services, portfolio, testimonials, contact form, footer, social media links

Example format:
\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>...</title>
    <style>
        /* Complete CSS with modern design, animations, responsive layout */
    </style>
</head>
<body>
    <!-- Complete HTML structure with all sections -->
    <script>
        /* Complete JavaScript for interactivity */
    </script>
</body>
</html>
\`\`\`

DO NOT write explanations. DO NOT say "here's the code" or "I'll build". ONLY OUTPUT THE COMPLETE CODE.
Every website must have: professional header, navigation menu, hero section with CTA, multiple content sections, contact form with validation, footer with social links, smooth scrolling, animations, and mobile-responsive design.`
      } else if (aiMode === 'planner') {
        systemPrompt = `You are a website planning assistant. Your job is to gather complete information about the user's website through conversation.

Ask strategic questions about:
1. Website purpose and target audience
2. Key sections needed (About, Services, Portfolio, Contact, etc.)
3. Branding preferences (colors, style, tone)
4. Special features or functionality
5. Content they want to include

Be conversational and helpful. After gathering sufficient information (usually 3-5 exchanges), ask: "I have all the information I need. Are you ready to start implementing the website? If yes, click the 'Start Implementing' button below."

DO NOT generate code in planner mode. Focus only on planning and gathering information.`
      } else if (aiMode === 'chat') {
        systemPrompt = 'You are a helpful web development assistant. Answer questions about web development, HTML, CSS, JavaScript, design principles, and best practices. Provide clear explanations and examples when helpful. You can show code snippets when explaining concepts.'
      }
      
      // Resolve Auto mode to actual provider/model based on current AI mode
      let actualProvider = provider
      let actualModel = model
      let maxTokens = 4000
      
      if (provider === 'auto') {
        // Use DeepSeek for all modes (reliable and works)
        actualProvider = 'deepseek'
        actualModel = 'deepseek-coder'
        if (aiMode === 'agent') {
          maxTokens = 8000 // DeepSeek max is 8192, use 8000 to be safe
        } else {
          maxTokens = 4000 // Standard for planning/chat
        }
      } else if (aiMode === 'agent') {
        // Respect provider limits: DeepSeek max 8192, Claude can go higher
        maxTokens = actualProvider === 'anthropic' ? 12000 : 8000
      }
      
      // Create abort controller for timeout (5 minutes for large requests)
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5 * 60 * 1000)
      
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: systemPrompt,
            },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { 
              role: 'user', 
              content: aiMode === 'agent' ? `${messageText}\n\nREMEMBER: Output ONLY the complete HTML code wrapped in \`\`\`html tags. NO explanations, NO text, JUST THE COMPLETE CODE with proper file structure including header, navigation, hero, content sections, contact form, footer, and social links. Make it production-ready.` : messageText 
            },
          ],
          provider: actualProvider,
          model: actualModel,
          maxTokens,
        }),
      })
      
      clearTimeout(timeoutId)

      if (!response.ok) {
        const data = await response.json().catch(() => ({ error: 'Unknown error' }))
        if (response.status === 402) {
          throw new Error('Insufficient credits. Please add more credits to continue.')
        }
        throw new Error(data.error || 'Failed to get AI response')
      }

      const data = await response.json()

      // Check if response contains code and extract it automatically (only in agent mode)
      let displayMessage = data.content
      let codeExtracted = false
      
      if (aiMode === 'agent' && onCodeGenerated && data.content) {
        console.log('🔍 Agent mode active, checking for code...')
        console.log('📝 Response length:', data.content.length)
        console.log('📝 Contains backticks:', data.content.includes('```'))
        
        if (data.content.includes('```')) {
          // Simple extraction: find first ``` html and last ```
          const startMarker = '```html'
          const endMarker = '```'
          const startIndex = data.content.indexOf(startMarker)
          
          if (startIndex !== -1) {
            const codeStart = startIndex + startMarker.length
            const codeEnd = data.content.indexOf(endMarker, codeStart)
            
            if (codeEnd !== -1) {
              const extractedCode = data.content.substring(codeStart, codeEnd).trim()
              console.log('📏 Extracted code length:', extractedCode.length)
              
              if (extractedCode.length > 100) {
                console.log('✅ Code extracted successfully!')
                onCodeGenerated(extractedCode)
                codeExtracted = true
                displayMessage = '✅ Website updated successfully! Check the preview on the right.'
              }
            }
          }
          
          if (!codeExtracted) {
            console.log('⚠️ Code block found but extraction failed')
            console.log('First 200 chars:', data.content.substring(0, 200))
          }
        } else {
          console.log('❌ No code blocks found in response')
        }
      }

      const assistantMessage: Message = { role: 'assistant', content: displayMessage }
      setMessages(prev => [...prev, assistantMessage])
      setCredits(data.remainingCredits)
      
      // Check if AI is asking if ready to implement (in planner mode)
      if (aiMode === 'planner' && displayMessage.toLowerCase().includes('start implementing')) {
        setShowImplementButton(true)
      }
    } catch (error: any) {
      console.error('AI chat error:', error)
      let errorMessage = 'Failed to get AI response'
      
      if (error.name === 'AbortError') {
        errorMessage = 'Request timed out after 5 minutes. The AI is taking too long. Please try again with a simpler request.'
      } else if (error.message === 'Failed to fetch') {
        errorMessage = 'Network error or timeout. Large requests can take 1-4 minutes. Please wait and try again if it fails.'
      } else if (error.message) {
        errorMessage = error.message
      }
      
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: `❌ Error: ${errorMessage}` },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSend = () => {
    handleSendWithMessage(input)
  }

  // Auto-send initial message after handleSendWithMessage is defined
  useEffect(() => {
    console.log('🔍 Initial message check:', {
      initialMessage: initialMessage?.substring(0, 50),
      hasInitialized,
      messagesLength: messages.length,
      isLoading
    })
    
    if (initialMessage && !hasInitialized && messages.length === 0 && !isLoading) {
      console.log('✅ Triggering initial message in 1 second...')
      setHasInitialized(true)
      // Trigger send after a brief delay
      setTimeout(() => {
        console.log('🚀 Sending initial message now')
        handleSendWithMessage(initialMessage)
      }, 1000)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialMessage, hasInitialized, messages.length])

  return (
    <div className="flex flex-col h-full">
      {/* Mode Selection */}
      <div className="p-4 border-b border-slate-800 bg-slate-900">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-medium text-slate-300">AI Mode</span>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={aiMode === 'agent' ? 'default' : 'outline'}
            onClick={() => {
              const wasChatMode = aiMode === 'chat'
              setAiMode('agent')
              if (wasChatMode && savedBuildConversation.length > 0) {
                setMessages(savedBuildConversation)
              }
            }}
            className={aiMode === 'agent' ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'border-slate-700 text-slate-300 hover:bg-slate-800'}
          >
            🤖 Agent
          </Button>
          <Button
            size="sm"
            variant={aiMode === 'planner' ? 'default' : 'outline'}
            onClick={() => {
              const wasChatMode = aiMode === 'chat'
              setAiMode('planner')
              if (wasChatMode && savedBuildConversation.length > 0) {
                setMessages(savedBuildConversation)
              }
            }}
            className={aiMode === 'planner' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'border-slate-700 text-slate-300 hover:bg-slate-800'}
          >
            📋 Planner
          </Button>
          <Button
            size="sm"
            variant={aiMode === 'chat' ? 'default' : 'outline'}
            onClick={() => {
              // Save current build conversation before switching to chat
              if (aiMode !== 'chat' && messages.length > 0) {
                setSavedBuildConversation(messages)
              }
              setAiMode('chat')
              setMessages([])
              setHasInitialized(true)
            }}
            className={aiMode === 'chat' ? 'bg-green-600 hover:bg-green-700 text-white' : 'border-slate-700 text-slate-300 hover:bg-slate-800'}
          >
            💬 Chat
          </Button>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          {aiMode === 'agent' && '🤖 Builds websites automatically'}
          {aiMode === 'planner' && '📋 Helps plan website structure'}
          {aiMode === 'chat' && '💬 General chat (clears history)'}
        </p>
      </div>

      {/* Provider Selection - VS Code Style */}
      <div className="p-4 border-b border-slate-800 flex items-center gap-3">
        <Select value={selectedProvider} onValueChange={setSelectedProvider}>
          <SelectTrigger className="w-[260px] bg-slate-800 border-slate-700 text-white h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            {AI_PROVIDERS.map((provider) => (
              <SelectItem 
                key={`${provider.value}|${provider.model}`} 
                value={`${provider.value}|${provider.model}`}
                className="text-white hover:bg-slate-700 focus:bg-slate-700"
              >
                <div className="flex items-center justify-between w-full gap-3">
                  <span>{provider.label}</span>
                  <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${
                    provider.credits === 'x1' ? 'bg-green-600/20 text-green-400' :
                    provider.credits === 'x2' ? 'bg-yellow-600/20 text-yellow-400' :
                    provider.credits === 'x5' ? 'bg-orange-600/20 text-orange-400' :
                    'bg-purple-600/20 text-purple-400'
                  }`}>
                    {provider.credits}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {/* Current model indicator */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          {selectedProvider === 'auto|auto' && (
            <span className="px-2 py-1 rounded bg-slate-700/50">
              → DeepSeek Coder
            </span>
          )}
        </div>
        
        {credits !== null && (
          <span className="text-sm text-slate-400 ml-auto">
            {credits} credits
          </span>
        )}
        {messages.length > 0 && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setMessages([])
              setHasInitialized(false)
              setShowImplementButton(false)
              localStorage.removeItem(`ai-chat-${projectId}`)
            }}
            className="border-slate-700 text-slate-300 hover:bg-slate-800 h-8"
            title="Clear conversation"
          >
            Clear
          </Button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-purple-500" />
            <h3 className="font-semibold mb-2">AI Code Assistant</h3>
            <p className="text-sm">
              Ask me to generate components, fix bugs, or improve your code
            </p>
          </div>
        )}
        {messages.map((message, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg ${
              message.role === 'user'
                ? 'bg-primary text-primary-foreground ml-12'
                : 'bg-muted mr-12'
            }`}
          >
            <div className="whitespace-pre-wrap break-words">{message.content}</div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Thinking...</span>
          </div>
        )}
        
        {/* Start Implementing Button */}
        {showImplementButton && aiMode === 'planner' && !isLoading && (
          <div className="flex justify-center mt-4">
            <Button
              onClick={() => {
                setShowImplementButton(false)
                setAiMode('agent')
                // Trigger the build with all context from planning conversation
                const buildPrompt = `Based on our discussion, please build the complete website now. Include all the features and requirements we discussed. Output ONLY the complete HTML code.`
                handleSendWithMessage(buildPrompt)
              }}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 text-lg font-semibold"
            >
              🚀 Start Implementing
            </Button>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder="Ask AI to generate or modify code..."
            className="min-h-[60px] bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
            disabled={isLoading}
          />
          <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send'}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Tip: Be specific about what you want. Press Shift+Enter for new line.
        </p>
      </div>
    </div>
  )
}
