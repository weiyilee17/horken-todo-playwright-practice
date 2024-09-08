import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@/components/theme-provider';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Toaster } from '@/components/ui/toaster';
import ErrorPage from './error-page';
import App from './App.tsx';
import Login from './components/login.tsx';
import './index.css';
// import { toast } from './hooks/use-toast.ts';

const queryClient = new QueryClient({
  queryCache: new QueryCache(),
  //   {
  //   onError: (error) => {
  //     toast({
  //       title: 'Login failed',
  //       description: error.message,
  //     });
  //   },
  // }
});

const router = createBrowserRouter([
  {
    path: '/todos/*',
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <Navigate to='/todos/all' />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider
      defaultTheme='dark'
      storageKey='vite-ui-theme'
    >
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>
);
