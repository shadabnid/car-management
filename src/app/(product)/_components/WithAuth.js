"use client"
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const withAuth = (Component) => {
  const ProtectedComponent = (props) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {

      const token = document.cookie.split('; ').find(row => row.startsWith('authToken='))?.split('=')[1];

      if (!token) {
        router.push('/'); 
       } 
      else {
       setLoading(false);
     }
    }, [router]);

    if (loading) return <div>Loading...</div>;

    return <Component {...props} />;
  };

  return ProtectedComponent;
};

export default withAuth;
