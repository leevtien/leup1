'use client';

import React, { useState, useEffect } from 'react';
import Image from "next/legacy/image";
import Link from 'next/link';
import { 
  FaGamepad, 
  FaLaptopCode, 
  FaBook, 
  FaPhotoVideo, 
  FaWindows, 
  FaGoogle, 
  FaWallet, 
  FaShieldAlt, 
  FaXbox,
  FaChevronLeft,
  FaChevronRight 
} from 'react-icons/fa';
import '@/styles/css/baner.css';

// Slideshow data for main banner
const slideshowData = [
  {
    id: 1,
    title: 'IQIYI PREMIUM PACKAGE',
    description: 'Unlimited access to exclusive Asian content with HD streaming',
    originalPrice: 14.99,
    discountPrice: 9.99,
    image: '/images/products/iqiyi-premium.jpg'
  },
  {
    id: 2,
    title: 'ADOBE CREATIVE CLOUD',
    description: 'Access all creative apps including Photoshop, Illustrator, and more',
    originalPrice: 52.99,
    discountPrice: 39.99,
    image: '/images/products/adobe-cc.jpg'
  },
  {
    id: 3,
    title: 'NETFLIX PREMIUM',
    description: 'Stream unlimited movies and TV shows in 4K across all your devices',
    originalPrice: 19.99,
    discountPrice: 17.99,
    image: '/images/products/netflix-premium.jpg'
  },
  {
    id: 4,
    title: 'MICROSOFT OFFICE 365',
    description: 'Complete productivity suite with Word, Excel, PowerPoint and more',
    originalPrice: 99.99,
    discountPrice: 69.99,
    image: '/images/products/office-365.jpg'
  },
  {
    id: 5,
    title: 'SPOTIFY PREMIUM',
    description: 'Ad-free music streaming with offline listening and unlimited skips',
    originalPrice: 12.99,
    discountPrice: 9.99,
    image: '/images/products/spotify.jpg'
  }
];

