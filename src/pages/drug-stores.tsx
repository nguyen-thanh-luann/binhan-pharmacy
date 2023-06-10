import { LocationOutlineIcon, TelePhoneIconOutline, TrashIconOutline } from '@/assets'
import {
  Breadcrumb,
  Button,
  CustomImage,
  NotFound,
  SearchField,
  SelectField,
  Spinner
} from '@/components'
import {
  DOMAIN_URL,
  LIMIT_DRUG_STORES,
  SWR_KEY, thumbnailImageUrl, WEB_DESCRIPTION,
  WEB_TITTLE
} from '@/constants'
import { isArrayHasValue } from '@/helper'
import { useAddress, useDrugstores } from '@/hooks'
import { Main } from '@/templates'
import { OptionType } from '@/types'
import { useForm } from 'react-hook-form'
import InfiniteScroll from 'react-infinite-scroll-component'

const DrugstorePage = () => {
  // useForm
  const { control, getValues, resetField } = useForm({
    mode: 'all',
  })

  const { districts, getDistricts, getWards, states } = useAddress()

  const { drugstores, filter, hasMore, getMore, isValidating, total } = useDrugstores({
    key: `${SWR_KEY.get_drug_stores}`,
    params: {
      limit: LIMIT_DRUG_STORES,
    },
  })

  const handleSelectState = (val: OptionType<number>) => {
    if (!val) return

    getDistricts(val.value)

    if (getValues('district') || getValues('ward')) {
      resetField('district')
    }

    filter({
      province_id: val.value,
    })
  }

  const handleSelectDistrict = (district: OptionType<number>) => {
    if (!district) return
    filter({
      district_id: district.value,
      province_id: getValues('state')?.value,
    })
    getWards(district.value)
  }

  const handleResetFilterValue = () => {
    filter({
      province_id: undefined,
      district_id: undefined,
      drugstore_name: '',
    })
    resetField('state', {})
    resetField('district', {})
  }

  const filterAddress = `${getValues('ward') ? getValues('ward')?.label : ''}${
    getValues('district') ? getValues('district')?.label : ''
  }${getValues('state') ? getValues('state')?.label : ''}`

  const renderFilerOptions = () => {
    return (
      <div className="bg-white">
        <div>
          <SearchField
            placeholder="Nhập tên nhà thuốc"
            className="py-8 px-12 rounded-full border border-gray-200 mb-12"
            onChangeWithDebounceValue={(val) => {
              filter({
                drugstore_name: val,
              })
            }}
          />
        </div>

        <div className="mb-12 flex-center">
          <div className="hidden md:block min-w-[132px] w-[10%] h-[1px] border border-t border-gray-300"></div>
          <p className="title-lg text-center capitalize mx-12">Hoặc</p>
          <div className="hidden md:block min-w-[132px] w-[10%] h-[1px] border border-t border-gray-300"></div>
        </div>

        <div className="mb-12 z-60">
          <SelectField
            value={getValues('state') || null}
            control={control}
            onChange={(val: any) => handleSelectState(val)}
            placeholder="Tỉnh/thành phố"
            name="state"
            options={states?.map((item) => ({
              label: item.name,
              value: item.id,
            }))}
          />
        </div>

        <div className="mb-12">
          <SelectField
            value={getValues('district') || null}
            control={control}
            onChange={(val: any) => {
              handleSelectDistrict(val)
              if (getValues('ward')) resetField('ward')
            }}
            placeholder="Quận/huyện"
            name="district"
            options={districts?.map((item) => ({
              label: item.name,
              value: item.id,
            }))}
          />
        </div>

        {getValues('state') || getValues('district') ? (
          <div>
            <Button
              icon={<TrashIconOutline className="text-red" />}
              className="border p-8 w-full rounded-md borer-gray-200 border-red"
              title="Xóa bộ lọc"
              textClassName="text-red"
              onClick={handleResetFilterValue}
            />
          </div>
        ) : null}
      </div>
    )
  }

  return (
    <Main title={WEB_TITTLE} description={WEB_DESCRIPTION}>
      <div className="container my-12 min-h-[80vh]">
        <Breadcrumb
          breadcrumbList={[
            {
              path: '/',
              name: 'Hệ thống nhà thuốc',
            },
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-24">
          <div className="hidden md:block col-span-1">
            <div className="rounded-[10px] shadow-shadow-1 p-12 bg-white">
              <p className="text-md text-text-color font-bold mb-12">Tìm kiếm nhà thuốc</p>

              {renderFilerOptions()}
            </div>
          </div>
          <div className="col-span-3 md:col-span-2">
            <div className="rounded-[10px] shadow-shadow-1 p-12 bg-white">
              {/* mobile */}
              <div className="md:hidden mb-12">
                <p className="text-md text-text-color font-bold mb-12">Tìm kiếm nhà thuốc</p>

                {renderFilerOptions()}
              </div>

              <div>
                <InfiniteScroll
                  dataLength={drugstores?.length || 0}
                  next={() => getMore()}
                  hasMore={false}
                  loader={
                    hasMore ? (
                      <div className="my-12">
                        <Spinner />
                      </div>
                    ) : null
                  }
                >
                  {isValidating ? (
                    <div className="my-12 flex-center">
                      <Spinner />
                    </div>
                  ) : isArrayHasValue(drugstores) ? (
                    <div>
                      <p className="text-md mb-12 font-bold">{`Tìm thấy ${total} cửa hàng ${
                        filterAddress !== '' ? `tại ${filterAddress}` : ''
                      }`}</p>

                      <div className="max-h-[60vh] overflow-scroll">
                        {drugstores?.map((store) => (
                          <div
                            key={store.partner_id}
                            className="flex items-center gap-12 border border-gray-200 rounded-md p-12 mb-12 last:mb-0 hover:bg-gray-100"
                            onClick={() => {}}
                          >
                            <div className="min-w-[46px] h-[46px]">
                              <CustomImage
                                src={store?.avatar_url?.url}
                                imageClassName="w-[46px] h-[46px] object-cover rounded-full"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="text-md font-bold mb-8">{store.partner_name}</p>

                              <div className="flex items-center gap-8 mb-8">
                                <LocationOutlineIcon className="min-w-[16px] w-[16px] h-[16px]" />
                                <p className="text-base font-semibold line-clamp-1">{`Địa chỉ: ${store.full_address}`}</p>
                              </div>

                              <div className="flex items-center gap-8">
                                <TelePhoneIconOutline className="min-w-[16px] w-[16px] h-[16px]" />
                                <p className="text-base font-semibold line-clamp-1">
                                  {store.phone}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <NotFound className="py-20" notify="Không tìm thấy cửa hàng nào!" />
                  )}
                </InfiniteScroll>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Main>
  )
}

export default DrugstorePage

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
