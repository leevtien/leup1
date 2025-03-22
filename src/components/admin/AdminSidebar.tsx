'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FaTachometerAlt, 
  FaShoppingBag, 
  FaThList, 
  FaUsers, 
  FaTag, 
  FaCog, 
  FaSignOutAlt 
} from 'react-icons/fa';
import { signOut } from '@/services/authService';

export default function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <div className="admin-sidebar">
      <div className="sidebar-header">
        <h1>Admin Dashboard</h1>
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link 
              href="/admin" 
              className={isActive('/admin') && !isActive('/admin/products') ? 'active' : ''}
            >
              <FaTachometerAlt /> Dashboard
            </Link>
          </li>
          <li>
            <Link 
              href="/admin/products" 
              className={isActive('/admin/products') ? 'active' : ''}
            >
              <FaShoppingBag /> Products
            </Link>
          </li>
          <li>
            <Link 
              href="/admin/categories" 
              className={isActive('/admin/categories') ? 'active' : ''}
            >
              <FaThList /> Categories
            </Link>
          </li>
          <li>
            <Link 
              href="/admin/orders" 
              className={isActive('/admin/orders') ? 'active' : ''}
            >
              <FaTag /> Orders
            </Link>
          </li>
          <li>
            <Link 
              href="/admin/customers" 
              className={isActive('/admin/customers') ? 'active' : ''}
            >
              <FaUsers /> Customers
            </Link>
          </li>
          <li>
            <Link 
              href="/admin/settings" 
              className={isActive('/admin/settings') ? 'active' : ''}
            >
              <FaCog /> Settings
            </Link>
          </li>
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <button 
          className="logout-button" 
          onClick={async () => {
            await signOut();
            window.location.href = '/';
          }}
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );
}