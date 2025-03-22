// src/components/admin/orders/OrderView.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getOrderById, updateOrderStatus, addOrderDeliveryInfo } from '@/services/orderService';
import { FaCheckCircle, FaTimesCircle, FaShippingFast, FaFileDownload } from 'react-icons/fa';

export default function OrderView({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deliveryData, setDeliveryData] = useState('');
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderById(orderId);
        setOrder(data);
      } catch (error) {
        console.error('Error fetching order:', error);
        setError('Failed to load order details.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdating(true);
      await updateOrderStatus(orderId, newStatus);
      setOrder({ ...order, status: newStatus });
    } catch (error) {
      console.error('Error updating order status:', error);
      setError('Failed to update order status.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeliverySubmit = async (e) => {
    e.preventDefault();
    
    if (!deliveryData.trim()) {
      setError('Please enter delivery information.');
      return;
    }
    
    try {
      setUpdating(true);
      await addOrderDeliveryInfo(orderId, deliveryData);
      setOrder({
        ...order,
        status: 'completed',
        deliveryDetails: {
          sentAt: new Date(),
          deliveryData
        }
      });
      setDeliveryData('');
    } catch (error) {
      console.error('Error sending delivery data:', error);
      setError('Failed to send delivery information.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading order details...</div>;
  }

  if (!order) {
    return <div className="error-message">Order not found.</div>;
  }

  return (
    <div className="order-view">
      <div className="page-header">
        <h1>Order: {order.orderNumber}</h1>
        <button 
          className="btn-back"
          onClick={() => router.push('/admin/orders')}
        >
          Back to Orders
        </button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="order-overview">
        <div className="order-status">
          <h3>Status</h3>
          <div className="status-indicators">
            <div className={`status-badge ${order.status}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </div>
            <div className={`status-badge payment-${order.paymentStatus}`}>
              Payment: {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
            </div>
          </div>
          
          <div className="status-actions">
            <button 
              className="btn-status processing"
              onClick={() => handleStatusChange('processing')}
              disabled={updating || order.status === 'processing' || order.status === 'completed'}
            >
              <FaShippingFast /> Mark as Processing
            </button>
            
            <button 
              className="btn-status completed"
              onClick={() => handleStatusChange('completed')}
              disabled={updating || order.status === 'completed'}
            >
              <FaCheckCircle /> Mark as Completed
            </button>
            
            <button 
              className="btn-status cancelled"
              onClick={() => handleStatusChange('cancelled')}
              disabled={updating || order.status === 'cancelled' || order.status === 'completed'}
            >
              <FaTimesCircle /> Mark as Cancelled
            </button>
          </div>
        </div>
        
        <div className="order-meta">
          <div className="meta-section">
            <h3>Order Details</h3>
            <p><strong>Date:</strong> {new Date(order.createdAt?.toDate()).toLocaleString()}</p>
            <p><strong>Customer:</strong> {order.billingAddress.name}</p>
            <p><strong>Email:</strong> {order.deliveryEmail}</p>
            <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
          </div>
          
          <div className="meta-section">
            <h3>Order Summary</h3>
            <p><strong>Subtotal:</strong> ${order.subtotal.toFixed(2)}</p>
            {order.tax > 0 && <p><strong>Tax:</strong> ${order.tax.toFixed(2)}</p>}
            {order.discount > 0 && <p><strong>Discount:</strong> -${order.discount.toFixed(2)}</p>}
            <p className="total-amount"><strong>Total:</strong> ${order.total.toFixed(2)}</p>
          </div>
        </div>
      </div>
      
      <div className="order-items">
        <h3>Items</h3>
        <table className="items-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, index) => (
              <tr key={index}>
                <td className="product-cell">
                  <img src={item.image} alt={item.name} className="product-thumbnail" />
                  <span className="product-name">{item.name}</span>
                </td>
                <td>${item.price.toFixed(2)}</td>
                <td>{item.quantity}</td>
                <td>${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Only show delivery form for digital products that haven't been delivered yet */}
      {order.deliveryMethod === 'email' && 
       (!order.deliveryDetails || !order.deliveryDetails.sentAt) && 
       order.status !== 'cancelled' && (
        <div className="delivery-section">
          <h3>Send Digital Products</h3>
          <form onSubmit={handleDeliverySubmit} className="delivery-form">
            <div className="form-group">
              <label htmlFor="deliveryData">
                Delivery Information (product keys, download links, etc.)
              </label>
              <textarea
                id="deliveryData"
                value={deliveryData}
                onChange={(e) => setDeliveryData(e.target.value)}
                rows={5}
                placeholder="Enter product keys, account details, or download links here..."
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="btn-deliver"
              disabled={updating}
            >
              <FaFileDownload /> {updating ? 'Sending...' : 'Send to Customer'}
            </button>
          </form>
        </div>
      )}
      
      {/* Show delivery details if already sent */}
      {order.deliveryDetails && order.deliveryDetails.sentAt && (
        <div className="delivery-details">
          <h3>Delivered Information</h3>
          <p><strong>Sent:</strong> {new Date(order.deliveryDetails.sentAt?.toDate()).toLocaleString()}</p>
          <div className="delivery-content">
            <pre>{order.deliveryDetails.deliveryData}</pre>
          </div>
        </div>
      )}
      
      <div className="billing-address">
        <h3>Billing Address</h3>
        <address>
          {order.billingAddress.name}<br />
          {order.billingAddress.line1}<br />
          {order.billingAddress.line2 && <>{order.billingAddress.line2}<br /></>}
          {order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.postalCode}<br />
          {order.billingAddress.country}
        </address>
      </div>
      
      {order.notes && (
        <div className="order-notes">
          <h3>Notes</h3>
          <p>{order.notes}</p>
        </div>
      )}
    </div>
  );
}