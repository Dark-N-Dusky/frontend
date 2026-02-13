'use client';

import { useAuth } from '../context/authContext';
import ReturnItem from '@/components/returnItem';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface ReturnItems {
  id: number;
  uid: string;
  orderId: number;
  productItemId: string;
  status: string;
  trackingStatus: string;
}

export default function Cart() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState<ReturnItems[]>([]);
  const api = process.env.NEXT_PUBLIC_API;

  useEffect(() => {
    if (!authLoading && !user?.token) router.push('/login');
  }, [user, router]);

  useEffect(() => {
    const fetchReturnItems = async () => {
      if (!user?.token) return;
      try {
        const res = await axios.get(`${api}/return`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setData(res.data);
      } catch (error: Error | any) {
        if (error.status !== 404)
          console.error('Error fetching return items:', error);
      }
    };
    fetchReturnItems();
  }, [user, axios, api]);

  const returnItems: ReturnItems[] | undefined = data;

  return (
    <div className="bg-neutral-800 flex flex-col-reverse md:flex-row w-full content-stretch p-4">
      <div className=" bg-black md:py-10 py-6 md:px-3 px-2 rounded-2xl md:m-4 w-full my-4">
        <p className="text-4xl mb-8 text-center text-white">Returns</p>
        <hr className="mb-5" />

        {returnItems && returnItems.length > 0 ? (
          returnItems.map((item, index) => (
            <ReturnItem
              key={index}
              productId={item.productItemId}
              orderId={item.orderId}
              status={item.status}
              trackingStatus={item.trackingStatus}
            />
          ))
        ) : (
          <p className="text-white text-xl text-center mt-8">
            No returns found.
          </p>
        )}
      </div>
    </div>
  );
}
