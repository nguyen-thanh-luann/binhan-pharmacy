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
      const response: any = await authAPI.generateChatToken(req.body.params.token)

      if (!response?.success) {
        return res.status(400).json({
          result: {
            message:
              response?.result?.message || response?.message || 'Generated chat token faild!',
            success: false,
            code: 400,
            data: response?.result?.data || undefined,
          },
        })
      }

      const { access_token, refresh_token } = response?.data

      cookies.set('chat_access_token', access_token.token, {
        httpOnly: true,
        sameSite: 'lax',
      })

      cookies.set('chat_refresh_token', refresh_token.token, {
        httpOnly: true,
        sameSite: 'lax',
      })

      res.status(response?.status_code || 200).json({
        result: {
          message: response?.message || response?.result?.message || 'Generate token success!',
          success: true,
          code: 200,
          data: response?.data || response?.result?.data,
        },
      })
    } catch (error: any) {
      res.status(500).send(error || 'Error generating token')
    }

    proxy.once('proxyRes', () => {
      resolve(true)
    })

    proxy.web(req, res, {
      target: process.env.NEXT_PUBLIC_CHAT_API_URL,
      changeOrigin: true,
      selfHandleResponse: true,
    })
  })
}
