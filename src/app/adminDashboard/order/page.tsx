'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/authContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function adminOrdersDashboard() {
  const [selectedStatus, setSelectedStatus] = useState('All');
  const { user, loading } = useAuth();
  const [orderList, setOrderList] = useState<
    {
      id: number;
      status: string;
      tracking_status: string;
      createdAt: string;
      sizeSelected: string;
    }[]
  >([]);
  const api = process.env.NEXT_PUBLIC_API;
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${api}/admin/orders`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        setOrderList(res.data[0]);
      } catch (err) {
        console.error(err);
      }
    };

    if (!loading && user?.token && user?.role === 'admin') {
      fetchOrders();
    } else {
      if (!loading && !user?.token) {
        router.push('/login');
      }
    }
  }, [loading, user?.token, user?.role, api, router]);

  const filteredOrders =
    selectedStatus === 'All'
      ? orderList
      : orderList.filter((order) => order.status === selectedStatus);

  const statuses = ['All', 'pending', 'confirmed', 'delivered', 'canceled'];

  const stats = {
    totalOrders: orderList.length,
    delivered: orderList.filter((o) => o.status === 'delivered').length,
  };

  return (
    <div className="p-6 bg-black text-white">
      <h1 className="text-2xl font-bold mb-4">Orders Management</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="border rounded p-4">
          <h2 className="text-sm text-gray-500">Total Orders</h2>
          <p className="text-xl font-semibold">{stats.totalOrders}</p>
        </div>
        <div className="border rounded p-4">
          <h2 className="text-sm text-gray-500">Delivered</h2>
          <p className="text-xl font-semibold">{stats.delivered}</p>
        </div>
      </div>

      <div className="mb-4">
        <label className="mr-2 font-semibold">Filter by Status:</label>
        <select
          className="border rounded px-2 py-1 bg-black"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <table className="w-full table-fixed border border-gray-400 overflow-x-scroll  ">
        <thead className="bg-gray-800">
          <tr>
            <th className="border px-4 py-2 text-left">Order ID</th>
            <th className="border px-4 py-2 text-left">Status</th>
            <th className="border px-4 py-2 text-left">Tracking Status</th>
            <th className="border px-4 py-2 text-left">Date</th>
            <th className="border px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order, index) => (
            <tr key={index} className="hover:bg-neutral-700">
              <td className="border px-4 py-2">
                {order.id ?? 'NA'}
                <span className="ml-2 px-2 py-1 bg-gray-200 text-xs rounded-full">
                  Size: {order.sizeSelected}
                </span>
              </td>
              <td className="border px-4 py-2">{order.status}</td>
              <td className="border px-4 py-2">{order.tracking_status}</td>
              <td className="border px-4 py-2">
                {order.createdAt.substring(0, 10)}
              </td>
              <td className="border px-4 py-2">
                <Link
                  className="text-blue-600 hover:underline"
                  href={`/adminDashboard/order/${order.id}`}
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
