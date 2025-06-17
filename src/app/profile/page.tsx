'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { useAuth } from '../context/authContext';
import client from '@/lib/apolloClient';
import { GET_USER } from '@/queries/getUser';
import Image from 'next/image';
import Link from 'next/link';
import { DeleteForeverTwoTone, Edit } from '@mui/icons-material';
import axios from 'axios';

export default function Profile() {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const btnClass =
    'border-2 border-orange-600 hover:bg-orange-600 py-2 px-4 rounded m-2 md:w-full text-center';
  const [manageSavedAddress, setManageSavedAddress] = useState(false);
  const api = process.env.NEXT_PUBLIC_API || 'localhost';
  const [isEditingNumber, setIsEditingNumber] = useState(false);
  const [editedNumber, setEditedNumber] = useState('');
  const [currentNumber, setCurrentNumber] = useState('');

  useEffect(() => {
    if (!authLoading && !user?.token) router.push('/login');
  }, [user, router]);

  const { data, loading, error } = useQuery(GET_USER, {
    client,
    variables: {
      uid: user?.uid || '',
    },
    context: {
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    },
    skip: !user?.token || !user?.uid,
    fetchPolicy: 'no-cache',
  });

  useEffect(() => {
    if (data?.user?.number) {
      setCurrentNumber(data.user.number);
    }
  }, [data]);

  const handleRemoveAddress = async (index: number) => {
    try {
      const res = await axios.delete(`${api}/user/address/${index}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      if (res.status === 200) {
        setManageSavedAddress(false);
        window.location.reload();
      } else {
        console.error('Failed to remove address:', res.data);
      }
    } catch (err) {
      console.error('Error removing address:', err);
    }
  };

  const handleNumberChange = async () => {
    try {
      const res = await axios.patch(
        `${api}/user`,
        { number: editedNumber },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (res.status === 200) {
        setCurrentNumber(editedNumber);
        setIsEditingNumber(false);
        window.location.reload();
      } else {
        console.error('Failed to update number:', res.data);
      }
    } catch (err) {
      console.error('Error updating number:', err);
    }
  };

  if (!user?.token || loading)
    return <p className="text-white p-10">Loading...</p>;
  if (error) return <p className="text-red-500 p-10">Error: {error.message}</p>;

  const profile = data.user;

  return (
    <div className="flex flex-col md:flex-row bg-neutral-800 text-white w-full">
      <div className="flex flex-col bg-black items-center p-4 m-2 rounded-md md:rounded-none md:m-0 md:w-1/5">
        <Image
          src={
            profile.profile_url ||
            `https://avatar.iran.liara.run/username?username=${profile.name}`
          }
          alt="Profile"
          height={500}
          width={500}
          className="rounded-full md:h-24 h-32 w-auto bg-slate-400 m-4"
        />
        <p className="text-2xl font-semibold md:text-center mb-3">
          {profile.name}
        </p>
        <div className="flex flex-col items-center w-full">
          <Link href="/cart" className={`${btnClass} w-full md:m-3`}>
            Cart
          </Link>
          <Link href="/order" className={`${btnClass} w-full md:m-3`}>
            Orders
          </Link>
          <Link href="/return" className={`${btnClass} w-full md:m-3`}>
            Returns
          </Link>
        </div>
      </div>

      <div className="p-1 w-full">
        <div className="bg-black p-2 m-2 rounded-md">
          <p className="text-xl pb-1 border-b mb-2">User information</p>
          <p className="text-gray-400">
            Name: <span className="text-white">{profile.name}</span>
          </p>
          <p className="text-gray-400">
            Email address: <span className="text-white">{profile.email}</span>
          </p>
          <p className="text-gray-400 flex items-center flex-wrap">
            Primary contact number:{' '}
            {!isEditingNumber ? (
              <>
                <span className="text-white ms-2">{currentNumber}</span>
                <Edit
                  className="text-white text-sm cursor-pointer hover:text-neutral-400 ms-2"
                  style={{ fontSize: 20 }}
                  onClick={() => {
                    setEditedNumber(currentNumber);
                    setIsEditingNumber(true);
                  }}
                />
              </>
            ) : (
              <div className="flex flex-wrap items-center md:ms-2">
                <input
                  type="text"
                  className="bg-black text-white border p-1 rounded"
                  value={editedNumber}
                  onChange={(e) => setEditedNumber(e.target.value)}
                />
                <div>
                  <button
                    className="bg-orange-400 hover:bg-orange-600 px-2 py-1 rounded text-white m-2"
                    onClick={handleNumberChange}
                  >
                    Done
                  </button>
                  <button
                    className="bg-gray-500 hover:bg-gray-600 px-2 py-1 rounded text-white m-2"
                    onClick={() => setIsEditingNumber(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </p>
        </div>

        <div className="bg-black p-2 m-2 rounded-md">
          <p className="text-xl pb-1 border-b mb-2">Saved Addresses</p>
          <div className="md:flex md:flex-row md:flex-wrap">
            {profile.addressDetails.length === 0 ? (
              <p className="text-gray-500">No saved addresses.</p>
            ) : (
              profile.addressDetails.map((addr: any, idx: number) => (
                <div key={idx} className="border m-2 p-2 rounded-md">
                  <p className="flex justify-between">
                    <strong>
                      {addr.type.substring(0, 1).toUpperCase() +
                        addr.type.substring(1) || 'Address'}{' '}
                      - {addr.name}
                    </strong>
                    {manageSavedAddress && (
                      <span onClick={() => handleRemoveAddress(idx)}>
                        <DeleteForeverTwoTone className="text-red-600 cursor-pointer" />
                      </span>
                    )}
                  </p>
                  <p className="text-gray-400">
                    Address:
                    <span className="text-white">
                      {' ' + addr.line1 + ', ' + addr.line2}
                    </span>
                  </p>
                  <p className="text-gray-400">
                    City: <span className="text-white">{' ' + addr.city}</span>
                  </p>
                  <p className="text-gray-400">
                    State:{' '}
                    <span className="text-white">{' ' + addr.state}</span>
                  </p>
                  <p className="text-gray-400">
                    Country:{' '}
                    <span className="text-white">{' ' + addr.country}</span>
                  </p>
                  <p className="text-gray-400">
                    Code: <span className="text-white">{' ' + addr.code}</span>
                  </p>
                  <p className="text-gray-400">
                    Contact number:
                    <span className="text-white">{' ' + addr.number}</span>
                  </p>
                  {addr.alternate_number && (
                    <p className="text-gray-400">
                      Alternate number:
                      <span className="text-white">
                        {' ' + addr.alternate_number}
                      </span>
                    </p>
                  )}
                  <p className="text-gray-400">
                    Weekend Availability:
                    <span className="text-white">
                      {addr.weekend_availability ? ' Yes' : ' No'}
                    </span>
                  </p>
                </div>
              ))
            )}
          </div>

          <div className="flex flex-col md:flex-row">
            {!manageSavedAddress && (
              <button
                className={btnClass}
                onClick={() => setManageSavedAddress(true)}
              >
                Manage Saved Addresses
              </button>
            )}
            {manageSavedAddress && (
              <button
                className={btnClass}
                onClick={() => setManageSavedAddress(false)}
              >
                Done
              </button>
            )}
            <Link href="/newaddress" className={btnClass}>
              Add New Address
            </Link>
          </div>
        </div>

        <div className="bg-black p-2 m-2 rounded-md">
          <p className="text-xl pb-1 border-b mb-2">Account Action</p>
          <div className="md:flex md:flex-row">
            <button className={`${btnClass}`}>Reset Password</button>
            <button className={`${btnClass}`} onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
