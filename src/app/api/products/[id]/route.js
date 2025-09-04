// src/app/api/products/[id]/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import { Product } from '@/models/Product';
import mongoose from 'mongoose';

// একটি পণ্য দেখা (GET)
export async function GET(request, { params }) {
  // Use `await` to correctly handle the async `params` object
  const { id } = await params;
  console.log(`Attempting to fetch product with ID: ${id}`);

  // Check if the ID is a valid MongoDB ObjectId
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    console.error(`Invalid product ID received: ${id}`);
    return NextResponse.json({ success: false, error: 'Invalid product ID' }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const product = await Product.findById(id).lean();

    if (!product) {
      console.log(`Product not found for ID: ${id}`);
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }
    
    console.log(`Successfully fetched product: ${product.name}`);
    return NextResponse.json({ success: true, data: product }, { status: 200 });
  } catch (error) {
    console.error("GET Single Product Error:", error);
    return NextResponse.json({ success: false, error: 'Failed to fetch product' }, { status: 500 });
  }
}

// একটি পণ্য আপডেট করা (PUT)
export async function PUT(request, { params }) {
  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ success: false, error: 'Invalid product ID' }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const body = await request.json();
    const updatedProduct = await Product.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    
    if (!updatedProduct) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: updatedProduct }, { status: 200 });
  } catch (error) {
    console.error("PUT Product Error:", error);
    if (error instanceof mongoose.Error.ValidationError) {
      const errors = Object.keys(error.errors).map(key => error.errors[key].message);
      return NextResponse.json({ success: false, error: 'Validation failed', details: errors }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Failed to update product' }, { status: 500 });
  }
}

// একটি পণ্য মুছে ফেলা (DELETE)
export async function DELETE(request, { params }) {
  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ success: false, error: 'Invalid product ID' }, { status: 400 });
  }
  
  try {
    await connectToDatabase();
    const deletedProduct = await Product.findByIdAndDelete(id);
    
    if (!deletedProduct) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: 'Product deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error("DELETE Product Error:", error);
    return NextResponse.json({ success: false, error: 'Failed to delete product' }, { status: 500 });
  }
}