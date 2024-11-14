// src/app/api/products/[product_id]/edit/route.js
import { NextResponse } from 'next/server';
import { Product } from '@/models/product';
import { dbConnect } from '@/utils/db';
import jwt from 'jsonwebtoken';

export const PUT = async (req) => {
  await dbConnect();
  const token = req.cookies.get("authToken:")?.value || '';

  if (!token) {
    return NextResponse.json({ message: "Please Login First" }, { status: 401 });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.SECRET_KEY);
  } catch (error) {
    return NextResponse.json({ message: "You are not authorized" }, { status: 401 });
  }

  const userId = decoded.user._id;

  
  const { title, description,productId } = await req.json(); 

  if (!title || !description) {
    return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      productId, 
      { title, description },
      { new: true }
    );

    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product updated successfully", product: updatedProduct }, { status: 200 });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "An error occurred while updating the product" }, { status: 500 });
  }
};
