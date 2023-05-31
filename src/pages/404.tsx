import { companyIconSm } from '@/assets'
import { Image } from '@/components'
import { Main } from '@/templates'
import Link from 'next/link'

const Error404 = () => (
  <Main title="Not found" description="">
    <div className="container flex flex-col items-center gap-24 bg-white my-32 p-12">
      <Image src={companyIconSm} imageClassName="w-[90%] max-w-[500px] object-cover mx-auto" />
      <p className="text-md font-bold text-center">Xin lỗi! chúng tôi không tìm thấy dữ liệu</p>
      <Link href="/" className="bg-primary py-8 px-24 rounded-md mb-12 active:opacity-50">
        <p className="text-white">Về trang chủ</p>
      </Link>
    </div>
  </Main>
)

export default Error404
