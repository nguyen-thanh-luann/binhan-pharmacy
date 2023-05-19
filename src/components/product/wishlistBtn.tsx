import { HeartIconOutline, HeartIconSolid } from '@/assets'
import { Spinner } from '../spinner'
import { twMerge } from 'tailwind-merge'
import classNames from 'classnames'

interface ButtonWishlistProps {
  status?: boolean
  onChange?: (_: boolean) => void
  isLoading?: boolean
  className?: string
  like_count?: number

}

const WishlistBtn = ({ status, onChange, isLoading, className, like_count = 0 }: ButtonWishlistProps) => {
  
  return (
    <button
      onClick={() => onChange?.(!status)}
      className={twMerge(classNames(`p-8 border border-gray-100 w-fit`, className))}
    >
      {isLoading ? (
        <Spinner className='text-xl'/>
      ) : (
        <div className="text-xl flex gap-8">
            {status ? <HeartIconSolid className="text-red" /> : <HeartIconOutline />}
            {like_count > 0 ? <p className='text-base'>{like_count}</p> : null}
        </div>
      )}
    </button>
  )
}

export default WishlistBtn
