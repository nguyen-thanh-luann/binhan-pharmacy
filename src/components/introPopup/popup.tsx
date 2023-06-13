import classNames from 'classnames'
import { useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import { Button } from '../button'
import { Modal } from '../modal'

interface PopUpProps {
  className?: string
}

export const IntroPopUp = ({ className }: PopUpProps) => {
  const [isOpen, setOpen] = useState<boolean>(() => !sessionStorage.getItem('is_open_popup'))

  const modalRef = useRef<HTMLDivElement>(null)

  // useClickOutside([modalRef], () => handleClose())

  const handleClose = () => {
    setOpen(false)
    sessionStorage.setItem('is_open_popup', 'true')
  }

  const hanldeDeny = () => {
    toast.error('Bạn phải đồng ý điều khoản để sử dụng dịch vụ của chúng tôi!')
  }

  return (
    <div className={classNames('', className)}>
      {isOpen ? (
        <Modal
          visible={isOpen}
          animationType="fade"
          headerClassName="hidden"
          modalClassName="p-20 w-[512px] max-w-[90%] h-fit max-h-[80vh] rounded-[10px]"
        >
          <div ref={modalRef} className="bg-white">
            <p className="text-md font-bold text-text-color mb-12 text-center">
              THÔNG TIN CHỈ MANG TÍNH CHẤT THAM KHẢO
            </p>
            <p className="text-md text-text-color mb-12">
              Website{' '}
              <a className="text-primary" href="https://duocbinhan.vn/">
                www.duocbinhan.vn{' '}
              </a>
              được xây dựng nhằm giới thiệu thông tin về sản phẩm chăm sóc sức khỏe do Dược phẩm
              BINHAN Pharmacy phân phối. Các sản phẩm được bán tại nhà thuốc, quầy thuốc và các cơ
              sở phân phối có người phụ trách chuyên môn theo quy định của pháp luật. Nội dung về
              sản phẩm, giá bán, tin tức… nhằm mục đích cung cấp thông tin cho người phụ trách
              chuyên môn có thể xác định đúng các đặc tính của sản phẩm. Đồng thời bảo vệ quyền lợi
              người tiêu dùng khi có nhu cầu mua sản phẩm tại các điểm bán, mua đúng sản phẩm, đảm
              bảo chất lượng, đúng giá. Tin sức khỏe và dùng thuốc chỉ tham khảo, việc sử dụng thuốc
              kê đơn hay chữa bệnh phải tuyệt đối tuân thủ theo sự hướng dẫn của người có chuyên môn
              về y dược. Binhan Pharmacy không chịu trách nhiệm cho bất cứ hậu quả nào xảy ra do cố
              tình mua và tự ý dùng thuốc dựa trên các thông tin trên.
            </p>

            <div className="flex-center flex-wrap gap-12">
              <Button
                title="Tôi Đồng Ý"
                onClick={handleClose}
                className="bg-primary rounded-full border border-primary px-12 py-6 hover:bg-white group"
                textClassName="text-white text-md group-hover:text-primary"
              />

              <Button
                title="Tôi Không Đồng Ý"
                onClick={hanldeDeny}
                className="bg-orange rounded-full opacity-50 hover:opacity-100 px-12 py-6"
                textClassName="text-white text-md"
              />
            </div>
          </div>
        </Modal>
      ) : null}
    </div>
  )
}
