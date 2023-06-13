import { TimesIcon } from '@/assets'
import { setToLocalStorage, toggleBodyOverflow } from '@/helper'
import { useUpload } from '@/hooks'
import dynamic from 'next/dynamic'
import { useEffect, useMemo, useRef, useState } from 'react'
import 'react-quill/dist/quill.snow.css'
import { Button } from '../button'
import { Modal } from '../modal'
import { PostContentDetail } from '../post'
import { Spinner } from '../spinner'
import classNames from 'classnames'

const ReactQuill: any = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill')

    return ({ forwardedRef, ...props }: any) => <RQ ref={forwardedRef} {...props} />
  },
  {
    ssr: false,
  }
)

const formats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'align',
  'color',
  'background',
  'indent',
  'link',
  'image',
  'undo',
  'table',
  'code',
  'script',
  'size',
  'font',
]

interface blogEditorProps {
  onSubmit?: (val: string) => void
  defaultValue?: string
  btnLabel?: string
  validating?: boolean
}

const PostEditor = ({ onSubmit, defaultValue, btnLabel, validating = false }: blogEditorProps) => {
  const quillRef = useRef<any>(null)
  const [text, setText] = useState<string>(defaultValue || '')
  const { uploadSingleImage, isUploading } = useUpload()
  const [showQuickView, setShowQuickView] = useState<boolean>(false)

  useEffect(() => {
    if (isUploading) {
      document.body.style.cursor = 'progress'
    } else {
      document.body.style.cursor = 'default'
    }
  }, [isUploading])

  const handleSetText = (val: string) => {
    setToLocalStorage('blog_form_content', val)
    setText(val)
  }

  const handleUploadImage = () => {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.click()
    input.onchange = (e: any) => {
      const files = e.target?.files
      if (!files?.length) return

      uploadSingleImage(files[0], (res: any) => {
        const quill = quillRef?.current?.getEditor()
        const range = quill.getSelection(true)

        quill.insertEmbed(range.index, 'image', res?.url)
      })
    }
  }

  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [{ color: [] }, { background: [] }],
          [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link', 'image'],
          // ['code'],
        ],
        handlers: {
          image: () => handleUploadImage(),
        },
        clipboard: {
          matchVisual: false,
        },
      },
    }
  }, [])

  if (validating)
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner size={20} />
      </div>
    )

  return (
    <div className="relative">
      <div className="pb-[64px] post-content">
        <ReactQuill
          forwardedRef={quillRef}
          value={text}
          onChange={(val: string) => handleSetText(val)}
          modules={modules}
          formats={formats}
          theme="snow"
        />
      </div>

      <div className="flex-center sticky bottom-0 z-40 bg-white py-12">
        <Button
          title={btnLabel || 'Tiếp tục'}
          className={classNames(
            `border border-primary px-20 py-4`,
            !text ? 'opacity-50 hover:opacity-50 cursor-default' : ''
          )}
          textClassName={`title-base font-bold text-primary`}
          onClick={() => onSubmit && onSubmit(text)}
        />

        {text ? (
          <button
            onClick={() => {
              setShowQuickView(true)
              toggleBodyOverflow('hidden')
            }}
            className={`title_md !text-primary ${
              !text ? 'opacity-50 hover:opacity-50 cursor-default' : ''
            } absolute right-24`}
          >
            {btnLabel || 'Xem trước'}
          </button>
        ) : null}
      </div>

      <Modal
        visible={showQuickView}
        modalClassName={`h-[90vh] w-[90%] md:w-[60%] mx-auto`}
        animationType="slideUp"
        header={
          <div className="flex justify-end p-18">
            <div
              className="cursor-pointer hover:opacity-50 duration-150 ease-in-out"
              onClick={() => {
                setShowQuickView(false)
              }}
            >
              <TimesIcon className="w-18 h-18 text-gray-500" />
            </div>
          </div>
        }
      >
        <div className="relative">
          <PostContentDetail content={text || ''} />
        </div>
      </Modal>
    </div>
  )
}

export { PostEditor }
