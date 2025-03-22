// src/services/userService.ts
import { 
    doc, 
    setDoc, 
    getDoc, 
    updateDoc, 
    arrayUnion, 
    arrayRemove,
    serverTimestamp 
  } from "firebase/firestore";
  import { db, auth } from "@/lib/firebaseConfig";
  import { User, Cart, CartItem, Address } from "@/types";
  
  // Create a new user document when user signs up
  export const createUserDocument = async (user: any): Promise<void> => {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      const newUser: Omit<User, 'id'> = {
        email: user.email || "",
        displayName: user.displayName || "",
        photoURL: user.photoURL || "",
        phoneNumber: user.phoneNumber || "",
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        role: "customer",
        wishlist: []
      };
      
      await setDoc(userRef, newUser);
    } else {
      // Update lastLoginAt if user already exists
      await updateDoc(userRef, {
        lastLoginAt: serverTimestamp()
      });
    }
  };
  
  // Get user data
  export const getUserData = async (userId: string): Promise<User | null> => {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return { id: userSnap.id, ...userSnap.data() } as User;
    }
    
    return null;
  };
  
  // Update user profile
  export const updateUserProfile = async (
    userId: string, 
    data: Partial<User>
  ): Promise<void> => {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { ...data, updatedAt: serverTimestamp() });
  };
  
  // Update user address
  export const updateUserAddress = async (
    userId: string,
    addressType: 'billing' | 'shipping',
    address: Address
  ): Promise<void> => {
    const userRef = doc(db, "users", userId);
    
    await updateDoc(userRef, {
      [`addresses.${addressType}`]: address,
      updatedAt: serverTimestamp()
    });
  };
  
  // Add product to wishlist
  export const addToWishlist = async (
    userId: string,
    productId: string
  ): Promise<void> => {
    const userRef = doc(db, "users", userId);
    
    await updateDoc(userRef, {
      wishlist: arrayUnion(productId),
      updatedAt: serverTimestamp()
    });
  };
  
  // Remove product from wishlist
  export const removeFromWishlist = async (
    userId: string,
    productId: string
  ): Promise<void> => {
    const userRef = doc(db, "users", userId);
    
    await updateDoc(userRef, {
      wishlist: arrayRemove(productId),
      updatedAt: serverTimestamp()
    });
  };
  
  // Get user's cart
  export const getUserCart = async (userId: string): Promise<Cart | null> => {
    const cartRef = doc(db, "users", userId, "cart", "current");
    const cartSnap = await getDoc(cartRef);
    
    if (cartSnap.exists()) {
      return cartSnap.data() as Cart;
    }
    
    return null;
  };
  
  // Update cart
  export const updateCart = async (
    userId: string,
    cart: Cart
  ): Promise<void> => {
    const cartRef = doc(db, "users", userId, "cart", "current");
    
    await setDoc(cartRef, {
      ...cart,
      updatedAt: serverTimestamp()
    });
  };
  
  // Add item to cart
  export const addToCart = async (
    userId: string,
    item: CartItem
  ): Promise<void> => {
    const cartRef = doc(db, "users", userId, "cart", "current");
    const cartSnap = await getDoc(cartRef);
    
    if (cartSnap.exists()) {
      const cart = cartSnap.data() as Cart;
      const existingItemIndex = cart.items.findIndex(i => i.productId === item.productId);
      
      if (existingItemIndex >= 0) {
        // Update quantity if item already exists
        cart.items[existingItemIndex].quantity += item.quantity;
      } else {
        // Add new item
        cart.items.push(item);
      }
      
      // Recalculate subtotal
      cart.subtotal = cart.items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
      
      await updateCart(userId, cart);
    } else {
      // Create new cart
      const newCart: Cart = {
        items: [item],
        subtotal: item.price * item.quantity,
        updatedAt: serverTimestamp()
      };
      
      await setDoc(cartRef, newCart);
    }
  };
  
  // Remove item from cart
  export const removeFromCart = async (
    userId: string,
    productId: string
  ): Promise<void> => {
    const cartRef = doc(db, "users", userId, "cart", "current");
    const cartSnap = await getDoc(cartRef);
    
    if (cartSnap.exists()) {
      const cart = cartSnap.data() as Cart;
      const updatedItems = cart.items.filter(item => item.productId !== productId);
      const subtotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      await updateDoc(cartRef, {
        items: updatedItems,
        subtotal,
        updatedAt: serverTimestamp()
      });
    }
  };
  
  // Update item quantity in cart
  export const updateCartItemQuantity = async (
    userId: string,
    productId: string,
    quantity: number
  ): Promise<void> => {
    const cartRef = doc(db, "users", userId, "cart", "current");
    const cartSnap = await getDoc(cartRef);
    
    if (cartSnap.exists()) {
      const cart = cartSnap.data() as Cart;
      const updatedItems = cart.items.map(item => {
        if (item.productId === productId) {
          return { ...item, quantity };
        }
        return item;
      });
      
      const subtotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      await updateDoc(cartRef, {
        items: updatedItems,
        subtotal,
        updatedAt: serverTimestamp()
      });
    }
  };
  
  // Clear cart
  export const clearCart = async (userId: string): Promise<void> => {
    const cartRef = doc(db, "users", userId, "cart", "current");
    
    await setDoc(cartRef, {
      items: [],
      subtotal: 0,
      updatedAt: serverTimestamp()
    });
  };