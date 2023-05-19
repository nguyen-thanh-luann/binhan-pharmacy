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
  if (req.method !== 'POST') {
    return res.status(404).json({
      result: {
        message: 'method not supported',
        success: false,
        data: [],
        code: 404,
      },
    })
  }
  

  const cookies = new Cookies(req, res)
  cookies.set('token')
  cookies.set('refresh_token')
  cookies.set('chat_access_token')
  cookies.set('chat_refresh_token')

  res.status(200).json({
    result: {
      message: 'logout successfully',
      success: true,
      data: [],
      code: 200,
    },
  })
}
