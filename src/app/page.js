"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  useEffect(() => {

    const token = document.cookie.split('; ').find(row => row.startsWith('authToken='))?.split('=')[1];

    if (token) {
      router.push('/product-list'); 
     } 
    
  }, [router]);

  const validateForm = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(''); 
    if (validateForm()) {
      setIsLoading(true);
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        setIsLoading(false);

        if (!response.ok) {
          setApiError(data.message || 'Login failed');
        } else {
          console.log('Login successful', data);
          document.cookie = `authToken=${data.token}; path=/`;

          router.push('/product-list');
        }
      } catch (error) {
        setIsLoading(false);
        setApiError('Something went wrong. Please try again later.');
        console.error('Login error:', error);
      }
    }
  };

  return (
    <div className=' h-screen flex flex-col justify-center items-center'>

      <h2 className='font-bold text-[1.5rem] text-textColor'>Login </h2>
      <form onSubmit={handleSubmit} className='flex flex-col gap-2'>
        <div className='flex flex-col gap-1'>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='outline-none border border-gray-400 rounded-md px-2 py-1'
          />
          {errors.email && <span style={{ color: 'red' }}>{errors.email}</span>}
        </div>
        <div className='flex flex-col gap-1'>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='outline-none border border-gray-400 rounded-md px-2 py-1'
          />
          {errors.password && <span style={{ color: 'red' }}>{errors.password}</span>}
        </div>
        {apiError && <p style={{ color: 'red' }}>{apiError}</p>}
        <button type="submit"
          style={{
            background: 'linear-gradient(0deg, #444444 -17.86%, #202020 100%)',
          }}
          className='bg-blue-600 rounded-md py-2 text-white' disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
        <Link href='/sign-up' className='text-[12px] text-textlightcolor'>Create Account </Link>
      </form>
    </div>
  );
};

export default Login;
