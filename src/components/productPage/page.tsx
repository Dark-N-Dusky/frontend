'use client';

import { useAuth } from '@/app/context/authContext';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface ProductPageProps {
  name: string;
  pid: string;
  media: string[];
  description: string;
  price: number;
  offer_price: number;
}

export default function ProductPage({
  name,
  pid,
  media,
  description,
  price,
  offer_price,
}: ProductPageProps) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const api = process.env.NEXT_PUBLIC_API;
  const [imgSrc, setImgSrc] = useState(media[0]);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = async () => {
    if (!authLoading && !user?.token) {
      router.push('/login');
    } else {
      try {
        const data = { product_id: pid, quantity: '1' };
        const res = await axios.post(`${api}/cart`, data, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        if (res.status === 201) {
          setAddedToCart(true);
        } else {
          console.error('Error adding to cart');
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleImgError = () => {
    setImgSrc(
      'https://via.assets.so/img.jpg?w=500&h=500&tc=white&bg=grey&t=Image'
    );
  };

  return (
    <div className="flex flex-col w-full md:w-1/5 bg-black text-white m-2 rounded-xl overflow-hidden shadow md:hover:scale-105 transition-all">
      <Image
        unoptimized
        src={imgSrc}
        alt=""
        height={500}
        width={500}
        className="w-full cursor-pointer"
        onError={handleImgError}
        onClick={() => router.push(`/product/${pid}`)}
      />
      <div className="p-5">
        <p className="text-2xl">&#8377; {offer_price}</p>
        <p>
          <span className="line-through text-gray-400">&#8377; {price} </span>
          <span className="ms-2 text-lg bg-green-800 px-1 rounded">
            {(((price - offer_price) / price) * 100).toFixed(0) + '%'}
          </span>
        </p>
        <p
          className="text-xl cursor-pointer"
          onClick={() => router.push(`/product/${pid}`)}
        >
          {name}
        </p>
        <p>{description.match(/(.*?[.!?])\s/)?.[1] || description}</p>
        {user?.role === 'admin' ? (
          <Link
            href={`/adminDashboard/product?pid=${pid}`}
            className="border-blue-400 block text-center border w-full p-3 my-2 mt-8 rounded-md hover:bg-blue-400 hover:text-black"
          >
            Edit Product
          </Link>
        ) : (
          <>
            {!addedToCart && (
              <button
                className="border-orange-400 border w-full p-3 my-2 mt-8 rounded-md hover:bg-orange-400 hover:text-black"
                onClick={handleAddToCart}
                id={pid}
              >
                Add to Cart
              </button>
            )}
            {addedToCart && (
              <Link
                href="/cart"
                className="border-green-400 block text-center border w-full p-3 my-2 mt-8 rounded-md hover:bg-green-400 hover:text-black"
              >
                View Cart
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  );
}
