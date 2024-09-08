import { X } from 'lucide-react';
import { useAtom } from 'jotai';

import type { CheckedState } from '@radix-ui/react-checkbox';
import type { TTodo } from '@/lib/types';

import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { cn } from '@/lib/utils';
import { todosAtom } from '@/atoms/todos';

function Todo({ id, description, completed }: TTodo) {
  const [todos, setTodos] = useAtom(todosAtom);

  const handleCheckChange = (checked: CheckedState) => {
    // skip case when checkState is 'indeterminate'
    if (typeof checked === 'string') {
      return;
    }
    const newTodos = todos.map((todo: TTodo) => (todo.id === id ? { ...todo, completed: checked } : todo));

    setTodos(newTodos);
  };

  const handleDelete = () => {
    const newTodos = todos.filter((todo: TTodo) => todo.id !== id);
    setTodos(newTodos);
  };

  return (
    <div
      className='flex items-center gap-2 p-4'
      data-testid='todo-item'
    >
      <Checkbox
        id='completed'
        checked={completed}
        onCheckedChange={handleCheckChange}
        type='button'
      />
      <Label
        htmlFor='completed'
        className={cn('text-sm font-medium', {
          'line-through': completed,
        })}
        data-testid='todo-description'
      >
        {description}
      </Label>

      <X
        className='ml-auto cursor-pointer size-4 hover:text-red-500'
        onClick={handleDelete}
      />
    </div>
  );
}

export default Todo;
