// File: app/page.tsx

import { getAllProducts } from '@/lib/data';
import ProductSearch from './ProductSearch';
import { IProduct } from '@/models/Product';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home | E-Store',
};

export default async function HomePage() {
  const products: IProduct[] = await getAllProducts();

  return (
    <div>
      {/* New hero text */}
      <h1 style={{ fontSize: '2.75rem' }}>Welcome to E-Store</h1>
      <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)' }}>
        Discover our curated collection of premium products. This page is
        statically generated and ready to browse.
      </p>

      <ProductSearch products={products} />
    </div>
  );
}