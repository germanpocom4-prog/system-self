# SYSTEM://SELF

PWA-приложение «терминал для взлома себя» — система личного роста с автоматической генерацией ежедневных задач.

Стек: **React 19 + Vite + TypeScript + Tailwind CSS + Supabase + PWA**

Стиль интерфейса: «Мистер Робот» — тёмный терминал, моноширинный шрифт, тревожный красный акцент, острые углы.

---

## Структура проекта

```
system-self/
├── public/
│   ├── favicon.svg
│   ├── manifest.json      # PWA манифест
│   └── sw.js              # Service Worker (кэш, офлайн, push)
├── src/
│   ├── components/        # UI компоненты (Button, Card, TerminalText, StatusBadge, ...)
│   ├── lib/               # supabase.ts, auth.ts, dailyEngine.ts, notifications.ts, types.ts
│   ├── pages/             # LoginPage, RegisterPage, DailyPage, ProfilePage, SettingsPage, SleepPage, MoodPage, MissionsPage
│   ├── App.tsx            # Точка входа, роутинг, состояние авторизации
│   ├── index.css          # Tailwind + базовые стили
│   └── main.tsx           # React entry + регистрация SW
├── supabase/
│   └── migrations/
│       ├── 001_init.sql   # Основная схема БД (12 таблиц + RLS)
│       └── 002_push_subscriptions.sql  # Таблица подписок на push
├── index.html
├── tailwind.config.js
├── postcss.config.js
├── vite.config.ts
├── tsconfig.json
├── .env                   # Локальные переменные окружения
├── .env.example           # Шаблон переменных окружения
└── package.json
```

---

## Требования

- Node.js v18+
- npm
- Аккаунт Supabase (для БД и Auth)
- (Опционально) VAPID ключи для push-уведомлений

---

## Локальный запуск

### 1. Клонирование и установка зависимостей

```bash
cd system-self
npm install
```

### 2. Переменные окружения

Скопируйте `.env.example` в `.env` и заполните:

```bash
cp .env.example .env
```

Заполните `.env`:

```env
VITE_SUPABASE_URL=https://ВАШ-ПРОЕКТ.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_ВАШ_КЛЮЧ
VITE_VAPID_PUBLIC_KEY=ВАШ_VAPID_ПУБЛИЧНЫЙ_КЛЮЧ  # для push-уведомлений
```

### 3. Настройка Supabase

1. Создайте проект в [Supabase Dashboard](https://supabase.com/dashboard)
2. Откройте **SQL Editor**
3. Выполните миграции по порядку:

   ```sql
   -- Файл: supabase/migrations/001_init.sql
   -- Создаёт 12 таблиц, RLS-политики, индексы
   ```

   ```sql
   -- Файл: supabase/migrations/002_push_subscriptions.sql
   -- Таблица подписок на push-уведомления
   ```

4. Загрузите задачи и миссии (4 файла SQL с INSERT-ами: 420 задач + 40 миссий)
5. Включите **Email auth** в Supabase Authentication → Settings

### 4. Запуск dev-сервера

```bash
npm run dev
```

Приложение будет доступно на `http://localhost:5173`

---

## Доступные скрипты

| Команда | Описание |
|---|---|
| `npm run dev` | Запуск dev-сервера с HMR |
| `npm run build` | TypeScript проверка + сборка для продакшена |
| `npm run preview` | Локальный предварительный просмотр сборки |
| `npm run lint` | Проверка кода линтером |

---

## PWA — установка на телефон

Приложение поддерживает установку как PWA (Progressive Web App):

### Android (Chrome)
1. Откройте приложение в браузере
2. Нажмите меню ⋮ → **Добавить на главный экран**
3. Приложение установится как нативное

### iOS (Safari)
1. Откройте приложение в Safari
2. Нажмите кнопку «Поделиться» → **На экран «Домой»**
3. Приложение добавится на главный экран

### Офлайн-режим
Service Worker кэширует статику. При отсутствии интернета отображается офлайн-заглушка.

---

## Push-уведомления

### Утреннее уведомление
> «ЗАДАЧИ НА СЕГОДНЯ ГОТОВЫ»

### Вечернее уведомление
> «ПОРА ВЫКЛЮЧАТЬ КОМП»

### Настройка

1. Получите VAPID ключи (например, через [web-push-libraries](https://github.com/web-push-libs/web-push))
2. Добавьте публичный ключ в `.env`:

   ```env
   VITE_VAPID_PUBLIC_KEY=ВАШ_КЛЮЧ
   ```

3. Выполните миграцию `002_push_subscriptions.sql` в Supabase
4. На странице **Настройки** нажмите «ПОДПИСАТЬСЯ НА PUSH»
5. Для отправки уведомлений в конкретное время настройте сервер отправки (Supabase Edge Function или свой сервер), который будет делать `POST` на конечную точку Push API с данными из таблицы `push_subscriptions`

---

## Деплой на Vercel

### 1. Подготовка репозитория

```bash
git init
git add .
git commit -m "Initial commit"
```

### 2. Подключение к Vercel

1. Загрузите код на GitHub
2. В [Vercel Dashboard](https://vercel.com/dashboard) нажмите **Add New Project**
3. Выберите свой репозиторий
4. Настройте переменные окружения:

   ```
   VITE_SUPABASE_URL=https://ВАШ-ПРОЕКТ.supabase.co
   VITE_SUPABASE_ANON_KEY=sb_publishable_ВАШ_КЛЮЧ
   VITE_VAPID_PUBLIC_KEY=ВАШ_VAPID_ПУБЛИЧНЫЙ_КЛЮЧ
   ```

5. Нажмите **Deploy**

### 3. После деплоя

- Приложение будет доступно по URL, который выдаст Vercel
- PWA установка будет работать через HTTPS
- Service Worker будет активен

---

## Экраны приложения

| Экран | Описание |
|---|---|
| **Вход / Регистрация** | Авторизация через email + пароль (Supabase Auth) |
| **Задачи на день** | Автогенерация задач из библиотеки (420 задач), отметка выполнения |
| **Профиль** | Данные пользователя: целевой сон, ежедневная учёба, предметы, дата ЦТ |
| **Настройки** | Уведомления,_push-подписка, утреннее/вечернее время, тема |
| **Сон** | Лог сна: среднее время, последние записи (отбой, подъём, часы) |
| **Настроение** | Дневник настроения 1-5, эмодзи-статус, заметки |
| **Миссии** | Активные и завершённые миссии, прогресс по дням |

---

## Библиотека задач

- **420 задач** по категориям: учёба (математика, физика, русский), сон, тело, отношения, цифровая гигиена, психика, общие
- **40 миссий** с целевыми днями и наградами (бейджи)
- Уровни: 1 (база), 2 (рост), 3 (пик)
- Сезоны: base, far, mid, near, final

---

## Технологии

| Инструмент | Версия | Назначение |
|---|---|---|
| React | 19 | UI |
| Vite | 8 | Сборка, dev-сервер |
| TypeScript | 7 | Типизация |
| Tailwind CSS | 3 | Стили |
| Supabase | JS SDK | БД, Auth, RLS |
| PWA | manifest + SW | Установка, офлайн, push |
| Vercel | — | Деплой |

---

## Лицензия

MIT
