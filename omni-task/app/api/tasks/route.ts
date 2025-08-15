import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createTaskSchema, updateTaskSchema } from '@/lib/validations/task'
import { ZodError } from 'zod'
import { publicConfig } from '@/lib/config'

// Helper pour créer le client Supabase
async function createSupabaseClient() {
  const cookieStore = await cookies()
  
  return createServerClient(
    publicConfig.supabaseUrl,
    publicConfig.supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    }
  )
}

// GET /api/tasks - Récupérer les tâches
export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseClient()
    
    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }
    
    // Récupérer les paramètres de query
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    
    // Construire la requête
    let query = supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('position', { ascending: true })
    
    if (projectId) {
      query = query.eq('project_id', projectId)
    }
    
    const { data, error } = await query
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' }, 
      { status: 500 }
    )
  }
}

// POST /api/tasks - Créer une tâche
export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseClient()
    
    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }
    
    // Parser et valider le body
    const body = await request.json()
    
    try {
      const validatedData = createTaskSchema.parse(body)
      
      // Ajouter les données système
      const taskData = {
        ...validatedData,
        user_id: user.id,
        status: 'todo',
        position: 0, // Sera ajusté par la DB
      }
      
      // Créer la tâche
      const { data, error } = await supabase
        .from('tasks')
        .insert(taskData)
        .select()
        .single()
      
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      
      return NextResponse.json({ data }, { status: 201 })
      
    } catch (validationError) {
      if (validationError instanceof ZodError) {
        return NextResponse.json(
          { 
            error: 'Données invalides',
            details: validationError.errors 
          }, 
          { status: 400 }
        )
      }
      throw validationError
    }
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' }, 
      { status: 500 }
    )
  }
}

// PATCH /api/tasks/[id] - Mettre à jour une tâche
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createSupabaseClient()
    
    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }
    
    // Valider l'ID
    const taskId = params.id
    if (!taskId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(taskId)) {
      return NextResponse.json({ error: 'ID de tâche invalide' }, { status: 400 })
    }
    
    // Parser et valider le body
    const body = await request.json()
    
    try {
      const validatedData = updateTaskSchema.parse(body)
      
      // Vérifier que la tâche appartient à l'utilisateur
      const { data: existingTask, error: fetchError } = await supabase
        .from('tasks')
        .select('user_id')
        .eq('id', taskId)
        .single()
      
      if (fetchError || !existingTask) {
        return NextResponse.json({ error: 'Tâche non trouvée' }, { status: 404 })
      }
      
      if (existingTask.user_id !== user.id) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
      }
      
      // Mettre à jour la tâche
      const { data, error } = await supabase
        .from('tasks')
        .update(validatedData)
        .eq('id', taskId)
        .select()
        .single()
      
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      
      return NextResponse.json({ data })
      
    } catch (validationError) {
      if (validationError instanceof ZodError) {
        return NextResponse.json(
          { 
            error: 'Données invalides',
            details: validationError.errors 
          }, 
          { status: 400 }
        )
      }
      throw validationError
    }
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' }, 
      { status: 500 }
    )
  }
}

// DELETE /api/tasks/[id] - Supprimer une tâche
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createSupabaseClient()
    
    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }
    
    // Valider l'ID
    const taskId = params.id
    if (!taskId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(taskId)) {
      return NextResponse.json({ error: 'ID de tâche invalide' }, { status: 400 })
    }
    
    // Vérifier que la tâche appartient à l'utilisateur
    const { data: existingTask, error: fetchError } = await supabase
      .from('tasks')
      .select('user_id')
      .eq('id', taskId)
      .single()
    
    if (fetchError || !existingTask) {
      return NextResponse.json({ error: 'Tâche non trouvée' }, { status: 404 })
    }
    
    if (existingTask.user_id !== user.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }
    
    // Supprimer la tâche
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ success: true }, { status: 200 })
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' }, 
      { status: 500 }
    )
  }
}