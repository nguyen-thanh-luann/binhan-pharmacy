import { SWR_KEY } from '@/constants'
import { isArrayHasValue } from '@/helper'
import { useProductDescription } from '@/hooks'
import { ProductClassification } from '@/types'
import classNames from 'classnames'
import { twMerge } from 'tailwind-merge'
import { Spinner } from '../spinner'
import { PlanDescriptionView } from './planDescriptionView'
import { TabDescriptionView } from './tabDescriptionView'

interface ProductDescriptionProps {
  product_id: number
  className?: string
  product_classification_type: ProductClassification
}

export const ProductDescription = ({
  product_id,
  className,
  product_classification_type = 'medicine',
}: ProductDescriptionProps) => {
  const { data, isValidating } = useProductDescription({
    key: `${SWR_KEY.get_product_description}_${product_id}`,
    product_id,
  })

  return (
    <div className={twMerge(classNames(``, className))}>
      {isValidating ? (
        <div className="flex-center my-24">
          <Spinner />
        </div>
      ) : isArrayHasValue(data) && data ? (
        <div>
          {product_classification_type === 'medicine' ? (
            <PlanDescriptionView data={data} />
          ) : (
            <TabDescriptionView data={data} />
          )}
        </div>
      ) : null}
    </div>
  )
}
