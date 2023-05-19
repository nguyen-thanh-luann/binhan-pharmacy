import { HTTPResponse, LoginRes } from '@/types'
import httpProxy from 'http-proxy'
import type { NextApiRequest, NextApiResponse } from 'next'

const proxy = httpProxy.createProxyServer()

export const config = {
  api: {
    bodyParser: false,
  },
}

export default function handler(req: NextApiRequest, res: NextApiResponse<HTTPResponse<LoginRes>>) {
  return new Promise(async (resolve) => {
    // const cookies = new Cookies(req, res, { secure: process.env.NODE_ENV !== 'development' })
    try {
      // const response = await authAPI.registerServer(req.body)

      // if (response?.data?.success) {
      //   const { access_token, refresh_token } = response.data.response

      //   cookies.set('access_token', access_token, {
      //     httpOnly: true,
      //     sameSite: 'lax',
      //     // expires: moment().add(expires_in, 'seconds').toDate(),
      //   })

      //   cookies.set('refresh_token', refresh_token, {
      //     httpOnly: true,
      //     sameSite: 'lax',
      //   })
      // }

      // res.status(200).json(response.data)
    } catch (error: any) {
      res.status(error.response.status).json(error.response.data)
    }

    proxy.once('proxyRes', () => {
      resolve(true)
    })

    proxy.web(req, res, {
      target: process.env.NEXT_PUBLIC_API_URL,
      changeOrigin: true,
      selfHandleResponse: true,
    })
  })
}
