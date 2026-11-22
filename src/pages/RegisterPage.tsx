import { useState } from 'react'
import { signUp } from '../lib/auth'
import { AuthForm } from '../components/AuthForm'

interface RegisterPageProps {
  onToggleMode: () => void
}

export function RegisterPage({ onToggleMode }: RegisterPageProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const { error: err } = await signUp(email, password)
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
        mode="register"
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
        onToggleMode={onToggleMode}
      />
    </div>
  )
}
