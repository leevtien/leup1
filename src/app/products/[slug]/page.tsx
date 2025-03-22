
'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Product } from '@/types/index'; // You'll need to create this type



export default function ProductDetailPage() {
    const { slug } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchProduct() {
            try {
                setLoading(true);
                // Replace this with your actual API endpoint
                const response = await fetch(`/api/products/${slug}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch product');
                }
                const data = await response.json();
                setProduct(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        }

        if (slug) {
            fetchProduct();
        }
    }, [slug]);

    if (loading) {
        return <div className="container mx-auto p-6">Loading...</div>;
    }

    if (error || !product) {
        return <div className="container mx-auto p-6">Error: {error || 'Product not found'}</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative h-96">
                    {product.imageUrl && (
                        <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className="object-contain"
                            priority
                        />
                    )}
                </div>
                
                <div>
                    <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                    <p className="text-2xl font-semibold text-blue-600 mb-4">${product.price.toFixed(2)}</p>
                    
                    {product.inStock ? (
                        <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded mb-4">
                            In Stock
                        </span>
                    ) : (
                        <span className="inline-block bg-red-100 text-red-800 px-2 py-1 rounded mb-4">
                            Out of Stock
                        </span>
                    )}
                    
                    <div className="mb-6">
                        <p className="text-gray-700">{product.description}</p>
                    </div>
                    
                    <button 
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
                        disabled={!product.inStock}
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}