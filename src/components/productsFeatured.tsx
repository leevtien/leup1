'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import '@/styles/css/productsFeatured.css';
import ProductCard from '@/components/productCard';

// Mock data for featured products
const featuredProductsData = [
  {
    id: 1,
    name: 'Netflix Premium',
    description: 'Watch unlimited movies and TV shows on all your devices',
    price: 11.99,
    discount: 15,
    rating: 4.8,
    image: '/images/products/netflix-premium.jpg',
    category: 'Entertainment',
    slug: 'netflix-premium'
  },
  {
    id: 2,
    name: 'Adobe Creative Cloud',
    description: 'Access all creative apps for photo, video, and design',
    price: 52.99,
    discount: 20,
    rating: 4.7,
    image: '/images/products/adobe-cc.jpg',
    category: 'Design',
    slug: 'adobe-creative-cloud'
  },
  {
    id: 3,
    name: 'Microsoft Office 365',
    description: 'Complete office suite with Word, Excel, PowerPoint and more',
    price: 69.99,
    discount: 25,
    rating: 4.6,
    image: '/images/products/office-365.jpg',
    category: 'Work',
    slug: 'microsoft-office-365'
  },
  {
    id: 4,
    name: 'NordVPN Premium',
    description: 'Secure your online activity with advanced encryption',
    price: 9.99,
    discount: 10,
    rating: 4.5,
    image: '/images/products/nordvpn.jpg',
    category: 'Security',
    slug: 'nordvpn-premium'
  },
  {
    id: 5,
    name: 'Steam Gift Card',
    description: 'Add funds to your Steam Wallet for games and more',
    price: 50.00,
    discount: 0,
    rating: 4.9,
    image: '/images/products/steam-gift.jpg',
    category: 'Gaming',
    slug: 'steam-gift-card'
  },
  {
    id: 6,
    name: 'Spotify Premium',
    description: 'Ad-free music streaming with offline listening',
    price: 9.99,
    discount: 15,
    rating: 4.7,
    image: '/images/products/spotify.jpg',
    category: 'Entertainment',
    slug: 'spotify-premium'
  },
  {
    id: 7,
    name: 'Windows 11 Pro',
    description: 'Latest Windows operating system for personal computers',
    price: 199.99,
    discount: 30,
    rating: 4.5,
    image: '/images/products/windows-11.jpg',
    category: 'Software',
    slug: 'windows-11-pro'
  },
  {
    id: 8,
    name: 'YouTube Premium',
    description: 'Ad-free YouTube with background play and downloads',
    price: 11.99,
    discount: 0,
    rating: 4.6,
    image: '/images/products/youtube-premium.jpg',
    category: 'Entertainment',
    slug: 'youtube-premium'
  }
];

const ProductTabs = ({ categories, activeCategory, setActiveCategory }) => {
    return (
      <div className="product-tabs">
        <button 
          className={activeCategory === 'All' ? 'active' : ''} 
          onClick={() => setActiveCategory('All')}
        >
          All Products
        </button>
        
        {categories.map(category => (
          <button 
            key={category} 
            className={activeCategory === category ? 'active' : ''}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
    );
  };
  
  export default function ProductsFeatured() {
    const [activeCategory, setActiveCategory] = useState('All');
    const [filteredProducts, setFilteredProducts] = useState(featuredProductsData);
    
    // Extract unique categories from products
    const categories = [...new Set(featuredProductsData.map(product => product.category))];
    
    // Filter products when category changes
    useEffect(() => {
      if (activeCategory === 'All') {
        setFilteredProducts(featuredProductsData);
      } else {
        const filtered = featuredProductsData.filter(
          product => product.category === activeCategory
        );
        setFilteredProducts(filtered);
      }
    }, [activeCategory]);
    
    return (
      <section className="featured-products">
        <div className="container">
          <div className="section-header">
            <h2>Featured Products</h2>
            <p>Discover our top selling digital products and services</p>
          </div>
          
          <ProductTabs 
            categories={categories} 
            activeCategory={activeCategory} 
            setActiveCategory={setActiveCategory} 
          />
          
          <div className="products-grid">
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                variant="featured" // Using the 'featured' variant for this section
              />
            ))}
          </div>
          
          <div className="view-all-container">
            <Link href="/products" className="view-all-btn">
              View All Products
            </Link>
          </div>
        </div>
      </section>
    );
  }