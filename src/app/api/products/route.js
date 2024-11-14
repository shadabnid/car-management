import { NextResponse } from 'next/server';
import { Product } from '@/models/product';
import cloudinary from '@/utils/cloudinary';
import { dbConnect } from '@/utils/db';
import jwt from 'jsonwebtoken';
import { slugify } from '@/utils/slug';

export const POST = async (req) => {
  await dbConnect();
  try {

    const token = req.cookies.get("authToken:")?.value || '';

    if (!token) {
      return NextResponse.json({ message: "Please Login First" }, { status: 401 });
    }

    const decoded = await jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded) {
      return NextResponse.json({ message: "You are not authorized" }, { status: 401 });
    }
    

    const userId = decoded.user._id; 
    


    const form = await req.formData();
    const title = form.get('title');
    const description = form.get('description');
    const tags = form.get('tags')?.split(',') || [];
    const images = form.getAll('images'); 

    // Generate slug from title
    const slug = slugify(title);


    const uploadedImages = await Promise.all(
      images.map(async (image) => {
        const buffer = await image.arrayBuffer();
        const result = await cloudinary.uploader.upload(
          `data:image/jpeg;base64,${Buffer.from(buffer).toString('base64')}`,
          { folder: 'car-management' }
        );
        return result.secure_url;
      })
    );

    const thumbnailImage = uploadedImages[0]; 
    const imageUrls = uploadedImages.slice(1);


    const product = new Product({
      userId,             
      slug,
      title,
      description,
      tags,
      thumbnail_image: thumbnailImage,
      images: imageUrls,
    });

    await product.save();
    return NextResponse.json({ message: 'Product created successfully', product }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};


export const config = {
  api: {
    bodyParser: false,
  },
};




