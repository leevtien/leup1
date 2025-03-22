// src/components/product/ProductCard.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { addToCart } from '@/services/userService';
import { FaStar, FaStarHalfAlt, FaRegStar, FaShoppingCart } from 'react-icons/fa';

interface ProductCardProps {
  product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { user } = useAuth();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  // Format price with sale price if available
  const formatPrice = () => {
    if (product.salePrice) {
      return (
        <>
          <span className="original-price">${product.price.toFixed(2)}</span>
          <span className="sale-price">${product.salePrice.toFixed(2)}</span>
        </>
      );
    }
    
    return <span className="regular-price">${product.price.toFixed(2)}</span>;
  };

  // Render star rating
  const renderRating = () => {
    const stars = [];
    const rating = product.rating?.average || 0;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(<FaStar key={i} className="star filled" />);
      } else if (i - 0.5 <= rating) {
        stars.push(<FaStarHalfAlt key={i} className="star half" />);
      } else {
        stars.push(<FaRegStar key={i} className="star empty" />);
      }
    }
    
    return (
      <div className="product-rating">
        <div className="stars">{stars}</div>
        <span className="rating-count">({product.rating?.count || 0})</span>
      </div>
    );
  };

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!user) {
      // Redirect to login if not authenticated
      window.location.href = '/account/login?redirect=/products/' + product.slug;
      return;
    }
    
    try {
      setIsAddingToCart(true);
      
      await addToCart(user.uid, {
        productId: product.id,
        quantity: 1,
        price: product.salePrice || product.price,
        name: product.name,
        image: product.thumbnail
      });
      
      // Show added to cart notification
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="product-card">
      {/* Product badges */}
      <div className="product-badges">
        {product.isNew && <span className="badge new-badge">New</span>}
        {product.salePrice && (
          <span className="badge sale-badge">
            {Math.round((1 - product.salePrice / product.price) * 100)}% Off
          </span>
        )}
      </div>
      
      {/* Product image */}
      <Link href={`/products/${product.slug}`} className="product-image-link">
        <div className="product-image">
          <Image
            src={product.thumbnail}
            alt={product.name}
            width={300}
            height={300}
            layout="responsive"
            objectFit="cover"
          />
        </div>
      </Link>
      
      {/* Product info */}
      <div className="product-info">
        <div className="product-category">{product.category}</div>
        
        <h3 className="product-name">
          <Link href={`/products/${product.slug}`}>{product.name}</Link>
        </h3>
        
        {renderRating()}
        
        <div className="product-description">{product.shortDescription}</div>
        
        <div className="product-price">{formatPrice()}</div>
      </div>
      
      {/* Add to cart button */}
      <button
        className="add-to-cart-button"
        onClick={handleAddToCart}
        disabled={isAddingToCart}
      >
        <FaShoppingCart />
        {isAddingToCart ? 'Adding...' : 'Add to Cart'}
      </button>
      
      {/* Added to cart notification */}
      {showNotification && (
        <div className="cart-notification">
          Product added to cart!
        </div>
      )}
    </div>
  );
}