// src/types/index.ts

// User related types
export interface User {
    id: string;
    email: string;
    displayName: string;
    photoURL?: string;
    phoneNumber?: string;
    createdAt: any; // Firestore Timestamp
    lastLoginAt: any; // Firestore Timestamp
    role: 'customer' | 'admin' | 'editor';
    addresses?: {
      billing?: Address;
      shipping?: Address;
    };
    wishlist?: string[];
  }
  
  export interface Address {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }
  
  export interface CartItem {
    productId: string;
    quantity: number;
    price: number;
    name: string;
    image: string;
  }
  
  export interface Cart {
    items: CartItem[];
    subtotal: number;
    updatedAt: any; // Firestore Timestamp
  }
  
  // Product related types
  export interface Product {
    id?: string;
    name: string;
    slug: string;
    description: string;
    shortDescription: string;
    price: number;
    salePrice?: number;
    images: string[];
    thumbnail: string;
    category: string;
    subcategory?: string;
    tags: string[];
    features: string[];
    isActive: boolean;
    isFeatured: boolean;
    isNew: boolean;
    stock?: number;
    soldCount: number;
    rating: {
      average: number;
      count: number;
    };
    createdAt?: any;
    updatedAt?: any;
    productType: 'subscription' | 'one-time' | 'account';
    subscriptionDetails?: {
      billingCycle: 'monthly' | 'yearly';
      trialDays: number;
      features: string[];
    };
    requirements?: string[];
    deliveryInfo: string;
  }
  
  export interface Category {
    id?: string;
    name: string;
    slug: string;
    description: string;
    image: string;
    icon: string;
    displayOrder: number;
    parentCategory?: string;
    isActive: boolean;
  }
  
  // Order related types
  export interface Order {
    id?: string;
    userId: string;
    orderNumber: string;
    items: OrderItem[];
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
    status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';
    paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
    paymentMethod: string;
    paymentId?: string;
    createdAt?: any;
    updatedAt?: any;
    notes?: string;
    billingAddress: Address;
    deliveryMethod: 'email' | 'account';
    deliveryEmail: string;
    deliveryDetails?: {
      sentAt: any;
      deliveryData: any;
    };
  }
  
  export interface OrderItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }
  
  // Remaining interfaces...
  export interface Review { /* ... */ }
  export interface Coupon { /* ... */ }
  export interface Transaction { /* ... */ }
  export interface Subscription { /* ... */ }
  export interface ProductKey { /* ... */ }
  export interface SiteSettings { /* ... */ }