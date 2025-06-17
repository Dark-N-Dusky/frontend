'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useState, useRef } from 'react';
import { CurrencyRupeeTwoTone } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '@/app/context/authContext';
import client from '@/lib/apolloClient';
import { GET_PRODUCT } from '@/queries/getProductDetails';

function ManageProductPageComponent() {
  const params = useSearchParams();
  const pid = useMemo(() => params.get('pid')?.toLowerCase() || '', [params]);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    top_points: 0.0,
    images: [] as File[],
    description: '',
    price: 0.0,
    offer: 0.0,
    detail: '',
    gallery: [] as File[],
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [isLoadingProduct, setIsLoadingProduct] = useState(!!pid);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const api = process.env.NEXT_PUBLIC_API || 'http://localhost:5000';
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
            setFormData((prev) => ({
              ...prev,
              name: product.name || '',
              category: product.category || '',
              top_points: parseFloat(product.top_points) || 0,
              description: product.description || '',
              price: parseFloat(product.price || 0),
              offer: parseFloat(product.offer_price || 0),
              detail: product.details || '',
            }));

            const imgUrls = product.media || [];
            const galleryUrls = (product.gallery || []).map(
              (g: { image_url: string }) => g.image_url
            );

            setImagePreviews(imgUrls);
            setGalleryPreviews(galleryUrls);
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

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'top_points' || name === 'price' || name === 'offer'
          ? parseFloat(value)
          : value,
    }));
  };

  const handleFileDrop = (
    type: 'images' | 'gallery',
    files: FileList | null
  ) => {
    if (!files) return;
    const fileArray = Array.from(files);
    const previewUrls = fileArray.map((file) => URL.createObjectURL(file));

    if (type === 'images') {
      setFormData((prev) => ({ ...prev, images: fileArray }));
      setImagePreviews(previewUrls);
    } else {
      setFormData((prev) => ({ ...prev, gallery: fileArray }));
      setGalleryPreviews(previewUrls);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (user?.token && !loading) {
      try {
        setIsSubmitting(true);

        const form = new FormData();

        form.append('name', formData.name);
        form.append('category', formData.category);
        form.append('top_points', formData.top_points.toString());
        form.append('description', formData.description);
        form.append('price', formData.price.toString());
        form.append('offer_price', formData.offer.toString());
        form.append('details', formData.detail);

        formData.images.forEach((file) => form.append('media', file));
        formData.gallery.forEach((file) => form.append('gallery', file));

        const url = pid
          ? `${api}/admin/products/${pid}`
          : `${api}/admin/products`;
        const method = pid ? 'put' : 'post';

        const res = await axios({
          method,
          url,
          data: form,
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'multipart/form-data',
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
        alert('Some error occurred');
      } finally {
        setIsSubmitting(false);
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
      top_points: 0.0,
      images: [],
      description: '',
      price: 0.0,
      offer: 0.0,
      detail: '',
      gallery: [],
    });
    setImagePreviews([]);
    setGalleryPreviews([]);
  };

  const inputClassName =
    'text-black my-2 px-2 py-1 rounded-md w-full focus:outline-none';
  const inputDivClassName = 'inline-block w-full text-left my-2';
  const dropzoneClass =
    'w-full border border-dashed border-white rounded-md p-4 my-2 text-sm text-gray-300 text-center cursor-pointer';

  const renderImagePreviews = (previews: string[]) => (
    <div className="flex gap-2 flex-wrap mt-2">
      {previews.map((src, idx) => (
        <img
          key={idx}
          src={src}
          alt={`preview-${idx}`}
          className="w-20 h-20 object-cover rounded"
        />
      ))}
    </div>
  );

  if (isLoadingProduct) {
    return (
      <div className="text-white text-center mt-10">Loading product...</div>
    );
  }

  return (
    <div className="bg-neutral-800 text-white px-4 py-8 flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center items-center bg-black p-4 w-max max-w-screen-md rounded-lg shadow-md"
      >
        <h1 className="text-3xl font-semibold m-2 mb-4 text-center">
          {pid ? 'Edit Product' : 'Create New Product'}
        </h1>

        <div className={inputDivClassName}>
          <label htmlFor="name">Product Name</label>
          <input
            type="text"
            name="name"
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
            value={formData.category}
            onChange={handleChange}
            className={inputClassName}
            placeholder="Product Category"
          />
        </div>

        <div className={inputDivClassName}>
          <label htmlFor="top_points">Rating</label>
          <input
            type="number"
            step="0.1"
            name="top_points"
            value={formData.top_points}
            onChange={handleChange}
            className={inputClassName}
            placeholder="4.5"
          />
        </div>

        {/* IMAGES Upload */}
        <div className={inputDivClassName}>
          <label>Product Images</label>
          <div
            className={dropzoneClass}
            onClick={() => imageInputRef.current?.click()}
            onDrop={(e) => {
              e.preventDefault();
              handleFileDrop('images', e.dataTransfer.files);
            }}
            onDragOver={(e) => e.preventDefault()}
          >
            Drag & drop or click to upload product images
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFileDrop('images', e.target.files)}
            />
          </div>
          {renderImagePreviews(imagePreviews)}
        </div>

        {/* DESCRIPTION */}
        <div className={inputDivClassName}>
          <label htmlFor="description">Short Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={inputClassName}
            placeholder="Short description"
            rows={3}
          />
        </div>

        {/* PRICE */}
        <div className={inputDivClassName}>
          <label htmlFor="price">Original Price</label>
          <span className={`${inputClassName} flex items-center bg-white`}>
            <CurrencyRupeeTwoTone className="text-neutral-600" />
            <input
              type="number"
              step="0.01"
              name="price"
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
            value={formData.detail}
            onChange={handleChange}
            className={inputClassName}
            placeholder="Detailed description"
            rows={5}
          />
        </div>

        {/* GALLERY Upload */}
        <div className={inputDivClassName}>
          <label>Gallery Images</label>
          <div
            className={dropzoneClass}
            onClick={() => galleryInputRef.current?.click()}
            onDrop={(e) => {
              e.preventDefault();
              handleFileDrop('gallery', e.dataTransfer.files);
            }}
            onDragOver={(e) => e.preventDefault()}
          >
            Drag & drop or click to upload gallery images
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFileDrop('gallery', e.target.files)}
            />
          </div>
          {renderImagePreviews(galleryPreviews)}
        </div>

        <div className="flex flex-row-reverse">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`m-2 px-4 py-2 rounded ${
              isSubmitting
                ? 'bg-orange-300 cursor-not-allowed'
                : 'bg-orange-500 hover:bg-orange-600'
            }`}
          >
            {isSubmitting ? 'Loading...' : pid ? 'Save' : 'Submit'}
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

export default function ProductPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ManageProductPageComponent />
    </Suspense>
  );
}
