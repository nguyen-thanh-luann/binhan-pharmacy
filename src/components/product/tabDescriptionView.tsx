import { HEADER_GROUP_HEIGHT } from '@/constants'
import {
  getTabDescriptionIndex,
  isArrayHasValue,
  mergeProductDescriptionTabContent,
  scrollIntoElementById,
} from '@/helper'
import { ProductDetailPageContainer } from '@/templates'
import { ProductDescription, ProductDescriptionChild } from '@/types'
import { useEffect, useRef, useState } from 'react'
import { Tabs } from '../tabs'
import { DescriptionContent } from './descriptionContent'
import { DescriptionMenu } from './descriptionMenu'
import { DescriptionMenuMobile } from './descriptionMenuMobile'

interface TabDescriptionViewProps {
  data: ProductDescription[]
}

export const TabDescriptionView = ({ data }: TabDescriptionViewProps) => {
  // const [currentDescCategory, setCurrentDescCategory] = useState<ProductDescription>()

  const [currentDesc, setCurrentDesc] = useState<String>(
    mergeProductDescriptionTabContent(data?.[0] || '')
  )
  const [currentTab, setCurrentTab] = useState<string>('')
  const [currentDescId, setCurrentDescId] = useState<number>()

  const descriptionContentRef = useRef<any>(null)

  const handleCategoryClick = (props: ProductDescription | ProductDescriptionChild) => {
    scrollIntoElementById(
      `desc_category_${(props as ProductDescription).category_id}`,
      HEADER_GROUP_HEIGHT * 2
    ) // scroll distance from top a space == header group height

    if (currentDescId !== props?.category_id && !descriptionContentRef?.current?.show) {
      descriptionContentRef?.current?.setShow(true)
    }

    data?.forEach((category) => {
      if (category?.category_id === props.category_id) {
        setCurrentTab(category?.category_id.toString())
        return
      } else {
        if (isArrayHasValue(category?.child)) {
          category?.child?.forEach((child) => {
            if (child?.category_id === props?.category_id) {
              setCurrentTab(category?.category_id.toString())
              return
            }
          })
        }
      }
    })
  }

  // change tab content when user select order tab in description
  useEffect(() => {
    const index = getTabDescriptionIndex(data, currentTab)

    if (index !== -1) {
      setCurrentDesc(mergeProductDescriptionTabContent(data?.[index] || ''))
    }
  }, [currentTab])

  return (
    <div>
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
          <div className={`product_desc`}>
            <Tabs
              list={data.map((tab) => ({
                label: tab?.category_name,
                value: tab?.category_id.toString(),
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
        </div>

        <DescriptionContent
          ref={descriptionContentRef}
          content={currentDesc + ''}
          onUserScroll={(id) => setCurrentDescId(id)}
        />
      </ProductDetailPageContainer>
    </div>
  )
}
