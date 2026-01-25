'use client';

import { useAuth } from '@/app/context/authContext';
import client from '@/lib/apolloClient';
import { GET_ORDER_DETAILS, GET_USER_DETAILS } from '@/queries/getOrderDetails';
import axios from 'axios';
import { useEffect, useState } from 'react';
import PDFGenerator from '@/components/pdfGen/page';

type Props = {
  params: Promise<{ id: string }>;
};

type OrderResponse = {
  order: {
    id: number;
    uid: string;
    address_id: string;
    status: string;
    tracking_status: string;
    createdAt: string;
    selectedSize: string;
  };
  orderItems: {
    id: number;
    quantity: number;
    product_id: string;
    order_id: number;
  }[];
};

type UserDetails = {
  name: string;
  email: string;
  number: string;
  addressDetails: {
    name: string;
    line1: string;
    line2: string;
    city: string;
    state: string;
    country: string;
    code: string;
    number: string;
    alternate_number: string;
    type: string;
    weekend_availability: boolean;
  }[];
};

export default function OrderDetails({ params }: Props) {
  const [id, setId] = useState<string | null>(null);
  const api = process.env.NEXT_PUBLIC_API;
  const { user, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editableStatus, setEditableStatus] = useState('');
  const [editableTrackingStatus, setEditableTrackingStatus] = useState('');
  const statusOptions = ['pending', 'confirmed', 'delivered', 'cancelled'];
  const trackingStatusOptions = [
    'pending',
    'packed',
    'shipped',
    'delivery',
    'delivered',
  ];
  const [orderDetails, setOrderDetails] = useState<OrderResponse | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [productDetails, setProductDetails] = useState<
    { name: string; quantity: number; price: number; selectedSize: string }[]
  >([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    params.then((res) => setId(res.id));
  }, [params]);

  useEffect(() => {
    if (!id || !user) return;

    const fetchOrderDetails = async () => {
      try {
        const res = await axios.get(`${api}/admin/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setOrderDetails(res.data);
      } catch (err) {
        console.error('Error fetching order details:', err);
      }
    };

    fetchOrderDetails();
  }, [id, user]);

  useEffect(() => {
    if (!orderDetails?.order.uid) return;

    const fetchUserDetail = async () => {
      try {
        const { data } = await client.query({
          query: GET_USER_DETAILS,
          variables: { uid: orderDetails.order.uid },
          fetchPolicy: 'no-cache',
        });
        setUserDetails(data.user);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetail();
  }, [orderDetails]);

  useEffect(() => {
    const fetchProductNames = async () => {
      if (!orderDetails) return;

      try {
        const productQueries = await Promise.all(
          orderDetails.orderItems.map((item) =>
            client.query({
              query: GET_ORDER_DETAILS,
              variables: { pid: item.product_id },
              fetchPolicy: 'no-cache',
            })
          )
        );

        let orderTotal = 0;
        const products = productQueries.map((res, index) => {
          const price = res.data.product.price;
          const quantity = orderDetails.orderItems[index].quantity;
          const size = orderDetails.order.selectedSize;
          orderTotal += price * quantity;

          return {
            name: res.data.product.name,
            price: price,
            quantity: quantity,
            selectedSize: size,
          };
        });

        const delivery = 40;
        const tax = +(0.18 * orderTotal).toFixed(2);
        const cartTotal = Math.round(orderTotal + delivery + tax);
        setTotal(cartTotal);
        setProductDetails(products);
      } catch (err) {
        console.error('Error fetching product names:', err);
      }
    };

    fetchProductNames();
  }, [orderDetails]);

  const addressIndex = Number(orderDetails?.order.address_id);
  const address = userDetails?.addressDetails?.[addressIndex];

  const handleEditClick = () => {
    if (!orderDetails) return;
    setEditableStatus(orderDetails.order.status);
    setEditableTrackingStatus(orderDetails.order.tracking_status);
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleUpdateClick = async () => {
    try {
      await axios.put(
        `${api}/admin/orders/${id}`,
        {
          status: editableStatus,
          trackingStatus: editableTrackingStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      setOrderDetails((prev) =>
        prev
          ? {
              ...prev,
              order: {
                ...prev.order,
                status: editableStatus,
                tracking_status: editableTrackingStatus,
              },
            }
          : prev
      );

      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  return (
    <div className="p-4 bg-black text-white" id="printable-content">
      <h1 className="text-2xl font-semibold mt-3 mb-0">Order ID: {id}</h1>
      {userDetails && (
        <p className="text-xl">Customer name: {userDetails.name ?? 'User'}</p>
      )}
      {address && (
        <>
          <p>Address: {address.line1 + ', ' + address.line2}</p>
          <p>City: {address.city}</p>
          <p>State: {address.state}</p>
          <p>Code: {address.code}</p>
        </>
      )}
      <p>Order total: {total}</p>
      {isEditing ? (
        <>
          <div className="mb-2 no-pdf">
            <label>Status:&nbsp;</label>
            <select
              value={editableStatus}
              onChange={(e) => setEditableStatus(e.target.value)}
              className="border p-1 rounded bg-black"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-2 no-pdf">
            <label>Tracking Status:&nbsp;</label>
            <select
              value={editableTrackingStatus}
              onChange={(e) => setEditableTrackingStatus(e.target.value)}
              className="border p-1 rounded bg-black"
            >
              {trackingStatusOptions.map((ts) => (
                <option key={ts} value={ts}>
                  {ts}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleUpdateClick}
            className="bg-orange-600 text-white px-3 py-1 rounded mr-2"
          >
            Update
          </button>
          <button
            onClick={handleCancelClick}
            className="bg-gray-400 text-white px-3 py-1 rounded"
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          <p className="no-pdf">Status: {orderDetails?.order.status}</p>
          <p className="no-pdf">
            Tracking Status: {orderDetails?.order.tracking_status}
          </p>
          <button
            onClick={handleEditClick}
            className="mt-2 bg-orange-400 text-white px-3 py-1 rounded"
          >
            Edit
          </button>
        </>
      )}

      <h2 className="mt-6 text-xl font-semibold">Products</h2>
      <table className="table-fixed border-collapse border-2 w-full mb-6">
        <thead className="border-2 bg-neutral-800">
          <tr>
            <th className="border-2 p-2">Product Name</th>
            <th className="border-2 p-2">Quantity</th>
            <th className="border-2 p-2">Size</th>
            <th className="border-2 p-2">Amount</th>
          </tr>
        </thead>
        <tbody className="border-2">
          {productDetails.map((product, index) => (
            <tr key={index} className="border-2">
              <td className="border-2 p-2">{product.name}</td>
              <td className="border-2 p-2">{product.quantity}</td>
              <td className="border-2 p-2">{product.selectedSize}</td>
              <td className="border-2 p-2">
                {product.quantity * product.price}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {orderDetails && userDetails && address && productDetails.length > 0 && (
        <PDFGenerator
          orderId={orderDetails.order.id.toString()}
          userDetails={{
            name: userDetails.name,
            number: Number(address.number),
            alternateNumber: Number(address.alternate_number),
            address: `${address.line1}, ${address.line2}, ${address.city}, ${address.state}, ${address.country}, ${address.code}`,
            email: userDetails.email,
          }}
          total={total}
          productDetails={productDetails}
        />
      )}
    </div>
  );
}
