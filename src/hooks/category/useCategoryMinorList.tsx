import { SWR_KEY } from '@/constants'
import { productAPI } from '@/services'
import { CategoryMinor, GetCategoryParams } from '@/types'
import useSWR from 'swr'

interface useCategoryProps {
  key?: string
  shouldFetch?: boolean
  params: GetCategoryParams
}

interface useCategoryRes {
  categoryMinorList: CategoryMinor[]
  isValidating: boolean
}

export const useCategoryMinorList = ({
  shouldFetch = true,
  key,
  params,
}: useCategoryProps): useCategoryRes => {
  const { data, isValidating } = useSWR(
    key ? key : SWR_KEY.get_category_minor_list,
    !shouldFetch
      ? null
      : () => productAPI.getCategoryMinorList(params).then((res: any) => res?.data || []),
    {
      revalidateOnFocus: false,
      dedupingInterval: 600000,
    }
  )

  return {
    categoryMinorList: data?.result || [],
    isValidating,
  }
}
