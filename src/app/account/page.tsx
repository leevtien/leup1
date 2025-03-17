'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from "next/legacy/image";
import { FaUser, FaShoppingBag, FaHeart, FaCreditCard, FaBell, FaLock, FaSignOutAlt, FaDownload } from 'react-icons/fa';
import '@/styles/css/account.css';

// Mock user data
const userData = {
  id: 1,
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: '/images/avatar-placeholder.jpg',
  memberSince: 'June 2023',
  purchases: 12,
  wishlistItems: 5,
  activeSubscriptions: 3
};

// Mock recent orders
const recentOrders = [
  {
    id: 'ORD-39847',
    date: '2025-03-10',
    total: 59.99,
    status: 'Delivered',
    items: [
      { id: 1, name: 'Netflix Premium', price: 19.99, image: '/images/products/netflix-premium.jpg' },
      { id: 2, name: 'Spotify Family Plan', price: 14.99, image: '/images/products/spotify.jpg' },
      { id: 3, name: 'Office 365', price: 25.01, image: '/images/products/office-365.jpg' }
    ]
  },
  {
    id: 'ORD-39721',
    date: '2025-03-01',
    total: 29.99,
    status: 'Delivered',
    items: [
      { id: 4, name: 'Adobe Photoshop', price: 29.99, image: '/images/products/adobe-cc.jpg' }
    ]
  }
];

