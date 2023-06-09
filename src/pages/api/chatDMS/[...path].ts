import type { HTTPResponse } from '@/types'
import Cookies from 'cookies'
import httpProxy from 'http-proxy'
import type { NextApiRequest, NextApiResponse } from 'next'

const proxy = httpProxy.createProxyServer()

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
}

export default function handler(req: NextApiRequest, res: NextApiResponse<HTTPResponse<any>>) {
  const cookies = new Cookies(req, res)
  const chatToken = cookies.get('chat_access_token')

  if (chatToken) {
    req.headers.Authorization = `Bearer ${chatToken}`
  }

  req.url = `${process.env.NEXT_PUBLIC_CHAT_API_URL}${req.url?.replace('/api/chatDMS', '')}`

  return new Promise((resolve) => {
    proxy.once('proxyRes', () => {
      resolve(true)
    })

    proxy.web(req, res, {
      target: process.env.NEXT_PUBLIC_CHAT_API_URL,
      changeOrigin: true,
      selfHandleResponse: false,
    })
  })
}
