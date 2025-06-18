'use client';

import { useState } from 'react';
import Image from 'next/image';

interface Review {
  name: string;
  image: string;
  review: string;
  rating: number;
}

function ReviewCard({ review }: { review: Review }) {
  const [imgSrc, setImgSrc] = useState(review.image);

  return (
    <div className="min-w-60 h-96 bg-slate-50 rounded-lg flex-col flex max-w-64 bg-[url(/avng.jpg)] bg-cover">
      <Image
        src={imgSrc}
        alt={review.name}
        height={100}
        width={100}
        className="rounded-full h-36 w-36 my-5 mx-14"
        onError={() =>
          setImgSrc(
            'https://res.cloudinary.com/dn3jc0m8s/image/upload/v1750240073/15_qjtpgd.png'
          )
        }
      />
      <p className="text-center text-lg font-bold">{review.name}</p>
      <p className="p-2 text-center">{review.review}</p>
      <p className="text-center">
        Rating: <span className="font-semibold">{review.rating}</span> out of 5
      </p>
    </div>
  );
}

interface ReviewsListProps {
  reviews: Review[];
}

export default function ReviewsList({ reviews }: ReviewsListProps) {
  return (
    <div className="p-5 flex flex-row flex-wrap justify-center gap-5 w-full">
      {reviews.map((r) => (
        <ReviewCard key={r.name} review={r} />
      ))}
    </div>
  );
}
