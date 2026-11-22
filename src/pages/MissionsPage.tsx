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
      const { user: u, error } = await getCurrentUser()
      if (error || !u) return

      const { data } = await supabase
        .from('user_missions')
        .select(`
          *,
          missions (*)
        `)
        .eq('user_id', u.id)
        .order('started_at', { ascending: false })

      setMissions(data ?? [])
      setLoading(false)
    }

    void load()
  }, [])

  const activeCount = missions.filter((m) => !m.completed_at).length
  const completedCount = missions.filter((m) => m.completed_at).length

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
              <div key={m.id} className="border-b border-border pb-2 last:border-0">
                <TerminalText>{m.missions?.title || 'Без названия'}</TerminalText>
                <TerminalText color="muted" className="text-sm">
                  прогресс {m.progress_days} / {m.missions?.target_days || 0} дней
                </TerminalText>
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
