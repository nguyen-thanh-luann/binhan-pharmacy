import { SWR_KEY } from '@/constants'
import { isArrayHasValue } from '@/helper'
import { useAttributeMinor } from '@/hooks'
import { AttributeMinor } from '@/types'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { InputCheckbox } from '../inputs'
import { Spinner } from '../spinner'

export const FilterByAttributeMinor = () => {
  const router = useRouter()
  const DEFAULT_DISPLAY_ATT = 5

  const [expandAtts, setExpandAtts] = useState<number[]>([])

  const { attributeMinors, isValidating: attributeMinorsLoading } = useAttributeMinor({
    key: SWR_KEY.get_attribute_minor_list_filter,
    params: {},
  })

  const handleSelectAttribute = (attribute_id: number, child_id: number) => {
    const _attribute_id = attribute_id.toString()
    const _child_id = child_id.toString()

    const attribute = `attributes_${_attribute_id}`
    const attributeIds: any = router.query?.[attribute]

    let query = router.query

    if (!attributeIds) {
      query[attribute] = _child_id
    } else {
      if (typeof attributeIds === 'string') {
        if (attributeIds === _child_id) {
          delete query[attribute]
        } else {
          query[attribute] = [attributeIds, _child_id]
        }
      } else if (typeof attributeIds === 'object') {
        if (attributeIds?.includes(_child_id)) {
          query[attribute] = attributeIds.filter((item: string) => item !== _child_id)
        } else {
          query[attribute] = [...attributeIds, _child_id]
        }
      } else {
        query[attribute] = _child_id
      }
    }

    router.push({
      query: { ...query },
    })
  }

  const isActive = (attribute_id: string, child_Id: string): boolean => {
    const attributesActive = router?.query?.[`attributes_${attribute_id}`]

    if (!attributesActive) return false

    if (typeof attributesActive === 'string') {
      return attributesActive === child_Id
    } else {
      return !!attributesActive.find((item) => item === child_Id)
    }
  }

  const hanldeExpandAttribute = (data: AttributeMinor) => {
    const index = expandAtts.findIndex((id) => id === data?.attribute_id)

    if (index !== -1) {
      setExpandAtts(expandAtts.filter((id) => id !== data?.attribute_id))
      return
    }
    setExpandAtts([...expandAtts, data?.attribute_id])
  }

  return (
    <div>
      {attributeMinorsLoading ? (
        <div className="flex justify-center my-12">
          <Spinner />
        </div>
      ) : isArrayHasValue(attributeMinors) ? (
        <div>
          {attributeMinors?.map((attribute) => {
            return (
              <div
                key={attribute?.attribute_id}
                className="bg-white rounded-[10px] shadow-shadow-1"
              >
                {isArrayHasValue(attribute?.value_ids) ? (
                  <div className="mb-16">
                    <p className="text-text-color font-bold text-lg border-b border-gray-200 p-8">
                      {attribute?.attribute_name}
                    </p>

                    {attribute?.value_ids?.slice(0, DEFAULT_DISPLAY_ATT)?.map((child) => {
                      return (
                        <div
                          key={child?.value_id}
                          className="flex gap-12 items-center p-8 cursor-pointer"
                          onClick={() =>
                            handleSelectAttribute(attribute?.attribute_id, child.value_id)
                          }
                        >
                          <div className="min-w-[20px]">
                            <InputCheckbox
                              isChecked={isActive(
                                attribute?.attribute_id.toString(),
                                child?.value_id.toString()
                              )}
                              onCheck={() =>
                                handleSelectAttribute(attribute?.attribute_id, child.value_id)
                              }
                            />
                          </div>

                          <p className="text-text-color font-semibold text-md">
                            {child?.value_name}
                          </p>
                        </div>
                      )
                    })}

                    {expandAtts?.includes(attribute?.attribute_id) ? (
                      <div>
                        {attribute?.value_ids
                          ?.slice(DEFAULT_DISPLAY_ATT, attribute?.value_ids?.length - 1)
                          ?.map((child) => {
                            return (
                              <div
                                key={child?.value_id}
                                className="flex gap-12 items-center p-8 cursor-pointer animate-fade"
                                onClick={() =>
                                  handleSelectAttribute(attribute?.attribute_id, child.value_id)
                                }
                              >
                                <div className="min-w-[20px]">
                                  <InputCheckbox
                                    isChecked={isActive(
                                      attribute?.attribute_id.toString(),
                                      child?.value_id.toString()
                                    )}
                                    onCheck={() =>
                                      handleSelectAttribute(attribute?.attribute_id, child.value_id)
                                    }
                                  />
                                </div>

                                <p className="text-text-color font-semibold text-md">
                                  {child?.value_name}
                                </p>
                              </div>
                            )
                          })}
                      </div>
                    ) : null}

                    {attribute?.value_ids?.length > 5 ? (
                      <p
                        onClick={() => hanldeExpandAttribute(attribute)}
                        className="text-primary text-center py-4 cursor-pointer"
                      >
                        {expandAtts?.includes(attribute?.attribute_id) ? 'Thu gọn' : 'Xem thêm'}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
