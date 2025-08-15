import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createLogger } from '@/lib/logger'
const logger = createLogger('route.ts');
import { serverConfig } from '@/lib/config'

// Initialiser OpenAI seulement si la clé API est présente
const getOpenAI = () => {
  if (!serverConfig.openaiApiKey) {
    throw new Error('OPENAI_API_KEY is required')
  }
  return new OpenAI({
    apiKey: serverConfig.openaiApiKey,
  })
}

interface RequestBody {
  message: string
  context?: {
    tasks?: any[]
    projects?: any[]
    currentProject?: string
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const { message, context }: RequestBody = body

    if (!message?.trim()) {
      return NextResponse.json(
        { error: 'Message requis' },
        { status: 400 }
      )
    }

    if (!serverConfig.openaiApiKey) {
      return NextResponse.json(
        { error: 'Clé API OpenAI manquante' },
        { status: 500 }
      )
    }

    // Construire le contexte pour l'IA
    let systemPrompt = `Tu es l'assistant IA d'OmniTask, une application de gestion de tâches et projets.

Ton rôle :
- Aider l'utilisateur à organiser ses tâches et projets
- Suggérer des améliorations de productivité
- Analyser les données de performance
- Proposer des optimisations de workflow

Contexte utilisateur :`

    if (context?.projects?.length) {
      systemPrompt += `
Projets actifs : ${context.projects.map(p => `${p.name} (${p.color})`).join(', ')}`
    }

    if (context?.tasks?.length) {
      systemPrompt += `
Tâches récentes : ${context.tasks.slice(0, 5).map(t => `"${t.title}" (${t.status})`).join(', ')}`
    }

    if (context?.currentProject) {
      systemPrompt += `
Projet actuel : ${context.currentProject}`
    }

    systemPrompt += `

Instructions :
- Réponds en français
- Sois concis et pratique
- Propose des actions concrètes
- Utilise des emojis appropriés
- Reste dans le contexte de la productivité`

    const openai = getOpenAI()
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      max_tokens: 1000,
      temperature: 0.7,
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: message
        }
      ]
    })

    const aiResponse = response.choices[0]?.message?.content || 
      'Désolé, je n\'ai pas pu traiter votre demande.'

    return NextResponse.json({
      response: aiResponse,
      usage: response.usage
    })

  } catch (error) {
    logger.error('Erreur API OpenAI:', error)
    
    // Gestion des erreurs spécifiques
    if (error instanceof Error) {
      if (error.message.includes('rate_limit')) {
        return NextResponse.json(
          { error: 'Limite de taux atteinte. Veuillez réessayer dans quelques minutes.' },
          { status: 429 }
        )
      }
      
      if (error.message.includes('invalid_api_key')) {
        return NextResponse.json(
          { error: 'Clé API invalide' },
          { status: 401 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}