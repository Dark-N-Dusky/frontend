'use client';

import { useQuery } from '@apollo/client';
import Image from 'next/image';
import { GET_PRODUCT_DETAILS } from '../../queries/getCartItems';
import { useEffect, useState } from 'react';
import client from '@/lib/apolloClient';

interface CartItemProps {
  productId: string;
  orderId: number;
  status: string;
  trackingStatus: string;
}

export default function ReturnItem({
  productId,
  orderId,
  status,
  trackingStatus,
}: CartItemProps) {
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

  return (
    <div className="flex flex-col md:flex-row md:mx-10 mx-5 text-white md:mb-2 mb-5 bg-black border border-white hover:bg-gray-900 rounded-lg overflow-hidden">
      <Image
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
          <p>OrderID: {orderId}</p>
        </div>
        <div className="md:pt-6 py-2 flex flex-col md:flex-row w-full justify-around">
          <p className="p-2 m-2 text-center border rounded-md">
            Status: {status.substring(0, 1).toUpperCase() + status.substring(1)}
          </p>
          <p className="p-2 m-2 text-center border rounded-md">
            Tracking Status:{' '}
            {trackingStatus.substring(0, 1).toUpperCase() +
              trackingStatus.substring(1)}
          </p>
        </div>
      </div>
    </div>
  );
}
