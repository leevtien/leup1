// src/components/checkout/CheckoutForm.tsx
'use client';

import { FaCreditCard, FaPaypal, FaLock } from 'react-icons/fa';

export default function CheckoutForm({
  formData,
  handleInputChange,
  paymentMethod,
  handlePaymentMethodChange,
  handleSubmit,
  submitting
}) {
  return (
    <div className="checkout-form-container">
      <form onSubmit={handleSubmit} className="checkout-form">
        <div className="form-section">
          <h2>Contact Information</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fullName">Full Name*</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email*</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>
        </div>
        
        <div className="form-section">
          <h2>Billing Address</h2>
          
          <div className="form-group">
            <label htmlFor="address.line1">Address Line 1*</label>
            <input
              type="text"
              id="address.line1"
              name="address.line1"
              value={formData.address.line1}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="address.line2">Address Line 2</label>
            <input
              type="text"
              id="address.line2"
              name="address.line2"
              value={formData.address.line2}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="address.city">City*</label>
              <input
                type="text"
                id="address.city"
                name="address.city"
                value={formData.address.city}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="address.state">State/Province*</label>
              <input
                type="text"
                id="address.state"
                name="address.state"
                value={formData.address.state}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="address.postalCode">Postal Code*</label>
              <input
                type="text"
                id="address.postalCode"
                name="address.postalCode"
                value={formData.address.postalCode}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="address.country">Country*</label>
              <select
                id="address.country"
                name="address.country"
                value={formData.address.country}
                onChange={handleInputChange}
                required
              >
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="GB">United Kingdom</option>
                <option value="AU">Australia</option>
                <option value="DE">Germany</option>
                <option value="FR">France</option>
                {/* Add more countries as needed */}
              </select>
            </div>
          </div>
        </div>
        
        <div className="form-section">
          <h2>Delivery Information</h2>
          
          <div className="form-group">
            <label htmlFor="deliveryEmail">Delivery Email*</label>
            <input
              type="email"
              id="deliveryEmail"
              name="deliveryEmail"
              value={formData.deliveryEmail}
              onChange={handleInputChange}
              required
            />
            <small className="helper-text">
              Digital products will be delivered to this email address
            </small>
          </div>
          
          <div className="form-group">
            <label htmlFor="notes">Order Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              placeholder="Special instructions for your order (optional)"
            />
          </div>
        </div>
        
        <div className="form-section">
          <h2>Payment Method</h2>
          
          <div className="payment-methods">
            <div 
              className={`payment-method ${paymentMethod === 'credit_card' ? 'active' : ''}`}
              onClick={() => handlePaymentMethodChange('credit_card')}
            >
              <div className="payment-icon">
                <FaCreditCard />
              </div>
              <div className="payment-info">
                <h3>Credit Card</h3>
                <p>Pay with Visa, Mastercard, or American Express</p>
              </div>
            </div>
            
            <div 
              className={`payment-method ${paymentMethod === 'paypal' ? 'active' : ''}`}
              onClick={() => handlePaymentMethodChange('paypal')}
            >
              <div className="payment-icon">
                <FaPaypal />
              </div>
              <div className="payment-info">
                <h3>PayPal</h3>
                <p>Pay with your PayPal account</p>
              </div>
            </div>
          </div>
          
          {paymentMethod === 'credit_card' && (
            <div className="credit-card-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="cardNumber">Card Number*</label>
                  <input
                    type="text"
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="cardName">Name on Card*</label>
                  <input
                    type="text"
                    id="cardName"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="expiryDate">Expiry Date*</label>
                  <input
                    type="text"
                    id="expiryDate"
                    placeholder="MM/YY"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="cvv">CVV*</label>
                  <input
                    type="text"
                    id="cvv"
                    placeholder="123"
                    required
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="secure-checkout">
          <FaLock /> Your information is secure and encrypted
        </div>
        
        <button 
          type="submit" 
          className="place-order-btn"
          disabled={submitting}
        >
          {submitting ? 'Processing...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
}