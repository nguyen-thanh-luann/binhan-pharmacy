import { HTTPResponse } from '@/types'
import Cookies from 'cookies'
import type { NextApiRequest, NextApiResponse } from 'next'

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
}

export default function handler(req: NextApiRequest, res: NextApiResponse<HTTPResponse<any>>) {

  const cookies = new Cookies(req, res)
  cookies.set('guest_token')
  cookies.set('guest_refresh_token')
  cookies.set('device_code')

  res.status(200).json({
    result: {
      message: 'Logout guest successfully',
      success: true,
      data: [],
      code: 200,
    },
  })
}
