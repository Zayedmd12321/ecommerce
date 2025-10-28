// File: lib/data.ts

import connectToDB from './mongodb';
import ProductModel, { IProduct } from '../models/Product';
import { revalidateTag } from 'next/cache';

function serialize<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

// --- READ OPERATIONS ---

export async function getAllProducts(): Promise<IProduct[]> {
  await connectToDB();
  const products = await ProductModel.find({}).lean();

  // FIX: Cast to 'unknown' first, then to 'IProduct[]'
  // This tells TypeScript to trust us that the shape is correct
  // after serialization.
  return serialize(products as unknown as IProduct[]);
}

export async function getProductBySlug(slug: string): Promise<IProduct | null> {
  await connectToDB();
  const product = await ProductModel.findOne({ slug }).lean();

  if (!product) {
    return null;
  }
  // FIX: Apply the same 'as unknown as' cast here
  return serialize(product as unknown as IProduct);
}

// --- WRITE OPERATIONS (for our API) ---

// This type now includes the optional 'imageUrl'
type ProductInput = Omit<IProduct, '_id' | 'lastUpdated'> & {
  lastUpdated?: Date;
};

export async function createProduct(
  productData: Partial<ProductInput>
): Promise<IProduct> {
  await connectToDB();
  const newProduct = new ProductModel({
    ...productData,
    lastUpdated: new Date(),
  });
  await newProduct.save();

  // (BONUS) Trigger revalidation
  // @ts-expect-error Expected 2 arguments, but got 1. (Bug in Next.js 15 types)
  revalidateTag('products');

  // FIX: Apply the same 'as unknown as' cast here for the output
  return serialize(newProduct.toObject() as unknown as IProduct);
}

export async function updateProductBySlug(
  slug: string,
  updateData: Partial<ProductInput>
): Promise<IProduct | null> {
  await connectToDB();

  const finalUpdateData = {
    ...updateData,
    lastUpdated: new Date(),
  };
  console.log(slug);


  const updatedProduct = await ProductModel.findOneAndUpdate(
    { slug },
    finalUpdateData,
    { new: true } // This returns the *new* document
  ).lean(); // <-- Use .lean() for a plain JS object

  if (updatedProduct) {
    // (BONUS) Trigger on-demand revalidation
    // @ts-expect-error
    revalidateTag('products');
    // @ts-expect-error
    revalidateTag(`product:${slug}`); // Revalidate old slug

    // --- EDIT FIX: Revalidate new slug if it changed ---
    if (updateData.slug && updateData.slug !== slug) {
      // @ts-expect-error
      revalidateTag(`product:${updateData.slug}`);
    }
    // --------------------------------------------------

    // FIX: Apply the same 'as unknown as' cast here
    return serialize(updatedProduct as unknown as IProduct);
  }

  return null;
}

// --- NEW DELETE FUNCTION ---
// This was completely missing. This is why delete was broken.
export async function deleteProductBySlug(
  slug: string
): Promise<IProduct | null> {
  await connectToDB();

  // Find the product and delete it
  const deletedProduct = await ProductModel.findOneAndDelete({ slug }).lean();

  if (deletedProduct) {
    // (BONUS) Trigger on-demand revalidation
    // @ts-expect-errora
    revalidateTag('products');
    // @ts-expect-error
    revalidateTag(`product:${slug}`);

    // Return the deleted product data (as a plain object)
    return serialize(deletedProduct as unknown as IProduct);
  }

  // If no product was found to delete
  return null;
}
// -------------------------