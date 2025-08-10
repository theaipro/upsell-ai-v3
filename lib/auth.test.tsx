import React from 'react';
import { render, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './auth-context';
import { supabase } from './supabase-client';

jest.mock('./supabase-client', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      verifyOtp: jest.fn(),
      onAuthStateChange: jest.fn().mockReturnValue({
        data: { subscription: { unsubscribe: jest.fn() } },
      }),
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
    })),
  },
}));

const TestComponent = ({ onAuthLoad }) => {
  const auth = useAuth();
  React.useEffect(() => {
    if (auth) {
      onAuthLoad(auth);
    }
  }, [auth, onAuthLoad]);
  return null;
};

describe('AuthProvider', () => {
  const testEmail = `testuser_${Date.now()}@example.com`;
  const testPassword = 'password123';

  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock for onAuthStateChange to simulate a logged-out user
    supabase.auth.onAuthStateChange.mockImplementation((callback) => {
      callback('INITIAL_SESSION', null);
      return {
        data: { subscription: { unsubscribe: jest.fn() } },
      };
    });
  });

  it('should sign up a new user', async () => {
    const mockUser = { id: '123', email: testEmail, email_confirmed_at: null };
    const mockSession = { access_token: 'abc', refresh_token: 'def', user: mockUser };
    supabase.auth.signUp.mockResolvedValue({ data: { user: mockUser, session: mockSession }, error: null });

    let auth;
    render(
      <AuthProvider>
        <TestComponent onAuthLoad={(a) => (auth = a)} />
      </AuthProvider>
    );

    await waitFor(() => expect(auth).toBeDefined());
    await waitFor(() => expect(auth.isLoading).toBe(false));

    let result;
    await act(async () => {
      result = await auth.signup('Test User', testEmail, testPassword);
    });

    expect(result.success).toBe(true);
    expect(result.error).toBeNull();
    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email: testEmail,
      password: testPassword,
      options: { data: { full_name: 'Test User' } },
    });
  });

  it('should log in an existing user', async () => {
    const mockUser = { id: '123', email: testEmail, email_confirmed_at: new Date().toISOString() };
    const mockSession = { access_token: 'abc', refresh_token: 'def', user: mockUser };
    supabase.auth.signInWithPassword.mockResolvedValue({ data: { user: mockUser, session: mockSession }, error: null });

    let auth;
    render(
      <AuthProvider>
        <TestComponent onAuthLoad={(a) => (auth = a)} />
      </AuthProvider>
    );

    await waitFor(() => expect(auth).toBeDefined());
    await waitFor(() => expect(auth.isLoading).toBe(false));

    let result;
    await act(async () => {
      result = await auth.login(testEmail, testPassword);
    });

    expect(result.success).toBe(true);
    expect(result.error).toBeNull();
    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: testEmail,
      password: testPassword,
    });
  });

  it('should log out a user', async () => {
    supabase.auth.signOut.mockResolvedValue({ error: null });

    let auth;
    render(
      <AuthProvider>
        <TestComponent onAuthLoad={(a) => (auth = a)} />
      </AuthProvider>
    );

    await waitFor(() => expect(auth).toBeDefined());

    await act(async () => {
      await auth.logout();
    });

    expect(supabase.auth.signOut).toHaveBeenCalled();
  });

  it('should return an error for an invalid verification code', async () => {
    const mockError = { message: 'Invalid token', status: 400 };
    supabase.auth.verifyOtp.mockResolvedValue({ data: {}, error: mockError });

    let auth;
    render(
      <AuthProvider>
        <TestComponent onAuthLoad={(a) => (auth = a)} />
      </AuthProvider>
    );

    await waitFor(() => expect(auth).toBeDefined());

    let result;
    await act(async () => {
      result = await auth.verifyEmail(testEmail, '000000');
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe(mockError.message);
  });
});
