import { authAPI } from '@/services'
import Cookies from 'cookies'
import httpProxy from 'http-proxy'
import type { NextApiRequest, NextApiResponse } from 'next'

export const config = {
  api: {
    bodyParser: true,
  },
}

const proxy = httpProxy.createProxyServer()

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return new Promise(async (resolve) => {
    const cookies = new Cookies(req, res, { secure: process.env.NODE_ENV !== 'development' })
    const refresh_token_req = cookies.get('refresh_token')
    const guest_refresh_token_req = cookies.get('guest_refresh_token')

    try {
      const response: any = await authAPI.refreshToken(
        refresh_token_req || guest_refresh_token_req || ''
      )

      if (!response?.success) {
        return res.status(400).json({
          result: {
            message: response?.message || 'Refresh token fail',
            success: false,
            code: 400,
            data: response?.data || undefined,
          },
        })
      }

      const { token, refresh_token } = response?.data

      cookies.set(refresh_token_req ? 'token' : 'guest_token', token, {
        httpOnly: true,
        sameSite: 'lax',
      })

      cookies.set(refresh_token_req ? 'refresh_token' : 'guest_refresh_token', refresh_token, {
        httpOnly: true,
        sameSite: 'lax',
      })

      res.status(response?.code || 200).json({
        result: {
          message: 'Refresh token success',
          success: true,
          code: 200,
          data: response?.data,
        },
      })
    } catch (err) {
      res.status(500).send(err || 'Internal Server Error.')
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
