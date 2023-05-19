import { isObjectHasValue } from '@/helper'
import { useClickOutside, useProductDetail } from '@/hooks'
import { RootState, setProduct } from '@/store'
import { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ProductDetail, ProductDetailLoading } from '../product'
import { Modal } from './modal'
import { SWR_KEY } from '@/constants'
import { TimesIcon } from '@/assets'

interface IModalProductDetail {
  onClose?: Function
  isOpen: boolean
}

export const ModalProductDetail = ({ onClose, isOpen }: IModalProductDetail) => {
  const dispatch = useDispatch()
  const ref = useRef<HTMLDivElement>(null)
  const productProps = useSelector((state: RootState) => state.product.product)

  const { data: productDetail, isValidating } = useProductDetail({
    key: `${SWR_KEY.get_product_detail}_${productProps?.product_id}`,
    product_id: productProps?.product_id,
  })

  const handleCloseModal = () => {
    dispatch(setProduct(undefined))
    onClose && onClose()
  }

  useClickOutside([ref], () => {
    handleCloseModal()
  })

  return (
    <div>
      <Modal
        visible={isOpen}
        animationType={'fade'}
        headerClassName="hidden"
        modalClassName="relative w-[90%] xl:w-[70%] mx-auto p-18 rounded-md bg-white h-[70vh]"
      >
        <div ref={ref}>
          <button
            onClick={() => {
              handleCloseModal()
            }}
            className="absolute right-8 top-8 p-8 z-50 bg-white rounded-full"
          >
            <TimesIcon className="text-gray-400 text-xl hover:text-gray duration-150 ease-in-out" />
          </button>

          {isValidating ? (
            <ProductDetailLoading />
          ) : productDetail && isObjectHasValue(productDetail) ? (
            <ProductDetail data={productDetail?.product_data} type='modal'/>
          ) : null}
        </div>
      </Modal>
    </div>
  )
}
