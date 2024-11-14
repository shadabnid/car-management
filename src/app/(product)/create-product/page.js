'use client';
import { useState } from 'react';
import withAuth from '@/app/(product)/_components/WithAuth';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

const CreateProductPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false); 

  const handleFileChange = (e) => {
    setImages(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('tags', tags);

    Array.from(images).forEach((image) => {
      formData.append('images', image);
    });

    setLoading(true);
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        body: formData,
        credentials: "include"
      });
      const data = await response.json();

      if (response.ok) {
        toast.success('Product created successfully!');
        console.log('Product created successfully:', data);

        setTitle('');
        setDescription('');
        setTags('');
        setImages([]);
      } else {
        toast.error(data.error || 'Error creating product');
        console.error('Error creating product:', data.error);
      }
    } catch (error) {
      toast.error('Error submitting form');
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>

      <ToastContainer />

      <form onSubmit={handleSubmit} className='h-screen px-4 py-6 flex flex-col gap-3'>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className='outline-none border border-gray-400 rounded-md px-2 py-1'
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className='outline-none border border-gray-400 rounded-md px-2 py-1'
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className='outline-none border border-gray-400 rounded-md px-2 py-1'
        />
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          required
          className='outline-none border border-gray-400 rounded-md px-2 py-1'
        />
        <button
          style={{
            background: 'linear-gradient(0deg, #444444 -17.86%, #202020 100%)',
          }}
          type="submit"
          className='rounded-lg py-2 text-white w-[10rem] h-[2.5rem]'
          disabled={loading}
        >
          {loading ? (
            <span className="spinner-border spinner-border-sm text-white">Loading...</span> 
          ) : (
            'Create Product'
          )}
        </button>
      </form>
    </>
  );
};

export default withAuth(CreateProductPage);






