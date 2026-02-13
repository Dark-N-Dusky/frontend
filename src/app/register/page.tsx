'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Carousel_signin from '@/components/carouselRegister';
import {
  validateName,
  validateEmail,
  validateMobile,
  validatePasswords,
} from '@/util/validate/validate';
import { useAuth } from '../context/authContext';
import axios from 'axios';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export default function RegisterPage() {
  const router = useRouter();
  const { user, login } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [visibleConfirm, setVisibleConfirm] = useState(false);
  const [error, setError] = useState<{
    name?: string;
    email?: string;
    mobile?: string;
    password?: string;
    general?: string;
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
      btn.innerHTML = 'Registering...';
      btn.setAttribute('disabled', 'true');
    }

    const nameError = validateName(name);
    const emailError = validateEmail(email);
    const mobileError = validateMobile(mobile);
    const passwordError = validatePasswords(password, confirmPassword);

    if (nameError || emailError || mobileError || passwordError) {
      setError({
        name: nameError,
        email: emailError,
        mobile: mobileError,
        password: passwordError,
      });

      if (btn) {
        btn.innerHTML = 'Register';
        btn.removeAttribute('disabled');
      }
      return;
    }

    const api = process.env.NEXT_PUBLIC_API;

    try {
      const res = await axios.post(`${api}/auth/register`, {
        name,
        email,
        number: mobile,
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
        if (err.response.status === 409) {
          setError({ email: 'User with this email already exists.' });
        } else {
          setError({
            general: err.response.data.message || 'Registration failed',
          });
        }
      } else {
        setError({ general: 'An unexpected error occurred' });
      }
    } finally {
      if (btn) {
        btn.innerHTML = 'Register';
        btn.removeAttribute('disabled');
      }
    }
  };

  return (
    <div className="bg-neutral-800 flex justify-center items-center">
      <div className="md:w-[60%] w-[90%] my-10 flex relative items-center md:h-[110vh] justify-center rounded-2xl shadow-lg">
        <div className="w-full hidden md:inline-block h-[110vh] rounded-l-md">
          <Carousel_signin />
        </div>
        <div className="bg-black p-7 md:p-4 w-full rounded-2xl md:rounded-l-none md:h-[110vh] flex flex-col justify-center">
          <p className="text-3xl text-center font-bold py-10 pt-5 text-white">
            Create Your Account
          </p>
          <form onSubmit={handleSubmit} className="pb-4">
            {/* Name */}
            <label className="block text-lg text-white" htmlFor="name">
              Name:
            </label>
            {error.name && <p className="text-red-500">{error.name}</p>}
            <input
              className="w-full mb-3 border-2 border-white rounded-md p-2"
              placeholder="John Doe"
              type="text"
              name="name"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            {/* Email */}
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

            {/* Mobile */}
            <label className="block text-lg text-white" htmlFor="mobile">
              Contact Number:
            </label>
            {error.mobile && <p className="text-red-500">{error.mobile}</p>}
            <input
              className="w-full mb-3 border-2 border-white rounded-md p-2"
              placeholder="+91 1234567890"
              type="tel"
              name="mobile"
              id="mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
            />

            {/* Password */}
            <label className="block text-lg text-white" htmlFor="password">
              Password:
            </label>
            <div className="flex">
              <input
                className="block w-full mb-3 border-t-2 border-l-2 border-b-2 border-white rounded-l-md p-2"
                placeholder="Password"
                type={visible ? 'text' : 'password'}
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                className="bg-slate-600 hover:bg-slate-800 block mb-3 border-t-2 border-r-2 border-b-2 rounded-r-md p-2 w-10 border-white text-white"
                type="button"
                onClick={() => setVisible(!visible)}
              >
                {visible ? <VisibilityOff /> : <Visibility />}
              </button>
            </div>

            <label
              className="block text-lg text-white"
              htmlFor="confirmPassword"
            >
              Confirm Password:
            </label>
            {error.password && <p className="text-red-500">{error.password}</p>}
            <div className="flex">
              <input
                className="block w-full mb-5 border-t-2 border-l-2 border-b-2 border-white rounded-l-md p-2"
                placeholder="Repeat Password"
                type={visibleConfirm ? 'text' : 'password'}
                name="confirmPassword"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                className="bg-slate-600 hover:bg-slate-800 block mb-5 border-t-2 border-r-2 border-b-2 rounded-r-md p-2 w-10 border-white text-white"
                type="button"
                onClick={() => setVisibleConfirm(!visibleConfirm)}
              >
                {visibleConfirm ? <VisibilityOff /> : <Visibility />}
              </button>
            </div>

            {/* Remember Me */}
            <input
              className="mb-4 mr-2"
              type="checkbox"
              name="remember"
              id="remember"
            />
            <label className="text-lg text-white" htmlFor="remember">
              Remember Me
            </label>

            {/* General Error */}
            {error.general && (
              <p className="text-red-500 mb-4">{error.general}</p>
            )}

            {/* Submit */}
            <button
              className="bg-slate-700 rounded-md mb-3 px-3 py-1 block w-full text-lg text-white border-white hover:bg-slate-800"
              type="submit"
            >
              Register
            </button>

            <hr className="my-4" />
            <p className="text-center text-lg mb-3 text-white">OR</p>
            <Link
              href="/login"
              className="bg-black rounded-md px-3 py-1 mb-7 block w-full text-white text-lg border-2 border-white hover:text-black hover:bg-white text-center"
            >
              Login
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
