'use client';

import Image from 'next/image';

export default function OrderSummary({ cart }) {
  if (!cart || !cart.items) {
    return null;
  }

  return (
    <div className="order-summary">
      <h2>Order Summary</h2>
      
      <div className="summary-items">
        {cart.items.map(item => (
          <div key={item.productId} className="summary-item">
            <div className="item-image">
              <Image
                src={item.image}
                alt={item.name}
                width={60}
                height={60}
                objectFit="cover"
              />
            </div>
            <div className="item-details">
              <div className="item-name">{item.name}</div>
              <div className="item-quantity">Qty: {item.quantity}</div>
            </div>
            <div className="item-price">${(item.price * item.quantity).toFixed(2)}</div>
          </div>
        ))}
      </div>
      
      <div className="summary-totals">
        <div className="summary-row">
          <span>Subtotal</span>
          <span>${cart.subtotal.toFixed(2)}</span>
        </div>
        
        <div className="summary-row">
          <span>Tax</span>
          <span>$0.00</span>
        </div>
        
        <div className="summary-row total">
          <span>Total</span>
          <span>${cart.subtotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}