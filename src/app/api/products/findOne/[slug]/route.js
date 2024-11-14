// src/app/api/cars/[slug]/route.js
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { dbConnect } from '@/utils/db';
import {Product} from '@/models/product'; // Verify this path is correct

export const GET = async (req, { params }) => {
  await dbConnect();

  try {
    
    const token = req.cookies.get('authToken:')?.value;
 
    if (!token) {
      return NextResponse.json({ message: 'Please Login First' }, { status: 401 });
    }


    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY);
    } catch (err) {
      console.error('JWT verification error:', err);
      return NextResponse.json({ error: 'Invalid or malformed token' }, { status: 401 });
    }

    if (!decoded) {
      return NextResponse.json({ error: 'You are not authorized' }, { status: 401 });
    }

    const userId = decoded.user._id;
    const { slug } = params;


    const car = await Product.findOne({ slug, userId });
    console.log(car);

    if (!car) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 });
    }

    return NextResponse.json({ car }, { status: 200 });
  } catch (error) {
    console.error('Error fetching car:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
};
