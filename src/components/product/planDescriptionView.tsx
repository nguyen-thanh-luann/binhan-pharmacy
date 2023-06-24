import { HEADER_GROUP_HEIGHT } from '@/constants'
import { mergeProductDescriptionContent, scrollIntoElementById } from '@/helper'
import { ProductDetailPageContainer } from '@/templates'
import { ProductDescription, ProductDescriptionChild } from '@/types'
import { useEffect, useRef, useState } from 'react'
import { DescriptionContent } from './descriptionContent'
import { DescriptionMenu } from './descriptionMenu'
import { DescriptionMenuMobile } from './descriptionMenuMobile'

interface PlanDescriptionViewProps {
  data: ProductDescription[]
}

export const PlanDescriptionView = ({ data }: PlanDescriptionViewProps) => {
  const [currentDescCategory, setCurrentDescCategory] = useState<ProductDescription>()
  const [currentDesc, setCurrentDesc] = useState<String>('')
  const [currentDescId, setCurrentDescId] = useState<number>()

  const descriptionContentRef = useRef<any>(null)

  const handleCategoryClick = (data: ProductDescription | ProductDescriptionChild) => {
    scrollIntoElementById(
      `desc_category_${(data as ProductDescription).category_id}`,
      HEADER_GROUP_HEIGHT * 2
    ) // scroll distance from top a space == header group height

    if (currentDescId !== data?.category_id && !descriptionContentRef?.current?.show) {
      descriptionContentRef?.current?.setShow(true)
    }

    setCurrentDescCategory(data as ProductDescription)
  }

  // handle when user select description category when data load success
  useEffect(() => {
    setCurrentDesc(mergeProductDescriptionContent(data || []))
  }, [data, currentDescCategory])

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
        <DescriptionContent
          ref={descriptionContentRef}
          content={currentDesc + ''}
          onUserScroll={(id) => setCurrentDescId(id)}
        />
      </ProductDetailPageContainer>
    </div>
  )
}
