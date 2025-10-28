// File: app/api/products/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts, createProduct } from '@/lib/data';
import { IProduct } from '@/models/Product';
import { revalidatePath } from 'next/cache';

// GET /api/products
export async function GET(request: NextRequest) {
  // --- THIS IS THE LOGIN FIX ---
  // ADMIN Key Auth Check
  const authHeader = request.headers.get('Authorization');
  const apiKey = authHeader?.split(' ')[1];

  if (apiKey !== process.env.ADMIN_API_KEY) {
    // If key is wrong, deny access. This makes the login check work.
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  // -----------------------------

  try {
    const products = await getAllProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Error fetching products' },
      { status: 500 }
    );
  }
}

// POST /api/products
export async function POST(request: NextRequest) {
  // ADMIN Key Auth Check
  const authHeader = request.headers.get('Authorization');
  const apiKey = authHeader?.split(' ')[1];
  if (apiKey !== process.env.ADMIN_API_KEY) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    // --- IMAGE URL FIX ---
    // Added imageUrl to the required fields check
    if (
      !body.name ||
      !body.slug ||
      !body.price ||
      body.inventory === undefined || // Check for 0
      !body.imageUrl
    ) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }
    // ---------------------

    const newProduct = await createProduct(body);

    revalidatePath('/'); // Rebuild the Home Page
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    console.error(error);
    if (error.code === 11000) {
      return NextResponse.json(
        { message: 'Slug already exists' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { message: 'Error creating product' },
      { status: 500 }
    );
  }
}