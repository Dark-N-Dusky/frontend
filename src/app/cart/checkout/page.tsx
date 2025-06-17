'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/authContext';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import client from '@/lib/apolloClient';
import { GET_PRODUCT_PRICE } from '@/queries/getCartItems';
import { GET_SAVED_ADDRESSES } from '@/queries/getAddress';
import Link from 'next/link';
import { Suspense } from 'react';

interface CartItem {
  product_id: string;
  quantity: number;
}

interface Address {
  type: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  country: string;
  code: string;
  number: string;
  alternate_number?: string;
  weekend_availability?: boolean;
}

function CheckoutClient() {
  const router = useRouter();
  const api = process.env.NEXT_PUBLIC_API;
  const { user, loading } = useAuth();
  const searchParams = useSearchParams();
  const pid = searchParams.get('pid');
  const [data, setData] = useState({
    name: '',
    email: '',
    cno: '',
    address: {
      fname: '',
      al1: '',
      al2: '',
      city: '',
      state: '',
      pin: 0,
      number: 0,
      type: 'home',
    },
  });

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [pricesMap, setPricesMap] = useState<Record<string, number>>({});
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);

  useEffect(() => {
    const getCartItems = async () => {
      if (pid) {
        const cartItem = [{ product_id: pid, quantity: 1 }];
        setCartItems(cartItem);
      } else {
        try {
          const res = await axios.get(`${api}/cart`, {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          });
          setCartItems(res.data);
          if (res.data.length === 0) router.push('/');
        } catch (err) {
          console.error(err);
        }
      }
    };
    if (user?.token) {
      getCartItems();
    }
  }, [user?.token, api, pid, router]);

  useEffect(() => {
    const getUserData = async () => {
      if (!user?.uid) return;

      try {
        const res = await client.query({
          query: GET_SAVED_ADDRESSES,
          variables: { uid: user.uid },
          fetchPolicy: 'no-cache',
        });

        const userData = res.data?.user;
        const addresses = userData?.addressDetails || [];

        setSavedAddresses(addresses);

        if (addresses.length > 0) {
          const firstAddress = addresses[0];

          setData((prev) => ({
            ...prev,
            name: userData?.name || '',
            email: userData?.email || '',
            cno: userData?.number || '',
            address: {
              ...prev.address,
              fname: userData?.name || '',
              al1: firstAddress.line1 || '',
              al2: firstAddress.line2 || '',
              city: firstAddress.city || '',
              state: firstAddress.state || '',
              pin: firstAddress.code || '',
              number: firstAddress.number || '',
              type: firstAddress.type || 'home',
            },
          }));

          setSelectedAddressIndex(0);
        } else {
          setData((prev) => ({
            ...prev,
            name: userData?.name || '',
            email: userData?.email || '',
            cno: userData?.number || '',
          }));
        }
      } catch (err) {
        console.error('Failed to fetch user data:', err);
      }
    };

    getUserData();
  }, [user?.uid]);

  useEffect(() => {
    const fetchPrices = async () => {
      if (!cartItems || cartItems.length === 0) return;

      try {
        const promises = cartItems.map((item) =>
          client.query({
            query: GET_PRODUCT_PRICE,
            variables: { pid: item.product_id },
            fetchPolicy: 'no-cache',
          })
        );

        const results = await Promise.all(promises);

        let total = 0;
        const map: Record<string, number> = {};

        results.forEach((res, idx) => {
          const price = res.data?.product?.price || 0;
          const quantity = cartItems[idx].quantity;
          map[cartItems[idx].product_id] = price;
          total += price * quantity;
        });

        setPricesMap(map);
        setSubtotal(total);
      } catch (err) {
        console.error('Error fetching prices', err);
      }
    };

    fetchPrices();
  }, [cartItems]);

  useEffect(() => {
    if (!loading && !user?.token) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const delivery = 40;
  const tax = +(0.18 * subtotal).toFixed(2);
  const cartTotal = Math.round(subtotal + delivery + tax);

  const handleSubmit = async () => {
    let orderData = {};
    if (pid) {
      orderData = {
        address_id: selectedAddressIndex.toString(),
        pid,
        quantity: '1',
      };
    } else {
      orderData = { address_id: selectedAddressIndex.toString() };
    }
    try {
      const res = await axios.post(`${api}/cart/checkout`, orderData, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      if (res.status === 200 || res.status === 201) {
        router.push('/orderplaced');
      } else {
        console.error('Error placing order:', res.data);
      }
    } catch (error: any) {
      console.error('Error placing order:', error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const inputClass = 'border border-black rounded w-full text-black p-2';
  const labelClass = 'block pt-4 pb-1';

  return (
    <div className="flex flex-col-reverse md:flex-row bg-gray-900 w-full p-6">
      <div className="w-full md:w-3/4 bg-black text-white rounded-xl py-4 px-6 my-4 mx-2 pb-6">
        <form>
          <p className="text-xl text-center my-3 border-b pb-3">
            Contact Information
          </p>
          <label htmlFor="name" className={labelClass}>
            Full Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={data.name}
            onChange={handleChange}
            className={inputClass}
          />

          <label htmlFor="cno" className={labelClass}>
            Contact Number
          </label>
          <input
            type="tel"
            name="cno"
            id="cno"
            value={data.cno}
            onChange={handleChange}
            className={inputClass}
          />

          <label htmlFor="email" className={labelClass}>
            Email address
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={data.email}
            onChange={handleChange}
            className={inputClass}
          />
        </form>

        <div>
          <p className="text-xl text-center my-3 border-b pb-3">
            Saved Addresses
          </p>
          {savedAddresses.length > 0 ? (
            <div className="space-y-4">
              {savedAddresses.map((addr, idx) => (
                <div
                  key={idx}
                  className={`border p-4 rounded-md cursor-pointer inline-block m-3 hover:bg-gray-700 ${
                    selectedAddressIndex === idx
                      ? 'border-orange-500 bg-gray-800 shadow-orange-600 shadow-md'
                      : 'border-gray-600'
                  }`}
                  onClick={() => {
                    setSelectedAddressIndex(idx);
                    setData((prev) => ({
                      ...prev,
                      address: {
                        ...prev.address,
                        fname: data.name || '',
                        al1: addr.line1 || '',
                        al2: addr.line2 || '',
                        city: addr.city || '',
                        state: addr.state || '',
                        pin: parseInt(addr.code || '0', 10),
                        number: parseInt(addr.number || '0', 10),
                        type: addr.type || 'home',
                      },
                    }));
                  }}
                >
                  <p className="font-semibold">{addr.type.toUpperCase()}</p>
                  <p>
                    {addr.line1}, {addr.line2}
                  </p>
                  <p>
                    {addr.city}, {addr.state}, {addr.country} - {addr.code}
                  </p>
                  <p>Contact: {addr.number}</p>
                  {addr.alternate_number && <p>Alt: {addr.alternate_number}</p>}
                  {addr.weekend_availability && <p>Available on weekends</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No saved addresses found.</p>
          )}
          <div className="my-4 p-4 text-center">
            <Link
              href="/newaddress"
              className="border-2 border-orange-600 hover:bg-orange-600 py-2 px-4 rounded m-4 text-center"
            >
              Add New Address
            </Link>
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/5 bg-black text-white rounded-xl p-6 my-4 mx-2">
        <div className="text-xl text-center border-b p-2">Payment method</div>
        <div className="m-6 bg-gray-800 hover:bg-gray-700 inline-block px-4 py-2 cursor-pointer border-2 border-orange-500 rounded-lg shadow-md shadow-orange-600">
          COD - Cash on Delivery
        </div>

        <p className="text-xl text-center border-b p-2 mb-4">Order Summary</p>
        <div className="flex justify-between">
          <p>Total items:</p>
          <p>{cartItems.length}</p>
        </div>
        <div className="flex justify-between">
          <p>Cart subtotal:</p>
          <p>₹{subtotal.toFixed(2)}</p>
        </div>
        <div className="flex justify-between">
          <p>Delivery:</p>
          <p>₹{delivery}</p>
        </div>
        <div className="flex justify-between">
          <p>Tax (18%):</p>
          <p>₹{tax}</p>
        </div>
        <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
          <p>Total amount:</p>
          <p>₹{cartTotal}</p>
        </div>

        <button
          className="block w-full text-center border border-green-700 hover:bg-green-700 p-3 rounded-md mt-6 my-2"
          onClick={handleSubmit}
        >
          Order Now
        </button>
      </div>
    </div>
  );
}

export default function Checkout() {
  return (
    <Suspense fallback={<div>Loading checkout...</div>}>
      <CheckoutClient />
    </Suspense>
  );
}
