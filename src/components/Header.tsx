'use client';
import { useState, useEffect } from 'react';
import '@/styles/css/Header.css';
import Link from 'next/link';
// Import icons from react-icons
import { FaSearch, FaUser, FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa';
import { IoNewspaper } from 'react-icons/io5';
import { MdEmail } from 'react-icons/md';
import { GiPresent } from 'react-icons/gi';

export default function Header() {
    const [searchTerm, setSearchTerm] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    
    // Handle window resize for responsive design
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        // Set initial value
        handleResize();
        
        // Add event listener
        window.addEventListener('resize', handleResize);
        
        // Clean up
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };
    
    return (
        <header className="site-header">
            {/* Layer 1 - Top information bar (hidden on mobile) */}
            {!isMobile && (
                <div className="header-layer header-layer-1">
                    <div className="container">
                        <nav className="top-nav">
                            <ul>
                                <li><a href="/welcome">Welcome to my shop</a></li>
                                <li><a href="/instructions">Purchase instructions</a></li>
                                <li><a href="/contact">Contact information</a></li>
                            </ul>
                        </nav>
                    </div>
                </div>
            )}
            
            {/* Layer 2 - Main header with logo, search, account */}
            <div className="header-layer header-layer-2">
                <div className="container">
                    <div className="main-header">
                        {/* On mobile: Show only category menu, search bar, and cart */}
                        {isMobile ? (
                            <>
                                {/* Mobile menu toggle */}
                                <button 
                                    className="mobile-menu-toggle" 
                                    onClick={toggleMobileMenu}
                                    aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                                >
                                    {mobileMenuOpen ? <FaTimes /> : <FaBars />}
                                </button>
                                
                                {/* Search bar always visible on mobile */}
                                <div className="mobile-search-bar">
                                    <form onSubmit={(e) => e.preventDefault()}>
                                        <input 
                                            type="text" 
                                            placeholder="Search..." 
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            aria-label="Search products"
                                        />
                                        <button type="submit" aria-label="Search">
                                            <FaSearch />
                                        </button>
                                    </form>
                                </div>
                                
                                {/* Shopping cart always visible */}
                                <a href="/cart" className="shopping-cart" aria-label="Shopping Cart">
                                    <FaShoppingCart className="cart-icon" />
                                    <span className="cart-count">0</span>
                                </a>
                            </>
                        ) : (
                            <>
                                <div className="logo">
                                    <Link href="/">
                                        Leup Shop
                                    </Link>
                                </div>
                                
                                {/* Desktop search box */}
                                <div className="search-box">
                                    <form onSubmit={(e) => e.preventDefault()}>
                                        <input 
                                            type="text" 
                                            placeholder="Search products..." 
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            aria-label="Search products"
                                        />
                                        <button type="submit" aria-label="Search">
                                            <FaSearch className="search-icon" />
                                        </button>
                                    </form>
                                </div>
                                
                                {/* Compact user actions */}
                                <div className="user-actions">
                                    <a href="/account/login" className="login-register" aria-label="Account">
                                        <FaUser className="user-icon" />
                                        <span>Login</span>
                                    </a>
                                    
                                    <a href="/cart" className="shopping-cart" aria-label="Shopping Cart">
                                        <FaShoppingCart className="cart-icon" />
                                        <span className="cart-count">0</span>
                                    </a>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Layer 3 - Navigation and additional links */}
            <div className={`header-layer header-layer-3 ${mobileMenuOpen ? 'mobile-open' : ''}`}>
                <div className="container">
                    <div className="bottom-header">
                        <nav className="category-menu">
                            {!isMobile && (
                                <div className="menu-icon">
                                    <FaBars className="hamburger-icon" />
                                </div>
                            )}
                        </nav>
                        
                        <div className="additional-links">
                            <a href="/blog" className="tips-news">
                                <IoNewspaper className="icon" /> 
                                <span>Tips & News</span>
                            </a>
                            <a href="/cooperation" className="cooperation">
                                <MdEmail className="icon" /> 
                                <span>Cooperation</span>
                            </a>
                            <a href="/giveaway" className="giveaway">
                                <GiPresent className="icon" /> 
                                <span>Giveaway</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Mobile menu (only shown when menu is open) */}
            {isMobile && mobileMenuOpen && (
                <div className="mobile-menu">
                    <nav className="mobile-navigation">
                        <ul>
                            <li><a href="/welcome">Welcome to my shop</a></li>
                            <li><a href="/instructions">Purchase instructions</a></li>
                            <li><a href="/contact">Contact information</a></li>
                            <li><a href="/blog">Tips & News</a></li>
                            <li><a href="/cooperation">Contact for Cooperation</a></li>
                            <li><a href="/giveaway">Giveaway</a></li>
                        </ul>
                    </nav>
                </div>
            )}
        </header>
    );
}