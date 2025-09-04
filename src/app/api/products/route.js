// src/app/api/products/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import { Product } from '@/models/Product';
import mongoose from 'mongoose';

// সকল পণ্য দেখা (GET)
export async function GET() {
  try {
    await connectToDatabase();
    const products = await Product.find({});
    return NextResponse.json({ success: true, data: products }, { status: 200 });
  } catch (error) {
    console.error("GET Products Error:", error);
    return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
  }
}

// নতুন পণ্য তৈরি (POST)
export async function POST(request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    
    // Mongoose validation will automatically check the body against the schema
    const newProduct = await Product.create(body);
    
    return NextResponse.json({ success: true, data: newProduct }, { status: 201 });
  } catch (error) {
    console.error("POST Product Error:", error);

    // Provide more specific error messages for validation errors
    if (error instanceof mongoose.Error.ValidationError) {
      const errors = Object.keys(error.errors).map(key => error.errors[key].message);
      return NextResponse.json({ success: false, error: 'Validation failed', details: errors }, { status: 400 });
    }

    return NextResponse.json({ success: false, error: 'Failed to create product' }, { status: 500 });
  }
}