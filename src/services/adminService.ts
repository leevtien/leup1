// src/services/adminService.ts
import {
    collection,
    query,
    where,
    orderBy,
    limit,
    getDocs,
    getDoc,
    doc,
    Timestamp,
    startAfter,
    updateDoc,
    deleteDoc,
    serverTimestamp,
  } from 'firebase/firestore';
  import { db } from '@/lib/firebaseConfig';
  
  // Get dashboard statistics
  export const getDashboardStats = async () => {
    try {
      // Get total orders
      const ordersQuery = collection(db, 'orders');
      const orderSnapshot = await getDocs(ordersQuery);
      const totalOrders = orderSnapshot.size;
      
      // Calculate total revenue
      let totalRevenue = 0;
      orderSnapshot.forEach((doc) => {
        const orderData = doc.data();
        totalRevenue += orderData.total || 0;
      });
      
      // Get total customers (unique user IDs in orders)
      const userIds = new Set();
      orderSnapshot.forEach((doc) => {
        const orderData = doc.data();
        if (orderData.userId) {
          userIds.add(orderData.userId);
        }
      });
      const totalCustomers = userIds.size;
      
      // Get recent orders
      const recentOrdersQuery = query(
        collection(db, 'orders'),
        orderBy('createdAt', 'desc'),
        limit(5)
      );
      const recentOrdersSnapshot = await getDocs(recentOrdersQuery);
      const recentOrders = recentOrdersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString(),
      }));
      
      return {
        totalOrders,
        totalRevenue,
        totalCustomers,
        recentOrders,
      };
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      throw error;
    }
  };
  
  // Get all products (for admin)
  export const getAllProducts = async (
    lastVisible = null,
    pageSize = 10,
    filter = {}
  ) => {
    try {
      let productsQuery;
      
      // Build query with filters
      if (lastVisible) {
        productsQuery = query(
          collection(db, 'products'),
          ...buildFilterQuery(filter),
          orderBy('createdAt', 'desc'),
          startAfter(lastVisible),
          limit(pageSize)
        );
      } else {
        productsQuery = query(
          collection(db, 'products'),
          ...buildFilterQuery(filter),
          orderBy('createdAt', 'desc'),
          limit(pageSize)
        );
      }
      
      const productsSnapshot = await getDocs(productsQuery);
      
      const products = productsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate().toISOString() || null,
        updatedAt: doc.data().updatedAt?.toDate().toISOString() || null,
      }));
      
      const newLastVisible = 
        productsSnapshot.docs.length > 0
          ? productsSnapshot.docs[productsSnapshot.docs.length - 1]
          : null;
      
      return {
        products,
        lastVisible: newLastVisible,
      };
    } catch (error) {
      console.error('Error getting all products:', error);
      throw error;
    }
  };
  
  // Helper function to build filter query
  const buildFilterQuery = (filter) => {
    const queryConstraints = [];
    
    if (filter.category) {
      queryConstraints.push(where('category', '==', filter.category));
    }
    
    if (filter.isActive !== undefined) {
      queryConstraints.push(where('isActive', '==', filter.isActive));
    }
    
    if (filter.isFeatured !== undefined) {
      queryConstraints.push(where('isFeatured', '==', filter.isFeatured));
    }
    
    if (filter.isNew !== undefined) {
      queryConstraints.push(where('isNew', '==', filter.isNew));
    }
    
    return queryConstraints;
  };
  
  // Get all orders (for admin)
  export const getAllOrders = async (
    lastVisible = null,
    pageSize = 10,
    filter = {}
  ) => {
    try {
      let ordersQuery;
      
      // Build query with filters
      if (lastVisible) {
        ordersQuery = query(
          collection(db, 'orders'),
          ...buildOrderFilterQuery(filter),
          orderBy('createdAt', 'desc'),
          startAfter(lastVisible),
          limit(pageSize)
        );
      } else {
        ordersQuery = query(
          collection(db, 'orders'),
          ...buildOrderFilterQuery(filter),
          orderBy('createdAt', 'desc'),
          limit(pageSize)
        );
      }
      
      const ordersSnapshot = await getDocs(ordersQuery);
      
      const orders = ordersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate().toISOString() || null,
        updatedAt: doc.data().updatedAt?.toDate().toISOString() || null,
      }));
      
      const newLastVisible = 
        ordersSnapshot.docs.length > 0
          ? ordersSnapshot.docs[ordersSnapshot.docs.length - 1]
          : null;
      
      return {
        orders,
        lastVisible: newLastVisible,
      };
    } catch (error) {
      console.error('Error getting all orders:', error);
      throw error;
    }
  };
  
  // Helper function to build order filter query
  const buildOrderFilterQuery = (filter) => {
    const queryConstraints = [];
    
    if (filter.status) {
      queryConstraints.push(where('status', '==', filter.status));
    }
    
    if (filter.paymentStatus) {
      queryConstraints.push(where('paymentStatus', '==', filter.paymentStatus));
    }
    
    if (filter.userId) {
      queryConstraints.push(where('userId', '==', filter.userId));
    }
    
    // Date range filter
    if (filter.dateFrom) {
      const fromDate = new Date(filter.dateFrom);
      queryConstraints.push(where('createdAt', '>=', Timestamp.fromDate(fromDate)));
    }
    
    if (filter.dateTo) {
      const toDate = new Date(filter.dateTo);
      toDate.setHours(23, 59, 59, 999); // End of day
      queryConstraints.push(where('createdAt', '<=', Timestamp.fromDate(toDate)));
    }
    
    return queryConstraints;
  };
  
  // Get all customers (for admin)
  export const getAllCustomers = async (
    lastVisible = null,
    pageSize = 10,
    filter = {}
  ) => {
    try {
      // Query users with role "customer" (default role)
      let usersQuery;
      
      if (lastVisible) {
        usersQuery = query(
          collection(db, 'users'),
          where('role', '==', 'customer'),
          orderBy('createdAt', 'desc'),
          startAfter(lastVisible),
          limit(pageSize)
        );
      } else {
        usersQuery = query(
          collection(db, 'users'),
          where('role', '==', 'customer'),
          orderBy('createdAt', 'desc'),
          limit(pageSize)
        );
      }
      
      const usersSnapshot = await getDocs(usersQuery);
      
      const customers = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate().toISOString() || null,
        lastLoginAt: doc.data().lastLoginAt?.toDate().toISOString() || null,
      }));
      
      // Get order counts for each customer
      for (const customer of customers) {
        const orderQuery = query(
          collection(db, 'orders'),
          where('userId', '==', customer.id)
        );
        const orderSnapshot = await getDocs(orderQuery);
        customer.orderCount = orderSnapshot.size;
        
        // Calculate total spent
        let totalSpent = 0;
        orderSnapshot.docs.forEach((doc) => {
          totalSpent += doc.data().total || 0;
        });
        customer.totalSpent = totalSpent;
      }
      
      const newLastVisible = 
        usersSnapshot.docs.length > 0
          ? usersSnapshot.docs[usersSnapshot.docs.length - 1]
          : null;
      
      return {
        customers,
        lastVisible: newLastVisible,
      };
    } catch (error) {
      console.error('Error getting all customers:', error);
      throw error;
    }
  };
  
  // Set a user as admin (for initial admin setup)
  export const setUserAsAdmin = async (userId) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        role: 'admin',
        updatedAt: serverTimestamp(),
      });
      return true;
    } catch (error) {
      console.error('Error setting user as admin:', error);
      throw error;
    }
  };