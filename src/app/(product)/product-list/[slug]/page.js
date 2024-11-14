"use client";
import { useEffect, useState, use } from "react";

import { useRouter } from 'next/navigation';
import Image from "next/image";

const ProductPage = ({ params }) => {
  const router = useRouter();
  const unwrappedParams = use(params); // Unwrap params with use()
  const slug = unwrappedParams?.slug;

  const [product, setProduct] = useState({
    title: "",
    description: "",
    tags: [],
    thumbnail_image: "",
    images: [],
  });
  const [selectedImage, setSelectedImage] = useState(null); // Start with null
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Track loading state

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  useEffect(() => {
    const fetchProductData = async () => {
      if (!slug) return;

      setLoading(true); // Start loading

      try {
        const response = await fetch(`/api/products/findOne/${slug}`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch product data");
        }

        const data = await response.json();
        setProduct(data.car); // Use the 'car' key from the response data
        setSelectedImage(data.car.thumbnail_image || null); // Set thumbnail_image if available
        setTitle(data.car.title);
        setDescription(data.car.description);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchProductData();
  }, [slug]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async() => {

    if (!slug) return;

    if(title==product.title&&description==product.description){
      console.log("here");
      return;
    }
    const productId = product._id;
    try {
      const response = await fetch(`/api/products/edit`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description,productId }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update product");
      }

      const data = await response.json();
      setProduct(data.product);
      setIsEditing(!isEditing);
     

      setIsEditing(false);
    } catch (error) {
      console.log("error")
     
    }
  };

  const handleDelete = async () => {
    if (!slug) return; 


    const confirmation = window.confirm("Are you sure you want to delete this product?");

    if (confirmation) {
      try {
        const response = await fetch(`/api/products/${product._id}`, {
          method: "DELETE",
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to delete product");
        }

       



        router.push("/product-list");

      } catch (error) {
       console.log("error");
      }
    }

  }
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row items-start md:space-x-6">

        <div className="w-full md:w-1/2 mb-4 md:mb-0">
          {selectedImage && (
            <Image
              src={selectedImage}
              alt={title}
              className="w-full h-80 object-cover rounded-lg mb-2"
            />
          )}
          <div className="flex space-x-2">
            {[product?.thumbnail_image, ...(product?.images || [])].map(
              (image, index) =>
                image && (
                  <Image
                    key={index}
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className={`w-16 h-16 object-cover rounded-lg cursor-pointer ${selectedImage === image ? "border-2 border-black" : ""
                      }`}
                    onClick={() => handleImageClick(image)}
                  />
                )
            )}
          </div>
        </div>


        <div className="w-full md:w-1/2">
          {isEditing ? (
            <div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border border-gray-300 rounded-md p-2 w-full mb-4 outline-none"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border border-gray-300 rounded-md p-2 w-full mb-4 outline-none"
                rows="5"
              />
              <button
                style={{
                  background: 'linear-gradient(0deg, #444444 -17.86%, #202020 100%)',
                }}
                onClick={handleSave}
                className=" text-white px-4 py-2 rounded-md"
              >
                Save
              </button>
            </div>
          ) : (
            <div>
              <h1 className="text-2xl font-bold mb-2">{title}</h1>
              <p className="text-gray-700 mb-4">{description}</p>

              <div className="flex gap-3">
                <button
                  style={{
                    background: 'linear-gradient(0deg, #444444 -17.86%, #202020 100%)',
                  }}
                  onClick={handleEditToggle}
                  className=" text-white px-4 py-2 rounded-md mb-4"
                >
                  Edit
                </button>
                <button

                  onClick={handleDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded-md mb-4"
                >
                  delete
                </button>
              </div>
            </div>
          )}

          
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Tags:</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {product?.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-200 text-gray-800 px-2 py-1 rounded-md text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
