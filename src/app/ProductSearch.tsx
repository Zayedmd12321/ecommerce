// File: app/ProductSearch.tsx
"use client";

import { useState, useMemo } from 'react';
import { IProduct } from '@/models/Product';
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';

interface Props {
  products: IProduct[];
}

export default function ProductSearch({ products }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Get all unique categories from the products
  const categories = useMemo(() => {
    const categorySet = new Set(products.map((p) => p.category));
    return Array.from(categorySet);
  }, [products]);

  const filteredProducts = useMemo(() => {
    let tempProducts = products;

    // 1. Filter by category first
    if (selectedCategory !== 'all') {
      tempProducts = tempProducts.filter(
        (product) => product.category === selectedCategory
      );
    }

    // 2. Then filter by search term
    if (searchTerm) {
      tempProducts = tempProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return tempProducts;
  }, [products, searchTerm, selectedCategory]);

  return (
    <div className={styles.searchContainer}>
      {/* New container for search + filter */}
      <div className={styles.controlsContainer}>
        <input
          type="text"
          placeholder="Search for products..."
          // Use the global class
          className={`input-field ${styles.searchBar}`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className={`input-field ${styles.categoryFilter}`}
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.productGrid}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            // Use the global 'card' class and the local module class
            <div key={product._id} className={`card ${styles.productCard}`}>
              <Link
                href={`/products/${product.slug}`}
                className={styles.imageLink}
              >
                <div className={styles.productImageWrapper}>
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </Link>

              {/* NEW Wrapper for clean padding */}
              <div className={styles.productContent}>
                <span className={styles.categoryTag}>{product.category}</span>

                <h3>{product.name}</h3>
                <p className={styles.productPrice}>
                  ${product.price.toFixed(2)}
                </p>

                <p className={styles.productDescription}>
                  {product.description.length > 80
                    ? product.description.substring(0, 80) + '...'
                    : product.description}
                </p>

                <Link
                  href={`/products/${product.slug}`}
                  // Use the global button class
                  className={`button-primary ${styles.productLink}`}
                >
                  View Details
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
}