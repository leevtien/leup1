// src/components/checkout/CheckoutPage.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getUserCart, getUserData, clearCart } from '@/services/userService';
import { createOrder } from '@/services/orderService';
import { ProcessPayment } from '@/services/paymentService';
import CheckoutForm from './CheckoutForm';
import OrderSummary from './OrderSummary';
import { FaSpinner } from 'react-icons/fa';

export default function CheckoutPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [cart, setCart] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'US'
    },
    deliveryEmail: '',
    notes: ''
  });

  useEffect(() => {
    // Check if user is authenticated and fetch data
    const fetchData = async () => {
      if (!authLoading && !user) {
        // Redirect to login if not authenticated
        router.push('/account/login?redirect=/checkout');
        return;
      }
      
      if (user) {
        try {
          setLoading(true);
          
          // Fetch cart data
          const cartData = await getUserCart(user.uid);
          
          if (!cartData || !cartData.items || cartData.items.length === 0) {
            // Redirect to cart if empty
            router.push('/cart');
            return;
          }
          
          setCart(cartData);
          
          // Fetch user data to pre-fill form
          const userProfileData = await getUserData(user.uid);
          setUserData(userProfileData);
          
          // Pre-fill form with user data if available
          if (userProfileData) {
            setFormData({
              fullName: userProfileData.displayName || '',
              email: userProfileData.email || '',
              phone: userProfileData.phoneNumber || '',
              address: userProfileData.addresses?.billing || {
                line1: '',
                line2: '',
                city: '',
                state: '',
                postalCode: '',
                country: 'US'
              },
              deliveryEmail: userProfileData.email || '',
              notes: ''
            });
          }
        } catch (error) {
          console.error('Error fetching checkout data:', error);
          setError('Failed to load checkout data. Please try again.');
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchData();
  }, [user, authLoading, router]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('address.')) {
      const addressField = name.split('address.')[1];
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [addressField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Handle payment method change
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  // Process order submission
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    
    // Validate form
    const requiredFields = [
      'fullName', 'email', 'deliveryEmail',
      'address.line1', 'address.city', 'address.state', 'address.postalCode'
    ];
    
    const missingFields = requiredFields.filter(field => {
      if (field.includes('address.')) {
        const addressField = field.split('address.')[1];
        return !formData.address[addressField];
      }
      return !formData[field];
    });
    
    if (missingFields.length > 0) {
      setError('Please fill in all required fields.');
      return;
    }
    
    try {
      setSubmitting(true);
      setError('');
      
      // Process payment first
      const paymentResult = await ProcessPayment({
        amount: cart.subtotal,
        currency: 'USD',
        paymentMethod,
        description: `Order from Digital Product Store`
      });
      
      if (!paymentResult.success) {
        throw new Error(paymentResult.error || 'Payment failed. Please try again.');
      }
      
      // Create order
      const orderData = {
        userId: user.uid,
        items: cart.items,
        subtotal: cart.subtotal,
        tax: 0, // Add tax calculation if needed
        discount: 0, // Add discount calculation if needed
        total: cart.subtotal, // Adjust with tax and discount
        status: 'pending',
        paymentStatus: 'paid',
        paymentMethod,
        paymentId: paymentResult.paymentId,
        billingAddress: formData.address,
        deliveryMethod: 'email',
        deliveryEmail: formData.deliveryEmail,
        notes: formData.notes
      };
      
      const orderId = await createOrder(orderData);
      
      // Clear the cart
      await clearCart(user.uid);
      
      // Redirect to order confirmation
      router.push(`/order-confirmation/${orderId}`);
    } catch (error) {
      console.error('Error processing order:', error);
      setError(error.message || 'Failed to process your order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="loading-container">
        <FaSpinner className="spinner" />
        <p>Preparing checkout...</p>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      
      {error && (
        <div className="error-message">{error}</div>
      )}
      
      <div className="checkout-container">
        <CheckoutForm
          formData={formData}
          handleInputChange={handleInputChange}
          paymentMethod={paymentMethod}
          handlePaymentMethodChange={handlePaymentMethodChange}
          handleSubmit={handleSubmitOrder}
          submitting={submitting}
        />
        
        <OrderSummary cart={cart} />
      </div>
    </div>
  );
}

