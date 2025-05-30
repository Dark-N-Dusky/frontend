'use client';

import { useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ShoppingCartTwoTone,
  KeyboardReturnTwoTone,
  Inventory2,
} from '@mui/icons-material';

export default function adminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const btnClass =
    'p-3 border rounded-md hover:bg-white hover:text-black m-3 flex flex-col w-full text-center justify-center items-center';

  useEffect(() => {
    if (!loading && !user?.token && user?.role != 'admin') {
      router.push('/login');
    }
  }, [loading, user?.token, user?.role]);

  return (
    <div className="p-6 bg-black text-white">
      <h1 className="text-2xl text-center my-4 mx-2">
        Welcome to Admin Dashboard
      </h1>
      <div className="flex flex-col md:flex-row w-full">
        <Link href="/adminDashboard/order" className={btnClass}>
          <ShoppingCartTwoTone sx={{ fontSize: 50 }} />
          View Orders
        </Link>
        <Link href="/adminDashboard/return" className={btnClass}>
          <KeyboardReturnTwoTone sx={{ fontSize: 50 }} />
          View Returns
        </Link>
        <Link href="/adminDashboard/product" className={btnClass}>
          <Inventory2 sx={{ fontSize: 50 }} />
          Create Product
        </Link>
      </div>
    </div>
  );
}
