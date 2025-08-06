'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@omnirealm/ui'
import { useRouter } from 'next/navigation'

export default function TestAuthPage() {
  const [user, setUser] = useState<any>(null)
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkUser()
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event:', event, session)
      setSession(session)
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      console.log('Current session:', session)
      setSession(session)
      setUser(session?.user ?? null)
    } catch (error) {
      console.error('Error checking session:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = () => {
    router.push('/login')
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleDashboard = () => {
    router.push('/dashboard')
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Auth</h1>
      
      <div className="space-y-4">
        <div>
          <strong>User:</strong> {user ? user.email : 'Not logged in'}
        </div>
        
        <div>
          <strong>Session:</strong> {session ? 'Active' : 'No session'}
        </div>

        <div>
          <strong>Supabase URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL}
        </div>

        <div className="flex gap-4">
          {!user ? (
            <Button onClick={handleLogin}>Login</Button>
          ) : (
            <>
              <Button onClick={handleLogout}>Logout</Button>
              <Button onClick={handleDashboard}>Go to Dashboard</Button>
            </>
          )}
          <Button onClick={checkUser} variant="outline">Refresh Session</Button>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-2">Debug Info:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify({ user, session }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}