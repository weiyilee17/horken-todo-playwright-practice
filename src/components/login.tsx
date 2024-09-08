import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import axios, { isAxiosError } from 'axios';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { loginResponseSchema, loginSchema, TLogin } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const loginRequest = async (data: TLogin) => {
  const response = await axios.post('http://localhost:8080/login', data);
  return response.data;
};

function Login() {
  const form = useForm<TLogin>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { toast } = useToast();

  const { mutate } = useMutation({
    mutationFn: loginRequest,
    onSuccess(response) {
      const { success, error, data } = loginResponseSchema.safeParse(response);
      if (!success) {
        toast({
          title: 'Login Failed',
          description: error.message,
        });
      } else {
        toast({
          title: 'Login Successful',
          description: `Token: ${data.token}`,
        });
      }
    },
    onError(error) {
      if (isAxiosError(error)) {
        toast({
          title: 'Login Failed',
          description: error.response?.data.message,
        });
      } else {
        toast({
          title: 'Login Failed',
          description: 'An unknown error occurred',
        });
      }
    },
  });

  function handleSubmit({ email, password }: TLogin) {
    mutate({ email, password });

    form.reset();
  }

  return (
    <div className='flex flex-col justify-center items-center h-screen'>
      <h2 className='text-2xl font-bold mb-4'>Login</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className='w-1/3 space-y-6'
        >
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Email'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Password'
                    type='password'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit'>Login</Button>
        </form>
      </Form>
    </div>
  );
}

export default Login;
