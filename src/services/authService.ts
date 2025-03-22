import { createUserWithEmailAndPassword, signInWithPopup, signInWithEmailAndPassword, signOut, UserCredential, sendEmailVerification, sendPasswordResetEmail, getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { auth, googleProvider, db } from "@/lib/firebaseConfig";

// Define user profile type
export interface UserProfile {
  uid: string;
  fullName?: string;
  email: string;
  photoURL?: string;
  memberSince: string;
  phoneNumber?: string;
  address?: string;
}

// Register a new user
export const signUp = async (email: string, password: string, fullName?: string): Promise<UserCredential> => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // Create user profile in Firestore
    if (result.user) {
      const userProfile: UserProfile = {
        uid: result.user.uid,
        fullName: fullName || '',
        email: result.user.email || email,
        photoURL: result.user.photoURL || '',
        memberSince: new Date().toISOString(),
        phoneNumber: result.user.phoneNumber || '',
      };
      
      await setDoc(doc(db, "users", result.user.uid), userProfile);
    }
    
    return result;
  } catch (error) {
    console.error("Error during signup:", error);
    throw error;
  }
};

// Sign in with email and password
export const signIn = async (email: string, password: string, rememberMe?: boolean): Promise<UserCredential> => {
  try {
    const persistence = rememberMe ? 'local' : 'session';
    // Set persistence would go here if needed
    
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// Sign out
export const logOut = async (): Promise<void> => {
  return signOut(auth);
};

// Sign in with Google
export const signInWithGoogle = async (): Promise<UserCredential> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    
    // Check if it's a new user and create profile if needed
    if (result.user) {
      const userDoc = await getDoc(doc(db, "users", result.user.uid));
      
      if (!userDoc.exists()) {
        const userProfile: UserProfile = {
          uid: result.user.uid,
          fullName: result.user.displayName || '',
          email: result.user.email || '',
          photoURL: result.user.photoURL || '',
          memberSince: new Date().toISOString(),
          phoneNumber: result.user.phoneNumber || '',
        };
        
        await setDoc(doc(db, "users", result.user.uid), userProfile);
      }
    }
    
    return result;
  } catch (error) {
    console.error("Google sign-in error:", error);
    throw error;
  }
};

// Send verification email
export const sendVerificationEmail = async (user) => {
  if (user) {
    await sendEmailVerification(user);
  }
};

// Reset password
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("Error sending reset password email:", error);
    throw error;
  }
};

// Get current user profile from Firestore
export const getCurrentUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const auth = getAuth();
    
    if (!auth.currentUser) {
      return null;
    }
    
    const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
    
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    } else {
      // Create a basic profile if it doesn't exist
      const userProfile: UserProfile = {
        uid: auth.currentUser.uid,
        fullName: auth.currentUser.displayName || '',
        email: auth.currentUser.email || '',
        photoURL: auth.currentUser.photoURL || '',
        memberSince: new Date().toISOString(),
        phoneNumber: auth.currentUser.phoneNumber || '',
      };
      
      await setDoc(doc(db, "users", auth.currentUser.uid), userProfile);
      return userProfile;
    }
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
};

// Check if user is logged in and return the current user
export const checkAuth = (): Promise<UserProfile | null> => {
  return new Promise((resolve) => {
    const auth = getAuth();
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe();
      
      if (user) {
        // User is signed in, get profile
        const profile = await getCurrentUserProfile();
        resolve(profile);
      } else {
        // User is not signed in
        resolve(null);
      }
    });
  });
};