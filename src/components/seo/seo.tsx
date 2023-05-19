
import { DOMAIN_URL } from '@/constants'
import Head from 'next/head'

interface SeoProps {
  title: string
  description: string
  url: string
  thumbnailUrl: string
}

const Seo = ({ description, url, thumbnailUrl, title }: SeoProps) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="title" content={title} />
        <meta name="description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${DOMAIN_URL}${url}`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={thumbnailUrl} />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={`${DOMAIN_URL}${url}`} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:image" content={thumbnailUrl} />
      </Head>
    </>
  )
}

export { Seo }
