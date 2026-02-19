import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { aiGateway, AIProvider } from '@/lib/ai-gateway'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    
    // Get or create demo user if no session
    let userId = session?.user?.id
    if (!userId) {
      let demoUser = await prisma.user.findUnique({
        where: { email: 'demo@aibuilder.local' }
      })
      
      if (!demoUser) {
        demoUser = await prisma.user.create({
          data: {
            email: 'demo@aibuilder.local',
            name: 'Demo User',
            credits: 10000, // Give demo users plenty of credits
          }
        })
      }
      userId = demoUser.id
    }

    const { messages, provider, model, maxTokens } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages' }, { status: 400 })
    }

    // Validate provider - if 'auto' or invalid, default to deepseek
    let actualProvider: AIProvider = 'deepseek'
    let actualModel = 'deepseek-coder'
    
    if (provider && provider !== 'auto' && ['deepseek', 'openai', 'anthropic'].includes(provider)) {
      actualProvider = provider as AIProvider
      actualModel = model || 'deepseek-coder'
    }

    // Get user's current credits
    let user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true, email: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Estimate cost before making the request
    const estimate = aiGateway.estimateCost(
      actualProvider,
      actualModel,
      1000, // rough estimate
      500
    )

    // If demo user or user has insufficient credits, give them credits
    if (user.email === 'demo@aibuilder.local' || user.credits === null || user.credits < estimate.credits) {
      const updated = await prisma.user.update({
        where: { id: userId },
        data: { credits: Math.max(10000, user.credits || 0) }, // Ensure at least 10000 credits
        select: { credits: true, email: true }
      })
      user = updated
    }

    // Make AI request
    const result = await aiGateway.chat(messages, {
      provider: actualProvider,
      model: actualModel,
      maxTokens: maxTokens || 8000,
    })

    // Deduct credits and create transaction record
    const updatedUser = await prisma.user.update({
      where: { id: userId! },
      data: { credits: { decrement: result.usage.credits } },
      select: { credits: true },
    })

    await prisma.transaction.create({
      data: {
        userId: userId!,
        type: 'DEDUCTION',
        amount: result.usage.credits,
        balanceBefore: user.credits || 0,
        balanceAfter: updatedUser.credits || 0,
        metadata: `AI request: ${actualProvider} - ${actualModel}`,
      },
    })

    return NextResponse.json({
      content: result.content,
      usage: result.usage,
      remainingCredits: updatedUser.credits,
    })
  } catch (error: any) {
    console.error('AI chat error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
