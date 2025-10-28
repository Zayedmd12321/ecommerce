// File: app/products/[slug]/page.tsx

import { getProductBySlug, getAllProducts } from '@/lib/data';
import { IProduct } from '@/models/Product';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import styles from './page.module.css';

interface Params {
  slug: string;
}

// ✅ New: Handle Promise-based params (Next.js 15+)
export default async function ProductPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params; // ✅ unwrap Promise
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Determine stock level and style
  const stockLevel =
    product.inventory > 10
      ? 'inStock'
      : product.inventory > 0
      ? 'lowStock'
      : 'outOfStock';
  const stockStyle = styles[stockLevel] || '';

  return (
    <div>
      {/* Back to Products Link */}
      <Link href="/" className={styles.backLink}>
        <ArrowLeft size={16} /> Back to all products
      </Link>

      {/* Product Container */}
      <div className={`card ${styles.productContainer}`}>
        <div className={styles.imageWrapper}>
          <Image
            src={product.imageUrl?product.imageUrl:''}
            alt={product.name}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        <div className={styles.productDetails}>
          <span className={styles.categoryTag}>{product.category}</span>
          <h1 className={styles.productName}>{product.name}</h1>
          <p className={styles.productPrice}>${product.price.toFixed(2)}</p>
          <p className={styles.productDescription}>{product.description}</p>

          <div className={`${styles.stockInfo} ${stockStyle}`}>
            {stockLevel === 'inStock' && `${product.inventory} In Stock`}
            {stockLevel === 'lowStock' &&
              `Low Stock! Only ${product.inventory} left`}
            {stockLevel === 'outOfStock' && `Out of Stock`}
          </div>

          <button
            className={`button-primary ${styles.addToCartButton}`}
            disabled={stockLevel === 'outOfStock'}
          >
            {stockLevel === 'outOfStock' ? 'Unavailable' : 'Add to Cart'}
          </button>

          <p className={styles.lastUpdated}>
            Last Updated:{' '}
            {new Date(product.lastUpdated).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}

// =======================================================
// Static Generation Helpers
// =======================================================

export const revalidate = 60;

export async function generateStaticParams() {
  const products: IProduct[] = await getAllProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

// ✅ Fix metadata function too
export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params; // ✅ unwrap Promise
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: 'Product Not Found' };
  }

  return {
    title: `${product.name} | E-Store`,
    description: product.description,
  };
}
