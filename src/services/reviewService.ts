// src/services/reviewService.ts
import { 
    collection, 
    doc, 
    addDoc, 
    getDoc, 
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp 
  } from "firebase/firestore";
  import { db } from "@/lib/firebaseConfig";
  import { Review } from "@/types";
  import { updateProductRating } from "./productService";
  
  // Note: Add this function to productService.ts
  export const updateProductRating = async (
    productId: string,
    newRating: number,
    isNewReview: boolean
  ): Promise<void> => {
    const productRef = doc(db, "products", productId);
    const productSnap = await getDoc(productRef);
    
    if (productSnap.exists()) {
      const productData = productSnap.data();
      const currentRating = productData.rating || { average: 0, count: 0 };
      
      let newCount, newAverage;
      
      if (isNewReview) {
        newCount = currentRating.count + 1;
        newAverage = ((currentRating.average * currentRating.count) + newRating) / newCount;
      } else {
        // This is an update to an existing review, so we're not changing the count
        newCount = currentRating.count;
        // We'd need to know the old rating to properly calculate this
        // For simplicity, we'll just recalculate from all reviews
        const reviews = await getProductReviews(productId);
        const sum = reviews.reduce((total, review) => total + review.rating, 0);
        newAverage = sum / newCount;
      }
      
      await updateDoc(productRef, {
        'rating.average': newAverage,
        'rating.count': newCount,
        updatedAt: serverTimestamp()
      });
    }
  };
  
  // Add a new review
  export const addReview = async (
    review: Omit<Review, 'id' | 'createdAt' | 'isApproved' | 'helpfulCount'>
  ): Promise<string> => {
    // Check if user already reviewed this product
    const existingReview = await getUserProductReview(review.userId, review.productId);
    
    if (existingReview) {
      throw new Error("You have already reviewed this product");
    }
    
    const reviewData = {
      ...review,
      isApproved: false, // Require moderation before showing
      helpfulCount: 0,
      createdAt: serverTimestamp()
    };
    
    const reviewRef = await addDoc(collection(db, "reviews"), reviewData);
    
    // Update product rating
    await updateProductRating(review.productId, review.rating, true);
    
    return reviewRef.id;
  };
  
  // Get a specific review
  export const getReviewById = async (reviewId: string): Promise<Review | null> => {
    const reviewRef = doc(db, "reviews", reviewId);
    const reviewSnap = await getDoc(reviewRef);
    
    if (reviewSnap.exists()) {
      return { id: reviewSnap.id, ...reviewSnap.data() } as Review;
    }
    
    return null;
  };
  
  // Get user's review for a specific product
  export const getUserProductReview = async (
    userId: string,
    productId: string
  ): Promise<Review | null> => {
    const q = query(
      collection(db, "reviews"),
      where("userId", "==", userId),
      where("productId", "==", productId)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as Review;
    }
    
    return null;
  };
  
  // Get all reviews for a product
  export const getProductReviews = async (
    productId: string,
    approvedOnly: boolean = true
  ): Promise<Review[]> => {
    let q;
    
    if (approvedOnly) {
      q = query(
        collection(db, "reviews"),
        where("productId", "==", productId),
        where("isApproved", "==", true),
        orderBy("createdAt", "desc")
      );
    } else {
      q = query(
        collection(db, "reviews"),
        where("productId", "==", productId),
        orderBy("createdAt", "desc")
      );
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    })) as Review[];
  };
  
  // Update a review
  export const updateReview = async (
    reviewId: string,
    data: Partial<Review>
  ): Promise<void> => {
    const reviewRef = doc(db, "reviews", reviewId);
    
    await updateDoc(reviewRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    
    // If rating is updated, update product rating
    if (data.rating) {
      const review = await getReviewById(reviewId);
      if (review) {
        await updateProductRating(review.productId, data.rating, false);
      }
    }
  };
  
  // Delete a review
  export const deleteReview = async (reviewId: string): Promise<void> => {
    const reviewRef = doc(db, "reviews", reviewId);
    const review = await getReviewById(reviewId);
    
    if (review) {
      await deleteDoc(reviewRef);
      
      // Recalculate product rating
      const productId = review.productId;
      const reviews = await getProductReviews(productId, false);
      
      if (reviews.length > 0) {
        const sum = reviews.reduce((total, r) => total + r.rating, 0);
        const newAverage = sum / reviews.length;
        
        const productRef = doc(db, "products", productId);
        await updateDoc(productRef, {
          'rating.average': newAverage,
          'rating.count': reviews.length,
          updatedAt: serverTimestamp()
        });
      } else {
        // No reviews left, reset rating
        const productRef = doc(db, "products", productId);
        await updateDoc(productRef, {
          'rating.average': 0,
          'rating.count': 0,
          updatedAt: serverTimestamp()
        });
      }
    }
  };
  
  // Mark a review as helpful
  export const markReviewHelpful = async (reviewId: string): Promise<void> => {
    const reviewRef = doc(db, "reviews", reviewId);
    
    await updateDoc(reviewRef, {
      helpfulCount: increment(1)
    });
  };