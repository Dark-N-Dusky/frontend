'use client';

import ProductPage from '@/components/productPage/page';
import { GET_PRODUCTS } from '@/queries/getProducts';
import { useQuery } from '@apollo/client';
import client from '@/lib/apolloClient';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Product {
  name: string;
  pid: string;
  media: string[];
  description: string;
  price: number;
  offer_price: number;
  category: string;
}

function SearchComponent() {
  const { data, loading, error } = useQuery(GET_PRODUCTS, {
    client,
    fetchPolicy: 'no-cache',
  });
  const searchParams = useSearchParams();
  const router = useRouter();

  const categoryParam = searchParams.get('c')?.toLowerCase();
  const searchParam = searchParams.get('s')?.toLowerCase() || '';

  const [searchInput, setSearchInput] = useState(searchParam);

  useEffect(() => {
    if (error) {
      console.error('Error fetching products:', error);
    }
  }, [error]);

  const filteredProducts = useMemo(() => {
    if (!data?.products) return [];

    return data.products.filter((product: Product) => {
      const matchesCategory = categoryParam
        ? product.category.toLowerCase() === categoryParam
        : true;

      const matchesSearch = searchParam
        ? product.name.toLowerCase().includes(searchParam)
        : true;

      return matchesCategory && matchesSearch;
    });
  }, [data, categoryParam, searchParam]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);

    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('s', value);
    } else {
      params.delete('s');
    }
    router.push(`?${params.toString()}`);
  };

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>Error loading products.</p>;

  return (
    <div className="p-4 bg-neutral-800 flex flex-wrap flex-col">
      <input
        type="text"
        value={searchInput}
        onChange={handleSearchChange}
        placeholder="Search products..."
        className="mb-4 p-2 border border-gray-300 rounded w-full bg-black text-white"
      />

      <div className="flex flex-row flex-wrap w-full md:w-full p-3 justify-center">
        {filteredProducts.map((product: any, index: number) => (
          <ProductPage
            key={product.pid}
            name={product.name}
            pid={product.pid}
            media={product.media}
            description={product.description}
            price={product.price}
            offer_price={product.offer_price}
          />
        ))}
      </div>
    </div>
  );
}

export default function Search() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <SearchComponent />
    </Suspense>
  );
}
