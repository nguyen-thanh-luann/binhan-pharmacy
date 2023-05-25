import classNames from 'classnames'

const concaveClassName =
  'w-[10px] h-[10px] border border-solid border-gray-300 rounded-full absolute top-1/2 transform -translate-y-1/2 bg-white '

export const PromotionLoading = () => {
  return (
    <div
      className={classNames(
        'animate-pulse px-12 py-4 w-fit h-fit bg-gray-300 relative rounded-[5px] overflow-hidden'
      )}
    >
      <span className="absolute inset-0 border border-solid border-gray-300 rounded-[5px]" />
      <span className={classNames(concaveClassName, 'left-[-4px]')} />
      <span className={classNames(concaveClassName, 'right-[-4px]')} />
      <span className="text-xs font-semibold line-clamp-1 text-primary w-[100px] h-[20px]"></span>
    </div>
  )
}
