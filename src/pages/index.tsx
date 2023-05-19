import { HomeBanner, HomePosts, ProductsByAttributeMinor, SectionBuyMedicine } from '@/components'
import { DOMAIN_URL, SWR_KEY, WEB_DESCRIPTION, WEB_TITTLE, thumbnailImageUrl } from '@/constants'
import { isArrayHasValue } from '@/helper'
import { useAttributeMinor, useBanner } from '@/hooks'
import { Main } from '@/templates'

const HomePage = () => {
  const { data: bannerList, isValidating } = useBanner({})

  const { attributeMinors, isValidating: attributeMinorLoading } = useAttributeMinor({
    key: SWR_KEY.get_attribute_minor_list,
    params: {},
  })

  return (
    <Main title={WEB_TITTLE} description={WEB_DESCRIPTION}>
      <div>
        <div className="mb-24">
          <HomeBanner banners={bannerList?.result || null} isLoading={isValidating} />
        </div>

        <div className="container px-12">
          <SectionBuyMedicine className="mb-24 hidden md:block" />

          {/* productList by attribute minor */}
          {attributeMinorLoading ? (
            <ProductsByAttributeMinor
              className="mb-24"
              atribute={undefined}
              isValidating={attributeMinorLoading}
            />
          ) : isArrayHasValue(attributeMinors) ? (
            attributeMinors?.map((attribute) => (
              <ProductsByAttributeMinor
                className="mb-24"
                key={attribute?.attribute_id}
                atribute={attribute}
              />
            ))
          ) : null}

          {/* post list */}
          <HomePosts />
        </div>

        {/* <ChatButton /> */}
      </div>
    </Main>
  )
}

export default HomePage

export const getStaticProps = async () => {
  return {
    props: {
      openGraphData: [
        {
          property: 'og:image',
          content: thumbnailImageUrl,
          key: 'ogimage',
        },
        {
          property: 'og:image:alt',
          content: thumbnailImageUrl,
          key: 'ogimagealt',
        },
        {
          property: 'og:image:width',
          content: '400',
          key: 'ogimagewidth',
        },
        {
          property: 'og:image:height',
          content: '300',
          key: 'ogimageheight',
        },
        {
          property: 'og:url',
          content: DOMAIN_URL,
          key: 'ogurl',
        },
        {
          property: 'og:image:secure_url',
          content: thumbnailImageUrl,
          key: 'ogimagesecureurl',
        },
        {
          property: 'og:title',
          content: WEB_TITTLE,
          key: 'ogtitle',
        },
        {
          property: 'og:description',
          content: WEB_DESCRIPTION,
          key: 'ogdesc',
        },
        {
          property: 'og:type',
          content: 'website',
          key: 'website',
        },
      ],
    },
  }
}
