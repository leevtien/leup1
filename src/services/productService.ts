// src/services/productService.ts
import { 
    collection, 
    doc, 
    // setDoc, 
    addDoc, 
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    startAfter,
    serverTimestamp,
    increment
  } from "firebase/firestore";
  import { db } from "@/lib/firebaseConfig";
  import { Product, Category } from "@/types";
  
  // Add a new product
  export const addProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'rating' | 'soldCount'>): Promise<string> => {
    const productData = {
      ...product,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      soldCount: 0,
      rating: {
        average: 0,
        count: 0
      }
    };
    
    const docRef = await addDoc(collection(db, "products"), productData);
    return docRef.id;
  };
  
  // Get product by ID
  export const getProductById = async (productId: string): Promise<Product | null> => {
    const productRef = doc(db, "products", productId);
    const productSnap = await getDoc(productRef);
    
    if (productSnap.exists()) {
      return { id: productSnap.id, ...productSnap.data() } as Product;
    }
    
    return null;
  };
  
  // Get product by slug
  export const getProductBySlug = async (slug: string): Promise<Product | null> => {
    const q = query(collection(db, "products"), where("slug", "==", slug));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as Product;
    }
    
    return null;
  };
  
  // Get featured products
  export const getFeaturedProducts = async (limit: number = 8): Promise<Product[]> => {
    const q = query(
      collection(db, "products"),
      where("isFeatured", "==", true),
      where("isActive", "==", true),
      orderBy("createdAt", "desc"),
      limit(limit)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    })) as Product[];
  };
  
  // Get new products
  export const getNewProducts = async (limit: number = 6): Promise<Product[]> => {
    const q = query(
      collection(db, "products"),
      where("isNew", "==", true),
      where("isActive", "==", true),
      orderBy("createdAt", "desc"),
      limit(limit)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    })) as Product[];
  };
  
  // Get products by category
  export const getProductsByCategory = async (
    category: string,
    pageSize: number = 12,
    lastVisible: any = null
  ): Promise<{ products: Product[], lastVisible: any }> => {
    let q;
    
    if (lastVisible) {
      q = query(
        collection(db, "products"),
        where("category", "==", category),
        where("isActive", "==", true),
        orderBy("createdAt", "desc"),
        startAfter(lastVisible),
        limit(pageSize)
      );
    } else {
      q = query(
        collection(db, "products"),
        where("category", "==", category),
        where("isActive", "==", true),
        orderBy("createdAt", "desc"),
        limit(pageSize)
      );
    }
    
    const querySnapshot = await getDocs(q);
    const products = querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    })) as Product[];
    
    const newLastVisible = querySnapshot.docs.length > 0 
      ? querySnapshot.docs[querySnapshot.docs.length - 1]
      : null;
    
    return { products, lastVisible: newLastVisible };
  };
  
  // Search products
  export const searchProducts = async (
    searchTerm: string,
    pageSize: number = 12
  ): Promise<Product[]> => {
    // Note: Basic search in Firestore is limited
    // For production, consider using Algolia or other search service
    const q = query(
      collection(db, "products"),
      where("isActive", "==", true),
      orderBy("name"),
      limit(pageSize)
    );
    
    const querySnapshot = await getDocs(q);
    
    // Client-side filtering (limited functionality)
    const searchTermLower = searchTerm.toLowerCase();
    const products = querySnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }) as Product)
      .filter(product => 
        product.name.toLowerCase().includes(searchTermLower) ||
        product.description.toLowerCase().includes(searchTermLower) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTermLower))
      );
    
    return products;
  };
  
  // Update product
  export const updateProduct = async (
    productId: string,
    data: Partial<Product>
  ): Promise<void> => {
    const productRef = doc(db, "products", productId);
    
    await updateDoc(productRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  };
  
  // Delete product
  export const deleteProduct = async (productId: string): Promise<void> => {
    const productRef = doc(db, "products", productId);
    await deleteDoc(productRef);
  };
  
  // Increment product sold count (called when order is completed)
  export const incrementProductSoldCount = async (
    productId: string,
    quantity: number = 1
  ): Promise<void> => {
    const productRef = doc(db, "products", productId);
    
    await updateDoc(productRef, {
      soldCount: increment(quantity)
    });
  };
  
  // Category functions
  export const addCategory = async (
    category: Omit<Category, 'id'>
  ): Promise<string> => {
    const docRef = await addDoc(collection(db, "categories"), {
      ...category,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  };
  
  export const getCategories = async (): Promise<Category[]> => {
    const q = query(
      collection(db, "categories"),
      where("isActive", "==", true),
      orderBy("displayOrder")
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    })) as Category[];
  };
  
  export const getCategoryBySlug = async (slug: string): Promise<Category | null> => {
    const q = query(collection(db, "categories"), where("slug", "==", slug));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as Category;
    }
    
    return null;
  };