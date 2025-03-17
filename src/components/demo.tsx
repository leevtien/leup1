"use client";
import { useState, useEffect } from "react";
import { getProducts, Product } from "@/services/firestoreService";

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts();
      setProducts(data);
    };
    fetchProducts();
  }, []);

  return (
    <div>
      {products.map((product) => (
        <div key={product.id}>
          <img src={product.imageUrl} alt={product.name} width={100} />
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <p>{product.price} VND</p>
        </div>
      ))}
    </div>
  );
}
