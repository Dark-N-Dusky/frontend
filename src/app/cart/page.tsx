'use client';

import { useQuery } from '@apollo/client';
import { useAuth } from '../context/authContext';
import CartItem from '@/components/cartItem/page';
import { useEffect, useState } from 'react';
import { GET_CART_ITEMS, GET_PRODUCT_PRICE } from '@/queries/getCartItems';
import client from '@/lib/apolloClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Cart() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [subtotal, setSubtotal] = useState(0);
  const [pricesMap, setPricesMap] = useState({});

  const { data, loading, error } = useQuery(GET_CART_ITEMS, {
    client,
    variables: { uid: user?.uid },
    skip: !user?.uid,
    fetchPolicy: 'no-cache',
  });

  useEffect(() => {
    if (!authLoading && !user?.token) router.push('/login');
  }, [user, router]);

  useEffect(() => {
    if (error) {
      console.error('Error fetching cart items:', error);
    }
  }, [error]);

  const cartItems: { product_id: string; quantity: number }[] | undefined =
    data?.user?.cart;

  useEffect(() => {
    const fetchPrices = async () => {
      if (!data?.user?.cart) return;

      const cartItems = data.user.cart;

      const promises = cartItems.map(
        (item: { product_id: string; quantity: number }) =>
          client.query({
            query: GET_PRODUCT_PRICE,
            variables: { pid: item.product_id },
            fetchPolicy: 'no-cache',
          })
      );

      const results = await Promise.all(promises);

      let total = 0;
      const map: Record<string, number> = {};

      results.forEach((res, idx) => {
        const price = res.data?.product?.price || 0;
        const quantity = cartItems[idx].quantity;
        map[cartItems[idx].product_id] = price;
        total += price * quantity;
      });

      setPricesMap(map);
      setSubtotal(total);
    };

    if (data?.user?.cart) {
      fetchPrices();
    }
  }, [data]);

  const delivery = cartItems && cartItems.length > 0 ? 40 : 0;
  const tax =
    cartItems && cartItems.length > 0 ? +(0.18 * subtotal).toFixed(2) : 0;
  const cartTotal =
    cartItems && cartItems.length > 0
      ? Math.round(subtotal + delivery + tax)
      : 0;
  const isCartEmpty = !cartItems || cartItems.length === 0;

  if (loading) return <p>Loading cart...</p>;
  if (error) return <p>Error loading cart data.</p>;

  const cartTotalClasses = 'flex flex-row justify-between p-2 my-3';

  return (
    <div className="bg-neutral-800 flex flex-col-reverse md:flex-row w-full content-stretch p-4">
      <div className=" bg-black md:py-10 py-6 md:px-3 px-2 rounded-2xl md:m-4 w-full my-4">
        <p className="text-4xl mb-8 text-center text-white">Shopping Cart</p>
        <hr className="mb-5" />

        {cartItems && cartItems.length > 0 ? (
          cartItems.map((item, index) => (
            <CartItem
              key={index}
              productId={item.product_id}
              quantity={item.quantity}
            />
          ))
        ) : (
          <p className="text-white text-xl text-center mt-8">
            Your cart is empty
          </p>
        )}
      </div>

      <div className=" bg-black md:py-10 py-6 md:px-3 px-2 rounded-2xl w-full md:w-1/4 md:m-4 my-4">
        <p className="text-4xl mb-8 text-center text-white">Cart Total</p>
        <hr className="mb-5" />
        <div className="text-white md:mt-4">
          <div className={`${cartTotalClasses} border-b border-b-gray-400`}>
            <span>Subtotal</span>
            <span>&#8377;{subtotal}</span>
          </div>
          <div className={`${cartTotalClasses} border-b border-b-gray-400`}>
            <span>Delivery Charges</span>
            <span>&#8377;{delivery}</span>
          </div>
          <div
            className={`${cartTotalClasses} border-b-2 border-dashed border-b-gray-400`}
          >
            <span>Taxes</span>
            <span>&#8377;{tax}</span>
          </div>
          <div className={`${cartTotalClasses} font-bold text-lg`}>
            <span>Total</span>
            <span className="font-normal">&#8377; {cartTotal}</span>
          </div>
        </div>

        <Link
          href={isCartEmpty ? '#' : '/cart/checkout'}
          className={`text-white border-2 px-4 py-3 font-bold w-full text-center inline-block md:sticky md:top-4 rounded-md
    ${
      isCartEmpty
        ? 'border-gray-400 bg-gray-600 pointer-events-none cursor-not-allowed'
        : 'border-green-400 hover:bg-green-400 hover:text-black'
    }
  `}
          aria-disabled={isCartEmpty}
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
