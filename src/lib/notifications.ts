import { supabase } from './supabase'
import { getCurrentUser } from './auth'

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY || ''

/** Запросить разрешение на уведомления и подписаться на push */
export async function subscribeToPush(): Promise<{
  subscription: PushSubscription | null
  error: string | null
}> {
  if (!('PushManager' in window)) {
    return { subscription: null, error: 'PUSH API НЕ ПОДДЕРЖИВАЕТСЯ' }
  }

  const permission = await Notification.requestPermission()
  if (permission !== 'granted') {
    return { subscription: null, error: 'РАЗРЕШЕНИЕ НЕ ПОЛУЧЕНО' }
  }

  const registration = await navigator.serviceWorker.ready
  let subscription = await registration.pushManager.getSubscription()

  if (!subscription) {
    const applicationServerKey = urlBase64ToUint8Array(
      VAPID_PUBLIC_KEY
    ) as BufferSource
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    })
  }

  // Сохраняем подписку в Supabase
  const { user: u, error: authError } = await getCurrentUser()
  if (!authError && u) {
    await supabase.from('push_subscriptions').upsert({
      user_id: u.id,
      endpoint: subscription.endpoint,
      keys: subscription.toJSON().keys,
      updated_at: new Date().toISOString(),
    })
  }

  return { subscription, error: null }
}

/** Отписаться от push-уведомлений */
export async function unsubscribeFromPush(): Promise<{ error: string | null }> {
  const registration = await navigator.serviceWorker.ready
  const subscription = await registration.pushManager.getSubscription()
  if (subscription) {
    await subscription.unsubscribe()

    const { user: u, error: authError } = await getCurrentUser()
    if (!authError && u) {
      await supabase.from('push_subscriptions').delete().eq('user_id', u.id)
    }
  }
  return { error: null }
}

/** Проверить, подписан ли пользователь */
export async function isPushSubscribed(): Promise<boolean> {
  const registration = await navigator.serviceWorker.ready
  const subscription = await registration.pushManager.getSubscription()
  return !!subscription
}

/** Показать локальное уведомление (без push сервера) */
export function showLocalNotification(
  title: string,
  body: string,
  url: string = '/'
) {
  if (
    !('Notification' in window) ||
    Notification.permission !== 'granted'
  ) {
    return
  }

  const notification = new Notification(title, {
    body,
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    tag: 'system-self',
  })

  notification.onclick = () => {
    window.focus()
    if (url !== '/') {
      window.location.href = url
    }
  }
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}
