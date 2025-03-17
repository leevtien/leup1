"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle, FaFacebook } from "react-icons/fa";
import { signIn, signInWithGoogle, resetPassword } from "@/services/authService";
import "@/styles/css/auth.css";

export default function Login() {
  const router = useRouter();
  
  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetError, setResetError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Handle form input changes
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setError("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError("");
  };

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }
    
    if (!password) {
      setError("Please enter your password");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      await signIn(email, password, rememberMe);
      router.push("/account");
    } catch (err) {
      console.error("Login error:", err);
      
      // Handle different Firebase auth errors
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        setError("Invalid email or password. Please try again.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many failed login attempts. Please try again later or reset your password.");
      } else if (err.code === "auth/user-disabled") {
        setError("This account has been disabled. Please contact support.");
      } else {
        setError("Failed to log in. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google sign in
  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError("");
      await signInWithGoogle();
      router.push("/account");
    } catch (err) {
      console.error("Google sign-in error:", err);
      setError("Google sign-in failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password reset
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!resetEmail.trim()) {
      setResetError("Please enter your email address");
      return;
    }
    
    setIsLoading(true);
    setResetError("");
    
    try {
      await resetPassword(resetEmail);
      setResetSent(true);
    } catch (err) {
      console.error("Password reset error:", err);
      
      if (err.code === "auth/user-not-found") {
        setResetError("We couldn't find an account with that email address");
      } else {
        setResetError("Failed to send password reset email. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-box login-box">
          <div className="auth-header">
            <Link href="/" className="auth-logo">
              <Image 
                src="/images/logo.png" 
                alt="Company Logo" 
                width={150} 
                height={40} 
              />
            </Link>
            <h1>Welcome Back</h1>
            <p>Sign in to your account to continue</p>
          </div>
          
          {error && <div className="auth-error">{error}</div>}
          
          {!showResetForm ? (
            // Login Form
            <>
              <form onSubmit={handleLogin} className="auth-form">
                <div className="form-group">
                  <label htmlFor="email">
                    <FaEnvelope className="input-icon" />
                    <span>Email Address</span>
                  </label>
                  <div className="input-wrapper">
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={handleEmailChange}
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="password">
                    <FaLock className="input-icon" />
                    <span>Password</span>
                  </label>
                  <div className="input-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={handlePasswordChange}
                      placeholder="Enter your password"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="password-toggle"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div className="form-options">
                  <div className="remember-me">
                    <input 
                      type="checkbox" 
                      id="remember" 
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <label htmlFor="remember">Remember me</label>
                  </div>
                  <button 
                    type="button" 
                    className="forgot-password"
                    onClick={() => setShowResetForm(true)}
                  >
                    Forgot password?
                  </button>
                </div>

                <button 
                  type="submit" 
                  className={`auth-button ${isLoading ? "loading" : ""}`}
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </button>
              </form>
              
              <div className="auth-divider">
                <span>Or sign in with</span>
              </div>
              
              <div className="social-auth">
                <button 
                  type="button" 
                  className="social-button google"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                >
                  <FaGoogle />
                  <span>Google</span>
                </button>
                <button 
                  type="button" 
                  className="social-button facebook"
                  disabled={isLoading}
                >
                  <FaFacebook />
                  <span>Facebook</span>
                </button>
              </div>
            </>
          ) : (
            // Password Reset Form
            <div className="reset-password-form">
              {resetSent ? (
                <div className="reset-success">
                  <div className="success-icon">✓</div>
                  <h3>Reset Email Sent!</h3>
                  <p>
                    We've sent instructions to reset your password to <strong>{resetEmail}</strong>.
                    Please check your inbox.
                  </p>
                  <button 
                    type="button" 
                    className="auth-button" 
                    onClick={() => {
                      setShowResetForm(false);
                      setResetSent(false);
                    }}
                  >
                    Back to Login
                  </button>
                </div>
              ) : (
                <>
                  <h3>Reset Your Password</h3>
                  <p>
                    Enter your email address and we'll send you instructions to reset your password.
                  </p>
                  
                  {resetError && <div className="auth-error">{resetError}</div>}
                  
                  <form onSubmit={handleResetPassword}>
                    <div className="form-group">
                      <label htmlFor="resetEmail">
                        <FaEnvelope className="input-icon" />
                        <span>Email Address</span>
                      </label>
                      <div className="input-wrapper">
                        <input
                          type="email"
                          id="resetEmail"
                          value={resetEmail}
                          onChange={(e) => {
                            setResetEmail(e.target.value);
                            setResetError("");
                          }}
                          placeholder="Enter your email address"
                        />
                      </div>
                    </div>
                    
                    <div className="reset-actions">
                      <button 
                        type="button" 
                        className="cancel-button"
                        onClick={() => setShowResetForm(false)}
                        disabled={isLoading}
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className={`auth-button ${isLoading ? "loading" : ""}`}
                        disabled={isLoading}
                      >
                        {isLoading ? "Sending..." : "Send Reset Link"}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          )}
          
          <div className="auth-footer">
            <p>
              Don't have an account? <Link href="/account/signup">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}