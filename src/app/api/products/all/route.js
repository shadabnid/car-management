// src/app/api/products/route.js
import { Product } from '@/models/product';
import { dbConnect } from '@/utils/db';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export const GET = async (req) => {
  try {
    await dbConnect();
    
    const token = req.cookies.get("authToken:")?.value || '';

    if (!token) {
      return NextResponse.json({ message: "Please Login First" }, { status: 401 });
    }

    const decoded = await jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded) {
      return NextResponse.json({ message: "You are not authorized" }, { status: 401 });
    }

    const userId = decoded.user._id;


    const searchQuery = req.nextUrl.searchParams.get('query') || '';
    const filter = {
      userId,
      ...(searchQuery && {
        $or: [
          { title: { $regex: searchQuery, $options: 'i' } },
          { description: { $regex: searchQuery, $options: 'i' } },
          { tags: { $regex: searchQuery, $options: 'i' } },
        ],
      }),
    };

    const products = await Product.find(filter);
    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
};
