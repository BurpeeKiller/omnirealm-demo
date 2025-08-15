'use client'

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Button } from '@/components/ui'
import { Logo } from '@/components/logo'
import { useAuth } from '@/lib/hooks/use-auth'
import { LogOut, User } from 'lucide-react'
import { cn } from "@/lib/utils"

export function DashboardHeader() {
  const { user, signOut } = useAuth()

  return (
    <header className="border-b bg-white">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Logo variant="color" className="w-10 h-10" />
          <h1 className="text-xl font-semibold">OmniTask</h1>
        </div>
        
        <DropdownMenuPrimitive.Root>
          <DropdownMenuPrimitive.Trigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuPrimitive.Trigger>
          <DropdownMenuPrimitive.Portal>
            <DropdownMenuPrimitive.Content
              align="end"
              sideOffset={4}
              className={cn(
                "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md w-56",
                "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
              )}
            >
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{user?.email}</p>
              </div>
              <DropdownMenuPrimitive.Separator className="-mx-1 my-1 h-px bg-muted" />
              <DropdownMenuPrimitive.Item
                onClick={signOut}
                className={cn(
                  "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                  "text-red-600"
                )}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Se déconnecter
              </DropdownMenuPrimitive.Item>
            </DropdownMenuPrimitive.Content>
          </DropdownMenuPrimitive.Portal>
        </DropdownMenuPrimitive.Root>
      </div>
    </header>
  )
}
