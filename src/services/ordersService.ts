import { db } from "@/lib/firebaseConfig";
import { collection, query, where, getDocs, orderBy, addDoc, Timestamp } from "firebase/firestore";

export interface OrderItem {
  id: number | string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface Order {
  id?: string;
  userId: string;
  date: Date | Timestamp;
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  items: OrderItem[];
  paymentMethod?: string;
  shippingAddress?: {
    name?: string;
    email?: string;
  };
}

// Get orders for a specific user
export const getUserOrders = async (userId: string): Promise<Order[]> => {
  try {
    // Validate userId to prevent Firestore error
    if (!userId) {
      console.error("Cannot fetch orders: userId is undefined");
      return [];
    }
    
    const ordersRef = collection(db, "orders");
    const q = query(
      ordersRef,
      where("userId", "==", userId),
      orderBy("date", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      orders.push({
        id: doc.id,
        userId: data.userId,
        date: data.date && data.date.toDate ? data.date.toDate() : new Date(), // Handle potential missing date
        total: data.total || 0,
        status: data.status || 'Pending',
        items: data.items || [],
        paymentMethod: data.paymentMethod,
        shippingAddress: data.shippingAddress
      });
    });
    
    return orders;
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return [];
  }
};

// Create a new order
export const createOrder = async (order: Omit<Order, 'id'>): Promise<string | null> => {
  try {
    // Validate required fields
    if (!order.userId) {
      throw new Error("User ID is required to create an order");
    }
    
    // Convert JavaScript Date to Firestore Timestamp
    const orderWithTimestamp = {
      ...order,
      date: order.date instanceof Date ? Timestamp.fromDate(order.date) : order.date
    };
    
    const docRef = await addDoc(collection(db, "orders"), orderWithTimestamp);
    return docRef.id;
  } catch (error) {
    console.error("Error creating order:", error);
    return null;
  }
};