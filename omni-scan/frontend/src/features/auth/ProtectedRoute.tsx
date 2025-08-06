import React from 'react'
import { Navigate } from 'react-router-dom'

import { useAuth } from './useAuth'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
}

export function ProtectedRoute({ children, requireAuth = true }: ProtectedRouteProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Chargement...</div>
  }

  if (requireAuth && !user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}