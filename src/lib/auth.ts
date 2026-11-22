import { supabase } from './supabase'
import { type User } from '@supabase/supabase-js'

/** Вход по email и паролю */
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

/** Регистрация по email и паролю */
export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  return { data, error }
}

/** Выход из системы */
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

/** Получить текущего пользователя */
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

/** Подписка на изменения состояния авторизации */
export function onAuthStateChange(callback: (user: User | null) => void) {
  const { data } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      callback(session?.user ?? null)
    },
  )
  return data?.subscription
}
