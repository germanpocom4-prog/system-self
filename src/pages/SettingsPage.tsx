import { useEffect, useState } from 'react'
import { TerminalText } from '../components/TerminalText'
import { Card } from '../components/Card'
import { StatusBadge } from '../components/StatusBadge'
import { Button } from '../components/Button'
import { supabase } from '../lib/supabase'
import { getCurrentUser } from '../lib/auth'
import {
  subscribeToPush,
  unsubscribeFromPush,
  isPushSubscribed,
  showLocalNotification,
} from '../lib/notifications'

export function SettingsPage() {
  const [settings, setSettings] = useState<any>(null)
  const [pushSubscribed, setPushSubscribed] = useState(false)
  const [subscribing, setSubscribing] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { user: u, error } = await getCurrentUser()
      if (error || !u) return

      const { data } = await supabase
        .from('settings')
        .select('*')
        .eq('user_id', u.id)
        .single()

      setSettings(data)
      setLoading(false)

      // Проверяем push-подписку
      const subscribed = await isPushSubscribed()
      setPushSubscribed(subscribed)
    }

    void load()
  }, [])

  const toggleNotifications = async () => {
    if (!settings) return
    const { user: u } = await getCurrentUser()
    if (!u) return

    await supabase
      .from('settings')
      .upsert({
        user_id: u.id,
        notifications_enabled: !settings.notifications_enabled,
      })
    setSettings({ ...settings, notifications_enabled: !settings.notifications_enabled })
  }

  const handleSubscribePush = async () => {
    setSubscribing(true)
    const { error } = await subscribeToPush()
    if (error) {
      alert(error)
    } else {
      setPushSubscribed(true)
      showLocalNotification(
        'SYSTEM://SELF',
        'УВЕДОМЛЕНИЯ ВКЛЮЧЕНЫ. БУДЕТЕ ПОЛУЧАТЬ УТРЕННИЕ И ВЕЧЕРНИЕ СООБЩЕНИЯ.'
      )
    }
    setSubscribing(false)
  }

  const handleUnsubscribePush = async () => {
    setSubscribing(true)
    const { error } = await unsubscribeFromPush()
    if (error) {
      alert(error)
    } else {
      setPushSubscribed(false)
    }
    setSubscribing(false)
  }

  const handleTestMorning = () => {
    showLocalNotification(
      'SYSTEM://SELF — УТРО',
      'ЗАДАЧИ НА СЕГОДНЯ ГОТОВЫ.',
      '/'
    )
  }

  const handleTestEvening = () => {
    showLocalNotification(
      'SYSTEM://SELF — ВЕЧЕР',
      'ПОРА ВЫКЛЮЧАТЬ КОМП.',
      '/'
    )
  }

  if (loading) {
    return (
      <div className="bg-bg min-h-screen p-8 flex items-center justify-center">
        <TerminalText color="muted">ЗАГРУЗКА НАСТРОЕК...</TerminalText>
      </div>
    )
  }

  return (
    <div className="bg-bg min-h-screen p-8">
      <TerminalText cursor color="green">
        НАСТРОЙКИ СИСТЕМЫ
      </TerminalText>

      <Card className="mt-4 max-w-lg">
        <TerminalText color="muted" className="text-sm mb-2 block">
          УВЕДОМЛЕНИЯ
        </TerminalText>
        <div className="flex items-center justify-between">
          <TerminalText>
            {settings?.notifications_enabled ? 'ВКЛ' : 'ВЫКЛ'}
          </TerminalText>
          <button
            onClick={toggleNotifications}
            className="border border-border text-xs font-mono px-2 py-1 rounded-none hover:bg-accent hover:text-white transition-colors"
          >
            ПЕРЕКЛЮЧИТЬ
          </button>
        </div>

        <TerminalText color="muted" className="text-sm mt-4 block">
          PUSH-ПОДПИСКА
        </TerminalText>
        <div className="mb-3">
          {pushSubscribed ? (
            <Button
              variant="danger"
              size="sm"
              onClick={handleUnsubscribePush}
              disabled={subscribing}
            >
              {subscribing ? 'ОТПИСКА...' : 'ОТПИСАТЬСЯ ОТ PUSH'}
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={handleSubscribePush}
              disabled={subscribing}
            >
              {subscribing ? 'ПОДПИСКА...' : 'ПОДПИСАТЬСЯ НА PUSH'}
            </Button>
          )}
        </div>

        <TerminalText color="muted" className="text-sm mb-1 block">
          ТЕСТ УТЕННЕГО УВЕДОМЛЕНИЯ
        </TerminalText>
        <Button variant="ghost" size="sm" onClick={handleTestMorning} className="mb-2 w-auto">
          ЗАДАЧИ НА СЕГОДНЯ ГОТОВЫ
        </Button>

        <TerminalText color="muted" className="text-sm mb-1 block">
          ТЕСТ ВЕЧЕРНЕГО УВЕДОМЛЕНИЯ
        </TerminalText>
        <Button variant="ghost" size="sm" onClick={handleTestEvening} className="w-auto">
          ПОРА ВЫКЛЮЧАТЬ КОМП
        </Button>

        <TerminalText color="muted" className="text-sm mt-6 block">
          УТРЕННЕЕ ВРЕМЯ
        </TerminalText>
        <TerminalText>{settings?.morning_time ?? '08:00'}</TerminalText>

        <TerminalText color="muted" className="text-sm mt-4 block">
          ВЕЧЕРНЕЕ ВРЕМЯ
        </TerminalText>
        <TerminalText>{settings?.evening_time ?? '22:00'}</TerminalText>

        <TerminalText color="muted" className="text-sm mt-4 block">
          ТЕМА
        </TerminalText>
        <TerminalText>{settings?.theme ?? 'terminal'}</TerminalText>

        <div className="mt-4 pt-4 border-t border-border">
          <StatusBadge status={settings?.notifications_enabled ? 'active' : 'idle'}>
            СИСТЕМА ГОТОВА
          </StatusBadge>
        </div>
      </Card>
    </div>
  )
}
