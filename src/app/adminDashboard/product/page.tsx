'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { CurrencyRupeeTwoTone } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '@/app/context/authContext';
import client from '@/lib/apolloClient';
import { GET_PRODUCT } from '@/queries/getProductDetails';

function ManageProductPageComponent() {
  const params = useSearchParams();
  const pid = useMemo(
    () => params.get('pid')?.toLowerCase().toString() || '',
    [params]
  );
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    rating: 0.0,
    images: [''],
    description: '',
    price: 0.0,
    offer: 0.0,
    detail: '',
    gallery: [''],
  });

  const [imagesInput, setImagesInput] = useState('');
  const [galleryInput, setGalleryInput] = useState('');
  const [isLoadingProduct, setIsLoadingProduct] = useState(!!pid);

  const api = process.env.NEXT_PUBLIC_API || 'localhost';
  const { user, loading } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      if (pid) {
        try {
          const { data } = await client.query({
            query: GET_PRODUCT,
            variables: { pid },
            fetchPolicy: 'no-cache',
          });

          const product = data?.product;
          if (product) {
            setFormData({
              name: product.name || '',
              category: product.category || '',
              rating: parseFloat(product.top_points || 0),
              images: product.media || [],
              description: product.description || '',
              price: parseFloat(product.price || 0),
              offer: parseFloat(product.offer_price || 0),
              detail: product.details || '',
              gallery: (product.gallery || []).map(
                (g: { image_url: string }) => g.image_url
              ),
            });
            setImagesInput((product.media || []).join(', '));
            setGalleryInput(
              (product.gallery || [])
                .map((g: { image_url: string }) => g.image_url)
                .join(', ')
            );
          }
        } catch (err) {
          console.error('Failed to load product:', err);
        } finally {
          setIsLoadingProduct(false);
        }
      }
    };

    fetchProduct();
  }, [pid]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'images') {
      setImagesInput(value);
      setFormData((prev) => ({
        ...prev,
        images: value
          .split(',')
          .map((url) => url.trim())
          .filter(Boolean),
      }));
    } else if (name === 'gallery') {
      setGalleryInput(value);
      setFormData((prev) => ({
        ...prev,
        gallery: value
          .split(',')
          .map((url) => url.trim())
          .filter(Boolean),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]:
          name === 'rating' || name === 'price' || name === 'offer'
            ? parseFloat(value)
            : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (user?.token && !loading) {
      try {
        const payload = {
          name: formData.name,
          category: formData.category,
          media: formData.images,
          description: formData.description,
          price: formData.price,
          offer_price: formData.offer,
          details: formData.detail,
          top_points: formData.rating.toString(),
          gallery: formData.gallery.map((url) => ({ image_url: url })),
        };

        const url = pid
          ? `${api}/admin/products/${pid}`
          : `${api}/admin/products`;

        const method = pid ? 'put' : 'post';

        const res = await axios[method](url, payload, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });

        if (res.status === 200 || res.status === 201) {
          alert(
            pid
              ? 'Product updated successfully!'
              : 'Product added successfully!'
          );
          router.push('/adminDashboard');
        }
      } catch (err) {
        console.error('Error submitting form:', err);
      }
    }
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push('/adminDashboard');
  };

  const handleReset = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setFormData({
      name: '',
      category: '',
      rating: 0.0,
      images: [''],
      description: '',
      price: 0.0,
      offer: 0.0,
      detail: '',
      gallery: [''],
    });
    setImagesInput('');
    setGalleryInput('');
  };

  const inputClassName =
    'text-black my-2 px-2 py-1 rounded-md w-full focus:outline-none';
  const inputDivClassName = 'inline-block w-full text-left my-2';

  if (isLoadingProduct) {
    return (
      <div className="text-white text-center mt-10">Loading product...</div>
    );
  }

  return (
    <div className="bg-neutral-800 text-white px-4 py-8 flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center items-center bg-black p-4 w-max rounded-lg shadow-md"
      >
        <h1 className="text-3xl font-semibold m-2 mb-4 text-center">
          {pid ? 'Edit Product' : 'Create New Product'}
        </h1>

        <div className={inputDivClassName}>
          <label htmlFor="name" className="block">
            Product Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className={inputClassName}
            placeholder="My Great Product"
            autoFocus
          />
        </div>

        <div className={inputDivClassName}>
          <label htmlFor="category">Category</label>
          <input
            type="text"
            name="category"
            id="category"
            value={formData.category}
            onChange={handleChange}
            className={inputClassName}
            placeholder="Product Category"
          />
        </div>

        <div className={inputDivClassName}>
          <label htmlFor="rating">Rating</label>
          <input
            type="number"
            step="0.1"
            name="rating"
            id="rating"
            value={formData.rating}
            onChange={handleChange}
            className={inputClassName}
            placeholder="4.5"
          />
        </div>

        <div className={inputDivClassName}>
          <label htmlFor="images">Images</label>
          <input
            type="text"
            name="images"
            id="images"
            value={imagesInput}
            onChange={handleChange}
            className={inputClassName}
            placeholder="url1, url2, url3"
          />
        </div>

        <div className={inputDivClassName}>
          <label htmlFor="description">Short Description</label>
          <textarea
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
            className={inputClassName}
            placeholder="Short description"
            rows={3}
          />
        </div>

        <div className={inputDivClassName}>
          <label htmlFor="price">Original Price</label>
          <span className={`${inputClassName} flex items-center bg-white`}>
            <CurrencyRupeeTwoTone className="text-neutral-600" />
            <input
              type="number"
              step="0.01"
              name="price"
              id="price"
              value={formData.price}
              onChange={handleChange}
              className="focus:outline-none w-full"
              placeholder="199.9"
            />
          </span>
        </div>

        <div className={inputDivClassName}>
          <label htmlFor="offer">Offer Price</label>
          <span className={`${inputClassName} flex items-center bg-white`}>
            <CurrencyRupeeTwoTone className="text-neutral-600" />
            <input
              type="number"
              step="0.01"
              name="offer"
              id="offer"
              value={formData.offer}
              onChange={handleChange}
              className="focus:outline-none w-full"
              placeholder="99.9"
            />
          </span>
        </div>

        <div className={inputDivClassName}>
          <label htmlFor="detail">Detailed Description</label>
          <textarea
            name="detail"
            id="detail"
            value={formData.detail}
            onChange={handleChange}
            className={inputClassName}
            placeholder="Detailed description"
            rows={5}
          />
        </div>

        <div className={inputDivClassName}>
          <label htmlFor="gallery">Gallery</label>
          <input
            type="text"
            name="gallery"
            id="gallery"
            value={galleryInput}
            onChange={handleChange}
            className={inputClassName}
            placeholder="url1, url2"
          />
        </div>

        <div className="flex flex-row-reverse">
          <button
            type="submit"
            className="m-2 bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded"
          >
            {pid ? 'Save' : 'Submit'}
          </button>
          <button
            className={`${
              pid
                ? 'hover:bg-gray-600 border border-gray-600'
                : 'hover:bg-red-600 border border-red-600'
            } m-2 px-4 py-2 rounded`}
            onClick={pid ? handleCancel : handleReset}
          >
            {pid ? 'Cancel' : 'Reset'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function productPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ManageProductPageComponent />
    </Suspense>
  );
}
