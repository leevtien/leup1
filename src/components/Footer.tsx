'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaFacebook, FaTwitter, FaInstagram, FaPinterest, FaYoutube, FaWhatsapp } from 'react-icons/fa';
import '@/styles/css/Footer.css';

export default function Footer() {
    return (
        <footer className="site-footer">
            <div className="container">
                {/* Payment Methods */}
                <div className="payment-methods">
                    {/* <h3>Accepted Payment Methods</h3> */}
                    <div className="payment-icons">
                        <div className="payment-icon">
                            <Image src="/images/payment/visa.png" alt="Visa" width={40} height={25} />
                        </div>
                        <div className="payment-icon">
                            <Image src="/images/payment/mastercard.png" alt="Mastercard" width={40} height={25} />
                        </div>
                        {/* <div className="payment-icon">
                            <Image src="/images/payment/amex.png" alt="American Express" width={40} height={25} />
                        </div> */}
                        <div className="payment-icon">
                            <Image src="/images/payment/paypal.png" alt="PayPal" width={40} height={25} />
                        </div>
                        <div className="payment-icon">
                            <Image src="/images/payment/apple-pay.png" alt="Apple Pay" width={40} height={25} />
                        </div>
                        <div className="payment-icon">
                            <Image src="/images/payment/google-pay.png" alt="Google Pay" width={40} height={25} />
                        </div>
                        <p className="small-text">và nhiều hình thức khác</p>
                    </div>
                </div>

                {/* Main Footer Content */}
                <div className="footer-content">
                    {/* About Section */}
                    
                    <div className="footer-section about">
                        <h3>About Us</h3>
                        <p>We are dedicated to providing quality products and excellent customer service.</p>
                        <ul className="footer-links">
                            <li><Link href="/about">Our Story</Link></li>
                            <li><Link href="/careers">Careers</Link></li>
                            <li><Link href="/press">Press</Link></li>
                            <li><Link href="/blog">Blog</Link></li>
                        </ul>
                    </div>

                    {/* Customer Account Section */}
                    <div className="footer-section account">
                        <h3>My Account</h3>
                        <ul className="footer-links">
                            <li><Link href="/account/login">Sign In</Link></li>
                            <li><Link href="/account/register">Register</Link></li>
                            <li><Link href="/account/orders">Order History</Link></li>
                            <li><Link href="/account/wishlist">My Wishlist</Link></li>
                            <li><Link href="/account/returns">Returns</Link></li>
                        </ul>
                    </div>

                    {/* Contact Information */}
                    <div className="footer-section contact">
                        <h3>Contact Us</h3>
                        {/* <p>Hamburg</p> */}
                        <p>Email: <a href="mailto:leupshop@gmail.com">leupshop@gmail.com</a></p>
                        <p>Phone: <a href="tel:+84988509524">+84988509524</a></p>
                        <p>Hours: Mon-Fri 9am to 5pm</p>
                    </div>

                    {/* Social Media & Newsletter */}
                    <div className="footer-section social">
                        <h3>Connect With Us</h3>
                        <div className="social-icons">
                            <a href="https://facebook.com/vtienle.dev" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                                <FaFacebook />
                            </a>
                            <a href="https://wa.me/+84988509524" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                                <FaWhatsapp />
                            </a>
                            {/* <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                                <FaInstagram />
                            </a>
                            <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" aria-label="Pinterest">
                                <FaPinterest />
                            </a>
                            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                                <FaYoutube />
                            </a> */}
                        </div>
                        
                        <h3 className="newsletter-title">Newsletter</h3>
                        <form className="newsletter-form">
                            <input 
                                type="email" 
                                placeholder="Your email address" 
                                required 
                            />
                            <button type="submit">Subscribe</button>
                        </form>
                    </div>
                </div>

                

                {/* Bottom Footer with Copyright */}
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} YourStore. All rights reserved.</p>
                    <div className="footer-bottom-links">
                        <Link href="/privacy">Privacy Policy</Link>
                        <Link href="/terms">Terms of Service</Link>
                        <Link href="/shipping">Shipping Policy</Link>
                        <Link href="/returns">Returns Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}