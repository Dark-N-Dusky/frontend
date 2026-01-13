import Link from 'next/link';
import Image from 'next/image';
import Carousel from '@/components/carousel/page';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import ProductPage from '@/components/productPage/page';
import ReviewsList from '@/components/customerReview';

const showStoppers = [
  {
    pid: 'ghghghghgh',
    name: 'Leather Belts',
    media: ['/belt2-5.jpg'],
    description: 'Genuine leather belt for men',
    price: 999,
    offer_price: 499,
  },
  {
    pid: 'ghghghghgh',
    name: 'Leather Belts',
    media: ['/belt2-5.jpg'],
    description: 'Genuine leather belt for men',
    price: 999,
    offer_price: 499,
  },
  {
    pid: 'ghghghghgh',
    name: 'Leather Belts',
    media: ['/belt2-5.jpg'],
    description: 'Genuine leather belt for men',
    price: 999,
    offer_price: 499,
  },
  {
    pid: 'ghghghghgh',
    name: 'Leather Belts',
    media: ['/belt2-5.jpg'],
    description: 'Genuine leather belt for men',
    price: 999,
    offer_price: 499,
  },
  {
    pid: 'ghghghghgh',
    name: 'Leather Belts',
    media: ['/belt2-5.jpg'],
    description: 'Genuine leather belt for men',
    price: 999,
    offer_price: 499,
  },
  {
    pid: 'ghghghghgh',
    name: 'Leather Belts',
    media: ['/belt2-5.jpg'],
    description: 'Genuine leather belt for men',
    price: 999,
    offer_price: 499,
  },
  {
    pid: 'ghghghghgh',
    name: 'Leather Belts',
    media: ['/belt2-5.jpg'],
    description: 'Genuine leather belt for men',
    price: 999,
    offer_price: 499,
  },
];

const reviews = [
  {
    name: 'Ajay Kumar',
    image: 'https://avatar.iran.liara.run/public/3',
    review:
      'Great website, totally loved it. The layout is very clean and user-friendly. Would definitely recommend to friends!',
    rating: 4.5,
  },
  {
    name: 'Sneha Reddy',
    image: 'https://avatar.iran.liara.run/public/79',
    review:
      'I found the website very helpful and easy to navigate. The content was well-organized and visually appealing.',
    rating: 4.2,
  },
  {
    name: 'Rajesh Mehra',
    image: 'https://avatar.iran.liara.run/public/34',
    review:
      'A very well-designed site with plenty of useful features. I had a smooth experience throughout.',
    rating: 4.0,
  },
  {
    name: 'Priya Sharma',
    image: 'https://avatar.iran.liara.run/public/71',
    review:
      'I really enjoyed using this site. The interface is clean and everything loads quickly. Great job!',
    rating: 4.7,
  },
  {
    name: 'Arun Verma',
    image: 'https://avatar.iran.liara.run/public/15',
    review:
      'The site exceeded my expectations. It’s intuitive and well-structured. I found exactly what I was looking for.',
    rating: 4.3,
  },
];

