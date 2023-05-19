import classNames from 'classnames'

interface RatingItemLoadingProps {
  className?: string
}

export const RatingItemLoading = ({ className }: RatingItemLoadingProps) => {
  return (
    <div
      className={classNames(
        'animate-pulse rounded-md bg-white border border-gray-100 p-12 flex gap-12',
        className
      )}
    >
      <div className="w-[32px] h-[32px] rounded-full bg-gray-300"></div>
      <div className="">
        <div className="w-[150px] mb-8 h-12 rounded-full bg-gray-300"></div>
        <div className="w-[80px] mb-8 h-12 rounded-full bg-gray-300"></div>
        <div className="w-[150px] h-12 rounded-full bg-gray-300"></div>
      </div>
    </div>
  )
}
