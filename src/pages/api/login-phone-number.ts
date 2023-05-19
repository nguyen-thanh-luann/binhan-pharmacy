import { authAPI } from '@/services'
import Cookies from 'cookies'
import httpProxy from 'http-proxy'
import type { NextApiRequest, NextApiResponse } from 'next'

const proxy = httpProxy.createProxyServer()

export const config = {
  api: {
    bodyParser: true,
  },
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return new Promise(async (resolve) => {
    const cookies = new Cookies(req, res, { secure: process.env.NODE_ENV !== 'development' })

    try {
      const response: any = await authAPI.firebaseAuth(req.body.params)

      if (!response?.success) {
        return res.status(400).json({
          result: {
            message: response?.message || 'Login fail',
            success: false,
            code: 400,
            data: response?.data || undefined,
          },
        })
      }

      const { token, refresh_token } = response?.data

      cookies.set('token', token, {
        httpOnly: true,
        sameSite: 'lax',
      })

      cookies.set('refresh_token', refresh_token, {
        httpOnly: true,
        sameSite: 'lax',
      })

      // reset guest token undefind after login main account
      cookies.set('guest_token')
      cookies.set('guest_refresh_token')
      cookies.set('device_code')

      res.status(response?.code || 200).json({
        result: {
          message: 'Login success',
          success: true,
          code: 200,
          data: response?.data,
        },
      })
    } catch (error: any) {
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
