import {
  HomeBanner,
  HomePosts,
  IntroPopUp,
  ListProductByAttributeMinor,
  SectionBuyMedicine,
  VisceraAttribute,
} from '@/components'
import { DOMAIN_URL, WEB_DESCRIPTION, WEB_TITTLE, thumbnailImageUrl } from '@/constants'
import { Main } from '@/templates'

// this is checkout branch
const HomePage = () => {
  return (
    <Main title={WEB_TITTLE} description={WEB_DESCRIPTION}>
      <div>
        <div className="mb-24">
          <HomeBanner />
        </div>

        <div className="container px-12">
          <SectionBuyMedicine className="mb-24 hidden md:block" />

          <VisceraAttribute />

          <ListProductByAttributeMinor />

          {/* post list */}
          <HomePosts />
        </div>

        <IntroPopUp />
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
