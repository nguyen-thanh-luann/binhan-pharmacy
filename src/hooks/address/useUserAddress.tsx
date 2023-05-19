import { SWR_KEY } from '@/constants'
import { userAPI } from '@/services'
import { setOrderAddress } from '@/store'
import { AddAddressHook, AddressDelete, ShippingAddressV2 } from '@/types'
import { toast } from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import useSWR from 'swr'
import { useUser } from '../user'

interface useAddressListProps {
  key?: string
  shouldFetch?: boolean
}

interface UseAddressListRes {
  data: ShippingAddressV2[] | undefined
  isValidating: boolean
  addAddress: ({ address, addressForm }: AddAddressHook) => Promise<any>
  deleteAddress: (address: AddressDelete) => Promise<any>
  updateOrderAddress: (address: ShippingAddressV2) => void
}

export const useUserAddress = ({
  key,
  shouldFetch = true,
}: useAddressListProps): UseAddressListRes => {
  const { data, isValidating, mutate } = useSWR(
    key ? key : SWR_KEY.get_user_shipping_address,
    !shouldFetch ? null : () => userAPI.getShippingAddressList().then((res) => res?.result?.data),
    {
      revalidateOnFocus: false,
      dedupingInterval: 600000,
    }
  )

  const { userInfo } = useUser({})
  const partner_id = userInfo?.account.partner_id || 0
  const dispatch = useDispatch()

  const addAddress = async ({ address, addressForm }: AddAddressHook) => {
    try {
      const res: any = await userAPI.addAddress(address)

      if (res?.result?.success) {
        if (address.adress_id) {
          if (addressForm)
            mutate(
              [
                ...(data || []).map((item) =>
                  item.id === address?.adress_id ? addressForm : item
                ),
              ],
              false
            )

          toast.success('Chỉnh sửa địa chỉ thành công')
        } else {
          if (addressForm) mutate([...(data || []), addressForm], false)
          toast.success('Thêm địa chỉ thành công')
        }
      } else {
        toast.error(res?.result?.message || 'Có lỗi xảy ra')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const deleteAddress = async (address: AddressDelete) => {
    try {
      const res: any = await userAPI.deleteAddress({
        adress_id: address.adress_id,
        partner_id,
      })
      if (res?.result?.success) {
        mutate([...(data || []).filter((item) => item.id !== address?.adress_id)], false)
      } else {
        toast.error(res?.result?.message || 'Có lỗi xảy ra')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const updateOrderAddress = (address: ShippingAddressV2) => {
    if (!address.id) return

    dispatch(setOrderAddress(address))
  }

  return {
    data,
    isValidating,
    addAddress,
    deleteAddress,
    updateOrderAddress,
  }
}
