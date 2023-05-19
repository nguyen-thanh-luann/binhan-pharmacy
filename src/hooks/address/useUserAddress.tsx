import { SWR_KEY } from '@/constants'
import { userAPI } from '@/services'
import { setOrderAddress } from '@/store'
import { AddAddressHook, AddressDelete, ShippingAddress, UserDetail } from '@/types'
import { toast } from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import useSWR from 'swr'
import { useUser } from '../user'

interface useAddressListProps {
  key?: string
  shouldFetch?: boolean
}

interface UseAddressListRes {
  data: UserDetail
  isValidating: boolean
  addAddress: ({ address, addressForm }: AddAddressHook) => Promise<any>
  deleteAddress: (address: AddressDelete) => Promise<any>
  updateOrderAddress: (address: ShippingAddress) => void
}

export const useUserAddress = ({
  key,
  shouldFetch = true,
}: useAddressListProps): UseAddressListRes => {
  const { data, isValidating, mutate } = useSWR(
    key ? key : SWR_KEY.get_user_address,
    !shouldFetch
      ? null
      : () => userAPI.getDetailUser().then((res: any) => res?.result?.data?.info_customer),
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
          mutate(
            {
              ...data,
              shipping_adress: [...data.shipping_adress].map((item: ShippingAddress) =>
                item.id === address.adress_id ? addressForm : item
              ),
            },
            false
          )
          toast.success('Chỉnh sửa địa chỉ thành công')
        } else {
          mutate(
            {
              ...data,
              shipping_adress: [
                ...data.shipping_adress,
                {
                  ...addressForm,
                  id: res.result.data?.[0]?.partner_shipping_id,
                },
              ],
            },
            false
          )
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
        mutate(
          {
            ...(data as UserDetail),
            shipping_adress: [...data.shipping_adress].filter(
              (item) => item.id !== address.adress_id
            ),
          },
          false
        )

        // if (addressDefault?.id === address.adress_id) {
        //   dispatch(setAddressDefault(undefined))
        // }

        // if (orderAddress?.id === address.adress_id) {
        //   dispatch(setOrderAddress(undefined))
        //   if (addressDefault?.id !== orderAddress.id) {
        //     dispatch(setOrderAddress(addressDefault))
        //   }
        // }
      } else {
        toast.error(res?.result?.message || 'Có lỗi xảy ra')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const updateOrderAddress = (address: ShippingAddress) => {
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
