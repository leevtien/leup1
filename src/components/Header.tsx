'use client';
import { useState } from 'react';
import '@/styles/css/Header.css';
// import Image from 'next/image';
import Link from 'next/link';
// Import icons from react-icons
import { FaSearch, FaUser, FaShoppingCart, FaBars } from 'react-icons/fa';
import { IoNewspaper } from 'react-icons/io5';
import { MdEmail } from 'react-icons/md';
import { GiPresent } from 'react-icons/gi';

export default function Header() {
    const [searchTerm, setSearchTerm] = useState('');
    
    return (
        <header className="site-header">
            {/* Layer 1 - Top information bar */}
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
            
            {/* Layer 2 - Main header with logo, search, account */}
            <div className="header-layer header-layer-2">
                <div className="container">
                    <div className="main-header">
                        <div className="logo">
                            <Link href="/">
                                logo
                            </Link>
                        </div>
                        
                        <div className="search-box">
                            <form onSubmit={(e) => e.preventDefault()}>
                                <input 
                                    type="text" 
                                    placeholder="Search products..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <button type="submit">
                                    <FaSearch className="search-icon" />
                                </button>
                            </form>
                        </div>
                        
                        <div className="user-actions">
                            <a href="/account" className="login-register">
                                <FaUser className="user-icon" />
                                <span>Login / Register</span>
                                
                            </a>
                            
                            <a href="/cart" className="shopping-cart">
                                <FaShoppingCart className="cart-icon" />
                                <span className="cart-count">0</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Layer 3 - Navigation and additional links */}
            <div className="header-layer header-layer-3">
                <div className="container">
                    <div className="bottom-header">
                        <nav className="category-menu">
                            <div className="menu-icon">
                                <FaBars className="hamburger-icon" />
                            </div>
                            {/* <ul className="dropdown-menu">
                                <li><a href="/category/electronics">Electronics</a></li>
                                <li><a href="/category/clothing">Clothing</a></li>
                                <li><a href="/category/home">Home & Garden</a></li>
                                <li><a href="/category/toys">Toys</a></li>
                                <li><a href="/categories">All Categories</a></li>
                            </ul> */}
                        </nav>
                        
                        <div className="additional-links">
                            <a href="/blog" className="tips-news">
                                <IoNewspaper className="icon" /> Tips & News
                            </a>
                            <a href="/cooperation" className="cooperation">
                                <MdEmail className="icon" /> Contact for Cooperation
                            </a>
                            <a href="/giveaway" className="giveaway">
                                <GiPresent className="icon" /> Giveaway
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}