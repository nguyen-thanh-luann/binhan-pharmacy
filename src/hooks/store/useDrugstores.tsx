import { SWR_KEY } from '@/constants'
import { userAPI } from '@/services'
import { GetDrugStoreParams, UserAccount } from '@/types'
import useSWR from 'swr'

interface useDrugstoresProps {
  key?: string
  shouldFetch?: boolean
  params: GetDrugStoreParams
}

interface useDrugstoresRes {
  drugstores: UserAccount[]
  isValidating: boolean
  filterStore: (params: GetDrugStoreParams) => void
}

export const useDrugstores = ({
  key,
  shouldFetch = true,
  params,
}: useDrugstoresProps): useDrugstoresRes => {
  const { data, isValidating, mutate } = useSWR(
    key ? key : SWR_KEY.get_drug_stores,
    !shouldFetch ? null : () => userAPI.getDrugStoreList(params).then((res: any) => res?.data),
    {
      revalidateOnFocus: false,
      dedupingInterval: 600000,
    }
  )

  const filterStore = async (params: GetDrugStoreParams) => {
    const res: any = await userAPI.getDrugStoreList(params)
    if (res?.success) {
      mutate(res?.data, false)
    }
  } 

  return {
    drugstores: data?.result || [],
    isValidating,
    filterStore
  }
}
