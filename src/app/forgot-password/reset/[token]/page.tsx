'use client';

import axios from 'axios';
import React, { use, useState } from 'react';
import { CheckCircleTwoTone, ErrorOutlineTwoTone } from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Props = {
  params: Promise<{ token: string }>;
};

export default function ForgotPassword({ params }: Props) {
  const { token } = use(params);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const api = process.env.NEXT_PUBLIC_API;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      setIsSuccess(false);
      setIsModalOpen(true);
      setLoading(false);
      setConfirmPassword('');
      return;
    }

    try {
      await axios.post(`${api}/auth/reset-password`, {
        token: token,
        password: newPassword,
      });
      setIsSuccess(true);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.response?.data?.message || 'An error occurred.');
      setIsSuccess(false);
    } finally {
      setIsModalOpen(true);
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setErrorMessage('');

    if (isSuccess) {
      setNewPassword('');
      setConfirmPassword('');
      router.push('/login');
    }
  };

  return (
    <div className="bg-neutral-800 text-white flex justify-center p-4 min-h-screen items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-black flex justify-center items-center flex-col space-y-4 p-6 rounded-md w-full max-w-md"
      >
        <h1 className="text-3xl font-semibold text-center">
          Reset your Password
        </h1>

        <label htmlFor="newPassword" className="w-full text-left">
          New Password:
        </label>
        <input
          type="password"
          id="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="bg-neutral-900 border border-white focus:outline-none focus:border-orange-400 w-full p-2 rounded"
        />

        <label htmlFor="confirmPassword" className="w-full text-left">
          Confirm New Password:
        </label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
          {loading ? 'Submitting...' : 'Reset Password'}
        </button>
      </form>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-black text-white p-6 rounded shadow-md text-center max-w-sm w-full">
            {isSuccess ? (
              <>
                <CheckCircleTwoTone
                  className="text-green-600"
                  style={{ fontSize: 80 }}
                />
                <h2 className="text-lg font-semibold mb-4">
                  Password Reset Successful
                </h2>
                <p>
                  Your password has been updated. You can now log in with your
                  new password.
                </p>
              </>
            ) : (
              <>
                <ErrorOutlineTwoTone
                  className="text-red-600"
                  style={{ fontSize: 80 }}
                />
                <h2 className="text-lg font-semibold mb-4">Error</h2>
                <p>{errorMessage}</p>
              </>
            )}
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