export default function MainBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance the slideshow every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slideshowData.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prevSlide) => 
      prevSlide === 0 ? slideshowData.length - 1 : prevSlide - 1
    );
  };

  const goToNextSlide = () => {
    setCurrentSlide((prevSlide) => 
      (prevSlide + 1) % slideshowData.length
    );
  };

  return (
    <div className="main-banner-section">
      <div className="banner-container">
        {/* Top Row: Navigation + Main Banner + Two Sub-Banners */}
        <div className="top-row">
          {/* Left Navigation Bar */}
          <div className="left-nav">
            <h3>Categories</h3>
            <ul className="category-list">
              <li>
                <Link href="/category/entertainment">
                  <span className="icon"><FaGamepad /></span>
                  <span className="text">Entertainment</span>
                </Link>
              </li>
              <li>
                <Link href="/category/work">
                  <span className="icon"><FaLaptopCode /></span>
                  <span className="text">Work</span>
                </Link>
              </li>
              <li>
                <Link href="/category/study">
                  <span className="icon"><FaBook /></span>
                  <span className="text">Study</span>
                </Link>
              </li>
              <li>
                <Link href="/category/photo-video">
                  <span className="icon"><FaPhotoVideo /></span>
                  <span className="text">Photo - Video Editing</span>
                </Link>
              </li>
              <li>
                <Link href="/category/windows-office">
                  <span className="icon"><FaWindows /></span>
                  <span className="text">Window, Office</span>
                </Link>
              </li>
              <li>
                <Link href="/category/google-drive">
                  <span className="icon"><FaGoogle /></span>
                  <span className="text">Google Drive</span>
                </Link>
              </li>
              <li>
                <Link href="/category/steam-wallet">
                  <span className="icon"><FaWallet /></span>
                  <span className="text">Steam Wallet</span>
                </Link>
              </li>
              <li>
                <Link href="/category/antivirus">
                  <span className="icon"><FaShieldAlt /></span>
                  <span className="text">Anti-Virus</span>
                </Link>
              </li>
              <li>
                <Link href="/category/gift-cards">
                  <span className="icon"><FaXbox /></span>
                  <span className="text">Xbox, iTunes Gift Card</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Main Banner Slideshow */}
          <div className="main-banner">
            <div className="slideshow-container">
              {slideshowData.map((slide, index) => (
                <div 
                  key={slide.id} 
                  className={`slide ${index === currentSlide ? 'active' : ''}`}
                >
                  <Image 
                    src={slide.image} 
                    alt={slide.title} 
                    layout="fill"
                    style={{ objectFit: 'cover' }}
                    priority={index === 0}
                    />
                  <div className="banner-content">
                    <h1>{slide.title}</h1>
                    <p>{slide.description}</p>
                    <div className="banner-price">
                      <span className="original-price">${slide.originalPrice.toFixed(2)}</span>
                      <span className="discount-price">${slide.discountPrice.toFixed(2)}</span>
                    </div>
                    <button className="btn-shop-now">Shop Now</button>
                  </div>
                </div>
              ))}
              
              {/* Slideshow Navigation */}
              <button className="prev-slide" onClick={goToPrevSlide}>
                <FaChevronLeft />
              </button>
              <button className="next-slide" onClick={goToNextSlide}>
                <FaChevronRight />
              </button>
              
              <div className="slideshow-dots">
                {slideshowData.map((_, index) => (
                  <div 
                    key={index}
                    className={`dot ${index === currentSlide ? 'active' : ''}`}
                    onClick={() => goToSlide(index)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Two Vertical Sub-Banners */}
          <div className="vertical-sub-banners">
            {/* Top Sub-Banner */}
            <div className="sub-banner">
              <div className="banner-content">
                <h3>FAKE IP VPN Service</h3>
                <p>Secure browsing with global server access</p>
                <span className="price">From $5.99/month</span>
                <button className="btn-view">View Details</button>
              </div>
              <Image 
                src="/images/products/vpn-service.jpg" 
                alt="FAKE IP VPN Service" 
                layout="fill"
                style={{ objectFit: 'cover' }}
                />
            </div>

            {/* Bottom Sub-Banner */}
            <div className="sub-banner">
              <div className="banner-content">
                <h3>AI Chatbot Service</h3>
                <p>Advanced AI assistant for your tasks</p>
                <span className="price">From $12.99/month</span>
                <button className="btn-view">View Details</button>
              </div>
              <Image 
                src="/images/products/ai-chatbot.jpg" 
                alt="AI Chatbot Service" 
                layout='fill'
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>

        {/* Bottom Row: Four Equal Sub-Banners */}
        <div className="bottom-row">
          <div className="sub-banner">
            <div className="banner-content">
              <h3>Steam Wallet Top-up</h3>
              <p>Instant digital code delivery</p>
              <span className="price">From $10.00</span>
              <button className="btn-view">View Details</button>
            </div>
            <Image 
              src="/images/products/steam-wallet.jpg" 
              alt="Steam Wallet Top-up" 
              layout='fill'
              style={{ objectFit: 'cover' }}
            />
          </div>

          <div className="sub-banner">
            <div className="banner-content">
              <h3>Design Software</h3>
              <p>Professional creative tools</p>
              <span className="price">From $19.99</span>
              <button className="btn-view">View Details</button>
            </div>
            <Image 
              src="/images/products/design-software.jpg" 
              alt="Design Software" 
              layout='fill'
              style={{ objectFit: 'cover' }}
            />
          </div>

          <div className="sub-banner">
            <div className="banner-content">
              <h3>Steam Offline Account</h3>
              <p>Access to premium games</p>
              <span className="price">From $29.99</span>
              <button className="btn-view">View Details</button>
            </div>
            <Image 
              src="/images/products/steam-offline.jpg" 
              alt="Steam Offline Account" 
              layout='fill'
              style={{ objectFit: 'cover' }}
            />
          </div>

          <div className="sub-banner">
            <div className="banner-content">
              <h3>Microsoft Office License</h3>
              <p>Lifetime access to Office suite</p>
              <span className="price">From $49.99</span>
              {/* <button className="btn-view">View Details</button> */}
            </div>
            <Image 
              src="/images/products/ms-office.jpg" 
              alt="Microsoft Office License" 
              layout='fill'
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}