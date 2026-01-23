'use client';

import { useQuery } from '@apollo/client';
import Image from 'next/image';
import { GET_PRODUCT_DETAILS } from '../../queries/getCartItems';
import { useEffect, useState } from 'react';
import client from '@/lib/apolloClient';
import axios from 'axios';
import { useAuth } from '@/app/context/authContext';
import { useRouter } from 'next/navigation';

interface CartItemProps {
  productId: string;
  quantity: number;
}

export default function CartItem({ productId, quantity }: CartItemProps) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { data, loading, error } = useQuery(GET_PRODUCT_DETAILS, {
    client,
    variables: { pid: productId },
    skip: !productId,
    fetchPolicy: 'no-cache',
  });

  const [imgSrc, setImgSrc] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (error) {
      console.error('Error fetching product details:', error);
    }
  }, [error]);

  useEffect(() => {
    if (data?.product?.media) {
      setImgSrc(data.product.media[0]);
    }
  }, [data]);

  if (loading) return <p>Loading product details...</p>;
  if (error) return <p>Error loading product details.</p>;

  const { name, price, description } = data.product;

  const handleImgError = () =>
    setImgSrc(
      'https://via.assets.so/img.jpg?w=500&h=500&tc=white&bg=grey&t=Image'
    );

  const api = process.env.NEXT_PUBLIC_API || 'localhost';

  const handleRemoveItem = async () => {
    if (!authLoading && !user?.token) {
      router.push('/login');
    } else {
      try {
        const res = await axios.delete(`${api}/cart/${productId}`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        if (res.status === 200) {
          window.location.reload();
        } else {
          console.error('Error removing item from cart');
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:mx-10 mx-5 text-white md:mb-2 mb-5 bg-black border border-white hover:bg-gray-900 rounded-lg overflow-hidden">
      <Image
        unoptimized
        src={imgSrc || ''}
        alt={name || 'Product Image'}
        width={500}
        height={500}
        onError={handleImgError}
        className="md:w-1/4 w-full"
      />
      <div className="p-4 w-full">
        <p className="text-2xl font-semibold">{name}</p>
        <p className="p-2">
          {description.match(/(.*?[.!?])\s/)?.[1] || description}
        </p>
        <div className="flex flex-col justify-around w-full md:flex-row my-4">
          <p>Price: &#8377;{price}</p>
          <p className="bg-orange-600 px-1 w-max">
            Amount: &#8377;{price * quantity}
          </p>
          <p>Quantity: {quantity}</p>
        </div>
        <div className="md:pt-6 py-2">
          <button
            onClick={handleRemoveItem}
            className="border rounded-md border-red-600 py-2 px-4 hover:bg-red-600"
          >
            Remove item
          </button>
        </div>
      </div>
    </div>
  );
}
