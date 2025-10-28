// File: models/Product.ts

import mongoose, { Document, Schema, Model } from 'mongoose';

// 1. Define the TypeScript interface
export interface IProduct {
  _id: string; // Mongoose adds _id by default
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  inventory: number;
  lastUpdated: Date;
  imageUrl?: string; // <-- ADDED
}

// 2. Define the Mongoose Document interface
export interface IProductDocument extends Omit<IProduct, '_id'>, Document {}

// 3. Create the Mongoose Schema
const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  inventory: { type: Number, required: true, default: 0 },
  lastUpdated: { type: Date, default: Date.now },
  imageUrl: { type: String, required: false }, // <-- ADDED
});

// 4. Create and export the Mongoose model
const ProductModel: Model<IProductDocument> =
  mongoose.models.Product ||
  mongoose.model<IProductDocument>('Product', ProductSchema);

export default ProductModel;