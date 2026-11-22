import { useEffect, useState } from 'react'
import { TerminalText } from '../components/TerminalText'
import { Card } from '../components/Card'
import { StatusBadge } from '../components/StatusBadge'
import { supabase } from '../lib/supabase'
import { getCurrentUser } from '../lib/auth'

export function ProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { user: u, error } = await getCurrentUser()
      if (error || !u) return

      const { data } = await supabase
        .from('users_profile')
        .select('*')
        .eq('id', u.id)
        .single()

      setProfile(data)
      setLoading(false)
    }

    void load()
  }, [])

  if (loading) {
    return (
      <div className="bg-bg min-h-screen p-8 flex items-center justify-center">
        <TerminalText color="muted">ЗАГРУЗКА ПРОФИЛЯ...</TerminalText>
      </div>
    )
  }

  return (
    <div className="bg-bg min-h-screen p-8">
      <TerminalText cursor color="green">
        ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ
      </TerminalText>

      <Card className="mt-4 max-w-lg">
        <TerminalText color="muted" className="text-sm mb-2 block">
          ID
        </TerminalText>
        <TerminalText>{profile?.id}</TerminalText>

        <TerminalText color="muted" className="text-sm mt-4 block">
          ЦЕЛЕВОЙ СОН (ЧАСОВ)
        </TerminalText>
        <TerminalText>{profile?.target_sleep_hours ?? 8}</TerminalText>

        <TerminalText color="muted" className="text-sm mt-4 block">
          ЕЖЕДНЕВНАЯ УЧЁБА (МИН)
        </TerminalText>
        <TerminalText>{profile?.daily_study_minutes ?? 60}</TerminalText>

        <TerminalText color="muted" className="text-sm mt-4 block">
          ПРЕДМЕТЫ
        </TerminalText>
        <TerminalText>
          {profile?.subjects?.join(', ') ?? 'не указаны'}
        </TerminalText>

        <TerminalText color="muted" className="text-sm mt-4 block">
          ДАТА ЦТ
        </TerminalText>
        <TerminalText>{profile?.ct_date ?? 'не указана'}</TerminalText>

        <div className="mt-4 pt-4 border-t border-border">
          <StatusBadge status="active">АКТИВЕН</StatusBadge>
        </div>
      </Card>
    </div>
  )
}
