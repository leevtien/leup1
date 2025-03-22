'use client';

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { getCurrentUserProfile, UserProfile } from '@/services/authService';

// Create the context with default values
interface UserContextType {
  user: UserProfile | null;
  loading: boolean;
  refreshUserProfile: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  refreshUserProfile: async () => {},
});

// Hook for using the user context
export const useUser = () => useContext(UserContext);

// Create the provider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUserProfile = async () => {
    try {
      setLoading(true);
      console.log("Refreshing user profile");
      const userProfile = await getCurrentUserProfile();
      console.log("Fetched user profile:", userProfile);
      setUser(userProfile);
    } catch (error) {
      console.error("Error refreshing user profile:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    console.log("Setting up auth state listener");
    
    // Set up auth state listener
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      
      if (firebaseUser) {
        console.log("User is signed in:", firebaseUser.uid);
        try {
          // Fetch the user profile from Firestore
          const userProfile = await getCurrentUserProfile();
          console.log("Fetched user profile:", userProfile);
          setUser(userProfile);
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setUser(null);
        }
      } else {
        console.log("User is signed out");
        setUser(null);
      }
      
      setLoading(false);
    });

    // Clean up subscription
    return () => {
      console.log("Cleaning up auth state listener");
      unsubscribe();
    }
  }, []);

  const value = {
    user,
    loading,
    refreshUserProfile
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};