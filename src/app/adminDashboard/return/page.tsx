'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/authContext';
import { useRouter } from 'next/navigation';
import client from '@/lib/apolloClient';
import { GET_RETURN_DETAILS } from '@/queries/getReturnDetails';

type ReturnList = {
  id: number;
  uid: string;
  orderId: number;
  productItemId: string;
  status: string;
  trackingStatus: string;
};

export default function AdminDashboard() {
  const [selectedStatus, setSelectedStatus] = useState('All');
  const { user, loading } = useAuth();
  const [returnList, setReturnList] = useState<ReturnList[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState<ReturnList | null>(null);
  const [returnDetails, setReturnDetails] = useState<{
    customerName: string;
    itemName: string;
  } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editStatus, setEditStatus] = useState('');
  const [editTrackingStatus, setEditTrackingStatus] = useState('');

  const api = process.env.NEXT_PUBLIC_API;
  const router = useRouter();

  useEffect(() => {
    const fetchReturns = async () => {
      try {
        const res = await axios.get(`${api}/admin/returns`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        setReturnList(res.data[0]);
      } catch (err) {
        console.error(err);
      }
    };

    if (!loading && user?.token && user?.role === 'admin') {
      fetchReturns();
    } else {
      if (!loading && !user?.token) {
        router.push('/login');
      }
    }
  }, [loading, user?.token, user?.role, api, router]);

  const fetchReturnDetails = async (returnItem: ReturnList) => {
    try {
      const { data } = await client.query({
        query: GET_RETURN_DETAILS,
        variables: { pid: returnItem.productItemId, uid: returnItem.uid },
        fetchPolicy: 'no-cache',
      });

      setReturnDetails({
        customerName: data.user.name,
        itemName: data.product.name,
      });

      setSelectedReturn(returnItem);
      setEditStatus(returnItem.status);
      setEditTrackingStatus(returnItem.trackingStatus);
      setShowModal(true);
    } catch (err) {
      console.error('Failed to fetch return details:', err);
    }
  };

  const updateReturn = async () => {
    if (!selectedReturn) return;
    try {
      await axios.patch(
        `${api}/admin/returns/${selectedReturn.id}`,
        {
          status: editStatus,
          trackingStatus: editTrackingStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      setReturnList((prev) =>
        prev.map((r) =>
          r.id === selectedReturn.id
            ? { ...r, status: editStatus, trackingStatus: editTrackingStatus }
            : r
        )
      );

      setIsEditing(false);
      window.location.reload();
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const filteredReturns =
    selectedStatus === 'All'
      ? returnList
      : returnList.filter((order) => order.status === selectedStatus);

  const statuses = ['All', 'pending', 'accepted', 'rejected'];
  const trackingOptions = [
    'pending',
    'picked',
    'processing',
    'declined',
    'refunded',
  ];

  const stats = {
    totalReturns: returnList.length,
    accepted: returnList.filter((o) => o.status === 'accepted').length,
  };

  return (
    <div className="p-6 bg-black text-white">
      <h1 className="text-2xl font-bold mb-4">Returns Management</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="border rounded p-4">
          <h2 className="text-sm text-gray-500">Total Returns</h2>
          <p className="text-xl font-semibold">{stats.totalReturns}</p>
        </div>
        <div className="border rounded p-4">
          <h2 className="text-sm text-gray-500">Accepted</h2>
          <p className="text-xl font-semibold">{stats.accepted}</p>
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

      <table className="w-full table-fixed border border-gray-400 overflow-x-scroll">
        <thead className="bg-gray-800">
          <tr>
            <th className="border px-4 py-2 text-left">Return ID</th>
            <th className="border px-4 py-2 text-left">Order ID</th>
            <th className="border px-4 py-2 text-left">Status</th>
            <th className="border px-4 py-2 text-left">Tracking Status</th>
            <th className="border px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredReturns.map((returnItem, index) => (
            <tr key={index} className="hover:bg-neutral-700">
              <td className="border px-4 py-2">{returnItem.id ?? 'NA'}</td>
              <td className="border px-4 py-2">{returnItem.orderId ?? 'NA'}</td>
              <td className="border px-4 py-2">{returnItem.status}</td>
              <td className="border px-4 py-2">{returnItem.trackingStatus}</td>
              <td className="border px-4 py-2">
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => fetchReturnDetails(returnItem)}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && returnDetails && selectedReturn && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-black text-white border-2 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Return Details</h2>
            <p>
              <strong>Customer Name:</strong> {returnDetails.customerName}
            </p>
            <p className="mt-2">
              <strong>Item Name:</strong> {returnDetails.itemName}
            </p>

            <div className="mt-4">
              <p>
                <strong>Status:</strong>
                {isEditing ? (
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="border p-1 w-full bg-black text-white"
                  >
                    {statuses
                      .filter((s) => s !== 'All')
                      .map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                  </select>
                ) : (
                  <span className="mb-2">{' ' + selectedReturn.status}</span>
                )}
              </p>
            </div>

            <div className="mt-2">
              <p>
                <strong>Tracking Status:</strong>
                {isEditing ? (
                  <select
                    value={editTrackingStatus}
                    onChange={(e) => setEditTrackingStatus(e.target.value)}
                    className="border p-1 w-full bg-black text-white"
                  >
                    {trackingOptions.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="mb-2">
                    {' ' + selectedReturn.trackingStatus}
                  </span>
                )}
              </p>
            </div>

            <div className="mt-4 flex gap-2">
              {isEditing ? (
                <div className="flex flex-row w-full">
                  <button
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded w-full text-center me-2"
                    onClick={updateReturn}
                  >
                    Update
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded w-full text-center ms-2"
                    onClick={() => {
                      setIsEditing(false);
                      setEditStatus(selectedReturn.status);
                      setEditTrackingStatus(selectedReturn.trackingStatus);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  className="px-4 py-2 border border-orange-500 hover:bg-orange-500 text-white rounded w-full text-center"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </button>
              )}
            </div>

            <button
              className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded w-full text-center"
              onClick={() => {
                setShowModal(false);
                setReturnDetails(null);
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
