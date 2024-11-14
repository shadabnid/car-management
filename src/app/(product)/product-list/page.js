"use client"
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import withAuth from '@/app/(product)/_components/WithAuth';
import Image from 'next/image';

const CarList = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/products/all?query=${searchTerm}`, {
          method: 'GET',
          
          credentials: "include"
        });
        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchTerm]);

  return (
    <div className='h-screen flex flex-col flex-wrap items-center px-10 gap-4'>

      <div className='mt-5'>
        
          <input
            type='text'
            placeholder='Search car'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='border border-inputBorder px-2 py-1 rounded-lg w-full outline-none'
          />
        

      </div>
      {loading ? (
        <div>Loading products...</div>
      ) : (
        <ul className='w-full flex flex-wrap gap-4'>
          {products.length == 0 && (
            <div className='text-center text-2xl w-full'>No Items </div>
          )}
          {products.map((item, index) => (
            <Link href={`/product-list/${item.slug}`} key={index}>
              <li className='border border-inputBorder flex flex-col w-[18rem] h-[14rem] rounded-lg'>
                <Image src={item.thumbnail_image || '/placeholder.png'} alt={item.title} className='w-[18rem] h-[10rem] object-cover rounded-t-lg' />
                <span className='text-[1.5rem] text-textColor text-center mt-1'>{item.title}</span>
              </li>
            </Link>
          ))}
        </ul>
      )}
    </div>
  );
};

export default withAuth(CarList);
