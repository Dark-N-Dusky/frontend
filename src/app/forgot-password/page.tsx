'use client';

import axios from 'axios';
import React, { useState } from 'react';
import { CheckCircleTwoTone } from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const api = process.env.NEXT_PUBLIC_API;
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${api}/auth/forgot-password`, {
        email: email,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsModalOpen(true);
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    router.push('/login');
  };

  return (
    <div className="bg-neutral-800 text-white flex justify-center items-center p-4 min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-black flex justify-center items-center flex-col space-y-4 p-6 rounded-md"
      >
        <h1 className="text-3xl font-semibold text-center">
          Recover your Account
        </h1>
        <label htmlFor="email" className="w-full text-left">
          Enter email address:
        </label>
        <input
          type="email"
          name="email"
          id="email"
          value={email}
          onChange={handleChange}
          required
          className="bg-neutral-900 border border-white focus:outline-none focus:border-orange-400 w-full p-2 rounded"
        />
        <Link
          href="/login"
          className="italic text-gray-400 block text-left w-full underline"
        >
          Back to Login
        </Link>
        <button
          type="submit"
          disabled={loading}
          className={`w-full border border-orange-500 text-white px-4 py-2 rounded 
            ${loading ? 'bg-orange-300 cursor-not-allowed' : 'hover:bg-orange-500'}`}
        >
          {loading ? 'Loading...' : 'Submit'}
        </button>
      </form>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-25">
          <div className="bg-black text-white p-6 rounded shadow-md text-center">
            <CheckCircleTwoTone
              className="text-green-600"
              style={{ fontSize: 80 }}
            />
            <h2 className="text-lg font-semibold mb-4">Email Sent</h2>
            <p>
              An email has been sent to <strong>{email}</strong> with password
              reset instructions.
            </p>
            <p>
              Please check your <em>spam</em> folder if you don't see it.
            </p>
            <button
              onClick={closeModal}
              className="mt-4 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
