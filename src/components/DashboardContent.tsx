// File: app/components/DashboardContent.tsx
"use client";

import { useState, useEffect } from 'react';
import { IProduct } from '@/models/Product';
import { useAuth } from '@/app/context/AuthContext';
import styles from '@/app/dashboard/dashboard.module.css';
import {
  Package,
  Archive,
  DollarSign,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';

export default function DashboardContent() {
  const { apiKey, logout } = useAuth();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!apiKey) return;

      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/products', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to fetch data');
        }
        const data: IProduct[] = await res.json();
        setProducts(data);
      } catch (err: any) {
        setError(err.message);
        if (err.message.includes('Unauthorized')) {
          logout(); // Log out if key is bad
        }
      }
      setIsLoading(false);
    };

    fetchDashboardData();
  }, [apiKey, logout]);

  // Calculate stats from the fetched data
  const totalProducts = products.length;
  const totalInventory = products.reduce(
    (sum, product) => sum + product.inventory,
    0
  );
  const totalValue = products.reduce(
    (sum, product) => sum + product.price * product.inventory,
    0
  );
  const lowStockProducts = products
    .filter((product) => product.inventory <= 10)
    .sort((a, b) => a.inventory - b.inventory);

  if (isLoading) {
    return <p className={styles.loading}>Loading dashboard data...</p>;
  }

  if (error) {
    return <p className={styles.loginError}>Error: {error}</p>;
  }

  return (
    <div>
      <h1>Inventory Dashboard</h1>
      <p className={styles.pageDescription}>
        This page is <strong>Client-Side Rendered (CSR)</strong>. Data
        is fetched from the API after you log in.
      </p>

      {/* Grid for the main statistics */}
      <div className={styles.statsGrid}>
        {/* Stat Card 1: Total Products */}
        <div className={`card ${styles.statCard}`}>
          <div className={`${styles.iconWrapper} ${styles.iconProducts}`}>
            <Package size={24} />
          </div>
          <div className={styles.statContent}>
            <h3>Total Products</h3>
            <p className={styles.statValue}>{totalProducts}</p>
          </div>
        </div>

        {/* Stat Card 2: Total Inventory */}
        <div className={`card ${styles.statCard}`}>
          <div className={`${styles.iconWrapper} ${styles.iconInventory}`}>
            <Archive size={24} />
          </div>
          <div className={styles.statContent}>
            <h3>Total Inventory</h3>
            <p className={styles.statValue}>{totalInventory} units</p>
          </div>
        </div>

        {/* Stat Card 3: Total Stock Value */}
        <div className={`card ${styles.statCard}`}>
          <div className={`${styles.iconWrapper} ${styles.iconValue}`}>
            <DollarSign size={24} />
          </div>
          <div className={styles.statContent}>
            <h3>Total Stock Value</h3>
            <p className={styles.statValue}>${totalValue.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Section for low stock items */}
      <h2 className={styles.sectionHeader}>
        <AlertTriangle size={20} />
        Low Stock Report
      </h2>

      {/* Table container card */}
      <div className={`card ${styles.tableContainer}`}>
        {lowStockProducts.length > 0 ? (
          <table className={styles.lowStockTable}>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>Stock Left</th>
              </tr>
            </thead>
            <tbody>
              {lowStockProducts.map((product) => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>
                    <span className={styles.categoryTag}>
                      {product.category}
                    </span>
                  </td>
                  <td>
                    <span className={styles.lowStockValue}>
                      {product.inventory}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className={styles.emptyState}>
            <CheckCircle size={48} />
            <h3>All Stocked Up!</h3>
            <p>No low stock products. Great job!</p>
          </div>
        )}
      </div>
    </div>
  );
}