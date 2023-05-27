import { Banner } from '@/types'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import { Button } from '../button'
import { CustomImage } from '../customImage'

interface ProductSlideBanner {
  data: Banner | undefined
  className?: string
}

export const ProductSlideBanner = ({ data, className }: ProductSlideBanner) => {
  if (!data) return <div></div>

  const router = useRouter()

  return (
    <div className={classNames('', className)}>
      <div className="relative w-fit mx-auto">
        <CustomImage
          src={data?.banner_cloud_storage_id?.url}
          imageClassName="object-cover aspect-[5/1]"
          className=""
        />

        <div className="absolute bottom-[24px] m-auto left-0 right-0 w-fit">
          <Button
            title="Xem thêm"
            className="min-w-fit w-[110px] border rounded-lg border-primary bg-primary-100"
            textClassName="text-primary"
            onClick={() => {
              router.push(data?.description_url)
            }}
          />
        </div>
      </div>
    </div>
  )
}
