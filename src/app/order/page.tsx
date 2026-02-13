'use client';

import { useAuth } from '../context/authContext';
import OrderItem from '@/components/orderItem';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface Orders {
  id: number;
  uid: string;
  status: string;
  tracking_status: string;
  createdAt: string;
}

export default function Cart() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState<Orders[]>([]);
  const api = process.env.NEXT_PUBLIC_API;

  useEffect(() => {
    if (!authLoading && !user?.token) router.push('/login');
  }, [user, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.token) return;
      try {
        const res = await axios.get(`${api}/order`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setData(res.data[0]);
      } catch (error: Error | any) {
        console.error('Error fetching order items:', error);
      }
    };
    fetchOrders();
  }, [user, axios, api]);

  const orders: Orders[] | undefined = data;

  return (
    <div className="bg-neutral-800 flex flex-col-reverse md:flex-row w-full content-stretch p-4">
      <div className=" bg-black md:py-10 py-6 md:px-3 px-2 rounded-2xl md:m-4 w-full my-4">
        <p className="text-4xl mb-8 text-center text-white">Orders</p>
        <hr className="mb-5" />

        {orders && orders.length > 0 ? (
          orders.map((item, index) => (
            <OrderItem
              key={index}
              id={item.id}
              createdAt={item.createdAt}
              status={item.status}
              trackingStatus={item.tracking_status}
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
