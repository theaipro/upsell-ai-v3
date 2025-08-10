import React from 'react';
import { render, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './auth-context';
import { supabase } from './supabase-client';

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
    // Sign up the user first to ensure they exist
    await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        emailRedirectTo: 'http://localhost:3000/',
        data: {
          email_confirm: false,
        },
      },
    });

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
