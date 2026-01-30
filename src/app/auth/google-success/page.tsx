'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../context/authContext'; // Adjust import path

function GoogleSignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const uid = searchParams.get('uid');
    const name = searchParams.get('name');
    const email = searchParams.get('email');
    const role = searchParams.get('role');

    if (token && uid && email) {
      // Use the context login function to save to localStorage and state
      login({
        uid,
        name: name || '',
        email,
        role: role as 'user' | 'admin',
        token,
      });

      // Redirect to home
      router.push('/');
    } else {
      // Handle failure
      router.push('/login');
    }
  }, [searchParams, login, router]);

  return (
    <div className="h-screen flex items-center justify-center bg-neutral-900 text-white">
      <p>Logging you in...</p>
    </div>
  );
}

export default function GoogleSuccess() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <GoogleSignIn />
    </Suspense>
  );
}
