import classNames from 'classnames'
import React, { useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { Tabs } from '../tabs'
import { ProductDetailPageContainer } from '@/templates'
import { Rating } from './ratingTab'
import { Comment } from './commentTab'

interface ProductTabsProps {
  className?: string
  product_id: number
}

export const ProductTabs = ({ className, product_id }: ProductTabsProps) => {
  const [currentTab, setCurrentTab] = useState<string>('rating')

  return (
    <ProductDetailPageContainer>
      <div className={twMerge(classNames(`p-12`, className))}>
        <Tabs
          list={[
            { label: 'Đánh giá', value: 'rating' },
            { label: 'Bình luận', value: 'comment' },
          ]}
          tabActive={currentTab}
          onChange={(val: string) => setCurrentTab(val)}
          className="bg-white w-fit mb-12"
          labelClassName="text-text-color font-bold text-lg leading-9 capitalize px-16 border-r border-gray-200 last:border-none"
          tabActiveClassName="!text-primary"
        />

        <div>
          {currentTab === 'rating' ? <Rating /> : null}
          
          {currentTab === 'comment' ? <Comment product_id={product_id}/> : null}
       </div>
      </div>
    </ProductDetailPageContainer>
  )
}
