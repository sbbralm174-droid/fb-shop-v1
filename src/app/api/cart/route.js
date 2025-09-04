import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import { Cart } from '@/models/Cart';
import mongoose from 'mongoose';

export async function POST(request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { userId, items } = body;

    console.log("POST /api/cart: Received request for userId:", userId);
    console.log("POST /api/cart: Items received:", items);

    if (!userId) {
      console.error("POST /api/cart: User ID is missing.");
      return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
    }

    const cart = await Cart.findOneAndUpdate(
      { user: userId },
      { items: items, updatedAt: Date.now() },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    
    console.log("POST /api/cart: findOneAndUpdate successful. Cart data:", cart);
    
    return NextResponse.json({ success: true, message: 'Cart saved successfully', data: cart }, { status: 200 });

  } catch (error) {
    console.error("POST /api/cart Error:", error.message);
    if (error instanceof mongoose.Error) {
      console.error("Mongoose specific error details:", error.stack);
    }
    return NextResponse.json({ success: false, error: 'Failed to save cart' }, { status: 500 });
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  console.log("GET /api/cart: Received request for userId:", userId);

  if (!userId) {
    console.error("GET /api/cart: User ID is missing.");
    return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const cart = await Cart.findOne({ user: userId }).lean();
    
    console.log("GET /api/cart: findOne query result:", cart);
    
    if (!cart) {
      console.log("GET /api/cart: No cart found for userId:", userId);
      return NextResponse.json({ success: true, data: { items: [] } }, { status: 200 });
    }

    console.log("GET /api/cart: Cart found for userId:", userId);
    return NextResponse.json({ success: true, data: cart }, { status: 200 });
  } catch (error) {
    console.error("GET /api/cart Error:", error.message);
    if (error instanceof mongoose.Error) {
      console.error("Mongoose specific error details:", error.stack);
    }
    return NextResponse.json({ success: false, error: 'Failed to fetch cart' }, { status: 500 });
  }
}