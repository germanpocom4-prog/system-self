import { supabase } from './supabase'
import type { TaskLibrary, DailyTask, UsersProfile } from './types'

export interface DailyTaskWithLibrary extends DailyTask {
  task_library?: TaskLibrary
}

function planCategories(profile: UsersProfile | null) {
  const studyMin = profile?.daily_study_minutes || 60
  const studyCount = Math.max(2, Math.min(5, Math.ceil(studyMin / 25)))

  return [
    { category: 'study', count: studyCount },
    { category: 'sleep', count: 1 },
    { category: 'body', count: 1 },
    { category: 'relationships', count: 1 },
    { category: 'digital', count: 1 },
    { category: 'mind', count: 1 },
  ]
}

function currentSeason(date: string): string {
  const m = new Date(date).getMonth() + 1
  if (m >= 9 && m <= 11) return 'base'
  if (m >= 12 || m <= 2) return 'far'
  if (m >= 3 && m <= 4) return 'mid'
  if (m >= 5 && m <= 6) return 'near'
  return 'final'
}

export async function generateDailyTasks(
  userId: string,
  profile: UsersProfile | null,
  date: string = new Date().toISOString().slice(0, 10)
): Promise<DailyTaskWithLibrary[]> {
  const { data: existing } = await supabase
    .from('daily_tasks')
    .select(`
      *,
      task_library (*)
    `)
    .eq('user_id', userId)
    .eq('date', date)
    .order('created_at', { ascending: true })

  if (existing && existing.length > 0) {
    return existing as DailyTaskWithLibrary[]
  }

  const plan = planCategories(profile)
  const season = currentSeason(date)
  const results: DailyTaskWithLibrary[] = []

  for (const { category, count } of plan) {
    const { data: tasks } = await supabase
      .from('task_library')
      .select('*')
      .eq('category', category)
      .eq('is_active', true)
      .eq('season', season)
      .order('level', { ascending: true })
      .limit(count)

    const tasksToUse = tasks ?? []
    if (tasksToUse.length === 0) {
      const { data: fallback } = await supabase
        .from('task_library')
        .select('*')
        .eq('category', category)
        .eq('is_active', true)
        .order('level', { ascending: true })
        .limit(count)

      if (!fallback || fallback.length === 0) continue

      for (const t of fallback) {
        const { data: inserted } = await supabase
          .from('daily_tasks')
          .insert({
            user_id: userId,
            task_id: t.id,
            date,
            completed: false,
          })
          .select(`
            *,
            task_library (*)
          `)
          .single()
        if (inserted) results.push(inserted as DailyTaskWithLibrary)
      }
      continue
    }

    for (const t of tasksToUse) {
      const { data: inserted } = await supabase
        .from('daily_tasks')
        .insert({
          user_id: userId,
          task_id: t.id,
          date,
          completed: false,
        })
        .select(`
          *,
          task_library (*)
        `)
        .single()
      if (inserted) results.push(inserted as DailyTaskWithLibrary)
    }
  }

  return results
}

export async function getDailyTasks(
  userId: string,
  date: string = new Date().toISOString().slice(0, 10)
): Promise<DailyTaskWithLibrary[]> {
  const { data } = await supabase
    .from('daily_tasks')
    .select(`
      *,
      task_library (*)
    `)
    .eq('user_id', userId)
    .eq('date', date)
    .order('created_at', { ascending: true })

  return (data ?? []) as DailyTaskWithLibrary[]
}

export async function toggleDailyTask(
  dailyTaskId: string,
  completed: boolean
): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from('daily_tasks')
    .update({ completed })
    .eq('id', dailyTaskId)
  return { error }
}
