import { useAtomValue } from 'jotai';
import { useLocation } from 'react-router-dom';

import Todo from './todo';
import { todosAtom } from '@/atoms/todos';

function TodoList() {
  // TODO: think about testability
  const todos = useAtomValue(todosAtom);

  const location = useLocation();

  const filteredTodos = todos.filter(({ completed }) => {
    if (location.pathname === '/todos/active') {
      return !completed;
    }
    if (location.pathname === '/todos/completed') {
      return completed;
    }
    return true;
  });

  return (
    <div>
      {filteredTodos.map((todo) => (
        <Todo
          key={todo.id}
          {...todo}
        />
      ))}
    </div>
  );
}

export default TodoList;
