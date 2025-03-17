'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaBars, FaSearch, FaShoppingCart, FaUser } from 'react-icons/fa';
import '@/styles/css/Header.css';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    // For improved UX, control MainBanner's menu state
    const event = new CustomEvent('toggleMobileMenu', { 
      detail: { isOpen: !mobileMenuOpen } 
    });
    window.dispatchEvent(event);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        {/* Mobile Menu Toggle */}
        <button 
          className={`menu-toggle ${mobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
        >
          <span></span>
        </button>

        {/* Logo */}
        <div className="navbar-logo">
          <Link href="/">
            <Image src="/images/logo.png" alt="Logo" width={150} height={40} />
          </Link>
        </div>

        {/* Desktop Nav Links - Hidden on mobile */}
        <div className="navbar-links">
          <Link href="/">Home</Link>
          <Link href="/products">Products</Link>
          <Link href="/categories">Categories</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </div>

        {/* Search Box - Hidden on mobile */}
        <div className="search-box">
          <input type="text" placeholder="Search products..." />
          <button><FaSearch /></button>
        </div>

        {/* User Actions - Hidden on mobile */}
        <div className="user-actions">
          <Link href="/login" className="login-btn">Login</Link>
          <Link href="/register" className="register-btn">Register</Link>
        </div>

        {/* Cart Icon - Always visible */}
        <div className="cart-icon">
          <Link href="/cart">
            <FaShoppingCart />
            <span className="cart-count">3</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}