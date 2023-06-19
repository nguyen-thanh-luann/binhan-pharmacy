import { SWR_KEY } from '@/constants'
import { useAttributeMinor } from '@/hooks'
import classNames from 'classnames'
import { twMerge } from 'tailwind-merge'
import { ProductItemLoading } from '../product'
import { ProductsByAttributeMinor } from './productsByAttributeMinor'



interface ListProductByAttributeMinorProps {
  className?: string
}

export const FirstSectionProductByAttributeMinor = ({
  className,
}: ListProductByAttributeMinorProps) => {
  const { attributeMinors, isValidating: attributeMinorLoading } = useAttributeMinor({
    key: SWR_KEY.get_attribute_minor_list,
    params: {
      view_state: 'home',
    },
  })

  const [firstAttribute, ..._] = attributeMinors

  return (
    <div className={twMerge(classNames(``, className))}>
      {attributeMinorLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12">
          {Array.from({ length: 5 }).map((_, index) => (
            <ProductItemLoading key={index} />
          ))}
        </div>
      ) : firstAttribute ? (
        <div>
          <ProductsByAttributeMinor
            className="mb-24"
            key={firstAttribute?.attribute_id}
            atribute={firstAttribute}
          />
        </div>
      ) : null}
    </div>
  )
}
