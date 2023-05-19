import { SWR_KEY } from '@/constants'
import { useAttributeMinor } from '@/hooks'
import React from 'react'
import { ProductsByAttributeMinor } from './productsByAttributeMinor'
import { isArrayHasValue } from '@/helper'
import { twMerge } from 'tailwind-merge'
import classNames from 'classnames'

interface ListProductByAttributeMinorProps {
  className?: string
}

export const ListProductByAttributeMinor = ({ className }: ListProductByAttributeMinorProps) => {
  const { attributeMinors, isValidating: attributeMinorLoading } = useAttributeMinor({
    key: SWR_KEY.get_attribute_minor_list,
    params: {},
  })

  return (
    <div className={twMerge(classNames(``, className))}>
      {attributeMinorLoading ? (
        <ProductsByAttributeMinor
          className="mb-24"
          atribute={undefined}
          isValidating={attributeMinorLoading}
        />
      ) : isArrayHasValue(attributeMinors) ? (
        attributeMinors?.map((attribute) => (
          <ProductsByAttributeMinor
            className="mb-24"
            key={attribute?.attribute_id}
            atribute={attribute}
          />
        ))
      ) : null}
    </div>
  )
}
