import { TerminalText } from './TerminalText'
import { Button } from './Button'
import type { DailyTaskWithLibrary } from '../lib/dailyEngine'

interface DailyTaskItemProps {
  task: DailyTaskWithLibrary
  onToggle: (id: string, completed: boolean) => void
}

export function DailyTaskItem({ task, onToggle }: DailyTaskItemProps) {
  const title = task.task_library?.title || 'Без названия'
  const duration = task.task_library?.duration_min
    ? ` (${task.task_library.duration_min} мин)`
    : ''
  const level = task.task_library?.level ? ` [Ур.${task.task_library.level}]` : ''
  const isCompleted = task.completed

  return (
    <div
      className={`flex items-start gap-3 p-3 border border-border ${
        isCompleted ? 'bg-green-900/10 border-green/30' : 'bg-card border-border'
      } rounded-sm`}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onToggle(task.id, !isCompleted)}
        className="w-8 h-8 p-0 leading-none"
      >
        {isCompleted ? '✓' : '□'}
      </Button>
      <div className="flex-1">
        <TerminalText color={isCompleted ? 'green' : 'default'}>
          {title}{duration}{level}
        </TerminalText>
        <TerminalText color="muted" className="text-xs mt-1">
          {task.task_library?.category} • {task.task_library?.difficulty}
        </TerminalText>
      </div>
    </div>
  )
}
