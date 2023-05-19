import { error404 } from '@/assets'
import { Image } from '@/components'
import { Main } from '@/templates'
import Link from 'next/link'

const Error404 = () => (
  <Main title="Not found" description="">
    <div className='container flex flex-col items-center gap-24 bg-white my-32'>
      <Image src={error404} imageClassName='w-[90%] max-w-[500px] object-cover' />
      <p className='text-md font-bold'>Xin lỗi! chúng tôi không tìm thấy dữ liệu</p>
      <Link href='/' className='bg-primary py-8 px-24 rounded-md mb-12 active:opacity-50'>
          <p className='text-white'>Về trang chủ</p>
      </Link>
    </div>
  </Main>
)

export default Error404
