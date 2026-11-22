import { useState } from 'react'
import { Button } from './Button'
import { TerminalText } from './TerminalText'
import { Card } from './Card'
import { StatusBadge } from './StatusBadge'

const PROMPT = '>'

type Mode = 'login' | 'register'

interface AuthFormProps {
  mode: Mode
  onSubmit: (email: string, password: string) => Promise<void>
  loading: boolean
  error: string | null
  onToggleMode: () => void
}

export function AuthForm({
  mode,
  onSubmit,
  loading,
  error,
  onToggleMode,
}: AuthFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const isRegister = mode === 'register'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(email, password)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <div className="mb-6">
        <TerminalText cursor color="green">
          {isRegister ? PROMPT + ' СОЗДАНИЕ АККАУНТА' : PROMPT + ' ИДЕНТИФИКАЦИЯ ПОЛЬЗОВАТЕЛЯ'}
        </TerminalText>
      </div>

      {error && (
        <div className="mb-4 p-3 border border-accent bg-red-900/20 text-accent text-sm font-mono">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <TerminalText color="muted" className="block mb-1 text-sm">
            {PROMPT} EMAIL
          </TerminalText>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
            className="w-full bg-black border border-border text-text font-mono p-2 rounded-none focus:outline-none focus:ring-1 focus:ring-accent"
            disabled={loading}
          />
        </div>

        <div>
          <TerminalText color="muted" className="block mb-1 text-sm">
            {PROMPT} ПАРОЛЬ
          </TerminalText>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-black border border-border text-text font-mono p-2 rounded-none focus:outline-none focus:ring-1 focus:ring-accent"
            disabled={loading}
          />
        </div>

        {isRegister && (
          <div>
            <TerminalText color="muted" className="block mb-1 text-sm">
              {PROMPT} ПОДТВЕРДИТЕ ПАРОЛЬ
            </TerminalText>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-black border border-border text-text font-mono p-2 rounded-none focus:outline-none focus:ring-1 focus:ring-accent"
              disabled={loading}
            />
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={loading}
          className="w-full"
        >
          {loading
            ? PROMPT + ' ЗАГРУЗКА...'
            : isRegister
            ? PROMPT + ' СОЗДАТЬ'
            : PROMPT + ' ВОЙТИ'}
        </Button>
      </form>

      <div className="mt-6 pt-4 border-t border-border">
        <TerminalText color="muted" className="text-sm">
          {isRegister
            ? PROMPT + ' УЖЕ ЕСТЬ АККАУНТ?'
            : PROMPT + ' НУЖЕН АККАУНТ?'}
        </TerminalText>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleMode}
          className="mt-2"
        >
          {isRegister ? PROMPT + ' ВОЙТИ' : PROMPT + ' ЗАРЕГИСТРИРОВАТЬСЯ'}
        </Button>
      </div>

      <div className="mt-4 flex justify-center">
        <StatusBadge status={loading ? 'idle' : 'active'}>
          СИСТЕМА ГОТОВА
        </StatusBadge>
      </div>
    </Card>
  )
}
