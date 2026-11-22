import { useEffect, useState } from 'react'
import { TerminalText } from '../components/TerminalText'
import { Card } from '../components/Card'
import { StatusBadge } from '../components/StatusBadge'
import {
  generateDailyTasks,
  getDailyTasks,
  toggleDailyTask,
} from '../lib/dailyEngine'
import { supabase } from '../lib/supabase'
import { getCurrentUser } from '../lib/auth'

export function DailyPage() {
  const [tasks, setTasks] = useState<Array<{
    id: string
    task_library?: {
      title?: string | null
      duration_min?: number | null
      category?: string | null
      difficulty?: string | null
      level?: number | null
    }
    completed?: boolean | null
    date?: string | null
  }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { user: u, error } = await getCurrentUser()
      if (error || !u) return

      setLoading(true)

      const { data: prof } = await supabase
        .from('users_profile')
        .select('*')
        .eq('id', u.id)
        .single()

      const today = new Date().toISOString().slice(0, 10)
      const existing = await getDailyTasks(u.id, today)

      if (existing.length === 0) {
        const generated = await generateDailyTasks(u.id, prof ?? null, today)
        setTasks(
          generated.map((t) => ({
            id: t.id,
            task_library: t.task_library,
            completed: t.completed,
            date: t.date,
          }))
        )
      } else {
        setTasks(
          existing.map((t) => ({
            id: t.id,
            task_library: t.task_library,
            completed: t.completed,
            date: t.date,
          }))
        )
      }

      setLoading(false)
    }

    void load()
  }, [])

  const handleToggle = async (id: string, completed: boolean) => {
    const { error } = await toggleDailyTask(id, completed)
    if (!error) {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed } : t))
      )
    }
  }

  const completedCount = tasks.filter((t) => t.completed).length
  const total = tasks.length

  if (loading) {
    return (
      <div className="bg-bg min-h-screen p-8 flex items-center justify-center">
        <TerminalText color="muted">ГЕНЕРАЦИЯ ЗАДАЧ НА СЕГОДНЯ...</TerminalText>
      </div>
    )
  }

  return (
    <div className="bg-bg min-h-screen p-8">
      <div className="flex justify-between items-end mb-6">
        <div>
          <TerminalText cursor color="green">
            ЗАДАЧИ НА СЕГОДНЯ
          </TerminalText>
          <TerminalText color="muted" className="text-sm">
            {new Date().toLocaleDateString('ru-RU')}
          </TerminalText>
        </div>
        <StatusBadge
          status={total > 0 && completedCount === total ? 'active' : 'idle'}
        >
          {completedCount} / {total}
        </StatusBadge>
      </div>

      <Card>
        {tasks.length === 0 ? (
          <TerminalText color="muted">НЕТ ЗАДАЧ НА СЕГОДНЯ</TerminalText>
        ) : (
          tasks.map((t) => (
            <div
              key={t.id}
              className={`flex items-start gap-3 p-3 border-b border-border last:border-0 ${
                t.completed ? 'bg-green-900/10' : ''
              }`}
            >
              <button
                onClick={() => handleToggle(t.id, !t.completed)}
                className="w-6 h-6 flex items-center justify-center border border-border rounded text-sm font-mono hover:bg-accent hover:text-white transition-colors"
              >
                {t.completed ? '✓' : '□'}
              </button>
              <div className="flex-1">
                <TerminalText color={t.completed ? 'green' : 'default'}>
                  {t.task_library?.title}
                </TerminalText>
                {t.task_library?.duration_min && (
                  <TerminalText color="muted" className="text-xs">
                    {t.task_library.duration_min} мин • {t.task_library.category} • Ур. {t.task_library.level}
                  </TerminalText>
                )}
              </div>
            </div>
          ))
        )}
      </Card>

      {total > 0 && completedCount === total && (
        <div className="mt-6 p-4 border border-green bg-green-900/10 text-green rounded-sm">
          <TerminalText color="green">
            ВСЕ ЗАДАЧИ ВЫПОЛНЕНЫ. СИСТЕМА ГОТОВА К ПЕРЕЗАГРУЗКЕ.
          </TerminalText>
        </div>
      )}
    </div>
  )
}
