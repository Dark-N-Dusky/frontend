import { Star } from '@mui/icons-material';
import { StarHalf } from '@mui/icons-material';

interface RatingStarProps {
  rating: number;
}

export default function RatingStar({ rating }: RatingStarProps) {
  let stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<Star key={i} className="text-yellow-400" />);
    } else {
      if (i - 0.5 <= rating) {
        stars.push(<StarHalf key={i} className="text-yellow-400" />);
      } else {
        stars.push(<Star key={i} className="text-gray-400" />);
      }
    }
  }
  return (
    <div className="flex flex-row items-center content-center justify-center md:justify-start my-2">
      {stars} <span className="ms-1">{rating} out of 5 rating</span>
    </div>
  );
}
