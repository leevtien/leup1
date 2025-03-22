// This file provides sample orders data that you can use to populate the Firestore database for testing
// You can run this code in a Firebase cloud function or a separate Node.js script

import { db } from "@/lib/firebaseConfig";
import { collection, addDoc, Timestamp } from "firebase/firestore";

/**
 * Add sample orders to Firestore for a specific user
 * @param userId - The user ID to create orders for
 */
export const addSampleOrders = async (userId: string) => {
  if (!userId) {
    console.error("Cannot add sample orders: userId is undefined");
    return;
  }

  const sampleOrders = [
    {
      userId: userId,
      date: Timestamp.fromDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)), // 7 days ago
      total: 59.99,
      status: 'Delivered',
      items: [
        { 
          id: 1, 
          name: 'Netflix Premium', 
          price: 19.99, 
          image: '/images/products/netflix-premium.jpg',
          quantity: 1
        },
        { 
          id: 2, 
          name: 'Spotify Family Plan', 
          price: 14.99, 
          image: '/images/products/spotify.jpg',
          quantity: 1 
        },
        { 
          id: 3, 
          name: 'Office 365', 
          price: 25.01, 
          image: '/images/products/office-365.jpg',
          quantity: 1 
        }
      ],
      paymentMethod: 'Credit Card'
    },
    {
      userId: userId,
      date: Timestamp.fromDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)), // 30 days ago
      total: 29.99,
      status: 'Delivered',
      items: [
        { 
          id: 4, 
          name: 'Adobe Photoshop', 
          price: 29.99, 
          image: '/images/products/adobe-cc.jpg',
          quantity: 1 
        }
      ],
      paymentMethod: 'PayPal'
    },
    {
      userId: userId,
      date: Timestamp.fromDate(new Date()), // Today
      total: 119.99,
      status: 'Processing',
      items: [
        { 
          id: 5, 
          name: 'Windows 11 Pro', 
          price: 119.99, 
          image: '/images/products/windows-11.jpg',
          quantity: 1 
        }
      ],
      paymentMethod: 'Credit Card'
    }
  ];

  try {
    const ordersRef = collection(db, 'orders');
    
    // Add each sample order
    for (const order of sampleOrders) {
      await addDoc(ordersRef, order);
    }
    
    console.log(`Successfully added ${sampleOrders.length} sample orders for user ${userId}`);
  } catch (error) {
    console.error('Error adding sample orders:', error);
  }
};

// Usage example:
// When a user signs up or you want to add sample data for testing
// import { addSampleOrders } from './sampleOrdersData';
// addSampleOrders('user123');