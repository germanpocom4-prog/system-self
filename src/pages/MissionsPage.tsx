import { useEffect, useState } from 'react'
import { TerminalText } from '../components/TerminalText'
import { Card } from '../components/Card'
import { StatusBadge } from '../components/StatusBadge'
import { supabase } from '../lib/supabase'
import { getCurrentUser } from '../lib/auth'

export function MissionsPage() {
  const [missions, setMissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      // Загружаем все доступные миссии (видимы все пользователям)
      const { data: allMissions, error } = await supabase
        .from('missions')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) {
        console.error(error)
        setLoading(false)
        return
      }

      // Пытаемся загрузить прогресс пользователя по миссиям
      const { user: u, error: authError } = await getCurrentUser()
      if (!authError && u) {
        const { data: userMissions } = await supabase
          .from('user_missions')
          .select('*')
          .eq('user_id', u.id)

        // Объединяем миссии с прогрессом пользователя
        const merged = (allMissions ?? []).map((m) => {
          const userProgress = (userMissions ?? []).find(
            (um) => um.mission_id === m.id
          )
          return {
            ...m,
            user_progress: userProgress || null,
          }
        })
        setMissions(merged)
      } else {
        setMissions(allMissions ?? [])
      }

      setLoading(false)
    }

    void load()
  }, [])

  const activeCount = missions.filter(
    (m) => !m.user_progress?.completed_at
  ).length
  const completedCount = missions.filter(
    (m) => m.user_progress?.completed_at
  ).length

  if (loading) {
    return (
      <div className="bg-bg min-h-screen p-8 flex items-center justify-center">
        <TerminalText color="muted">ЗАГРУЗКА МИССИЙ...</TerminalText>
      </div>
    )
  }

  return (
    <div className="bg-bg min-h-screen p-8">
      <TerminalText cursor color="green">
        МИССИИ
      </TerminalText>

      <Card className="mt-4 max-w-lg">
        <TerminalText color="muted" className="text-sm mb-2 block">
          АКТИВНЫХ
        </TerminalText>
        <TerminalText color="green">{activeCount}</TerminalText>

        <TerminalText color="muted" className="text-sm mt-4 block">
          ЗАВЕРШЕНО
        </TerminalText>
        <TerminalText color="green">{completedCount}</TerminalText>

        <div className="mt-4">
          <TerminalText color="muted" className="text-sm mb-2 block">
            СПИСОК МИССИЙ
          </TerminalText>
          {missions.length === 0 ? (
            <TerminalText color="muted">МИССИЙ НЕТ</TerminalText>
          ) : (
            missions.map((m) => (
              <div
                key={m.id}
                className="border-b border-border pb-2 last:border-0"
              >
                <TerminalText>{m.title}</TerminalText>
                <TerminalText color="muted" className="text-sm">
                  {m.description} • цель {m.target_days} дней
                </TerminalText>
                {m.user_progress ? (
                  <TerminalText color="muted" className="text-xs mt-1">
                    прогресс {m.user_progress.progress_days} / {m.target_days} дней
                  </TerminalText>
                ) : (
                  <TerminalText color="muted" className="text-xs mt-1">
                    ещё не начата
                  </TerminalText>
                )}
              </div>
            ))
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <StatusBadge status={activeCount > 0 ? 'active' : 'idle'}>
            СИСТЕМА МИССИЙ ГОТОВА
          </StatusBadge>
        </div>
      </Card>
    </div>
  )
}
