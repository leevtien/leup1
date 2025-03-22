rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    function isAdmin() {
      return isAuthenticated() && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
    }
    
    // Users Collection
    match /users/{userId} {
      allow read: if isOwner(userId) || isAdmin();
      allow create: if isAuthenticated() && request.auth.uid == userId;
      allow update: if isOwner(userId) || isAdmin();
      allow delete: if isAdmin();
      
      // User's cart subcollection
      match /cart/{cartId} {
        allow read, write: if isOwner(userId) || isAdmin();
      }
      
      // User's wishlist subcollection
      match /wishlist/{itemId} {
        allow read, write: if isOwner(userId) || isAdmin();
      }
      
      // User's orders reference (just for quick access)
      match /orders/{orderId} {
        allow read: if isOwner(userId) || isAdmin();
      }
    }
    
    // Products Collection
    match /products/{productId} {
      allow read: if true;
      allow create, update, delete: if isAdmin();
    }
    
    // Categories Collection
    match /categories/{categoryId} {
      allow read: if true;
      allow create, update, delete: if isAdmin();
    }
    
    // Orders Collection
    match /orders/{orderId} {
      allow read: if isAuthenticated() && (resource.data.userId == request.auth.uid || isAdmin());
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow update, delete: if isAdmin();
    }
    
    // Reviews Collection
    match /reviews/{reviewId} {
      allow read: if true;
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow update: if isAuthenticated() && (resource.data.userId == request.auth.uid || isAdmin());
      allow delete: if isAuthenticated() && (resource.data.userId == request.auth.uid || isAdmin());
    }
    
    // Coupons Collection
    match /coupons/{couponId} {
      allow read: if true;
      allow create, update, delete: if isAdmin();
    }
    
    // Transactions Collection
    match /transactions/{transactionId} {
      allow read: if isAuthenticated() && (resource.data.userId == request.auth.uid || isAdmin());
      allow create, update, delete: if isAdmin();
    }
    
    // Settings Collection
    match /settings/{settingId} {
      allow read: if true;
      allow write: if isAdmin();
    }
  }
}