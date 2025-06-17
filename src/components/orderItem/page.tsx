'use client';

import Image from 'next/image';
import { GET_PRODUCT_DETAILS } from '../../queries/getCartItems';
import { useEffect, useState } from 'react';
import client from '@/lib/apolloClient';
import axios from 'axios';
import { useAuth } from '@/app/context/authContext';
import { useRouter } from 'next/navigation';

interface OrderProps {
  id: number;
  createdAt: string;
  status: string;
  trackingStatus: string;
}

interface OrderItems {
  id: number;
  quantity: number;
  product_id: string;
  order_id: number;
}

interface ProductDetails {
  id: string;
  description: string;
  media: string[];
  name: string;
  price: number;
  quantity: number;
}

export default function Order({
  id,
  createdAt,
  status,
  trackingStatus,
}: OrderProps) {
  const api = process.env.NEXT_PUBLIC_API;
  const { user } = useAuth();
  const router = useRouter();
  const [orderItems, setOrderItems] = useState<OrderItems[]>([]);
  const [products, setProducts] = useState<ProductDetails[]>([]);
  const [fallbackImgSrcs, setFallbackImgSrcs] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${api}/order/${id}`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        console.log('Order:', res.data);
        setOrderItems(res.data.orderItem);
      } catch (error) {
        console.error('Error fetching order items:', error);
      }
    };
    fetchProducts();
  }, [api, id, user?.token]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const productDetailPromises = orderItems.map(async (item) => {
          const { data } = await client.query({
            query: GET_PRODUCT_DETAILS,
            variables: { pid: item.product_id },
            fetchPolicy: 'no-cache',
          });
          return {
            ...data.product,
            id: item.product_id,
            quantity: item.quantity,
          };
        });

        const detailedProducts = await Promise.all(productDetailPromises);
        setProducts(detailedProducts);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    if (orderItems.length > 0) {
      fetchProductDetails();
    }
  }, [orderItems]);

  const isReturnEligible = () => {
    const orderDate = new Date(createdAt);
    const today = new Date();
    const diffInTime = today.getTime() - orderDate.getTime();
    const diffInDays = diffInTime / (1000 * 3600 * 24);
    return (
      status.toLowerCase() === 'delivered' &&
      trackingStatus.toLowerCase() === 'delivered' &&
      diffInDays <= 15
    );
  };

  const handleReturn = async (productId: string) => {
    const data = { orderId: id.toString(), productItemId: productId };
    try {
      const res = await axios.post(`${api}/return`, data, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      if (res.status === 201) {
        router.push('/return');
      }
    } catch (err) {
      console.error('Error filling return: ', err);
    }
  };

  return (
    <div className="border rounded-lg p-2 md:mx-6 mx-5 md:my-2 my-5 text-white bg-gray-950">
      <div className="flex flex-col md:flex-row justify-between">
        <p className="px-4 py-2 font-semibold">Order ID: {id}</p>
        <p className="px-4 py-2 font-semibold">
          Order Date: {createdAt.substring(0, 10)}
        </p>
      </div>
      {products.map((product, index) => (
        <div
          key={index}
          className="flex flex-col md:flex-row text-white mx-2 my-4 bg-black border border-white hover:bg-gray-900 rounded-lg overflow-hidden"
        >
          <Image
            src={fallbackImgSrcs[product.name] || product.media[0] || ''}
            alt={product.name || 'Product Image'}
            width={500}
            height={500}
            onError={() =>
              setFallbackImgSrcs((prev) => ({
                ...prev,
                [product.name]:
                  'https://via.assets.so/img.jpg?w=500&h=500&tc=white&bg=grey&t=Image',
              }))
            }
            className="md:w-1/6 h-auto w-full"
          />
          <div className="p-4 w-full">
            <p className="text-2xl font-semibold">{product.name}</p>
            <p className="p-2">
              {product.description.match(/(.*?[.!?])\s/)?.[1] ||
                product.description}
            </p>
            <div className="flex flex-col justify-around w-full md:flex-row mt-4">
              <p>Price: &#8377;{product.price}</p>
              <p>Quantity: {product.quantity}</p>
            </div>
            {isReturnEligible() && (
              <button
                onClick={() => handleReturn(product.id)}
                className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
              >
                Return
              </button>
            )}
          </div>
        </div>
      ))}

      <div className="py-2 flex flex-col md:flex-row w-full justify-around">
        <p className="p-2 m-1 text-center border rounded-md">
          Status: {status.substring(0, 1).toUpperCase() + status.substring(1)}
        </p>
        <p className="p-2 m-1 text-center border rounded-md">
          Tracking Status:{' '}
          {trackingStatus.substring(0, 1).toUpperCase() +
            trackingStatus.substring(1)}
        </p>
      </div>
    </div>
  );
}
