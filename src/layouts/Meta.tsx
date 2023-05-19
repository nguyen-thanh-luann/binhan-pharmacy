import { WEB_TITTLE, WEB_DESCRIPTION } from '@/constants'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import { AppConfig } from '@/utils'

export type MetaProps = {
  title: string
  description: string
  thumbnail?: string
  url?: string
}

const Meta = (props: MetaProps) => {
  const router = useRouter()
  const { title = WEB_TITTLE, description = WEB_DESCRIPTION, thumbnail = '' } = props

  return (
    <>
      <Head>
        <meta charSet="UTF-8" key="charset" />
        <meta name="viewport" content="width=device-width,initial-scale=1" key="viewport" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={thumbnail} />
        <meta property="og:image:width" content="875" />
        <meta property="og:image:height" content="476" />
        <meta property="og:image:alt" content={title} />
        <meta property="og:site_name" content={title} />
        <meta property="og:image:url" content={thumbnail} />
        <meta property="og:image:secure_url" content={thumbnail} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:image" content={thumbnail} />
        <meta property="twitter:image:width" content="875" />
        <meta property="twitter:image:height" content="476" />
        <link rel="icon" href={`${router.basePath}/favicon.ico`} key="favicon" />
      </Head>
      <NextSeo
        title={title}
        description={description}
        openGraph={{
          title: title,
          description: description,
          locale: AppConfig.locale,
          site_name: AppConfig.site_name,
        }}
      />
    </>
  )
}

export { Meta }
