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
    const token = cookies.get('token')
    const guest_token = cookies.get('guest_token')
    const guest_refresh_token = cookies.get('guest_refresh_token')
    const device_code = cookies.get('device_code')

    if (token) {
      return res.status(201).json({
        result: {
          message: 'Account Logged',
          success: true,
          code: 201,
          data: [],
        },
      })
    }

    if (guest_token) {
      return res.status(201).json({
        result: {
          message: 'Guest Token exist',
          success: true,
          code: 201,
          data: {
            guest_token,
            guest_refresh_token,
            device_code,
          },
        },
      })
    }

    try {
      const response: any = await authAPI.loginGuestAccount()

      if (!response?.success) {
        return res.status(400).json({
          result: {
            message: response?.message || 'Login guest fail',
            success: false,
            code: 400,
            data: response?.data || undefined,
          },
        })
      }

      const { token, refresh_token, device_code } = response?.data

      cookies.set('guest_token', token, {
        httpOnly: true,
        sameSite: 'lax',
      })

      cookies.set('guest_refresh_token', refresh_token, {
        httpOnly: true,
        sameSite: 'lax',
      })

      cookies.set('device_code', device_code, {
        httpOnly: true,
        sameSite: 'lax',
      })

      res.status(response?.code || 200).json({
        result: {
          message: 'Guest Login success',
          success: true,
          code: 200,
          data: response?.data,
        },
      })
    } catch (error: any) {
      console.log(error)
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
