"use client"
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const SignUp = () => {


  const [formData, setFormData] = useState({
    email: '',
    password: '',
    mobile: '',
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const router = useRouter();

  useEffect(() => {

    const token = document.cookie.split('; ').find(row => row.startsWith('authToken='))?.split('=')[1];

    if (token) {
      router.push('/product-list'); 
     }
    
  }, [router]);

  const validateForm = () => {
    const newErrors = {};

    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }


    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }


    if (!formData.mobile) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Mobile number must be 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setSuccessMessage('');
    if (validateForm()) {
      setIsLoading(true); 
      try {
        const response = await fetch('http://localhost:3000/api/sign-up', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const data = await response.json();
        setIsLoading(false);

        if (!response.ok) {
          setApiError(data.message || 'Sign-up failed');
        } else {
          setSuccessMessage('Sign-up successful! Please log in to continue.');
        }
      } catch (error) {
        setIsLoading(false);
        setApiError('Something went wrong. Please try again later.');
        console.error('Sign-up error:', error);
      }
    }
  };

  return (
    <div className='border border-red-500 h-screen flex flex-col justify-center items-center'>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} className='flex flex-col gap-2'>
        <div className='flex flex-col gap-1'>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className='outline-none border border-gray-400 rounded-md px-2 py-1'
          />
          {errors.email && <span style={{ color: 'red' }}>{errors.email}</span>}
        </div>
        <div className='flex flex-col gap-1'>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className='outline-none border border-gray-400 rounded-md px-2 py-1'
          />
          {errors.password && <span style={{ color: 'red' }}>{errors.password}</span>}
        </div>
        <div className='flex flex-col gap-1'>
          <label>Mobile Number</label>
          <input
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            className='outline-none border border-gray-400 rounded-md px-2 py-1'
          />
          {errors.mobile && <span style={{ color: 'red' }}>{errors.mobile}</span>}
        </div>
        {apiError && <p style={{ color: 'red' }}>{apiError}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        <button type="submit" 
         style={{
          background: 'linear-gradient(0deg, #444444 -17.86%, #202020 100%)',
        }}
        className='bg-blue-600 rounded-md py-2 text-white' disabled={isLoading}>
          {isLoading ? 'Signing up...' : 'Sign Up'}
        </button>
        <Link href='/' className='text-[12px] text-textlightcolor'>Login page </Link>
      </form>
    </div>
  );
};

export default SignUp;
