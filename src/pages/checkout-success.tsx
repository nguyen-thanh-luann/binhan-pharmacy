import { orderDoneIcon } from '@/assets'
import { Button, Image, OrderConfirmTicket } from '@/components'
import { WEB_DESCRIPTION, WEB_TITTLE } from '@/constants'
import { MainNoFooter } from '@/templates'
import { useRouter } from 'next/router'

const CheckoutSuccessPage = () => {
  const router = useRouter()
  const { sale_order_id } = router.query

  return (
    <MainNoFooter title={WEB_TITTLE} description={WEB_DESCRIPTION}>
      <div className="container min-h-[80vh] w-[90vw] lg:w-[50vw] mx-auto mt-24 mb-bottom_nav_height md:mb-[32px]">
        <div className="bg-white p-16 shadow-shadow-1 rounded-lg">
          <div className={`min-h-[200px] flex items-center justify-center flex-col mb-12`}>
            <Image
              alt=""
              src={orderDoneIcon}
              imageClassName="w-[161px] h-[144px] object-cover"
              className="mb-18"
            />
            <p className="text-text-color font-bold text-md mb-18">Đặt hàng thành công!</p>

            <div className="flex justify-center gap-8 flex-wrap">
              <Button
                onClick={() => {
                  router.push('/')
                }}
                title="Quay lại trang chủ"
                className="bg-primary p-8 w-[150px]"
                textClassName="text-white font-bold text-base"
              />
            </div>
          </div>

          {typeof sale_order_id === 'string' ? (
            <div>
              <OrderConfirmTicket sale_order_id={Number(sale_order_id)} />
            </div>
          ) : (
            <div>
              {(sale_order_id as string[])?.map((item, index) => (
                <div key={index} className="mb-24">
                  <OrderConfirmTicket sale_order_id={Number(item)} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainNoFooter>
  )
}

export default CheckoutSuccessPage
