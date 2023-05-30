import { HEADER_GROUP_HEIGHT, SWR_KEY } from '@/constants'
import {
  getTabIndexInProductDesc,
  isArrayHasValue,
  mergeProductDescriptionContent,
  scrollIntoElementById,
} from '@/helper'
import { useProductDescription } from '@/hooks'
import { ProductDetailPageContainer } from '@/templates'
import { ProductDescription as IProductDescription, ProductDescriptionChild } from '@/types'
import classNames from 'classnames'
import { useEffect, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { Spinner } from '../spinner'
import { Tabs } from '../tabs'
import { DescriptionContent } from './descriptionContent'
import { DescriptionMenu } from './descriptionMenu'
import { DescriptionMenuMobile } from './descriptionMenuMobile'

interface ProductDescriptionProps {
  product_id: number
  className?: string
}

export const ProductDescription = ({ product_id, className }: ProductDescriptionProps) => {
  // use currentDescCategory for detect desciption have tab or not
  const [currentDescCategory, setCurrentDescCategory] = useState<IProductDescription>()
  const [currentTab, setCurrentTab] = useState<string>('')
  const [currentDesc, setCurrentDesc] = useState<String>('')
  const [currentDescId, setCurrentDescId] = useState<number>()
  const descriptionContentRef = useRef<any>(null)

  const { data, isValidating } = useProductDescription({
    key: `${SWR_KEY.get_product_description}_${product_id}`,
    product_id,
  })

  const handleCategoryClick = (data: IProductDescription | ProductDescriptionChild) => {
    scrollIntoElementById(
      `desc_category_${(data as IProductDescription).category_id}`,
      HEADER_GROUP_HEIGHT * 2
    ) // scroll distance from top a space == header group height

    if (currentDescId !== data?.category_id && !descriptionContentRef?.current?.show) {
      descriptionContentRef?.current?.setShow(true)
    }
    // console.log(descriptionContentRef?.current?.setShow(true))

    setCurrentDescCategory(data as IProductDescription)
  }

  // handle when user select description category when data load success
  useEffect(() => {
    if (isArrayHasValue(currentDescCategory?.tab)) {
      setCurrentTab(currentDescCategory?.tab?.[0]?.tab_id.toString() || '')
      setCurrentDesc(
        `${currentDescCategory?.tab?.[0]?.content || ''} 
        ${currentDescCategory?.tab?.[0]?.extra_content || ''}`
      )
    } else {
      setCurrentDesc(mergeProductDescriptionContent(data || []))
    }
  }, [data, currentDescCategory])

  // change tab content when user select order tab in description
  useEffect(() => {
    const tabIndex = getTabIndexInProductDesc(currentDescCategory, currentTab)
    if (tabIndex !== -1) {
      setCurrentDesc(
        `${currentDescCategory?.tab?.[tabIndex]?.content || ''} 
        ${currentDescCategory?.tab?.[tabIndex]?.extra_content || ''}`
      )
    }
  }, [currentTab])

  return (
    <div className={twMerge(classNames(``, className))}>
      {isValidating ? (
        <div className="flex-center my-24">
          <Spinner />
        </div>
      ) : isArrayHasValue(data) ? (
          <div>
            
          {/* Description menu in mobile */}
          <DescriptionMenuMobile
            className="sticky block md:hidden top-header_mobile_height bg-white z-30 shadow-sm"
            data={data || []}
            currentDescId={currentDescId}
          />

          <ProductDetailPageContainer
            leftChildren={
              <DescriptionMenu
                currentDescId={currentDescId}
                data={data || []}
                onClick={handleCategoryClick}
                className="sticky top-header_group_height"
              />
            }
          >
            <div className="relative">
              {isArrayHasValue(currentDescCategory?.tab) ? (
                <div className={`product_desc`}>
                  <Tabs
                    list={(currentDescCategory as IProductDescription)?.tab?.map((tab) => ({
                      label: tab?.tab_name,
                      value: tab?.tab_id.toString(),
                    }))}
                    tabActive={currentTab}
                    onChange={(val) => {
                      setCurrentTab(val)
                    }}
                    className="border-b border-gray-200 py-12 text-gray w-full overflow-scroll scrollbar-hide"
                    labelClassName="text-lg font-bold border-r last:border-none border-gray-200 px-12 hover:text-primary"
                    tabActiveClassName="!text-primary"
                  />
                </div>
              ) : null}
            </div>

            <DescriptionContent
              ref={descriptionContentRef}
              content={currentDesc + ''}
              onUserScroll={(id) => setCurrentDescId(id)}
            />
          </ProductDetailPageContainer>
        </div>
      ) : null}
    </div>
  )
}
