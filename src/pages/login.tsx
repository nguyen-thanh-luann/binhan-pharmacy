import { LoginPasswordScreen } from '@/components'
import { MainNoFooter } from '@/templates'

const Login = () => {
  return (
    <MainNoFooter title={'Đăng nhập'} description="">
      <div className="container min-h-[80vh] w-[90%] md:w-[50%] mx-auto">
        <div className="bg-white my-24 p-12 rounded-lg shadow-shadow-1">
          <LoginPasswordScreen showCloseButton={false} />
        </div>
      </div>
    </MainNoFooter>
  )
}

export default Login
