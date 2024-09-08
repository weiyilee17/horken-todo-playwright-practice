import { useAtom } from 'jotai';
import { NavLink } from 'react-router-dom';

import { todosAtom } from '@/atoms/todos';
import { cn } from '@/lib/utils';

function Footer() {
  const [todos, setTodos] = useAtom(todosAtom);

  const remainingTodos = todos.filter((todo) => !todo.completed);

  return (
    <div className='flex items-center justify-between'>
      {/* Could be simplified with i18n */}
      <p data-testid='todo-count'>
        {remainingTodos.length} {remainingTodos.length === 1 ? 'item' : 'items'} left
      </p>
      <div className='flex gap-2'>
        <NavLink
          to='./all'
          className={({ isActive }) =>
            cn('border-2 px-4 border-transparent rounded-md hover:border-blue-500 hover:underline', {
              'border-blue-500': isActive,
            })
          }
        >
          All
        </NavLink>
        <NavLink
          to='./active'
          className={({ isActive }) =>
            cn('border-2 px-4 border-transparent rounded-md hover:border-blue-500 hover:underline', {
              'border-blue-500': isActive,
            })
          }
        >
          Active
        </NavLink>
        <NavLink
          to='./completed'
          className={({ isActive }) =>
            cn('border-2 px-4 border-transparent rounded-md hover:border-blue-500 hover:underline', {
              'border-blue-500': isActive,
            })
          }
        >
          Completed
        </NavLink>
      </div>
      <button
        type='button'
        className={cn('border-2 px-4 border-transparent rounded-md hover:border-red-500 hover:underline', {
          // todos.length === remainingTodos.length means there are no completed todos, so it is meaningless to clear completed todos
          invisible: remainingTodos.length === todos.length,
        })}
        onClick={() => {
          setTodos(remainingTodos);
        }}
      >
        Clear completed
      </button>
    </div>
  );
}

export default Footer;
