export type UsersProfile = {
  id: string;
  ct_date?: string | null;
  subjects?: string[] | null;
  target_sleep_hours?: number;
  daily_study_minutes?: number;
  created_at?: string;
};

export type TaskLibrary = {
  id: string;
  category?: string | null;
  title?: string | null;
  duration_min?: number;
  difficulty?: string | null;
  level?: number;
  season?: string | null;
  subject?: string | null;
  is_active?: boolean;
  created_at?: string;
};

export type DailyTask = {
  id: string;
  user_id: string;
  task_id: string;
  date: string;
  completed?: boolean;
  created_at?: string;
};

export type TaskLog = {
  id: string;
  user_id: string;
  task_id?: string | null;
  category?: string | null;
  completed?: boolean | null;
  date?: string | null;
  created_at?: string;
};

export type StudySession = {
  id: string;
  user_id: string;
  subject?: string | null;
  duration_min?: number;
  date?: string | null;
  created_at?: string;
};

export type SleepLog = {
  id: string;
  user_id: string;
  date?: string | null;
  hours?: number | null;
  bedtime?: string | null;
  wake_time?: string | null;
};

export type ActivityLog = {
  id: string;
  user_id: string;
  type?: string | null;
  duration_min?: number;
  date?: string | null;
};

export type MoodLog = {
  id: string;
  user_id: string;
  date?: string | null;
  mood?: number | null;
  note?: string | null;
  gratitude?: string[] | null;
};

export type Mission = {
  id: string;
  title?: string | null;
  description?: string | null;
  category?: string | null;
  target_days?: number;
  season?: string | null;
  reward?: string | null;
  created_at?: string;
};

export type UserMission = {
  id: string;
  user_id: string;
  mission_id: string;
  started_at?: string;
  completed_at?: string | null;
  progress_days?: number;
};

export type Setting = {
  id: string;
  user_id: string;
  theme?: string | null;
  notifications_enabled?: boolean;
  morning_time?: string | null;
  evening_time?: string | null;
};

export type TaskFeedback = {
  id: string;
  user_id: string;
  task_id?: string | null;
  feedback?: string | null;
  created_at?: string;
};
