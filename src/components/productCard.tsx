'use client';

import React, { useState } from 'react';
import Image from "next/legacy/image";
import Link from 'next/link';
import { 
  FaStar, 
  FaStarHalfAlt, 
  FaRegStar, 
  FaEye, 
  FaShoppingCart, 
  FaClock
} from 'react-icons/fa';
import '@/styles/css/productCard.css';

// Types for TypeScript
export interface ProductProps {
  id: number;
  name: string;
  price: number;
  image: string;
  slug: string;
  rating?: number;
  discount?: number;
  description?: string;
  category?: string;
  isNew?: boolean;
  daysAgo?: number;
  inStock?: boolean;
  variant?: 'default' | 'compact' | 'featured' | 'grid' | 'list';
}

interface ProductCardProps {
  product: ProductProps;
  variant?: 'default' | 'compact' | 'featured' | 'grid' | 'list';
}

// Star Rating Component
const StarRating = ({ rating = 0 }: { rating: number }) => {
  const stars = [];
  
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars.push(<FaStar key={i} className="star" />);
    } else if (i - 0.5 <= rating) {
      stars.push(<FaStarHalfAlt key={i} className="star" />);
    } else {
      stars.push(<FaRegStar key={i} className="star" />);
    }
  }
  
  return <div className="product-rating">{stars}</div>;
};

const ProductCard: React.FC<ProductCardProps> = ({ product, variant = 'default' }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Calculate discounted price if applicable
  const discountedPrice = product.discount 
    ? (product.price * (1 - product.discount / 100)).toFixed(2) 
    : null;
  
  return (
    <div 
      className={`product-card ${variant} ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product badges */}
    <div className="product-badges">
      {typeof product.discount === "number" && product.discount > 0 && (
        <span className="badge discount-badge">-{product.discount}%</span>
      )}
      {product.daysAgo !== undefined && product.daysAgo <= 7 && (
        <span className="badge new-badge">New</span>
        )}
      {product.inStock === false && (
        <span className="badge out-of-stock-badge">Out of Stock</span>
      )}
    </div>
      
      {/* Product Image */}
      <div className="product-image">
        <Link href={`/product/${product.slug}`}>
          <Image 
            src={product.image} 
            alt={product.name} 
            // width={300} 
            // height={300}
            layout="fill" 
          />
        </Link>
        
        {/* Quick action buttons that appear on hover */}
        {/* <div className={`product-actions ${isHovered ? 'visible' : ''}`}>
          <button className="action-btn view-btn" title="Quick view">
            <FaEye />
          </button>
          <button className="action-btn cart-btn" title="Add to cart">
            <FaShoppingCart />
          </button>
          <button className="action-btn wishlist-btn" title="Add to wishlist">
            <FaHeart />
          </button>
        </div> */}
      </div>
      
      {/* Product Information */}
      <div className="product-info">
        {product.category && (
          <div className="product-category">{product.category}</div>
        )}
        
        <h3 className="product-name">
          <Link href={`/product/${product.slug}`}>{product.name}</Link>
        </h3>
        
        {product.rating !== undefined && (
          <div className="product-rating-container">
            <StarRating rating={product.rating} />
            <span className="rating-value">{product.rating.toFixed(1)}</span>
          </div>
        )}
        
        {product.description && variant !== 'compact' && (
          <p className="product-description">{product.description}</p>
        )}
        
        <div className="product-price-container">
          {product.discount && product.discount > 0 ? (
            <>
              <span className="original-price">${product.price.toFixed(2)}</span>
              <span className="current-price">${discountedPrice}</span>
            </>
          ) : (
            <span className="current-price">${product.price.toFixed(2)}</span>
          )}
        </div>
        
        {/* Only show buttons in certain variants */}
        {(variant === 'default' || variant === 'grid' || variant === 'featured' || variant === 'list') && (
          <div className="product-buttons">
            <button className="btn add-to-cart">
              <FaShoppingCart className="btn-icon" />
              Add to Cart
            </button>
            
            {variant === 'list' && (
              <button className="btn view-details">
                <FaEye className="btn-icon" />
                View Details
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;