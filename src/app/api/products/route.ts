// File: /app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseConfig';
import { collection, getDocs, query, where, orderBy, limit, doc, getDoc, WhereFilterOp, OrderByDirection, QueryConstraint } from 'firebase/firestore';
import { Product } from '@/types/index';
// Product interface
// export interface Product {
//   id: string;
//   name: string;
//   description: string;
//   price: number;
//   salePrice?: number;
//   category: string;
//   images: string[];
//   featured: boolean;
//   isOnSale: boolean;
//   stock: number;
//   ratings?: {
//     average: number;
//     count: number;
//   };
//   specifications?: Record<string, string>;
//   createdAt: Date;
//   updatedAt: Date;
// }

/**
 * GET handler to fetch products from Firestore
 * @param request - The Next.js request object
 * @returns Promise with NextResponse
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const category = searchParams.get('category');
  const featured = searchParams.get('featured');
  const limitParam = searchParams.get('limit') ? parseInt(searchParams.get('limit') as string) : 10;
  const sort = searchParams.get('sort') || 'createdAt';
  const order = (searchParams.get('order') || 'desc') as OrderByDirection;

  try {
    // If specific product ID is requested
    if (id) {
      const productDoc = await getDoc(doc(db, "products", id));
      
      if (!productDoc.exists()) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      
      const productData = productDoc.data();
      
      // Convert Firestore timestamps to JS dates
      const product: Product = {
        id: productDoc.id,
        ...productData,
        createdAt: productData.createdAt?.toDate() || new Date(),
        updatedAt: productData.updatedAt?.toDate() || new Date()
      } as Product;
      
      return NextResponse.json({ product });
    }
    
    // Build query for multiple products
    const productsRef = collection(db, "products");
    const constraints: QueryConstraint[] = [];
    
    // Add filters if specified
    if (category) {
      constraints.push(where("category", "==", category));
    }
    
    if (featured === 'true') {
      constraints.push(where("featured", "==", true));
    }
    
    // Add sorting
    constraints.push(orderBy(sort, order));
    
    // Add limit
    constraints.push(limit(limitParam));
    
    // Create query with all constraints
    const q = query(productsRef, ...constraints);
    const querySnapshot = await getDocs(q);
    
    const products: Product[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      products.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      } as Product);
    });
    
    return NextResponse.json({ products });
    
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error occurred' }, 
      { status: 500 }
    );
  }
}

/**
 * Example usage:
 * GET /api/products - Get all products (limited to 10)
 * GET /api/products?id=abc123 - Get a specific product
 * GET /api/products?category=electronics - Get products in the electronics category
 * GET /api/products?featured=true - Get featured products
 * GET /api/products?limit=20 - Get up to 20 products
 * GET /api/products?sort=price&order=asc - Get products sorted by price in ascending order
 */