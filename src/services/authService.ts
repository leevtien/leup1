import { createUserWithEmailAndPassword, signInWithPopup, signInWithEmailAndPassword, signOut, UserCredential, sendEmailVerification, sendPasswordResetEmail } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebaseConfig";

// Đăng ký tài khoản
export const signUp = async (email: string, password: string): Promise<UserCredential> => {
  return createUserWithEmailAndPassword(auth, email, password);

};

// Đăng nhập
export const signIn = async (email: string, password: string): Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Đăng xuất
export const logOut = async (): Promise<void> => {
  return signOut(auth);
};

export const signInWithGoogle = async (): Promise<UserCredential> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result;
  } catch (error) {
    console.error("Lỗi đăng nhập bằng Google:", error);
    throw error;
  }
};

export const sendVerificationEmail = async (user) => {
  if (user) {
    await sendEmailVerification(user);
  }
};

export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("Error sending reset password email:", error);
    throw error;
  }
};