// File: app/api/products/[slug]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import {
  getProductBySlug,
  updateProductBySlug,
  deleteProductBySlug,
} from '@/lib/data';
import { revalidatePath } from 'next/cache';

// =======================================================
// GET /api/products/[slug]
// =======================================================
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> } // ✅ params is Promise
) {
  const { slug } = await params; // ✅ await directly
  console.log(`[API GET]: Received request for slug: "${slug}"`);

  try {
    const product = await getProductBySlug(slug);

    if (!product) {
      console.warn(`[API GET]: Product not found for slug: "${slug}"`);
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('[API GET]: Error fetching product', error);
    return NextResponse.json(
      { message: 'Error fetching product' },
      { status: 500 }
    );
  }
}

// =======================================================
// PUT /api/products/[slug]
// =======================================================
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params; // ✅ await directly
  console.log(`[API PUT]: Attempting to find product with slug: "${slug}"`);

  const authHeader = request.headers.get('Authorization');
  const apiKey = authHeader?.split(' ')[1];
  if (apiKey !== process.env.ADMIN_API_KEY) {
    console.warn('[API PUT]: Unauthorized access attempt.');
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    console.log('[API PUT]: Update data being sent to DB:', body);

    const updatedProduct = await updateProductBySlug(slug, body);

    if (!updatedProduct) {
      console.warn(
        `[API PUT]: Product not found. DB query for slug "${slug}" returned null.`
      );
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    console.log(`[API PUT]: Successfully updated product (old slug: "${slug}")`);

    revalidatePath('/');
    revalidatePath(`/products/${slug}`);
    if (body.slug && body.slug !== slug) {
      console.log(
        `[API PUT]: Slug changed. Revalidating new path: /products/${body.slug}`
      );
      revalidatePath(`/products/${body.slug}`);
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('[API PUT]: Error updating product', error);
    return NextResponse.json(
      { message: 'Error updating product' },
      { status: 500 }
    );
  }
}

// =======================================================
// DELETE /api/products/[slug]
// =======================================================
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params; // ✅ await directly
  console.log(`[API DELETE]: Attempting to delete product with slug: "${slug}"`);

  const authHeader = request.headers.get('Authorization');
  const apiKey = authHeader?.split(' ')[1];
  if (apiKey !== process.env.ADMIN_API_KEY) {
    console.warn('[API DELETE]: Unauthorized access attempt.');
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const deletedProduct = await deleteProductBySlug(slug);

    if (!deletedProduct) {
      console.warn(
        `[API DELETE]: Product not found. DB query for slug "${slug}" returned null.`
      );
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    console.log(`[API DELETE]: Successfully deleted product with slug: "${slug}"`);

    revalidatePath('/');
    revalidatePath(`/products/${slug}`);

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('[API DELETE]: Error deleting product', error);
    return NextResponse.json(
      { message: 'Error deleting product' },
      { status: 500 }
    );
  }
}
