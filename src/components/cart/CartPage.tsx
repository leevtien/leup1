// src/components/cart/CartPage.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getUserCart, updateCartItemQuantity, removeFromCart } from '@/services/userService';
import { FaTrash, FaArrowLeft, FaArrowRight, FaCreditCard } from 'react-icons/fa';

export default function CartPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch cart data when user is available
    const fetchCart = async () => {
      if (!authLoading && !user) {
        // Redirect to login if not authenticated
        router.push('/account/login?redirect=/cart');
        return;
      }
      
      if (user) {
        try {
          setLoading(true);
          const cartData = await getUserCart(user.uid);
          setCart(cartData || { items: [], subtotal: 0 });
        } catch (error) {
          console.error('Error fetching cart:', error);
          setError('Failed to load your cart. Please try again.');
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchCart();
  }, [user, authLoading, router]);

  // Update item quantity
  const handleQuantityChange = async (productId, quantity) => {
    if (quantity < 1) return;
    
    try {
      setUpdating(true);
      await updateCartItemQuantity(user.uid, productId, quantity);
      
      // Update local cart state
      const updatedItems = cart.items.map(item => {
        if (item.productId === productId) {
          return { ...item, quantity };
        }
        return item;
      });
      
      const subtotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      setCart({
        ...cart,
        items: updatedItems,
        subtotal
      });
    } catch (error) {
      console.error('Error updating quantity:', error);
      setError('Failed to update quantity. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  // Remove item from cart
  const handleRemoveItem = async (productId) => {
    try {
      setUpdating(true);
      await removeFromCart(user.uid, productId);
      
      // Update local cart state
      const updatedItems = cart.items.filter(item => item.productId !== productId);
      const subtotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      setCart({
        ...cart,
        items: updatedItems,
        subtotal
      });
    } catch (error) {
      console.error('Error removing item:', error);
      setError('Failed to remove item. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  // Proceed to checkout
  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (authLoading || loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your cart...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="empty-cart">
        <div className="empty-cart-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added any products to your cart yet.</p>
        <Link href="/products" className="continue-shopping-btn">
          <FaArrowLeft /> Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>
      
      <div className="cart-container">
        <div className="cart-items">
          <table className="cart-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.items.map(item => (
                <tr key={item.productId} className="cart-item">
                  <td className="product-info">
                    <div className="product-image">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={80}
                        height={80}
                        objectFit="cover"
                      />
                    </div>
                    <div className="product-details">
                      <Link href={`/products/${item.productId}`} className="product-name">
                        {item.name}
                      </Link>
                    </div>
                  </td>
                  <td className="product-price">${item.price.toFixed(2)}</td>
                  <td className="product-quantity">
                    <div className="quantity-selector">
                      <button 
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                        disabled={updating || item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button 
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                        disabled={updating}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="product-total">${(item.price * item.quantity).toFixed(2)}</td>
                  <td className="product-action">
                    <button 
                      className="remove-btn"
                      onClick={() => handleRemoveItem(item.productId)}
                      disabled={updating}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="cart-summary">
          <h2>Order Summary</h2>
          
          <div className="summary-row">
            <span className="summary-label">Subtotal</span>
            <span className="summary-value">${cart.subtotal.toFixed(2)}</span>
          </div>
          
          <div className="summary-row">
            <span className="summary-label">Tax</span>
            <span className="summary-value">$0.00</span>
          </div>
          
          <div className="summary-total">
            <span className="total-label">Total</span>
            <span className="total-value">${cart.subtotal.toFixed(2)}</span>
          </div>
          
          <button 
            className="checkout-btn"
            onClick={handleCheckout}
            disabled={updating || cart.items.length === 0}
          >
            <FaCreditCard /> Proceed to Checkout
          </button>
          
          <Link href="/products" className="continue-shopping-link">
            <FaArrowLeft /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}