'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Carousel_login from '@/components/carousel_login/page';
import { useAuth } from '../context/authContext';
import axios from 'axios';
import { Visibility, VisibilityOff } from '@mui/icons-material';

type LoginResponse = {
  message: string;
  uid: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  token: string;
};

export default function LoginPage() {
  const router = useRouter();
  const { login, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState<{
    invalid?: string;
    email?: string;
    password?: string;
  }>({});

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError({});

    const btn = e.currentTarget.querySelector('button[type="submit"]');
    if (btn) {
      btn.innerHTML = 'Loading...';
      btn.setAttribute('disabled', 'true');
    }

    const api = process.env.NEXT_PUBLIC_API;

    try {
      const res = await axios.post<LoginResponse>(`${api}/auth/login`, {
        email,
        password,
      });

      const data = res.data;

      login({
        uid: data.uid,
        name: data.name,
        email: data.email,
        role: data.role,
        token: data.token,
      });

      router.push('/');
    } catch (err: Error | any) {
      if (err.response) {
        setError({ invalid: err.response.data.message || 'Login failed' });
      } else {
        setError({ invalid: 'An unexpected error occurred' });
      }
    } finally {
      if (btn) {
        btn.innerHTML = 'Login';
        btn.removeAttribute('disabled');
      }
    }
  };

  return (
    <div className="bg-neutral-800 flex justify-center items-center">
      <div className="md:w-[60%] w-[90%] my-10 flex relative items-center h-[80vh] justify-center rounded-2xl shadow-lg">
        <div className="w-full h-[80vh] rounded-l-md hidden md:inline-block">
          <Carousel_login />
        </div>
        <div className="bg-black p-7 md:p-4 w-full rounded-2xl md:rounded-l-none h-[80vh] flex flex-col justify-center">
          <p className="text-3xl text-center font-bold py-10 pt-5 text-white">
            Continue Shopping
          </p>
          <form onSubmit={handleSubmit} className="pb-4">
            <label className="block text-lg text-white" htmlFor="email">
              Email:
            </label>
            {error.email && <p className="text-red-500">{error.email}</p>}
            <input
              className="w-full mb-3 border-2 border-white rounded-md p-2"
              placeholder="john.doe@example.com"
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label className="block text-lg text-white" htmlFor="password">
              Password:
            </label>
            {error.password && <p className="text-red-500">{error.password}</p>}
            <div className="flex">
              <input
                className="block w-full mb-5 border-t-2 border-l-2 border-b-2 border-white rounded-l-md p-2"
                placeholder="Password"
                type={visible ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                name="password"
                id="password"
                required
              />
              <button
                className="bg-slate-600 hover:bg-slate-800 block mb-5 border-t-2 border-r-2 border-b-2 rounded-r-md p-2 w-10 border-white text-white"
                type="button"
                onClick={() => setVisible(!visible)}
              >
                {visible ? <VisibilityOff /> : <Visibility />}
              </button>
            </div>

            <input
              className="mb-4 mr-2"
              type="checkbox"
              name="remember"
              id="remember"
            />
            <label className="text-lg text-white" htmlFor="remember">
              Remember Me
            </label>

            {/* <Link
              className="block underline mb-5 text-lg text-white italic"
              href="/forgot-password"
            >
              Forgot Password?
            </Link> */}

            {error.invalid && (
              <p className="text-red-500 mb-4">{error.invalid}</p>
            )}

            <button
              className="bg-slate-700 rounded-md mb-3 px-3 py-1 block w-full text-lg text-white border-white hover:bg-slate-800"
              type="submit"
            >
              Login
            </button>

            <hr className="my-4" />
            <p className="text-center text-lg mb-3 text-white">OR</p>
            <Link
              href="/signin"
              className="bg-black rounded-md px-3 py-1 mb-7 block w-full text-white text-lg border-2 border-white hover:text-black hover:bg-white text-center"
            >
              Register
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
