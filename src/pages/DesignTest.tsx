import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { TerminalText } from '../components/TerminalText';
import { StatusBadge } from '../components/StatusBadge';

export function DesignTest() {
  return (
    <div className="bg-bg min-h-screen p-8">
      <TerminalText cursor>СИСТЕМА: ТЕСТ ДИЗАЙН-СИСТЕМЫ</TerminalText>

      <div className="mt-8">
        <TerminalText color="muted">// КНОПКИ</TerminalText>
        <div className="mt-4 flex flex-wrap gap-4">
          <Button variant="primary" size="sm">primary sm</Button>
          <Button variant="primary" size="md">primary md</Button>
          <Button variant="primary" size="lg">primary lg</Button>
          <Button variant="ghost" size="sm">ghost sm</Button>
          <Button variant="ghost" size="md">ghost md</Button>
          <Button variant="ghost" size="lg">ghost lg</Button>
          <Button variant="danger" size="sm">danger sm</Button>
          <Button variant="danger" size="md">danger md</Button>
          <Button variant="danger" size="lg">danger lg</Button>
          <Button variant="primary" disabled>disabled primary</Button>
        </div>
      </div>

      <div className="mt-10">
        <TerminalText color="muted">// КАРТОЧКИ</TerminalText>
        <div className="mt-4 flex flex-wrap gap-4 max-w-md">
          <Card>
            <TerminalText>Карточка 1 — базовое содержимое</TerminalText>
          </Card>
          <Card>
            <TerminalText color="green">Карточка 2 — зелёный акцент</TerminalText>
          </Card>
          <Card onClick={() => {}}>
            <TerminalText color="muted">Карточка 3 — кликабельная</TerminalText>
          </Card>
        </div>
      </div>

      <div className="mt-10">
        <TerminalText color="muted">// ТЕРМИНАЛЬНЫЙ ТЕКСТ</TerminalText>
        <div className="mt-4 space-y-2">
          <TerminalText color="default">default color text</TerminalText>
          <TerminalText color="green">green color text</TerminalText>
          <TerminalText color="red">red color text</TerminalText>
          <TerminalText color="muted">muted color text</TerminalText>
          <TerminalText cursor>with cursor</TerminalText>
          <TerminalText showPrefix={false}>no prefix</TerminalText>
        </div>
      </div>

      <div className="mt-10">
        <TerminalText color="muted">// СТАТУСЫ</TerminalText>
        <div className="mt-4 flex gap-4">
          <StatusBadge status="active">active</StatusBadge>
          <StatusBadge status="critical">critical</StatusBadge>
          <StatusBadge status="idle">idle</StatusBadge>
        </div>
      </div>
    </div>
  );
}
