import { useEffect, useState } from 'react'
import { TerminalText } from '../components/TerminalText'
import { Card } from '../components/Card'
import { StatusBadge } from '../components/StatusBadge'
import { supabase } from '../lib/supabase'
import { getCurrentUser } from '../lib/auth'

export function SleepPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { user: u, error } = await getCurrentUser()
      if (error || !u) return

      const { data } = await supabase
        .from('sleep_logs')
        .select('*')
        .eq('user_id', u.id)
        .order('date', { ascending: false })
        .limit(14)

      setLogs(data ?? [])
      setLoading(false)
    }

    void load()
  }, [])

  if (loading) {
    return (
      <div className="bg-bg min-h-screen p-8 flex items-center justify-center">
        <TerminalText color="muted">ЗАГРУЗКА ЛОГОВ СНА...</TerminalText>
      </div>
    )
  }

  const avgHours =
    logs.length > 0
      ? (logs.reduce((sum, l) => sum + (l.hours ?? 0), 0) / logs.length).toFixed(1)
      : '—'

  return (
    <div className="bg-bg min-h-screen p-8">
      <TerminalText cursor color="green">
        ЛОГ СНА
      </TerminalText>

      <Card className="mt-4 max-w-lg">
        <TerminalText color="muted" className="text-sm mb-2 block">
          СРЕДНЕЕ ВРЕМЯ СНА (ЗА 14 ДНЕЙ)
        </TerminalText>
        <TerminalText color="green">{avgHours} часов</TerminalText>

        <div className="mt-4">
          <TerminalText color="muted" className="text-sm mb-2 block">
            ПОСЛЕДНИЕ ЗАПИСИ
          </TerminalText>
          {logs.length === 0 ? (
            <TerminalText color="muted">ЗАПИСЕЙ НЕТ</TerminalText>
          ) : (
            logs.map((l) => (
              <div key={l.id} className="border-b border-border pb-2 last:border-0">
                <TerminalText>{l.date}</TerminalText>
                <TerminalText color="muted" className="text-sm">
                  {l.hours} ч • отбой {l.bedtime ?? '—'} • подъём {l.wake_time ?? '—'}
                </TerminalText>
              </div>
            ))
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <StatusBadge status="active">МОНИТОРИНГ АКТИВЕН</StatusBadge>
        </div>
      </Card>
    </div>
  )
}
