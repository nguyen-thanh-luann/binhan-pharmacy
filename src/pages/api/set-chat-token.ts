import type { HTTPResponse } from '@/types'
import Cookies from 'cookies'
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse<HTTPResponse<any>>) {
  const cookies = new Cookies(req, res)

  const { access_token, refresh_token, data } = req.body
  cookies.set('chat_access_token', access_token?.token)
  cookies.set('chat_refresh_token', refresh_token?.token)

  res.status(200).json({
    result: {
      message: 'Set chat token successfully',
      code: 200,
      success: true,
      data: data,
    },
  })
}
