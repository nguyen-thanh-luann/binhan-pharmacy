import {
  Breadcrumb,
  Modal,
  NotFound,
  PurchasedProduct,
  PurchasedProductLoading,
  RatingForm,
} from '@/components'
import { DEFAULT_LIMIT, SWR_KEY, WEB_DESCRIPTION, WEB_TITTLE } from '@/constants'
import { isArrayHasValue } from '@/helper'
import { useRatingProduct } from '@/hooks'
import { AccountContainer, Main } from '@/templates'
import { CreateRatingReq, DeleteRatingProps, RatingRes } from '@/types'
import classNames from 'classnames'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import InfiniteScroll from 'react-infinite-scroll-component'

const PurchasedProductPage = () => {
  const [currentPurchasedProduct, setCurrentPurchasedProduct] = useState<RatingRes | undefined>()

  const { productHistory, isValidating, getMore, hasMore, createRating, deleteRating } =
    useRatingProduct({
      key: SWR_KEY.get_product_rating,
      params: {
        limit: DEFAULT_LIMIT,
        offset: 0,
      },
    })

  const renderRatingLoader = (number?: number, className?: string) => {
    return (
      <div
        className={classNames('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12', className)}
      >
        {Array.from({ length: number || 3 }).map((_, index) => (
          <PurchasedProductLoading key={index} />
        ))}
      </div>
    )
  }

  const hanldeProductSelect = (data: RatingRes) => {
    setCurrentPurchasedProduct(data)
  }

  const hanldeUpdateRatingProduct = (params: CreateRatingReq) => {
    createRating(params, () => {
      setCurrentPurchasedProduct(undefined)
      toast.success('Đánh giá cho sản phẩm thành công!')
    })
  }

  const handleDeleteRatingProduct = (params: DeleteRatingProps) => {
    deleteRating(params, () => {
      setCurrentPurchasedProduct(undefined)
      toast.success('Xoá đánh giá cho sản phẩm thành công!')
    })
  }

  return (
    <Main title={WEB_TITTLE} description={WEB_DESCRIPTION}>
      <div className="container">
        <Breadcrumb
          breadcrumbList={[
            {
              path: '/',
              name: 'Đánh giá của tôi',
            },
          ]}
        />
      </div>

      <AccountContainer className="container mb-32">
        <div className="bg-white p-24 rounded-[10px] shadow-shadow-1">
          {/* header */}
          <p className="text-xl capitalize font-semibold border-b border-gray-200 pb-12 mb-24">
            Đánh giá của tôi
          </p>

          {/* content */}
          <div>
            <InfiniteScroll
              dataLength={productHistory?.length || 0}
              next={() => getMore()}
              hasMore={hasMore}
              loader={hasMore ? renderRatingLoader(3, 'my-12') : null}
            >
              <div>
                {isValidating ? (
                  renderRatingLoader()
                ) : isArrayHasValue(productHistory) ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {productHistory?.map((line) => (
                      <PurchasedProduct
                        key={line.history_line_id}
                        data={line}
                        onSelect={(data) => hanldeProductSelect(data)}
                      />
                    ))}
                  </div>
                ) : (
                  <div>
                    <NotFound notify="Không tìm thấy đánh giá nào!" />
                  </div>
                )}
              </div>
            </InfiniteScroll>
          </div>

          {currentPurchasedProduct && (
            <Modal
              visible={currentPurchasedProduct !== undefined}
              animationType="fade"
              headerClassName="hidden"
              modalClassName="p-20 h-fit max-h-[550px] w-[500px] max-w-[90%] rounded-[10px] overflow-scroll scrollbar-hide"
            >
              <RatingForm
                purchaseForm={currentPurchasedProduct}
                onAddRating={hanldeUpdateRatingProduct}
                onCloseModal={() => setCurrentPurchasedProduct(undefined)}
                onDeleteRating={(params) => handleDeleteRatingProduct(params)}
              />
            </Modal>
          )}
        </div>
      </AccountContainer>
    </Main>
  )
}

export default PurchasedProductPage
