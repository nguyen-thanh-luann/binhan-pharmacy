import type { HTTPResponse } from '@/types'
import Cookies from 'cookies'
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse<HTTPResponse<any>>) {
  const cookies = new Cookies(req, res)
  const chat_access_token = cookies.get('chat_access_token')
  const chat_refresh_token = cookies.get('chat_refresh_token')

  if (!chat_access_token || !chat_refresh_token) {
    return res.status(200).json({
      result: {
        message: 'Chat token not found',
        code: 400,
        success: false,
        data: undefined,
      },
    })
  }

  res.status(200).json({
    result: {
      message: 'Success',
      code: 200,
      success: true,
      data: {
        chat_access_token,
        chat_refresh_token,
      },
    },
  })
}
