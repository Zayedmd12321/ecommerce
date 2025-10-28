// File: src/scripts/seed.ts
// This version uses CommonJS ('require') to avoid module conflicts.

// Use 'require' syntax
const mongoose = require('mongoose');
// We use .default because our Product model is an ES 'export default'
const ProductModel = require('../models/Product').default;
const { sampleProducts } = require('../data/sample-data');
const dotenv = require('dotenv');

// Load environment variables from .env.local in the ROOT folder
// The path is relative to where you RUN the script (the root), not the file location.
dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

async function seedDatabase() {
  console.log('Connecting to database...');
  try {
    // Ensure mongoose.connect is awaited
    await mongoose.connect(MONGODB_URI);
    console.log('Database connected successfully.');

    // Clear existing data
    console.log('Clearing existing products...');
    await ProductModel.deleteMany({});
    console.log('Existing products cleared.');

    // Insert new data
    console.log('Inserting sample products...');
    await ProductModel.insertMany(sampleProducts);
    console.log(
      `Successfully inserted ${sampleProducts.length} sample products.`
    );
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Disconnect from the database
    await mongoose.disconnect();
    console.log('Database connection closed.');
  }
}

// Run the seed function
seedDatabase();