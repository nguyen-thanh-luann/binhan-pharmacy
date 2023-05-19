import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  let token = req.cookies?.get('token')

  if (!token) {
    
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_DOMAIN_URL}/login`)
  }
  return
}

export const config = {
  matcher: ['/account/:path*'],
}
