import { introBanner } from '@/assets'
import { Breadcrumb, Image } from '@/components'
import { WEB_DESCRIPTION, WEB_TITTLE } from '@/constants'
import { CoreValues } from '@/data'
import { Main } from '@/templates'

const IntroducePage = () => {
  return (
    <Main title={WEB_TITTLE} description={WEB_DESCRIPTION}>
      <div className="container px-12 my-32">
        <Breadcrumb
          breadcrumbList={[
            {
              path: '/',
              name: 'Giới thiệu',
            },
          ]}
        />

        <p className="text-center uppercase text-primary text-2xl font-bold mb-24">Giới thiệu</p>

        <p className="text-md text-text-color">
          Công ty Cổ phần Dược phẩm Quốc tế Abipha đặt mục tiêu “Top 10 thương hiệu dược phẩm hàng
          đầu Việt Nam” và mong muốn đóng góp sức mình để chăm lo sức khỏe cộng đồng. Thành lập với
          tâm nguyện “Tâm lớn trước sức khỏe cộng đồng”, công ty đặc biệt chú trọng đến công tác
          nghiên cứu, phát triển, không ngừng cải tiến và đổi mới nhằm nâng cao chất lượng sản phẩm.
          Bằng việc đầu tư hệ thống văn phòng nhà máy đầy đủ tiện nghi, dây chuyền máy móc hiện đại.
          Đặc biệt là tuyển dụng và đào tạo bồi dưỡng nguồn nhân lực có trình độ chuyên môn cao.
        </p>

        <br />

        <p className="text-md text-text-color">
          Chúng tôi xin chân thành cảm ơn sự hợp tác của: Viện kiểm nghiệm, Viện dược liệu, Viện da
          liễu, Viện khoa học Việt Nam, Bộ Y tế, các Giáo viên, Tiến sĩ của trường Đại học Dược Hà
          Nội, Đại học Y Hà Nội, Đại học Tổng hợp Hà Nội đã tần tình hợp tác và giúp đỡ công ty trên
          con xây dựng và phát triển.
        </p>

        <br />

        <p className="text-md text-text-color">
          Ngoài hệ thống phân phối dược phẩm rộng khắp cả nước, công ty đã đầu tư vào xây dựng nhà
          máy công nghệ cao đạt chuẩn GMP với đầy đủ các dây truyền sản xuất: thực phẩm bảo vệ sức
          khỏe, thuốc đông dược, thuốc tân dược, mỹ phẩm… đảm bảo cung cấp cho người sử dụng những
          sản phẩm tốt nhất.
        </p>

        <br />

        <Image
          src={introBanner}
          imageClassName="object-cover rounded-md w-full"
          className="mb-24"
        />

        <p className="text-center uppercase text-primary text-2xl font-bold mb-24">
          Giá trị cốt lõi
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-12">
          {CoreValues?.map((value, index) => {
            return (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-12 flex flex-col justify-center items-center"
              >
                <Image
                  src={value.image}
                  imageClassName="w-[78px] h-[78px] object-cover"
                  className="mb-12"
                />

                <p className="text-md font-bold uppercase text-primary mb-12">{value.title}</p>
                <p className="text-md text-text-color text-center">{value.content}</p>
              </div>
            )
          })}
        </div>
      </div>
    </Main>
  )
}

export default IntroducePage
