import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../api/queryClient';
import { ThemeProvider } from '../theme/ThemeProvider';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { SelectionProvider } from './SelectionContext';
import { useSessionStore } from '../state/sessionStore';
export function AppProviders({ children }) {
  const userId = useSessionStore((s) => s.session?.user.id || 'guest');
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ErrorBoundary>
          <QueryClientProvider client={queryClient}>
            <SelectionProvider key={userId}>{children}</SelectionProvider>
          </QueryClientProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
