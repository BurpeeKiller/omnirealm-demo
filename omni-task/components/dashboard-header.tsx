'use client'

import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@omnirealm/ui'
import { Logo } from '@/components/logo'
import { useAuth } from '@/lib/hooks/use-auth'
import { LogOut, User } from 'lucide-react'

export function DashboardHeader() {
  const { user, signOut } = useAuth()

  return (
    <header className="border-b bg-white">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Logo variant="color" className="w-10 h-10" />
          <h1 className="text-xl font-semibold">OmniTask</h1>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 z-50">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">{user?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Se déconnecter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}