export default function Home() {
  const images = [
    'https://res.cloudinary.com/dn3jc0m8s/image/upload/v1768318740/img2_pap23w.png',
    'https://res.cloudinary.com/dn3jc0m8s/image/upload/v1768318689/img4_bc38dl.png',
    'https://res.cloudinary.com/dn3jc0m8s/image/upload/v1768318687/img3_l4yhnk.png',
    'https://res.cloudinary.com/dn3jc0m8s/image/upload/v1768318735/img1_b087do.png',
  ];
  return (
    <div className="w-full overflow-x-hidden bg-black">
      <Carousel images={images} divHeightMd="150vh" divHeightNormal="80vh" />
      <h2 className="text-center text-white font-semibold bg-gray-900 p-3 text-2xl uppercase">
        Shop now
      </h2>

      <div className="bg-black text-white py-4">
        <p className="text-white text-center text-3xl font-semibold pb-2">
          Top Categories
        </p>
        <div className="flex justify-around flex-wrap">
          <Link href="/product?s=belt" className="m-6">
            <Image
              className="rounded-full mb-2 border-[0.3rem] border-white"
              src="https://res.cloudinary.com/dn3jc0m8s/image/upload/v1768319126/belt2-5_kpybbh.jpg"
              alt="Product - Belt"
              height={180}
              width={180}
            />
            <p className="text-center text-lg">Belts</p>
          </Link>
          <Link href="/product?s=wallet" className="m-6">
            <Image
              className="rounded-full mb-2 border-[0.3rem] border-white"
              src="https://res.cloudinary.com/dn3jc0m8s/image/upload/v1768319481/p1_aw071p.png"
              alt="Product - Wallet"
              height={180}
              width={180}
            />
            <p className="text-center text-lg">Wallets</p>
          </Link>
          {/* <Link href="/product" className="m-6">
            <Image
              className="rounded-full mb-2 border-[0.3rem] border-white"
              src="/belt2-5.jpg"
              alt="Product - Belt"
              height={180}
              width={180}
            />
            <p className="text-center text-lg">Belts</p>
          </Link>
          <Link href="/product" className="m-6">
            <Image
              className="rounded-full mb-2 border-[0.3rem] border-white"
              src="/belt2-5.jpg"
              alt="Product - Belt"
              height={180}
              width={180}
            />
            <p className="text-center text-lg">Belts</p>
          </Link> */}
          <Link href="/product" className="m-6">
            <Image
              className="rounded-full mb-2 border-[0.3rem] border-white"
              src="https://res.cloudinary.com/dn3jc0m8s/image/upload/v1768319366/leather-products_jambcv.jpg"
              alt="Product - All"
              height={180}
              width={180}
            />
            <p className="text-center text-lg">Explore more</p>
          </Link>
        </div>
      </div>

      <div className="luxury p-4 backdrop-brightness-50 bg-[url(https://res.cloudinary.com/dn3jc0m8s/image/upload/v1750235529/portrait-wood_zcx7c6.jpg)] md:bg-[url(https://res.cloudinary.com/dn3jc0m8s/image/upload/v1750235528/landscape-wood_tveu1g.jpg)]">
        <p className="text-white text-center text-3xl font-semibold pb-2">
          Luxurious Fineness
        </p>

        <div className="flex flex-col md:flex-row shadow-xl bg-black m-4 text-white rounded-lg">
          <Image
            src="https://res.cloudinary.com/dn3jc0m8s/image/upload/v1768320624/belts_eibpgp.png"
            className="rounded-lg"
            alt=""
            width={500}
            height={200}
          />
          <div className="p-4">
            <p className="text-2xl font-bold">Gifts for Him</p>
            <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              Inventore doloribus id pariatur facilis qui voluptas ipsum,
              molestiae, neque earum, repudiandae fugiat atque doloremque. Quas
              rerum obcaecati, sed ab accusamus quasi id molestias provident
              aliquid non ducimus dolorum necessitatibus beatae deserunt
              molestiae veniam expedita cumque laboriosam commodi, aliquam
            </p>
            <p className="text-lg my-4">
              Starting @ <span className="bg-red-600">Rs. 199</span>
            </p>
            <Link href="/product">
              <button className="p-2 border border-white rounded-md transition hover:bg-white hover:text-black w-full md:w-max text-center">
                Shop now
              </button>
            </Link>
          </div>
        </div>

        <div className="flex flex-col md:flex-row shadow-xl bg-black m-4 text-white rounded-lg">
          <Image
            src="https://res.cloudinary.com/dn3jc0m8s/image/upload/v1768320640/purses_otjz1h.png"
            className="rounded-lg"
            alt=""
            width={500}
            height={200}
          />
          <div className="p-4">
            <p className="text-2xl font-bold">Gifts for Her</p>
            <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              Inventore doloribus id pariatur facilis qui voluptas ipsum,
              molestiae, neque earum, repudiandae fugiat atque doloremque. Quas
              rerum obcaecati, sed ab accusamus quasi id molestias provident
              aliquid non ducimus dolorum necessitatibus beatae deserunt
              molestiae veniam expedita cumque laboriosam commodi, aliquam
            </p>
            <p className="text-lg my-4">
              Starting @ <span className="bg-red-600">Rs. 199</span>
            </p>
            <Link href="/product">
              <button className="p-2 border border-white rounded-md transition hover:bg-white hover:text-black w-full md:w-max text-center">
                Shop now
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="overflow-hidden w-full bg-neutral-800">
        <p className="text-white text-3xl text-center font-bold py-5 bg-black">
          Show Stopper
        </p>
        <div className="flex flex-row flex-wrap justify-center gap-3 p-5">
          {showStoppers.map((i) => (
            <ProductPage
              key={i.pid}
              name={i.name}
              pid={i.pid}
              media={i.media}
              description={i.description}
              price={i.price}
              offer_price={i.offer_price}
            />
          ))}
        </div>
        <div className="w-full overflow-x-scroll no-scrollbar"></div>
      </div>

      <div className="bg-neutral-900 w-full overflow-hidden">
        <p className="text-white text-3xl text-center font-bold py-5">
          Customer Satisfaction
        </p>
        <div className="p-5 flex flex-row flex-wrap justify-center gap-5 w-full">
          <ReviewsList reviews={reviews} />
        </div>
      </div>
      <div className="bg-slate-50 flex flex-col md:flex-row items-center">
        <div className="flex flex-row">
          <KeyboardReturnIcon
            className="text-white bg-slate-800 rounded-full p-2 mx-4 my-4 md:my-0"
            sx={{ fontSize: '4rem' }}
          />
          <p className="mx-4 text-3xl md:ml-8 font-semibold flex align-middle items-center">
            EASY RETURN & REFUND POLICY
          </p>
        </div>
        <div className="flex flex-row align-middle justify-center md:justify-end h-max w-full md:w-1/2">
          <Link
            href="/return"
            className="bg-zinc-400 hover:bg-zinc-500 rounded-lg text-xl font-semibold m-3 py-4 px-8"
          >
            Return
          </Link>
          <Link
            href="/order"
            className="bg-zinc-400 hover:bg-zinc-500 rounded-lg text-xl font-semibold m-3 py-4 px-8"
          >
            Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
