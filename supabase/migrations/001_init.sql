-- ============================================================
-- 001_init.sql — SYSTEM://SELF database schema
-- Run in Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- Ensure uuid generation is available
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------
-- 1. users_profile
-- ------------------------------------------------------------
CREATE TABLE users_profile (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  ct_date         DATE,
  subjects        TEXT[],
  target_sleep_hours INTEGER DEFAULT 8,
  daily_study_minutes INTEGER DEFAULT 60,
  created_at      TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE users_profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_profile_select" ON users_profile
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_profile_insert" ON users_profile
  FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "users_profile_update" ON users_profile
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "users_profile_delete" ON users_profile
  FOR DELETE USING (auth.uid() = id);

-- ------------------------------------------------------------
-- 2. task_library (shared reference data)
-- ------------------------------------------------------------
CREATE TABLE task_library (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category     TEXT,
  title        TEXT,
  duration_min INTEGER,
  difficulty   TEXT,
  level        INTEGER,
  season       TEXT,
  subject      TEXT,
  is_active    BOOLEAN DEFAULT TRUE,
  created_at   TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE task_library ENABLE ROW LEVEL SECURITY;

CREATE POLICY "task_library_select" ON task_library
  FOR SELECT USING (true);
CREATE POLICY "task_library_insert" ON task_library
  FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "task_library_update" ON task_library
  FOR UPDATE USING (auth.role() = 'service_role');
CREATE POLICY "task_library_delete" ON task_library
  FOR DELETE USING (auth.role() = 'service_role');

-- Index for task_library lookups
CREATE INDEX idx_task_library_lookup
  ON task_library (category, level, season, subject, is_active);

-- ------------------------------------------------------------
-- 3. daily_tasks
-- ------------------------------------------------------------
CREATE TABLE daily_tasks (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id    UUID NOT NULL REFERENCES task_library(id) ON DELETE CASCADE,
  date       DATE NOT NULL,
  completed  BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE daily_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "daily_tasks_select" ON daily_tasks
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "daily_tasks_insert" ON daily_tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "daily_tasks_update" ON daily_tasks
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "daily_tasks_delete" ON daily_tasks
  FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_daily_tasks_user_date
  ON daily_tasks (user_id, date);

-- ------------------------------------------------------------
-- 4. task_logs
-- ------------------------------------------------------------
CREATE TABLE task_logs (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id    UUID REFERENCES task_library(id),
  category   TEXT,
  completed  BOOLEAN,
  date       DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE task_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "task_logs_select" ON task_logs
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "task_logs_insert" ON task_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "task_logs_update" ON task_logs
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "task_logs_delete" ON task_logs
  FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_task_logs_user_cat_date
  ON task_logs (user_id, category, date);

-- ------------------------------------------------------------
-- 5. study_sessions
-- ------------------------------------------------------------
CREATE TABLE study_sessions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject      TEXT,
  duration_min INTEGER,
  date         DATE,
  created_at   TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "study_sessions_select" ON study_sessions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "study_sessions_insert" ON study_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "study_sessions_update" ON study_sessions
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "study_sessions_delete" ON study_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 6. sleep_logs
-- ------------------------------------------------------------
CREATE TABLE sleep_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date        DATE,
  hours       NUMERIC(4,2),
  bedtime     TIME,
  wake_time   TIME
);

ALTER TABLE sleep_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sleep_logs_select" ON sleep_logs
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "sleep_logs_insert" ON sleep_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "sleep_logs_update" ON sleep_logs
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "sleep_logs_delete" ON sleep_logs
  FOR DELETE USING (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 7. activity_logs
-- ------------------------------------------------------------
CREATE TABLE activity_logs (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type         TEXT,
  duration_min INTEGER,
  date         DATE
);

ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "activity_logs_select" ON activity_logs
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "activity_logs_insert" ON activity_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "activity_logs_update" ON activity_logs
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "activity_logs_delete" ON activity_logs
  FOR DELETE USING (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 8. mood_logs
-- ------------------------------------------------------------
CREATE TABLE mood_logs (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date       DATE,
  mood       INTEGER CHECK (mood >= 1 AND mood <= 5),
  note       TEXT,
  gratitude  TEXT[]
);

ALTER TABLE mood_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "mood_logs_select" ON mood_logs
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "mood_logs_insert" ON mood_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "mood_logs_update" ON mood_logs
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "mood_logs_delete" ON mood_logs
  FOR DELETE USING (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 9. missions (shared reference data)
-- ------------------------------------------------------------
CREATE TABLE missions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT,
  description TEXT,
  category    TEXT,
  target_days INTEGER,
  season      TEXT,
  reward      TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE missions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "missions_select" ON missions
  FOR SELECT USING (true);
CREATE POLICY "missions_insert" ON missions
  FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "missions_update" ON missions
  FOR UPDATE USING (auth.role() = 'service_role');
CREATE POLICY "missions_delete" ON missions
  FOR DELETE USING (auth.role() = 'service_role');

-- ------------------------------------------------------------
-- 10. user_missions
-- ------------------------------------------------------------
CREATE TABLE user_missions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mission_id    UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  started_at    TIMESTAMPTZ DEFAULT now(),
  completed_at  TIMESTAMPTZ,
  progress_days INTEGER DEFAULT 0
);

ALTER TABLE user_missions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_missions_select" ON user_missions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_missions_insert" ON user_missions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_missions_update" ON user_missions
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "user_missions_delete" ON user_missions
  FOR DELETE USING (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 11. settings
-- ------------------------------------------------------------
CREATE TABLE settings (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  theme                TEXT,
  notifications_enabled BOOLEAN DEFAULT TRUE,
  morning_time         TIME,
  evening_time         TIME
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "settings_select" ON settings
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "settings_insert" ON settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "settings_update" ON settings
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "settings_delete" ON settings
  FOR DELETE USING (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 12. task_feedback
-- ------------------------------------------------------------
CREATE TABLE task_feedback (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id    UUID REFERENCES task_library(id),
  feedback   TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE task_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "task_feedback_select" ON task_feedback
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "task_feedback_insert" ON task_feedback
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "task_feedback_update" ON task_feedback
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "task_feedback_delete" ON task_feedback
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- END OF MIGRATION
-- ============================================================
