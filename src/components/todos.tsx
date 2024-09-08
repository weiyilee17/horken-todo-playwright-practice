import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useAtom } from 'jotai';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import TodoList from './todo-list';
import Footer from './footer';

import { todoFormSchema, TTodoForm } from '@/lib/types';
import { todosAtom } from '@/atoms/todos';
import { cn } from '@/lib/utils';
import { Checkbox } from './ui/checkbox';

function Todos() {
  const form = useForm<TTodoForm>({
    resolver: zodResolver(todoFormSchema),
    defaultValues: {
      description: '',
    },
  });

  const [todos, setTodos] = useAtom(todosAtom);

  const completedTodos = todos.filter(({ completed }) => completed);

  function handleSubmit({ description }: TTodoForm) {
    const newTodo = {
      id: Math.max(...todos.map(({ id }) => id), 0) + 1,
      description,
      completed: false,
    };
    const newTodos = [...todos, newTodo];
    setTodos(newTodos);

    form.reset();
  }

  const handleToggleAll = () => {
    const isAllCompleted = completedTodos.length === todos.length;
    const newTodos = todos.map((todo) => ({ ...todo, completed: isAllCompleted ? false : true }));
    setTodos(newTodos);
  };

  return (
    <div className='my-4'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className='flex items-center gap-2 px-2'
        >
          <Checkbox
            aria-label='Mark all as complete'
            className={cn('', {
              invisible: todos.length === 0,
            })}
            onClick={handleToggleAll}
            checked={completedTodos.length === todos.length}
          />
          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem className='flex-1'>
                <FormControl>
                  <Input
                    placeholder='What needs to be done?'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit'>Add</Button>
        </form>
      </Form>
      <TodoList />
      {todos.length > 0 && <Footer />}
    </div>
  );
}

export default Todos;
