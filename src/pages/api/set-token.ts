import type { HTTPResponse } from '@/types'
import Cookies from 'cookies'
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse<HTTPResponse<any>>) {
  const cookies = new Cookies(req, res)
  const { token, refresh_token, data } = req.body
  cookies.set('token', token)
  cookies.set('refresh_token', refresh_token)

  res.status(200).json({
    result: {
      message: 'Set token successfully',
      code: 200,
      success: true,
      data: data
    },
  })
}
