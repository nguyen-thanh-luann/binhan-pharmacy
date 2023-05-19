import { SWR_KEY } from '@/constants'
import { productAPI } from '@/services'
import { AttributeMinor, GetListAttributeMinorParams } from '@/types'
import useSWR from 'swr'

interface useAttributeMinorProps {
  key?: string
  shouldFetch?: boolean
  params: GetListAttributeMinorParams
}

interface useAttributeMinorRes {
  attributeMinors: AttributeMinor[]
  isValidating: boolean
}

export const useAttributeMinor = ({
  shouldFetch = true,
  key,
  params,
}: useAttributeMinorProps): useAttributeMinorRes => {
  const { data, isValidating } = useSWR(
    key ? key : SWR_KEY.get_attribute_minor_list,
    !shouldFetch
      ? null
      : () => productAPI.getListAtributeMinor(params).then((res: any) => res?.data || []),
    {
      revalidateOnFocus: false,
      dedupingInterval: 600000,
    }
  )

  return {
    attributeMinors: data?.result || [],
    isValidating,
  }
}
