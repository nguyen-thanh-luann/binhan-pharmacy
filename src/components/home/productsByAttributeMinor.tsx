import { UserCircleIcon } from '@/assets'
import { SWR_KEY } from '@/constants'
import { useProductListByAttributeMinor } from '@/hooks'
import { AttributeMinor } from '@/types'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { twMerge } from 'tailwind-merge'
import { CustomImage } from '../customImage'
import { ProductItem, ProductItemLoading } from '../product'
import { Tabs } from '../tabs'
import { HomeSlide } from './homeSlide'

interface ProductsByAttributeMinorProps {
  atribute: AttributeMinor | undefined
  className?: string
  isValidating?: boolean
}

export const ProductsByAttributeMinor = ({
  atribute,
  className,
  isValidating,
}: ProductsByAttributeMinorProps) => {
  const [currentTab, setCurrentTab] = useState<string>('')
  const [params, setParams] = useState<object>({})

  const [firstChild, secondChild, thirdChild, ..._] = atribute?.value_ids || []

  const tabs = thirdChild
    ? [
        { label: firstChild?.value_name || '', value: firstChild?.value_id.toString() || '' },
        { label: secondChild?.value_name || '', value: secondChild?.value_id.toString() || '' },
        { label: thirdChild?.value_name || '', value: thirdChild?.value_id.toString() || '' },
      ]
    : secondChild
    ? [
        { label: firstChild?.value_name || '', value: firstChild?.value_id.toString() || '' },
        { label: secondChild?.value_name || '', value: secondChild?.value_id.toString() || '' },
      ]
    : [{ label: firstChild?.value_name || '', value: firstChild?.value_id.toString() || '' }]

  const {
    data: productList,
    isValidating: productListLoading,
    fetchByOtherAttrValues,
  } = useProductListByAttributeMinor({
    key: `${SWR_KEY?.get_product_list_by_attribute_minor}_${atribute?.attribute_id || 0}`,
    params: {
      attribute_id: atribute?.attribute_id || 0,
      attribute_value_ids: [atribute?.value_ids?.[0]?.value_id || 0],
    },
  })

  useEffect(() => {
    setCurrentTab(atribute?.value_ids?.[0]?.value_id.toString() || '')
    setParams({
      attribute_id: atribute?.attribute_id || 0,
      attribute_value_ids: [atribute?.value_ids?.[0]?.value_id || 0],
    })
  }, [atribute])

  const handleTabChange = (val: string) => {
    if (val === 'more') {
      toast.success('comming soon!')
    } else {
      setCurrentTab(val)
      setParams({
        ...params,
        attribute_value_ids: [Number(val)],
      })
    }
  }

  useEffect(() => {
    fetchByOtherAttrValues(params)
  }, [params])

  if (isValidating || productListLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12">
        {Array.from({ length: 5 }).map((_, index) => (
          <ProductItemLoading key={index} />
        ))}
      </div>
    )
  }

  return (
    <div>
      <HomeSlide
        className={twMerge(classNames(``, className))}
        icon={
          atribute?.attribute_icon?.url ? (
            <CustomImage
              src={atribute?.attribute_icon?.url || ''}
              imageClassName="w-[32px] h-[32px] object-cover"
            />
          ) : (
            <UserCircleIcon className="text-primary w-[32px] h-[32px]" />
          )
        }
        title={atribute?.attribute_name || ''}
        rightSection={
          tabs?.length > 1 ? (
            <div className="overflow-scroll scrollbar-hide">
              <Tabs
                list={
                  (atribute?.value_ids?.length || 0) > 3
                    ? [...tabs, { label: 'Xem thêm', value: 'more' }]
                    : [...tabs]
                }
                tabActive={currentTab}
                onChange={(val: string) => handleTabChange(val)}
                className="rounded-[32px] bg-primary-200 w-fit"
                labelClassName="text-gray font-medium text-md leading-9 py-8 px-16"
                tabActiveClassName="bg-primary !text-white rounded-[32px]"
              />
            </div>
          ) : undefined
        }
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12">
          {productList?.result?.map((product) => (
            <ProductItem key={product?.product_id} data={product} />
          ))}
        </div>
      </HomeSlide>
    </div>
  )
}
