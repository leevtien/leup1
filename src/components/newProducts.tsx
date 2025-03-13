'use client';

// import React, { useState } from 'react';
// import Image from 'next/image';
import Link from 'next/link';
import '@/styles/css/newProducts.css';
import ProductCard from '@/components/productCard';


// Mock data for new products
const newProductsData = [
    {
      id: 101,
      name: 'Disney+ Premium',
      price: 9.99,
      image: '/images/products/disney-plus.jpg',
      slug: 'disney-plus-premium',
      rating: 4.9,
      isNew: true,
      daysAgo: 2,
      category: 'Entertainment'
    },
    {
      id: 102,
      name: 'ChatGPT Plus Subscription',
      price: 20.00,
      image: '/images/products/chatgpt-plus.jpg',
      slug: 'chatgpt-plus',
      rating: 5.0,
      isNew: true,
      daysAgo: 3,
      category: 'AI Services'
    },
    {
      id: 103,
      name: 'Apple Music Family Plan',
      price: 14.99,
      image: '/images/products/apple-music.jpg',
      slug: 'apple-music-family',
      rating: 4.7,
      isNew: true,
      daysAgo: 4,
      category: 'Music'
    },
    {
      id: 104,
      name: 'Canva Pro Annual',
      price: 119.99,
      image: '/images/products/canva-pro.jpg',
      slug: 'canva-pro-annual',
      rating: 4.8,
      isNew: true,
      daysAgo: 5,
      category: 'Design'
    },
    {
      id: 105,
      name: 'McAfee Total Protection',
      price: 49.99,
      image: '/images/products/mcafee.jpg',
      slug: 'mcafee-total-protection',
      rating: 4.5,
      isNew: true,
      daysAgo: 6,
      category: 'Security'
    },
    {
      id: 106,
      name: 'Midjourney Subscription',
      price: 10.00,
      image: '/images/products/midjourney.jpg',
      slug: 'midjourney-subscription',
      rating: 4.9,
      isNew: true,
      daysAgo: 1,
      category: 'AI Services'
    }
  ];

// New Product Card Component
export default function NewProducts() {
    return (
      <section className="new-products-section">
        <div className="container">
          <div className="section-heading">
            <div className="heading-left">
              <h2>New Products</h2>
              <p>Check out our latest digital products and services</p>
            </div>
            <div className="heading-right">
              <Link href="/products/new" className="view-all">
                View All New Products
              </Link>
            </div>
          </div>
          
          <div className="products-carousel">
            {newProductsData.map(product => (
              <ProductCard 
                key={product.id} 
                product={{
                  ...product,
                  isNew: true,
                  description: `Premium digital subscription for ${product.name}`
                }} 
                variant="default"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }