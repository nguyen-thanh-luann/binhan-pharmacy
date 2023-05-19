import { SWR_KEY } from '@/constants'
import { productAPI } from '@/services'
import { Category, GetCategoryParams } from '@/types'
import useSWR from 'swr'

interface useCategoryProps {
  key?: string
  shouldFetch?: boolean
  params: GetCategoryParams
}

interface useCategoryRes {
  categoryList: Category[]
  isValidating: boolean
}

export const useCategoryList = ({
  shouldFetch = true,
  key,
  params,
}: useCategoryProps): useCategoryRes => {
  const { data, isValidating } = useSWR(
    key ? key : SWR_KEY.get_category_list,
    !shouldFetch
      ? null
      : () => productAPI.getCategoryList(params).then((res: any) => res?.data || []),
    {
      revalidateOnFocus: false,
      dedupingInterval: 600000,
    }
  )

  return {
    categoryList: data?.result || [],
    isValidating,
  }
}
