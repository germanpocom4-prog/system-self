import { useEffect, useState } from 'react'
import { TerminalText } from '../components/TerminalText'
import { Card } from '../components/Card'
import { StatusBadge } from '../components/StatusBadge'
import { supabase } from '../lib/supabase'
import { getCurrentUser } from '../lib/auth'

export function MoodPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { user: u, error } = await getCurrentUser()
      if (error || !u) return

      const { data } = await supabase
        .from('mood_logs')
        .select('*')
        .eq('user_id', u.id)
        .order('date', { ascending: false })
        .limit(14)

      setLogs(data ?? [])
      setLoading(false)
    }

    void load()
  }, [])

  const avgMood =
    logs.length > 0
      ? (logs.reduce((sum, l) => sum + (l.mood ?? 0), 0) / logs.length).toFixed(1)
      : '—'

  const moodEmoji = (m: number | null) => {
    if (!m) return '—'
    if (m <= 2) return '⚠'
    if (m <= 3) return '⚡'
    if (m <= 4) return '✓'
    return '●'
  }

  if (loading) {
    return (
      <div className="bg-bg min-h-screen p-8 flex items-center justify-center">
        <TerminalText color="muted">ЗАГРУЗКА НАСТРОЕНИЯ...</TerminalText>
      </div>
    )
  }

  return (
    <div className="bg-bg min-h-screen p-8">
      <TerminalText cursor color="green">
        ДНЕВНИК НАСТРОЕНИЯ
      </TerminalText>

      <Card className="mt-4 max-w-lg">
        <TerminalText color="muted" className="text-sm mb-2 block">
          СРЕДНЕЕ НАСТРОЕНИЕ (1-5)
        </TerminalText>
        <TerminalText color={Number(avgMood) >= 4 ? 'green' : 'muted'}>
          {avgMood} {moodEmoji(Number(avgMood) || 0)}
        </TerminalText>

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
                  настроение {l.mood}/5 {moodEmoji(l.mood)}
                  {l.note ? '• ' + l.note : ''}
                </TerminalText>
              </div>
            ))
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <StatusBadge status="active">РЕФЛЕКСИЯ АКТИВНА</StatusBadge>
        </div>
      </Card>
    </div>
  )
}
