import { AuthProvider } from '@/components/providers/auth-provider'
import { RealtimeProvider } from '@/components/sync/realtime-provider'
import { AIChat } from '@/components/ai/ai-chat'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <RealtimeProvider>
        {children}
        <AIChat />
      </RealtimeProvider>
    </AuthProvider>
  )
}