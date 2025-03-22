// src/components/product/ProductGrid.tsx
'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/components/product/ProductCard';
import { getProducts } from '@/services/productService';
import { FaSpinner } from 'react-icons/fa';

interface ProductGridProps {
  category?: string;
  featured?: boolean;
  isNew?: boolean;
  limit?: number;
  showPagination?: boolean;
}

export default function ProductGrid({
  category,
  featured = false,
  isNew = false,
  limit = 12,
  showPagination = false
}: ProductGridProps) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const options = {
          category,
          featured,
          isNew,
          limit,
          page: currentPage
        };
        
        const result = await getProducts(options);
        
        setProducts(result.products);
        
        if (showPagination) {
          setTotalPages(result.totalPages || 1);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, featured, isNew, limit, currentPage, showPagination]);

  if (loading) {
    return (
      <div className="loading-container">
        <FaSpinner className="spinner" />
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (products.length === 0) {
    return <div className="no-products">No products found.</div>;
  }

  return (
    <div className="product-grid-container">
      <div className="product-grid">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {showPagination && totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="pagination-button"
          >
            Previous
          </button>
          
          <span className="pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

