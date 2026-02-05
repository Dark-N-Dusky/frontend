'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/authContext';
import { useRouter } from 'next/navigation';
import axios from 'axios';

type AddressData = {
  name: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  code: string;
  number: string;
  alternate_number?: string | null;
  type: 'home' | 'office';
  weekend_availability: string;
};

export default function SaveNewAddress() {
  const inputClass = 'border border-black rounded w-full text-black p-2';
  const labelClass = 'block pt-4 pb-1';
  const api = process.env.NEXT_PUBLIC_API;
  const router = useRouter();
  const { user } = useAuth();

  const [addressData, setAddressData] = useState<AddressData>({
    name: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    code: '',
    number: '',
    type: 'home',
    weekend_availability: 'true',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setAddressData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${api}/user/address`, addressData, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      if (response.status === 200 || response.status === 201) {
        router.push('/profile');
      }
    } catch (error) {
      console.error('Failed to save address:', error);
    }
  };
  return (
    <form method="POST" onSubmit={handleSubmit}>
      <p className="text-xl text-center my-3 border-b pb-3">Shipping Address</p>

      <label htmlFor="name" className={labelClass}>
        Full Name
      </label>
      <input
        type="text"
        name="name"
        id="name"
        className={inputClass}
        onChange={handleChange}
        value={addressData.name}
      />

      <label htmlFor="line1" className={labelClass}>
        Address Line 1
      </label>
      <input
        type="text"
        name="line1"
        id="line1"
        className={inputClass}
        onChange={handleChange}
        value={addressData.line1}
      />

      <label htmlFor="line2" className={labelClass}>
        Address Line 2
      </label>
      <input
        type="text"
        name="line2"
        id="line2"
        className={inputClass}
        onChange={handleChange}
        value={addressData.line2}
      />

      <label htmlFor="city" className={labelClass}>
        City
      </label>
      <input
        type="text"
        name="city"
        id="city"
        className={inputClass}
        onChange={handleChange}
        value={addressData.city}
      />

      <label htmlFor="state" className={labelClass}>
        State
      </label>
      <select
        name="state"
        id="state"
        className={inputClass}
        onChange={handleChange}
        value={addressData.state}
      >
        <option value="">Select State</option>
        <option value="Andhra Pradesh">Andhra Pradesh</option>
        <option value="Arunachal Pradesh">Arunachal Pradesh</option>
        <option value="Assam">Assam</option>
        <option value="Bihar">Bihar</option>
        <option value="Chhattisgarh">Chhattisgarh</option>
        <option value="Goa">Goa</option>
        <option value="Gujarat">Gujarat</option>
        <option value="Haryana">Haryana</option>
        <option value="Himachal Pradesh">Himachal Pradesh</option>
        <option value="Jharkhand">Jharkhand</option>
        <option value="Karnataka">Karnataka</option>
        <option value="Kerala">Kerala</option>
        <option value="Madhya Pradesh">Madhya Pradesh</option>
        <option value="Maharashtra">Maharashtra</option>
        <option value="Manipur">Manipur</option>
        <option value="Meghalaya">Meghalaya</option>
        <option value="Mizoram">Mizoram</option>
        <option value="Nagaland">Nagaland</option>
        <option value="Odisha">Odisha</option>
        <option value="Punjab">Punjab</option>
        <option value="Rajasthan">Rajasthan</option>
        <option value="Sikkim">Sikkim</option>
        <option value="Tamil Nadu">Tamil Nadu</option>
        <option value="Telangana">Telangana</option>
        <option value="Tripura">Tripura</option>
        <option value="Uttar Pradesh">Uttar Pradesh</option>
        <option value="Uttarakhand">Uttarakhand</option>
        <option value="West Bengal">West Bengal</option>
        <option value="Andaman and Nicobar Islands">
          Andaman and Nicobar Islands
        </option>
        <option value="Chandigarh">Chandigarh</option>
        <option value="Dadra and Nagar Haveli and Daman and Diu">
          Dadra and Nagar Haveli and Daman and Diu
        </option>
        <option value="Delhi">Delhi</option>
        <option value="Jammu and Kashmir">Jammu and Kashmir</option>
        <option value="Ladakh">Ladakh</option>
        <option value="Lakshadweep">Lakshadweep</option>
        <option value="Puducherry">Puducherry</option>
      </select>

      <label htmlFor="code" className={labelClass}>
        PIN Code
      </label>
      <input
        type="text"
        name="code"
        id="code"
        className={inputClass}
        onChange={handleChange}
        value={addressData.code}
      />

      <label htmlFor="number" className={labelClass}>
        Contact Number
      </label>
      <input
        type="tel"
        name="number"
        id="number"
        className={inputClass}
        onChange={handleChange}
        value={addressData.number}
      />

      <label htmlFor="number" className={labelClass}>
        Alternate Contact Number
      </label>
      <input
        type="tel"
        name="alternate_number"
        id="alternate_number"
        className={inputClass}
        onChange={handleChange}
        value={addressData.alternate_number || undefined}
      />

      <label htmlFor="type" className={labelClass}>
        Address Type
      </label>
      <select
        name="type"
        id="type"
        className={inputClass}
        onChange={handleChange}
        value={addressData.type}
      >
        <option value="home">Home</option>
        <option value="work">Work</option>
      </select>

      <label className={labelClass}>Available on Weekends</label>
      <div className="flex gap-4">
        <label className="flex items-center">
          <input
            type="radio"
            name="weekend_availability"
            value="true"
            checked={addressData.weekend_availability === 'true'}
            onChange={handleChange}
            className="mr-2"
          />
          Yes
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            name="weekend_availability"
            value="false"
            checked={addressData.weekend_availability === 'false'}
            onChange={handleChange}
            className="mr-2"
          />
          No
        </label>
      </div>

      <button className="border p-2" type="submit">
        Save Address
      </button>
    </form>
  );
}
