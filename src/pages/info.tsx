import { Breadcrumb, Spinner } from '@/components'
import { WEB_DESCRIPTION, WEB_TITTLE } from '@/constants'
import { fromProductSlugToProductId } from '@/helper'
import { useFooterDescription } from '@/hooks/footer'
import { Main } from '@/templates'
import { useRouter } from 'next/router'

const InfoPage = () => {
  const router = useRouter()
  const target = fromProductSlugToProductId((router?.query?.target as string) || '')

  const { footerData, isValidating } = useFooterDescription({
    id: Number(target),
  })

  if (isValidating)
    return (
      <div className="flex-center">
        <Spinner />
      </div>
    )

  if (!footerData) return null

  return (
    <Main title={WEB_TITTLE} description={WEB_DESCRIPTION}>
      <div className="container px-12 my-32">
        <Breadcrumb
          breadcrumbList={[
            {
              path: '/',
              name: `${footerData?.line_name}`,
            },
          ]}
        />

        <div
          dangerouslySetInnerHTML={{
            __html: footerData?.description_html || '',
          }}
        ></div>
      </div>
    </Main>
  )
}

export default InfoPage
