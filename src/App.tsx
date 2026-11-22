import { useEffect, useState } from 'react'
import { TerminalText } from './components/TerminalText'
import { onAuthStateChange } from './lib/auth'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { DailyPage } from './pages/DailyPage'
import { ProfilePage } from './pages/ProfilePage'
import { SettingsPage } from './pages/SettingsPage'
import { SleepPage } from './pages/SleepPage'
import { MoodPage } from './pages/MoodPage'
import { MissionsPage } from './pages/MissionsPage'

const PROMPT = '>'

type View = 'login' | 'register' | 'app'

type AppPage = 'daily' | 'profile' | 'settings' | 'sleep' | 'mood' | 'missions'

function App() {
  const [user, setUser] = useState<{ id: string; email?: string } | null>(
    null,
  )
  const [view, setView] = useState<View>('login')
  const [page, setPage] = useState<AppPage>('daily')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const subscription = onAuthStateChange((u) => {
      setUser(u ? { id: u.id, email: u.email } : null)
      setLoading(false)
    })
    return () => {
      void subscription?.unsubscribe?.()
    }
  }, [])

  const switchToLogin = () => setView('login')
  const switchToRegister = () => setView('register')

  const navigateTo = (p: AppPage) => setPage(p)

  if (loading) {
    return (
      <div className="bg-bg min-h-screen flex items-center justify-center p-8">
        <TerminalText color="muted">ЗАГРУЗКА СИСТЕМЫ...</TerminalText>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="bg-bg min-h-screen p-8">
        {view === 'login' ? (
          <LoginPage onToggleMode={switchToRegister} />
        ) : (
          <RegisterPage onToggleMode={switchToLogin} />
        )}
      </div>
    )
  }

  return (
    <div className="bg-bg min-h-screen p-8">
      <div className="flex justify-between items-end mb-6 border-b border-border pb-2">
        <div>
          <h1 className="text-2xl font-bold mb-1">SYSTEM://SELF</h1>
          <TerminalText color="muted" className="text-sm">
            {PROMPT} ПОЛЬЗОВАТЕЛЬ: {user.email}
          </TerminalText>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigateTo('daily')}
            className={`font-mono text-xs uppercase tracking-wide border rounded-none px-2 py-1 ${
              page === 'daily' ? 'bg-accent text-white' : 'text-text border-border hover:bg-accent hover:text-white transition-colors'
            }`}
          >
            ЗАДАЧИ
          </button>
          <button
            onClick={() => navigateTo('profile')}
            className={`font-mono text-xs uppercase tracking-wide border rounded-none px-2 py-1 ${
              page === 'profile' ? 'bg-accent text-white' : 'text-text border-border hover:bg-accent hover:text-white transition-colors'
            }`}
          >
            ПРОФИЛЬ
          </button>
          <button
            onClick={() => navigateTo('settings')}
            className={`font-mono text-xs uppercase tracking-wide border rounded-none px-2 py-1 ${
              page === 'settings' ? 'bg-accent text-white' : 'text-text border-border hover:bg-accent hover:text-white transition-colors'
            }`}
          >
            НАСТРОЙКИ
          </button>
          <button
            onClick={() => navigateTo('sleep')}
            className={`font-mono text-xs uppercase tracking-wide border rounded-none px-2 py-1 ${
              page === 'sleep' ? 'bg-accent text-white' : 'text-text border-border hover:bg-accent hover:text-white transition-colors'
            }`}
          >
            СОН
          </button>
          <button
            onClick={() => navigateTo('mood')}
            className={`font-mono text-xs uppercase tracking-wide border rounded-none px-2 py-1 ${
              page === 'mood' ? 'bg-accent text-white' : 'text-text border-border hover:bg-accent hover:text-white transition-colors'
            }`}
          >
            НАСТРОЕНИЕ
          </button>
          <button
            onClick={() => navigateTo('missions')}
            className={`font-mono text-xs uppercase tracking-wide border rounded-none px-2 py-1 ${
              page === 'missions' ? 'bg-accent text-white' : 'text-text border-border hover:bg-accent hover:text-white transition-colors'
            }`}
          >
            МИССИИ
          </button>
        </div>
      </div>

      {page === 'daily' && <DailyPage />}
      {page === 'profile' && <ProfilePage />}
      {page === 'settings' && <SettingsPage />}
      {page === 'sleep' && <SleepPage />}
      {page === 'mood' && <MoodPage />}
      {page === 'missions' && <MissionsPage />}
    </div>
  )
}

export default App
