import { RightIcon } from '@/assets'
import { useAddress, useClickOutside, useModal } from '@/hooks'
import { OptionType } from '@/types'
import classNames from 'classnames'
import { useRef, useState, useImperativeHandle, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { Tabs } from '../tabs'
import { SearchField } from './searchField'

export interface AddressPickerV2Props {
  onSubmit?: Function
  className?: string
  placeHolder?: string
  inputClassName?: string
  modalClassName?: string
  defaultValue?: string
}

// This version of AddressPicker can use ref to call reset data from external
export const AddressPickerV2 = forwardRef(
  (
    {
      onSubmit,
      className,
      placeHolder,
      inputClassName,
      modalClassName,
      defaultValue,
    }: AddressPickerV2Props,
    ref
  ) => {
    const {
      visible: showAddressModal,
      closeModal: closeAddressModal,
      openModal: openAddressModal,
      toggle: toggleAddressModal,
    } = useModal()

    // Get Address from custom hook
    const { districts, getDistricts, getWards, states, wards } = useAddress()

    const [state, setState] = useState<OptionType<number> | undefined>(undefined)
    const [district, setDistrict] = useState<OptionType<number> | undefined>(undefined)
    const [ward, setWard] = useState<OptionType<number> | undefined>(undefined)
    const [searchValue, setSearchValue] = useState<string>('')

    const [currentTab, setCurrentTab] = useState<string>('state')

    const addressModalRef = useRef<HTMLDivElement>(null)
    const searchFieldRef = useRef<HTMLDivElement>(null)
    const selectRef = useRef<HTMLInputElement>(null)

    useClickOutside([addressModalRef], closeAddressModal)

    const focusSearchField = () => {
      searchFieldRef?.current?.focus()
    }

    const resetData = () => {
      if (selectRef?.current) {
        selectRef.current.value = ''
      }
      defaultValue = ''
      setState(undefined)
      setDistrict(undefined)
      setWard(undefined)
    }

    useImperativeHandle(ref, () => ({
      resetData,
    }))

    const handleSelectState = (state: OptionType<number>) => {
      setState(state)

      if (district || ward) {
        setDistrict(undefined)
        setWard(undefined)
      }
      getDistricts(state.value)
      setCurrentTab('district')
    }

    const handleSelectDistrict = (district: OptionType<number>) => {
      setDistrict(district)
      setSearchValue('')
      if (ward) {
        setWard(undefined)
      }
      getWards(district.value)
      setCurrentTab('ward')
    }

    const handleSelectWard = (ward: OptionType<number>) => {
      setWard(ward)
      setSearchValue('')

      onSubmit?.({
        state,
        district,
        ward,
      })

      closeAddressModal()
    }

    const handleTabChange = (tab: string) => {
      if (tab === 'district' && state) {
        setCurrentTab(tab)
      }
      if (tab === 'ward' && district) {
        setCurrentTab(tab)
      }
      if (tab === 'state') {
        setCurrentTab(tab)
      }
    }

    return (
      <div ref={addressModalRef} className={twMerge(classNames(`relative bg-white`, className))}>
        <div
          className={`flex items-center border-gray-200  p-8 ${
            showAddressModal ? `border-b` : `rounded-lg border`
          }`}
        >
          <input
            ref={selectRef}
            readOnly
            className={twMerge(classNames(`flex-1 outline-none w-full`, inputClassName))}
            placeholder={placeHolder || 'Tỉnh/Thành phố, Quận/Huyện, Phường/Xã'}
            onFocus={() => {
              openAddressModal()
              setCurrentTab('state')
              focusSearchField()
            }}
            value={
              state || district || ward
                ? `${ward?.label || ''} ${district?.label || ''} ${state?.label}  `
                : undefined
            }
            defaultValue={defaultValue}
          />

          <div
            className="cursor-pointer"
            onClick={() => {
              toggleAddressModal()
              focusSearchField()
            }}
          >
            <RightIcon
              className={classNames(
                'w-12 h-12 text-gray duration-200 ease-in-out',
                showAddressModal ? `rotate-90` : ``
              )}
            />
          </div>
        </div>

        <div
          className={twMerge(
            classNames(
              `absolute z-50 left-0 right-0 bg-white border border-gray-200 border-t-0 animate-fade ${
                showAddressModal ? `block` : `hidden`
              }`,
              modalClassName
            )
          )}
        >
          <Tabs
            list={[
              { label: 'Tỉnh/Thành phố', value: 'state' },
              { label: 'Quận/Huyện', value: 'district' },
              { label: 'Phường/Xã', value: 'ward' },
            ]}
            tabActive={currentTab}
            onChange={(val: string) => handleTabChange(val)}
            className="bg-white"
            labelClassName="flex-1 p-8 text-base text-center"
            tabActiveClassName="border-b border-primary"
          />

          <SearchField
            ref={searchFieldRef}
            showSearchIcon={false}
            placeholder="Tìm kiếm"
            className="border-b border-gray-200 px-12"
            onChangeWithDebounceValue={(val) => setSearchValue(val.toUpperCase())}
          />

          <div className={`h-[250px] overflow-scroll scrollbar-hide`}>
            {currentTab === 'state'
              ? states?.map((item) =>
                  item?.name.toUpperCase().includes(searchValue) ? (
                    <div
                      key={item.id}
                      className="address_picker_item"
                      onClick={() =>
                        handleSelectState({
                          label: item?.name,
                          value: item?.id,
                        })
                      }
                    >
                      <p className={item?.id === state?.value ? `!text-primary` : ``}>
                        {item?.name}
                      </p>
                    </div>
                  ) : null
                )
              : null}

            {currentTab === 'district'
              ? districts?.map((item) =>
                  item?.name.toUpperCase().includes(searchValue) ? (
                    <div
                      key={item.id}
                      className="address_picker_item"
                      onClick={() =>
                        handleSelectDistrict({
                          label: item?.name,
                          value: item?.id,
                        })
                      }
                    >
                      <p className={item?.id === district?.value ? `!text-primary` : ``}>
                        {item?.name}
                      </p>
                    </div>
                  ) : null
                )
              : null}

            {currentTab === 'ward'
              ? wards?.map((item) =>
                  item?.name.toUpperCase().includes(searchValue) ? (
                    <div
                      key={item.id}
                      className="address_picker_item"
                      onClick={() =>
                        handleSelectWard({
                          label: item?.name,
                          value: item?.id,
                        })
                      }
                    >
                      <p className={item?.id === ward?.value ? `!text-primary` : ``}>
                        {item?.name}
                      </p>
                    </div>
                  ) : null
                )
              : null}
          </div>
        </div>
      </div>
    )
  }
)
