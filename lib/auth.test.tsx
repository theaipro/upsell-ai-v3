import React from 'react';
import { render, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './auth-context';
import { supabase } from './supabase-client';

// Mock the supabase client
jest.mock('./supabase-client', () => ({
  supabase: {
    auth: {
      signUp: jest.fn().mockResolvedValue({ data: { user: { id: '123', email_confirmed_at: null } }, error: null }),
      signInWithPassword: jest.fn().mockResolvedValue({ data: { user: { id: '123' } }, error: null }),
      signOut: jest.fn().mockResolvedValue({ error: null }),
      verifyOtp: jest.fn().mockImplementation((params) => {
        if (params.token === '000000') {
          return Promise.resolve({ error: { message: 'Invalid token' } });
        }
        return Promise.resolve({ data: { user: { id: '123' } }, error: null });
      }),
      onAuthStateChange: jest.fn((callback) => {
        // Immediately call the callback with a mock session
        Promise.resolve().then(() => callback('INITIAL_SESSION', { user: null }));
        return {
          data: { subscription: { unsubscribe: jest.fn() } },
        };
      }),
    },
    from: jest.fn(() => ({
      insert: jest.fn().mockResolvedValue({ data: [{ id: 'company-123' }], error: null }),
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: { id: 'company-123' }, error: null }),
    })),
  },
}));


// Generate a random email for each test run
const testEmail = `testuser_${Date.now()}@mailinator.com`;
const testPassword = 'password123';

import { waitFor } from '@testing-library/react';

const TestComponent = ({ onAuthLoad }) => {
  const auth = useAuth();
  React.useEffect(() => {
    onAuthLoad(auth);
  }, [auth, onAuthLoad]);
  return null;
};

describe('AuthProvider', () => {
  // Increase the timeout for all tests in this suite
  jest.setTimeout(10000);

  it('should sign up a new user', async () => {
    let auth;
    const onAuthLoad = (a) => (auth = a);
    render(
      <AuthProvider>
        <TestComponent onAuthLoad={onAuthLoad} />
      </AuthProvider>
    );

    await waitFor(() => expect(auth).toBeDefined());
    await waitFor(() => expect(auth.isLoading).toBe(false));

    let success, error;
    await act(async () => {
      const result = await auth.signup('Test User', testEmail, testPassword);
      success = result.success;
      error = result.error;
    });

    expect(success).toBe(true);
    expect(error).toBeNull();
  });

  it('should log in an existing user', async () => {
    let auth;
    const onAuthLoad = (a) => (auth = a);
    render(
      <AuthProvider>
        <TestComponent onAuthLoad={onAuthLoad} />
      </AuthProvider>
    );

    await waitFor(() => expect(auth).toBeDefined());
    await waitFor(() => expect(auth.isLoading).toBe(false));

    let success, error;
    await act(async () => {
      const result = await auth.login(testEmail, testPassword);
      success = result.success;
      error = result.error;
    });

    expect(success).toBe(true);
    expect(error).toBeNull();
  });

  it('should log out a user', async () => {
    let auth;
    const onAuthLoad = (a) => (auth = a);
    render(
      <AuthProvider>
        <TestComponent onAuthLoad={onAuthLoad} />
      </AuthProvider>
    );

    await waitFor(() => expect(auth).toBeDefined());
    await waitFor(() => expect(auth.isLoading).toBe(false));

    await act(async () => {
      await auth.logout();
    });
  });

  it('should return an error for an invalid verification code', async () => {
    let auth;
    const onAuthLoad = (a) => (auth = a);
    render(
      <AuthProvider>
        <TestComponent onAuthLoad={onAuthLoad} />
      </AuthProvider>
    );

    await waitFor(() => expect(auth).toBeDefined());
    await waitFor(() => expect(auth.isLoading).toBe(false));

    let success, error;
    await act(async () => {
      const result = await auth.verifyEmail(testEmail, '000000');
      success = result.success;
      error = result.error;
    });

    expect(success).toBe(false);
    expect(error).not.toBeNull();
  });
});
