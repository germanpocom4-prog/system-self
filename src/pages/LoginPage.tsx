import { useState } from 'react'
import { signIn } from '../lib/auth'
import { AuthForm } from '../components/AuthForm'

interface LoginPageProps {
  onToggleMode: () => void
}

export function LoginPage({ onToggleMode }: LoginPageProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const { error: err } = await signIn(email, password)
      if (err) setError(err.message)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-bg min-h-screen flex items-center justify-center p-4">
      <AuthForm
        mode="login"
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
        onToggleMode={onToggleMode}
      />
    </div>
  )
}
