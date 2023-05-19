import { Star } from "../star"

interface RatingCountProps {
  star: number
  starQuantity: number
  totalQuantity: number
}

export const RatingCount = ({ star, starQuantity, totalQuantity }: RatingCountProps) => {
  return (
    <div className="flex items-center">
      <Star ratingValue={star * 20} readonly size={13} allowHalfIcon />
      <div className="relative ml-8 h-8 rounded-full w-[140px] bg-gray-400">
        <div
          style={{ width: `${(starQuantity / totalQuantity) * 100}%` }}
          className="absolute left-0 top-0 bottom-0 bg-primary rounded-full"
        ></div>
      </div>
      <span className="ml-8 text-text-color font-semibold">{starQuantity}</span>
    </div>
  )
}
