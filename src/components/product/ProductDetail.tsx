// src/components/product/ProductDetail.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { addToCart, addToWishlist } from '@/services/userService';
import { getProductReviews } from '@/services/reviewService';
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaShoppingCart,
  FaHeart,
  FaCheckCircle,
  FaList
} from 'react-icons/fa';

interface ProductDetailProps {
  product: any;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(product.thumbnail);
  const [activeTab, setActiveTab] = useState('description');
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  // Load reviews when reviews tab is selected
  const handleTabChange = async (tab) => {
    setActiveTab(tab);
    
    if (tab === 'reviews' && reviews.length === 0) {
      try {
        setLoadingReviews(true);
        const reviewsData = await getProductReviews(product.id);
        setReviews(reviewsData);
      } catch (error) {
        console.error('Error loading reviews:', error);
      } finally {
        setLoadingReviews(false);
      }
    }
  };

  // Handle quantity changes
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  // Add to cart
  const handleAddToCart = async () => {
    if (!user) {
      window.location.href = `/account/login?redirect=/products/${product.slug}`;
      return;
    }
    
    try {
      setIsAddingToCart(true);
      
      await addToCart(user.uid, {
        productId: product.id,
        quantity,
        price: product.salePrice || product.price,
        name: product.name,
        image: product.thumbnail
      });
      
      setNotificationMessage('Added to cart!');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Add to wishlist
  const handleAddToWishlist = async () => {
    if (!user) {
      window.location.href = `/account/login?redirect=/products/${product.slug}`;
      return;
    }
    
    try {
      setIsAddingToWishlist(true);
      
      await addToWishlist(user.uid, product.id);
      
      setNotificationMessage('Added to wishlist!');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  // Render star rating
  const renderRating = (rating = product.rating?.average || 0) => {
    const stars = [];
    
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
      <div className="stars-container">
        {stars}
      </div>
    );
  };

  return (
    <div className="product-detail-page">
      <div className="product-breadcrumb">
        <Link href="/">Home</Link> &gt;
        <Link href="/products">Products</Link> &gt;
        <Link href={`/category/${product.category}`}>{product.category}</Link> &gt;
        <span>{product.name}</span>
      </div>
      
      <div className="product-main">
        <div className="product-gallery">
          <div className="main-image">
            <Image
              src={selectedImage}
              alt={product.name}
              width={600}
              height={600}
              layout="responsive"
              objectFit="contain"
            />
          </div>
          
          <div className="thumbnail-gallery">
            {product.images.map((image, index) => (
              <div
                key={index}
                className={`thumbnail ${selectedImage === image ? 'active' : ''}`}
                onClick={() => setSelectedImage(image)}
              >
                <Image
                  src={image}
                  alt={`${product.name} - image ${index + 1}`}
                  width={80}
                  height={80}
                  objectFit="cover"
                />
              </div>
            ))}
          </div>
        </div>
        
        <div className="product-info">
          <h1 className="product-title">{product.name}</h1>
          
          <div className="product-meta">
            <div className="product-rating">
              {renderRating()}
              <span className="rating-text">
                {product.rating?.average?.toFixed(1) || '0.0'} ({product.rating?.count || 0} reviews)
              </span>
            </div>
            
            {product.soldCount > 0 && (
              <div className="sold-count">{product.soldCount} sold</div>
            )}
          </div>
          
          <div className="product-price">
            {product.salePrice ? (
              <>
                <span className="regular-price">${product.price.toFixed(2)}</span>
                <span className="sale-price">${product.salePrice.toFixed(2)}</span>
                <span className="discount-percentage">
                  {Math.round((1 - product.salePrice / product.price) * 100)}% OFF
                </span>
              </>
            ) : (
              <span className="regular-price">${product.price.toFixed(2)}</span>
            )}
          </div>
          
          <div className="product-short-description">
            {product.shortDescription}
          </div>
          
          <div className="product-actions">
            <div className="quantity-selector">
              <label htmlFor="quantity">Quantity</label>
              <div className="quantity-input">
                <button
                  type="button"
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  className="quantity-btn"
                >
                  -
                </button>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  value={quantity}
                  onChange={handleQuantityChange}
                />
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="quantity-btn"
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="action-buttons">
              <button
                className="add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={isAddingToCart}
              >
                <FaShoppingCart />
                {isAddingToCart ? 'Adding...' : 'Add to Cart'}
              </button>
              
              <button
                className="wishlist-btn"
                onClick={handleAddToWishlist}
                disabled={isAddingToWishlist}
              >
                <FaHeart />
                {isAddingToWishlist ? 'Adding...' : 'Add to Wishlist'}
              </button>
            </div>
          </div>
          
          <div className="product-meta-info">
            <div className="meta-item">
              <span className="meta-label">Category:</span>
              <Link href={`/category/${product.category}`} className="meta-value">
                {product.category}
              </Link>
            </div>
            
            {product.tags.length > 0 && (
              <div className="meta-item">
                <span className="meta-label">Tags:</span>
                <div className="tags-list">
                  {product.tags.map((tag, index) => (
                    <Link key={index} href={`/products?tag=${tag}`} className="tag">
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="product-tabs">
        <div className="tabs-header">
          <button
            className={`tab-button ${activeTab === 'description' ? 'active' : ''}`}
            onClick={() => handleTabChange('description')}
          >
            Description
          </button>
          
          <button
            className={`tab-button ${activeTab === 'features' ? 'active' : ''}`}
            onClick={() => handleTabChange('features')}
          >
            Features
          </button>
          
          {product.requirements?.length > 0 && (
            <button
              className={`tab-button ${activeTab === 'requirements' ? 'active' : ''}`}
              onClick={() => handleTabChange('requirements')}
            >
              Requirements
            </button>
          )}
          
          <button
            className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => handleTabChange('reviews')}
          >
            Reviews ({product.rating?.count || 0})
          </button>
        </div>
        
        <div className="tabs-content">
          {/* Description Tab */}
          {activeTab === 'description' && (
            <div className="tab-content description-content">
              <div dangerouslySetInnerHTML={{ __html: product.description }} />
              
              {product.deliveryInfo && (
                <div className="delivery-info">
                  <h3>Delivery Information</h3>
                  <p>{product.deliveryInfo}</p>
                </div>
              )}
            </div>
          )}
          
          {/* Features Tab */}
          {activeTab === 'features' && (
            <div className="tab-content features-content">
              {product.features.length > 0 ? (
                <ul className="features-list">
                  {product.features.map((feature, index) => (
                    <li key={index} className="feature-item">
                      <FaCheckCircle className="feature-icon" /> {feature}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No features specified for this product.</p>
              )}
            </div>
          )}
          
          {/* Requirements Tab */}
          {activeTab === 'requirements' && (
            <div className="tab-content requirements-content">
              <h3>System Requirements</h3>
              <ul className="requirements-list">
                {product.requirements.map((req, index) => (
                  <li key={index} className="requirement-item">
                    <FaList className="requirement-icon" /> {req}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="tab-content reviews-content">
              <div className="reviews-summary">
                <div className="average-rating">
                  <h3>Customer Reviews</h3>
                  <div className="rating-number">{product.rating?.average?.toFixed(1) || '0.0'}</div>
                  {renderRating()}
                  <div className="rating-count">Based on {product.rating?.count || 0} reviews</div>
                </div>
              </div>
              
              {loadingReviews ? (
                <div className="loading-reviews">Loading reviews...</div>
              ) : (
                <>
                  {reviews.length > 0 ? (
                    <div className="reviews-list">
                      {reviews.map(review => (
                        <div key={review.id} className="review-item">
                          <div className="review-header">
                            <div className="reviewer-info">
                              <div className="reviewer-name">{review.userName}</div>
                              <div className="review-date">
                                {new Date(review.createdAt?.toDate()).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="review-rating">
                              {renderRating(review.rating)}
                            </div>
                          </div>
                          
                          <div className="review-content">
                            <h4 className="review-title">{review.title}</h4>
                            <p className="review-text">{review.content}</p>
                          </div>
                          
                          {review.response && (
                            <div className="review-response">
                              <div className="response-header">
                                <strong>{review.response.responderName}</strong>
                                <span className="response-date">
                                  {new Date(review.response.createdAt?.toDate()).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="response-content">{review.response.content}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-reviews">
                      <p>There are no reviews yet for this product.</p>
                      {user && (
                        <Link href={`/products/${product.slug}/review`} className="write-review-btn">
                          Be the first to write a review
                        </Link>
                      )}
                    </div>
                  )}
                  
                  {user && reviews.length > 0 && (
                    <div className="write-review">
                      <Link href={`/products/${product.slug}/review`} className="write-review-btn">
                        Write a Review
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Related products would go here */}
      
      {/* Notification */}
      {showNotification && (
        <div className="notification">
          <div className="notification-content">
            <FaCheckCircle className="notification-icon" />
            {notificationMessage}
          </div>
        </div>
      )}
    </div>
  );
}