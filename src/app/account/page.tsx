'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from "next/legacy/image";
import { FaUser, FaShoppingBag, FaHeart, FaCreditCard, FaBell, FaLock, FaSignOutAlt, FaDownload, FaSpinner } from 'react-icons/fa';
import { useUser } from '@/context/userContext';
import { logOut } from '@/services/authService';
import { getUserOrders, Order } from '@/services/ordersService.ts';
import '@/styles/css/account.css';

// Sample data for subscriptions and payment methods for UI demonstration
// This will be replaced with real data from the database when those features are implemented
const sampleSubscriptions = [
  {
    id: 1,
    name: 'Netflix Premium',
    plan: '4K UHD Plan',
    renewalDate: 'April 15, 2025',
    price: 19.99,
    period: 'month',
    image: '/images/products/netflix-premium.jpg'
  },
  {
    id: 2,
    name: 'Microsoft Office 365',
    plan: 'Family Plan',
    renewalDate: 'May 21, 2025',
    price: 99.99,
    period: 'year',
    image: '/images/products/office-365.jpg'
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
  const { user, loading, refreshUserProfile } = useUser();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/account/login');
    }
  }, [user, loading, router]);

  // Fetch user orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (user && user.uid) {
        try {
          setOrdersLoading(true);
          const userOrders = await getUserOrders(user.uid);
          setOrders(userOrders);
        } catch (error) {
          console.error("Error fetching orders:", error);
        } finally {
          setOrdersLoading(false);
        }
      }
    };

    if (user && user.uid) {
      fetchOrders();
    }
  }, [user]);

  const handleSignOut = async () => {
    try {
      await logOut();
      // Clear any local user state
      await refreshUserProfile();
      router.push('/');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Format member since date
  const formatMemberSince = (dateString) => {
    if (!dateString) return 'New Member';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    } catch (error) {
      return 'New Member';
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="account-page loading-state">
        <div className="container">
          <div className="loading-spinner">
            <FaSpinner className="spinner-icon" />
            <p>Loading your account information...</p>
          </div>
        </div>
      </div>
    );
  }

  // If user is not logged in and we're not loading, component will redirect
  if (!user) {
    return null;
  }

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
                  src={user.photoURL || '/images/avatar-placeholder.jpg'} 
                  alt={user.fullName || 'User Avatar'}
                  width={80}
                  height={80}
                  className="user-avatar"
                  unoptimized={!user.photoURL?.startsWith('/')} // For external URLs
                />
              </div>
              <h3 className="user-name">{user.fullName || 'User'}</h3>
              <p className="user-email">{user.email}</p>
              <p className="member-since">Member since {formatMemberSince(user.memberSince)}</p>
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
                  <button className="nav-link logout" onClick={handleSignOut}>
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
                      <p className="stat-value">{orders.length}</p>
                    </div>
                  </div>
                  
                  <div className="stat-card">
                    <div className="stat-icon"><FaHeart /></div>
                    <div className="stat-content">
                      <h3>Wishlist</h3>
                      <p className="stat-value">0</p>
                    </div>
                  </div>
                  
                  <div className="stat-card">
                    <div className="stat-icon"><FaDownload /></div>
                    <div className="stat-content">
                      <h3>Subscriptions</h3>
                      <p className="stat-value">{sampleSubscriptions.length}</p>
                    </div>
                  </div>
                </div>

                <div className="recent-orders">
                  <div className="section-header">
                    <h3>Recent Orders</h3>
                    <Link href="#" className="view-all" onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('orders');
                    }}>
                      View all
                    </Link>
                  </div>
                  
                  {ordersLoading ? (
                    <div className="loading-indicator">
                      <FaSpinner className="spinner-icon" />
                      <p>Loading your orders...</p>
                    </div>
                  ) : orders.length > 0 ? (
                    orders.slice(0, 2).map(order => (
                      <div className="order-card" key={order.id}>
                        <div className="order-header">
                          <div>
                            <span className="order-id">{order.id?.substring(0, 6) || 'Order'}</span>
                            <span className="order-date">
                              {order.date instanceof Date ? 
                                order.date.toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                }) : 'N/A'
                              }
                            </span>
                          </div>
                          <div>
                            <span className={`order-status ${(order.status || 'pending').toLowerCase()}`}>
                              {order.status || 'Pending'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="order-items">
                          {(order.items || []).map((item, index) => (
                            <div className="order-item" key={item.id || index}>
                              <div className="item-image">
                                <Image 
                                  src={item.image || '/images/placeholder.jpg'} 
                                  alt={item.name || 'Product'}
                                  width={60}
                                  height={60}
                                  unoptimized={!item.image?.startsWith('/')} // For external URLs
                                />
                              </div>
                              <div className="item-details">
                                <h4>{item.name || 'Product'}</h4>
                                <p className="item-price">${(item.price || 0).toFixed(2)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="order-footer">
                          <p className="order-total">
                            <strong>Total:</strong> ${(order.total || 0).toFixed(2)}
                          </p>
                          <div className="order-actions">
                            <button className="btn btn-outline">Download</button>
                            <button className="btn btn-outline">View Details</button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <FaShoppingBag className="empty-icon" />
                      <h3>No orders yet</h3>
                      <p>Your order history will appear here once you make a purchase</p>
                      <Link href="/products" className="btn btn-primary">Start Shopping</Link>
                    </div>
                  )}
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
                
                {ordersLoading ? (
                  <div className="loading-indicator">
                    <FaSpinner className="spinner-icon" />
                    <p>Loading your orders...</p>
                  </div>
                ) : orders.length > 0 ? (
                  <div className="orders-list">
                    {orders.map(order => (
                      <div className="order-card" key={order.id}>
                        <div className="order-header">
                          <div>
                            <span className="order-id">{order.id?.substring(0, 6) || 'Order'}</span>
                            <span className="order-date">
                              {order.date instanceof Date ? 
                                order.date.toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                }) : 'N/A'
                              }
                            </span>
                          </div>
                          <div>
                            <span className={`order-status ${(order.status || 'pending').toLowerCase()}`}>
                              {order.status || 'Pending'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="order-items">
                          {(order.items || []).map((item, index) => (
                            <div className="order-item" key={item.id || index}>
                              <div className="item-image">
                                <Image 
                                  src={item.image || '/images/placeholder.jpg'} 
                                  alt={item.name || 'Product'}
                                  width={60}
                                  height={60}
                                  unoptimized={!item.image?.startsWith('/')} // For external URLs
                                />
                              </div>
                              <div className="item-details">
                                <h4>{item.name || 'Product'}</h4>
                                <p className="item-price">${(item.price || 0).toFixed(2)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="order-footer">
                          <p className="order-total">
                            <strong>Total:</strong> ${(order.total || 0).toFixed(2)}
                          </p>
                          <div className="order-actions">
                            <button className="btn btn-outline">Download</button>
                            <button className="btn btn-primary">View Details</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <FaShoppingBag className="empty-icon" />
                    <h3>No orders yet</h3>
                    <p>Your order history will appear here once you make a purchase</p>
                    <Link href="/products" className="btn btn-primary">Start Shopping</Link>
                  </div>
                )}
              </div>
            )}

            {/* Wishlist Tab */}
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

            {/* Subscriptions Tab */}
            {activeTab === 'subscriptions' && (
              <div className="tab-content">
                <h2>My Subscriptions</h2>
                <p>Manage your digital subscriptions.</p>
                <div className="subscription-cards">
                  {sampleSubscriptions.map(subscription => (
                    <div className="subscription-card" key={subscription.id}>
                      <div className="subscription-logo">
                        <Image 
                          src={subscription.image}
                          alt={subscription.name}
                          width={60}
                          height={60}
                        />
                      </div>
                      <div className="subscription-details">
                        <h3>{subscription.name}</h3>
                        <p className="subscription-plan">{subscription.plan}</p>
                        <p className="subscription-renewal">Renews on {subscription.renewalDate}</p>
                      </div>
                      <div className="subscription-price">
                        <span>${subscription.price.toFixed(2)}</span>
                        <span className="period">/ {subscription.period}</span>
                      </div>
                      <div className="subscription-actions">
                        <button className="btn btn-sm btn-outline">Manage</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Payment Methods Tab */}
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

            {/* Notifications Tab */}
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
                        <input type="checkbox" defaultChecked />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="notification-option">
                      <div className="option-details">
                        <h4>Promotions and deals</h4>
                        <p>Get notified about special offers and discounts</p>
                      </div>
                      <label className="toggle-switch">
                        <input type="checkbox" defaultChecked />
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

            {/* Security Tab */}
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
                        <p>Browser • {navigator.userAgent.includes('Chrome') ? 'Chrome' : 
                              navigator.userAgent.includes('Firefox') ? 'Firefox' : 
                              navigator.userAgent.includes('Safari') ? 'Safari' : 'Browser'}</p>
                        <span className="active-tag">Active now</span>
                      </div>
                      <div>
                        <button className="btn btn-text">This is me</button>
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