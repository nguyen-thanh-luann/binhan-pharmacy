import { delivery } from '@/assets'
import { Breadcrumb, Image } from '@/components'
import { WEB_DESCRIPTION, WEB_TITTLE } from '@/constants'
import { Main } from '@/templates'

const SalePolicyPage = () => {
  return (
    <Main title={WEB_TITTLE} description={WEB_DESCRIPTION}>
      <div className="container px-12 my-32">
        <Breadcrumb
          breadcrumbList={[
            {
              path: '/',
              name: 'Chính sách bán hàng',
            },
          ]}
        />

        <p className="text-center uppercase text-primary text-2xl font-bold mb-24">
          Chính sách bán hàng
        </p>
        <Image
          src={delivery}
          imageClassName="object-cover rounded-md w-full aspect-[2/1]"
          className="mb-24"
        />

        <div className="mb-24">
          <p className="text-md font-bold">Hình thức vận chuyển:</p>
          <p className="text-md mb-12">
            Sản phẩm đặt hàng của quý khách sẽ được chuyển trực tiếp từ công ty, không qua đơn vị
            chung gian để đảm bảo quyền lợi của quý khách:
          </p>
          <ul className="px-24">
            <li className="list-disc mb-12">
              Tại Hà Nội; Đà Nẵng; Hồ Chí Minh: có thể nhận hàng ngay trong ngày hoặc trong vòng 2h
              theo thời gian di chuyển của Grap.
            </li>
            <li className="list-disc mb-12">
              Tại các tỉnh thành khách: giao hàng nhanh bằng Viettel, quý khách có thể nhận hàng từ
              1 đến 3 ngày tùy thuộc vào quảng đường và địa bàn đi lại.
            </li>
          </ul>
        </div>

        <div className="mb-24">
          <p className="text-md font-bold mb-12">Quy trình xử lý và chuyển hàng:</p>
          <p className="text-md mb-12">
            - Gọi điện cho quý khách: xác nhận đơn hàng theo số lượng, chủng loại…
          </p>
          <p className="text-md mb-12">
            - Chuyển đơn hàng cho bộ phận kế toán để xuất đơn và bộ phận kho đóng gói đơn hàng.
          </p>
          <p className="text-md mb-12">
            - Liên hệ đơn vị vận chuyển, xác nhận lại thời gian giao hàng dự kiến.
          </p>
          <p className="text-md mb-12">
            - Nhắn tin cho khách hàng xác nhận đơn hàng đang được chuyển và thời gian dự kiến.
          </p>
        </div>

        <div className="mb-24">
          <p className="text-md font-bold mb-12">Xác nhận đơn hàng:</p>
          <p className="text-md mb-12">
            - Gọi điện cho khách xác nhận tình trạng giao hàng, nhận hàng và chất lượng của hàng
            gửi.
          </p>
          <p className="text-md mb-12">
            - Khách hàng chú ý kiểm tra trình trạng kiện hàng, số lượng và chủng loại. Nếu có sai
            xót như hàng bị món méo, hỏng, hạn dùng không đúng, không đúng chúng loại, không đủ số
            lượng. Xin vui lòng chụp ảnh và gửi về công ty theo 2 hình thức:
          </p>
          <ol className="px-24">
            <li className="list-decimal mb-12 flex gap-8">
              - Gửi tin nhắn zalo OA: trên website tại
              <a className="forward-link" href="https://duocbinhan.vn/" target="_blank">
                https://duocbinhan.vn/
              </a>
            </li>
            <li className="list-decimal mb-12 flex gap-8">
              - Gửi tin nhắn qua facebook:{' '}
              <a
                className="forward-link"
                href=" https://www.facebook.com/duocbinhan"
                target="_blank"
              >
                https://www.facebook.com/duocbinhan
              </a>
            </li>
          </ol>
          <p className="text-md mb-12">
            Chúng tôi sẽ có trách nhiệm đổi trả và bồi thường cho quý khách hàng.
          </p>
        </div>

        <div className="mb-24">
          <p className="text-md font-bold mb-12">Nghĩa vụ của bên vận chuyển:</p>
          <p className="text-md mb-12">
            - Bảo đảm vận chuyển tài sản đầy đủ, an toàn đến địa điểm đã định, theo đúng thời hạn.
          </p>
          <p className="text-md mb-12"> - Giao tài sản cho người có quyền nhận.</p>
          <p className="text-md mb-12">
            - Chịu chi phí liên quan đến việc chuyên chở tài sản, trừ trường hợp có thỏa thuận khác.
          </p>
          <p className="text-md mb-12">
            - Mua bảo hiểm trách nhiệm dân sự theo quy định của pháp luật
          </p>
          <p className="text-md mb-12">
            - Bồi thường thiệt hại cho bên thuê vận chuyển trong trường hợp bên vận chuyển để mất,
            hư hỏng tài sản, trừ trường hợp có thỏa thuận khác hoặc pháp luật có quy định khác.
          </p>
        </div>

        <div className="mb-24">
          <p className="text-md font-bold mb-12">Quyền của bên vận chuyển:</p>
          <p className="text-md mb-12">
            - Kiểm tra sự xác thực của tài sản, của vận đơn hoặc chứng từ vận chuyển tương đương
            khác.
          </p>
          <p className="text-md mb-12"> - Giao tài sản cho người có quyền nhận.</p>
          <p className="text-md mb-12">
            - Từ chối vận chuyển tài sản không đúng với loại tài sản đã thỏa thuận trong hợp đồng.
          </p>
          <p className="text-md mb-12">
            - Yêu cầu bên thuê vận chuyển thanh toán đủ cước phí vận chuyển đúng thời hạn.
          </p>
          <p className="text-md mb-12">
            - Từ chối vận chuyển tài sản cấm giao dịch, tài sản có tính chất nguy hiểm, độc hại, nếu
            bên vận chuyển
          </p>
        </div>

        <div className="mb-24">
          <p className="text-md font-bold mb-12">Nghĩa vụ của bên thuê vận chuyển:</p>
          <p className="text-md mb-12">
            - Trả đủ tiền cước phí vận chuyển cho bên vận chuyển theo đúng thời hạn, phương thức đã
            thỏa thuận.
          </p>
          <p className="text-md mb-12">
            - Cung cấp thông tin cần thiết liên quan đến tài sản vận chuyển để bảo đảm an toàn cho
            tài sản vận chuyển.
          </p>
          <p className="text-md mb-12">
            - Trông coi tài sản trên đường vận chuyển, nếu có thỏa thuận. Trường hợp bên thuê vận
            chuyển trông coi tài sản mà tài sản bị mất, hư hỏng thì không được bồi thường.
          </p>
        </div>

        <div className="mb-24">
          <p className="text-md font-bold mb-12">Quyền của bên thuê vận chuyển:</p>
          <p className="text-md mb-12">
            - Yêu cầu bên vận chuyển chuyên chở tài sản đến đúng địa điểm, thời điểm đã thỏa thuận.
          </p>
          <p className="text-md mb-12">
            - Trực tiếp hoặc chỉ định người thứ ba nhận lại tài sản đã thuê vận chuyển.
          </p>
        </div>

        <div className="mb-24">
          <p className="text-md font-bold mb-12">Trách nhiệm bồi thường thiệt hại:</p>
          <p className="text-md mb-12">
            - Bên vận chuyển phải bồi thường thiệt hại cho bên thuê vận chuyển nếu để tài sản bị mất
            hoặc hư hỏng.
          </p>
          <p className="text-md mb-12">
            - Bên thuê vận chuyển phải bồi thường thiệt hại cho bên vận chuyển và người thứ ba về
            thiệt hại do tài sản vận chuyển có tính chất nguy hiểm, độc hại mà không có biện pháp
            đóng gói, bảo đảm an toàn trong quá trình vận chuyển.
          </p>
          <p className="text-md mb-12">
            - Trường hợp bất khả kháng dẫn đến tài sản vận chuyển bị mất, hư hỏng hoặc bị hủy hoại
            trong quá trình vận chuyển thì bên vận chuyển không phải chịu trách nhiệm bồi thường
            thiệt hại, trừ trường hợp có thỏa thuận khác hoặc pháp luật có quy định khác.
          </p>
        </div>
      </div>
    </Main>
  )
}

export default SalePolicyPage
