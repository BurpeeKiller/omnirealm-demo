import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Vérifier que les variables d'environnement essentielles sont présentes
    const requiredEnvVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY'
    ]

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName])

    if (missingVars.length > 0) {
      return NextResponse.json(
        {
          status: 'unhealthy',
          error: 'Missing environment variables',
          missing: missingVars,
          timestamp: new Date().toISOString()
        },
        { status: 503 }
      )
    }

    // Retourner un statut healthy
    return NextResponse.json({
      status: 'healthy',
      service: 'omni-task',
      version: '3.0.0',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: 'Internal server error',
        timestamp: new Date().toISOString()
      },
      { status: 503 }
    )
  }
}