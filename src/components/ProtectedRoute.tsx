import { useEffect, useState } from 'react'
import { TerminalText } from './TerminalText'
import { getCurrentUser } from '../lib/auth'

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const [user, setUser] = useState<{ id: string; email?: string } | null>(
    null,
  )
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const check = async () => {
      const { user: u, error } = await getCurrentUser()
      if (!error && u) {
        setUser({ id: u.id, email: u.email })
      }
      setLoading(false)
    }
    void check()
  }, [])

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center p-8">
        <TerminalText color="muted">ЗАГРУЗКА СИСТЕМЫ...</TerminalText>
      </div>
    )
  }

  if (!user) {
    return fallback ?? (
      <div className="h-screen flex items-center justify-center p-8">
        <TerminalText color="red">ДОСТУП ЗАПРЕЩЁН</TerminalText>
      </div>
    )
  }

  return <>{children}</>
}
