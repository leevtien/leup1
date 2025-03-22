// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebaseConfig';
import { getUserData } from '@/services/userService';

interface UserData {
  id: string;
  email: string;
  displayName: string;
  role: string;
  [key: string]: any;
}

interface AuthState {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    userData: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        if (user) {
          try {
            // Get additional user data from Firestore
            const userData = await getUserData(user.uid);
            setAuthState({
              user,
              userData,
              loading: false,
              error: null,
            });
          } catch (error) {
            console.error('Error fetching user data:', error);
            setAuthState({
              user,
              userData: null,
              loading: false,
              error: 'Failed to load user data',
            });
          }
        } else {
          setAuthState({
            user: null,
            userData: null,
            loading: false,
            error: null,
          });
        }
      },
      (error) => {
        console.error('Auth state change error:', error);
        setAuthState({
          user: null,
          userData: null,
          loading: false,
          error: error.message,
        });
      }
    );

    // Clean up subscription
    return () => unsubscribe();
  }, []);

  return authState;
}