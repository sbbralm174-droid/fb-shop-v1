import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import { Cart } from '@/models/Cart';
import mongoose from 'mongoose';

// POST => পুরো cart overwrite/save করার জন্য
export async function POST(request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { userId, items } = body;

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
    }

    const cart = await Cart.findOneAndUpdate(
      { user: userId },
      { items, updatedAt: Date.now() },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({ success: true, message: 'Cart saved successfully', data: cart }, { status: 200 });
  } catch (error) {
    console.error("POST /api/cart Error:", error);
    return NextResponse.json({ success: false, error: 'Failed to save cart' }, { status: 500 });
  }
}

// PUT => একক item add/update করার জন্য
export async function PUT(request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { userId, item } = body;

    if (!userId || !item) {
      return NextResponse.json({ success: false, error: 'User ID and item are required' }, { status: 400 });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // নতুন cart বানানো হবে
      cart = new Cart({
        user: userId,
        items: [item],
      });
    } else {
      // check করা হবে একই product/color/size আগে আছে কিনা
      const existingItem = cart.items.find(
        (i) =>
          i.productId.toString() === item.productId.toString() &&
          i.color?.name === item.color?.name &&
          i.size?.size === item.size?.size
      );

      if (existingItem) {
        existingItem.quantity = item.quantity; // শুধু quantity update
      } else {
        cart.items.push(item); // নতুন item push
      }
    }

    await cart.save();

    return NextResponse.json({ success: true, message: 'Item updated successfully', data: cart }, { status: 200 });
  } catch (error) {
    console.error("PUT /api/cart Error:", error);
    return NextResponse.json({ success: false, error: 'Failed to update cart' }, { status: 500 });
  }
}

// GET => user এর cart read করার জন্য
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const cart = await Cart.findOne({ user: userId }).lean();

    if (!cart) {
      return NextResponse.json({ success: true, data: { items: [] } }, { status: 200 });
    }

    return NextResponse.json({ success: true, data: cart }, { status: 200 });
  } catch (error) {
    console.error("GET /api/cart Error:", error);
    return NextResponse.json({ success: false, error: 'Failed to fetch cart' }, { status: 500 });
  }
}
