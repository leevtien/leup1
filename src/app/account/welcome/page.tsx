"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash, FaGoogle, FaFacebook } from "react-icons/fa";
import { signUp, signInWithGoogle } from "@/services/authService";
import "@/styles/css/auth.css";

export default function SignUp() {
  const router = useRouter();
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear validation error when user types
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: "",
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    };
    let isValid = true;

    // Validate fullName
    if (!formData.fullName.trim()) {
      errors.fullName = "Full name is required";
      isValid = false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Validate password
    if (!formData.password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
      isValid = false;
    }

    // Validate confirm password
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  // Handle form submission
  const handleSignUp = async (e) => {
    e.preventDefault();
    
    // Reset general error
    setError("");
    setSuccessMessage("");
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Call Firebase signup function
      await signUp(formData.email, formData.password, formData.fullName);
      setSuccessMessage("Registration successful! Redirecting to login...");
      
      // Success message and redirect
      setTimeout(() => {
        router.push("/account/login");
      }, 3000);
    } catch (err) {
      // Handle Firebase errors
      if (err.code === "auth/email-already-in-use") {
        setError("This email address is already in use.");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email address format.");
      } else if (err.code === "auth/weak-password") {
        setError("Password should be at least 6 characters.");
      } else {
        setError(err.message || "An error occurred during signup. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google sign in
  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
      router.push("/account");
    } catch (err) {
      setError("Google sign-in failed. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-box signup-box">
          <div className="auth-header">
            <Link href="/" className="auth-logo">
              <Image 
                src="/images/logo.png" 
                alt="Company Logo" 
                width={150} 
                height={40} 
              />
            </Link>
            <h1>Create an Account</h1>
            <p>Join our community and start shopping today!</p>
          </div>
          
          {error && <div className="auth-error">{error}</div>}
          {successMessage && <div className="auth-success">{successMessage}</div>}
          
          <form onSubmit={handleSignUp} className="auth-form">
            <div className="form-group">
              <label htmlFor="fullName">
                <FaUser className="input-icon" />
                <span>Full Name</span>
              </label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={validationErrors.fullName ? "error" : ""}
                />
              </div>
              {validationErrors.fullName && (
                <p className="error-message">{validationErrors.fullName}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email">
                <FaEnvelope className="input-icon" />
                <span>Email Address</span>
              </label>
              <div className="input-wrapper">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  className={validationErrors.email ? "error" : ""}
                />
              </div>
              {validationErrors.email && (
                <p className="error-message">{validationErrors.email}</p>
              )}
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
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  className={validationErrors.password ? "error" : ""}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {validationErrors.password && (
                <p className="error-message">{validationErrors.password}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">
                <FaLock className="input-icon" />
                <span>Confirm Password</span>
              </label>
              <div className="input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className={validationErrors.confirmPassword ? "error" : ""}
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="password-toggle"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {validationErrors.confirmPassword && (
                <p className="error-message">{validationErrors.confirmPassword}</p>
              )}
            </div>

            <div className="form-group terms-agreement">
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">
                I agree to the <Link href="/terms">Terms of Service</Link> and <Link href="/privacy">Privacy Policy</Link>
              </label>
            </div>

            <button 
              type="submit" 
              className={`auth-button ${isLoading ? "loading" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
          
          <div className="auth-divider">
            <span>Or sign up with</span>
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
          
          <div className="auth-footer">
            <p>
              Already have an account? <Link href="/account/login">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}