import { NextResponse } from 'next/server';
import { Product } from '@/models/product';
import cloudinary from '@/utils/cloudinary';
import { dbConnect } from '@/utils/db';
import jwt from 'jsonwebtoken';

export const DELETE = async (req, context) => {
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

  const { product_id: productId } = await context.params;

  if (!productId) {
    return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
  }

  try {

    const product = await Product.findById({_id:productId});
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }


    if (product.userId.toString() !== userId.toString()) {
      return NextResponse.json({ error: 'You are not authorized to delete this product' }, { status: 403 });
    }

 
    const allImages = [product.thumbnail_image, ...product.images];
    const publicIds = allImages.map((url) => {
      const parts = url.split('/');
      const publicIdWithExtension = parts[parts.length - 1];
      const publicId = publicIdWithExtension.split('.')[0]; 
      return `car-management/${publicId}`;
    });


    await Promise.all(
      publicIds.map((publicId) =>
        cloudinary.uploader.destroy(publicId, (error, result) => {
          if (error) throw new Error(`Failed to delete image: ${error.message}`);
          return result;
        })
      )
    );
    console.log(productId)


    await Product.findByIdAndDelete({_id:productId});

    return NextResponse.json({ message: 'Product and images deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export const config = {
  api: {
    bodyParser: false,
  },
};