// Account page tabs
const accountTabs = [
  { id: 'dashboard', label: 'Dashboard', icon: <FaUser /> },
  { id: 'orders', label: 'My Orders', icon: <FaShoppingBag /> },
  { id: 'wishlist', label: 'Wishlist', icon: <FaHeart /> },
  { id: 'subscriptions', label: 'Subscriptions', icon: <FaDownload /> },
  { id: 'payment', label: 'Payment Methods', icon: <FaCreditCard /> },
  { id: 'notifications', label: 'Notifications', icon: <FaBell /> },
  { id: 'security', label: 'Security', icon: <FaLock /> }
];

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="account-page">
      <div className="container">
        <h1 className="page-title">My Account</h1>
        
        <div className="account-container">
          {/* Sidebar */}
          <aside className="account-sidebar">
            <div className="user-info">
              <div className="avatar-container">
                <Image 
                  src={userData.avatar} 
                  alt={userData.name}
                  width={80}
                  height={80}
                  className="user-avatar"
                />
              </div>
              <h3 className="user-name">{userData.name}</h3>
              <p className="user-email">{userData.email}</p>
              <p className="member-since">Member since {userData.memberSince}</p>
            </div>

            <nav className="account-nav">
              <ul>
                {accountTabs.map(tab => (
                  <li key={tab.id}>
                    <button
                      className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <span className="icon">{tab.icon}</span>
                      <span className="label">{tab.label}</span>
                    </button>
                  </li>
                ))}
                <li className="logout-item">
                  <button className="nav-link logout">
                    <span className="icon"><FaSignOutAlt /></span>
                    <span className="label">Sign Out</span>
                  </button>
                </li>
              </ul>
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="account-content">
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div className="tab-content dashboard-tab">
                <h2>Dashboard</h2>
                
                <div className="stats-cards">
                  <div className="stat-card">
                    <div className="stat-icon"><FaShoppingBag /></div>
                    <div className="stat-content">
                      <h3>Purchases</h3>
                      <p className="stat-value">{userData.purchases}</p>
                    </div>
                  </div>
                  
                  <div className="stat-card">
                    <div className="stat-icon"><FaHeart /></div>
                    <div className="stat-content">
                      <h3>Wishlist</h3>
                      <p className="stat-value">{userData.wishlistItems}</p>
                    </div>
                  </div>
                  
                  <div className="stat-card">
                    <div className="stat-icon"><FaDownload /></div>
                    <div className="stat-content">
                      <h3>Subscriptions</h3>
                      <p className="stat-value">{userData.activeSubscriptions}</p>
                    </div>
                  </div>
                </div>

                <div className="recent-orders">
                  <div className="section-header">
                    <h3>Recent Orders</h3>
                    <Link href="#" className="view-all" onClick={() => setActiveTab('orders')}>
                      View all
                    </Link>
                  </div>
                  
                  {recentOrders.slice(0, 2).map(order => (
                    <div className="order-card" key={order.id}>
                      <div className="order-header">
                        <div>
                          <span className="order-id">{order.id}</span>
                          <span className="order-date">
                            {new Date(order.date).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                        <div>
                          <span className={`order-status ${order.status.toLowerCase()}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="order-items">
                        {order.items.map(item => (
                          <div className="order-item" key={item.id}>
                            <div className="item-image">
                              <Image 
                                src={item.image} 
                                alt={item.name}
                                width={60}
                                height={60}
                              />
                            </div>
                            <div className="item-details">
                              <h4>{item.name}</h4>
                              <p className="item-price">${item.price.toFixed(2)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="order-footer">
                        <p className="order-total">
                          <strong>Total:</strong> ${order.total.toFixed(2)}
                        </p>
                        <div className="order-actions">
                          <button className="btn btn-outline">Download</button>
                          <button className="btn btn-outline">View Details</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="tab-content orders-tab">
                <h2>My Orders</h2>
                
                <div className="orders-filter">
                  <div className="search-box">
                    <input type="text" placeholder="Search orders..." />
                    <button className="search-btn">Search</button>
                  </div>
                  
                  <div className="filter-controls">
                    <select className="filter-select">
                      <option>All Orders</option>
                      <option>Recent</option>
                      <option>Past 30 days</option>
                      <option>Past 6 months</option>
                    </select>
                  </div>
                </div>
                
                <div className="orders-list">
                  {recentOrders.map(order => (
                    <div className="order-card" key={order.id}>
                      <div className="order-header">
                        <div>
                          <span className="order-id">{order.id}</span>
                          <span className="order-date">
                            {new Date(order.date).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                        <div>
                          <span className={`order-status ${order.status.toLowerCase()}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="order-items">
                        {order.items.map(item => (
                          <div className="order-item" key={item.id}>
                            <div className="item-image">
                              <Image 
                                src={item.image} 
                                alt={item.name}
                                width={60}
                                height={60}
                              />
                            </div>
                            <div className="item-details">
                              <h4>{item.name}</h4>
                              <p className="item-price">${item.price.toFixed(2)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="order-footer">
                        <p className="order-total">
                          <strong>Total:</strong> ${order.total.toFixed(2)}
                        </p>
                        <div className="order-actions">
                          <button className="btn btn-outline">Download</button>
                          <button className="btn btn-primary">View Details</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Wishlist Tab (placeholder) */}
            {activeTab === 'wishlist' && (
              <div className="tab-content">
                <h2>My Wishlist</h2>
                <p>Your saved items will appear here.</p>
                <div className="empty-state">
                  <FaHeart className="empty-icon" />
                  <h3>Your wishlist is empty</h3>
                  <p>Browse our products and add items to your wishlist</p>
                  <Link href="/products" className="btn btn-primary">Start Shopping</Link>
                </div>
              </div>
            )}

            {/* Subscriptions Tab (placeholder) */}
            {activeTab === 'subscriptions' && (
              <div className="tab-content">
                <h2>My Subscriptions</h2>
                <p>Manage your digital subscriptions.</p>
                <div className="subscription-cards">
                  <div className="subscription-card">
                    <div className="subscription-logo">
                      <Image 
                        src="/images/products/netflix-premium.jpg"
                        alt="Netflix"
                        width={60}
                        height={60}
                      />
                    </div>
                    <div className="subscription-details">
                      <h3>Netflix Premium</h3>
                      <p className="subscription-plan">4K UHD Plan</p>
                      <p className="subscription-renewal">Renews on April 15, 2025</p>
                    </div>
                    <div className="subscription-price">
                      <span>$19.99</span>
                      <span className="period">/ month</span>
                    </div>
                    <div className="subscription-actions">
                      <button className="btn btn-sm btn-outline">Manage</button>
                    </div>
                  </div>
                  
                  <div className="subscription-card">
                    <div className="subscription-logo">
                      <Image 
                        src="/images/products/office-365.jpg"
                        alt="Office 365"
                        width={60}
                        height={60}
                      />
                    </div>
                    <div className="subscription-details">
                      <h3>Microsoft Office 365</h3>
                      <p className="subscription-plan">Family Plan</p>
                      <p className="subscription-renewal">Renews on May 21, 2025</p>
                    </div>
                    <div className="subscription-price">
                      <span>$99.99</span>
                      <span className="period">/ year</span>
                    </div>
                    <div className="subscription-actions">
                      <button className="btn btn-sm btn-outline">Manage</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Methods Tab (placeholder) */}
            {activeTab === 'payment' && (
              <div className="tab-content">
                <h2>Payment Methods</h2>
                <p>Manage your payment options.</p>
                <div className="payment-methods-list">
                  <div className="payment-method-card">
                    <div className="card-type visa"></div>
                    <div className="card-details">
                      <h3>Visa ending in 4242</h3>
                      <p>Expires 09/26</p>
                    </div>
                    <div className="card-default">Default</div>
                    <div className="card-actions">
                      <button className="btn btn-sm btn-outline">Edit</button>
                      <button className="btn btn-sm btn-outline btn-danger">Remove</button>
                    </div>
                  </div>

                  <div className="payment-method-card">
                    <div className="card-type mastercard"></div>
                    <div className="card-details">
                      <h3>Mastercard ending in 5678</h3>
                      <p>Expires 12/25</p>
                    </div>
                    <div className="card-actions">
                      <button className="btn btn-sm btn-outline">Set as Default</button>
                      <button className="btn btn-sm btn-outline">Edit</button>
                      <button className="btn btn-sm btn-outline btn-danger">Remove</button>
                    </div>
                  </div>

                  <button className="btn btn-add-payment">
                    <span className="plus-icon">+</span> Add Payment Method
                  </button>
                </div>
              </div>
            )}

            {/* Notifications Tab (placeholder) */}
            {activeTab === 'notifications' && (
              <div className="tab-content">
                <h2>Notifications</h2>
                <p>Manage your notification preferences.</p>
                <div className="notification-settings">
                  <div className="notification-group">
                    <h3>Email Notifications</h3>
                    
                    <div className="notification-option">
                      <div className="option-details">
                        <h4>Order updates</h4>
                        <p>Receive emails about your order status</p>
                      </div>
                      <label className="toggle-switch">
                        <input type="checkbox" checked />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="notification-option">
                      <div className="option-details">
                        <h4>Promotions and deals</h4>
                        <p>Get notified about special offers and discounts</p>
                      </div>
                      <label className="toggle-switch">
                        <input type="checkbox" checked />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="notification-option">
                      <div className="option-details">
                        <h4>Product updates</h4>
                        <p>Receive information about product updates</p>
                      </div>
                      <label className="toggle-switch">
                        <input type="checkbox" />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab (placeholder) */}
            {activeTab === 'security' && (
              <div className="tab-content">
                <h2>Security</h2>
                <p>Manage your account security settings.</p>
                
                <div className="security-section">
                  <h3>Password</h3>
                  <div className="password-info">
                    <p>Last changed: 3 months ago</p>
                    <button className="btn btn-outline">Update Password</button>
                  </div>
                </div>

                <div className="security-section">
                  <h3>Two-Factor Authentication</h3>
                  <div className="two-factor-info">
                    <p>Add an extra layer of security to your account</p>
                    <label className="toggle-switch">
                      <input type="checkbox" />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <div className="security-section">
                  <h3>Login Sessions</h3>
                  <div className="sessions-list">
                    <div className="session-item">
                      <div className="session-info">
                        <h4>Current session</h4>
                        <p>macOS • Safari • San Francisco, CA</p>
                        <span className="active-tag">Active now</span>
                      </div>
                      <div>
                        <button className="btn btn-text">This is me</button>
                      </div>
                    </div>
                    
                    <div className="session-item">
                      <div className="session-info">
                        <h4>Previous session</h4>
                        <p>iOS • Mobile Safari • San Francisco, CA</p>
                        <span className="time">2 days ago</span>
                      </div>
                      <div>
                        <button className="btn btn-text btn-danger">Sign out</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}