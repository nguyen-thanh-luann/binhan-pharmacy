import type { HTTPResponse } from '@/types'
import Cookies from 'cookies'
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse<HTTPResponse<any>>) {
  const cookies = new Cookies(req, res)
  const guest_token = cookies.get('guest_token')
  const guest_refresh_token = cookies.get('guest_refresh_token')
  const device_code = cookies.get('device_code')

  if (!guest_token || !guest_refresh_token) {
    return res.status(200).json({
      result: {
        message: 'Guest Token not found',
        code: 400,
        success: false,
        data: [],
      },
    })
  }

  res.status(200).json({
    result: {
      message: 'Get guest token success!',
      code: 200,
      success: true,
      data: {
        guest_token,
        guest_refresh_token,
        device_code,
      },
    },
  })
}
