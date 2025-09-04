// src/app/api/users/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import { User } from '@/models/User';

export async function POST(request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { uid, name, email, photoUrl } = body;

    // Check if user already exists
    let user = await User.findOne({ uid });

    if (user) {
      // User exists, update their information
      user.name = name;
      user.email = email;
      user.photoUrl = photoUrl;
      await user.save();
      return NextResponse.json({ success: true, message: 'User updated successfully', data: user }, { status: 200 });
    } else {
      // User does not exist, create a new one
      user = await User.create({ uid, name, email, photoUrl });
      return NextResponse.json({ success: true, message: 'User created successfully', data: user }, { status: 201 });
    }

  } catch (error) {
    console.error("POST User Error:", error);
    return NextResponse.json({ success: false, error: 'Failed to create or update user' }, { status: 500 });
  }
}