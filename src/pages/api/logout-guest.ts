import { authAPI } from '@/services'
import Cookies from 'cookies'
import httpProxy from 'http-proxy'
import type { NextApiRequest, NextApiResponse } from 'next'

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
}

const proxy = httpProxy.createProxyServer()

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return new Promise(async (resolve) => {
    const cookies = new Cookies(req, res, { secure: process.env.NODE_ENV !== 'development' })

    try {
      const response: any = await authAPI.logoutGuestAccount()

      if (!response.success) {
        return res.status(400).json({
          result: {
            message: response?.message || 'Logout fail',
            success: false,
            code: 400,
            data: response?.data || undefined,
          },
        })
      }

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
    } catch (err) {
      res.status(500).send('Internal Server Error.')
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
