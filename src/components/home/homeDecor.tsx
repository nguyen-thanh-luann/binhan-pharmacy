import { HomeDecorData } from '@/data'
import classNames from 'classnames'
import { Image } from '../image'

interface HomeDecorProps {
  className?: string
}

export const HomeDecor = ({ className }: HomeDecorProps) => {
  return (
    <div
      className={classNames(
        'p-24 relative flex items-center home-decor bg-cover overflow-hidden',
        className
      )}
    >
      <div className="container my-auto z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-32">
        {HomeDecorData.map((value, index) => (
          <div className="z-10" key={index}>
            <Image
              imageClassName="w-[60px] h-[60px] object-cover"
              className="mb-12"
              src={value?.image}
            />

            <p className="text-lg uppercase mb-12 font-bold">{value.title}</p>

            <p className="text-md">{value.content}</p>
          </div>
        ))}
      </div>

      <div className="absolute top-0 bottom-0 left-0 right-0 background-default z-0"></div>

      {/* <div className="absolute top-0 bottom-0 -right-[14%]">
        <Image src={homeDecord} imageClassName="h-[250px] w-full" className="h-[150px]" />
      </div> */}
    </div>
  )
}
