import type { HTTPResponse } from '@/types'
import Cookies from 'cookies'
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse<HTTPResponse<any>>) {
  const cookies = new Cookies(req, res)
  const token = cookies.get('token')
  const refresh_token = cookies.get('refresh_token')

  if (!token || !refresh_token) {
    return res.status(200).json({
      result: {
        message: 'Token not found',
        code: 400,
        success: false,
        data: [],
      },
    })
  }

  res.status(200).json({
    result: {
      message: 'Success',
      code: 200,
      success: true,
      data: {
        token,
        refresh_token,
      },
    },
  })
}
