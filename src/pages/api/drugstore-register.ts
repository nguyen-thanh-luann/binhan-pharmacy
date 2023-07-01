import { authAPI } from '@/services'
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
 

    try {
      const response: any = await authAPI.firebaseAuth(req.body.params)

      if (!response?.success) {
        return res.status(400).json({
          result: {
            message: response?.message || 'Register fail',
            success: false,
            code: 400,
            data: response?.data || undefined,
          },
        })
      }  

      res.status(response?.code || 200).json({
        result: {
          message: 'Register success',
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
