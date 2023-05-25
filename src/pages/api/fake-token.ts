import type { HTTPResponse } from '@/types'
import Cookies from 'cookies'
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse<HTTPResponse<any>>) {
  const cookies = new Cookies(req, res)

  cookies.set(
    'token',
    '131XxTcVuvM29DUz9DM9i6QYR8hjw1hoiiktO3mXGN1FpuACtG0S0nvekpptUx8YKDQ9MrAL9Fg6Zvf1PseEMjEgYqMSBTjReP76qoVKuksgKJM3meF1DICvUPEowpmx'
  )

  res.status(200).json({
    result: {
      message: 'Set fake Success',
      code: 200,
      success: true,
      data: {},
    },
  })
}
