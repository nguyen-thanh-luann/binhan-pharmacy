import { useEffect, useRef, useState } from 'react'

import { useUpload } from '@/hooks'
import classNames from 'classnames'
import dynamic from 'next/dynamic'
import { Button } from '../button'

const JoditEditor: any = dynamic(() => import('jodit-react').then((mod) => mod), {
  ssr: false,
})

interface JoditPostEditorProps {
  onSubmit?: (val: string) => void
  defaultValue?: string
  btnLabel?: string
  validating?: boolean
}

export const JoditPostEditor = ({
  defaultValue = '',
  onSubmit,
  btnLabel,
}: JoditPostEditorProps) => {
  const editorRef = useRef<any>(null)
  const [content, setContent] = useState(defaultValue)
  const { uploadSingleImage, isUploading } = useUpload()

  useEffect(() => {
    if (isUploading) {
      document.body.style.cursor = 'progress'
    } else {
      document.body.style.cursor = 'default'
    }
  }, [isUploading])

  const handleUploadImage = () => {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.click()
    input.onchange = (e: any) => {
      const files = e.target?.files
      if (!files?.length) return

      uploadSingleImage(files[0], (res: any) => {
        if (editorRef) {
          console.log({ editorRef })
          console.log({ res })

          const imgElement = `<img src="${res?.url}" alt="Inserted Image">`
          const editorInstance = editorRef?.current?.editor

          console.log({ editorInstance })

          const currentValue = editorInstance.getEditorValue()

          const newValue = `${currentValue}${imgElement}`

          editorInstance.setEditorValue(newValue)
        }
      })
    }
  }

  const config: any = {
    extraButtons: [
      {
        name: '🎬',
        exec: handleUploadImage,
      },
    ],
  }

  return (
    <div className="relative">
      <div className="post-editor">
        <JoditEditor
          config={config}
          ref={editorRef}
          value={content}
          onBlur={(newContent: any) => setContent(newContent)}
          className="!text-md"
        />
      </div>

      <div className="flex-center sticky bottom-0 z-40 bg-white py-12">
        <Button
          title={btnLabel || 'Tiếp tục'}
          className={classNames(
            `border border-primary px-20 py-4`,
            !content ? 'opacity-50 hover:opacity-50 cursor-default' : ''
          )}
          textClassName={`title-base font-bold text-primary`}
          onClick={() => onSubmit && onSubmit(content)}
        />
      </div>
    </div>
  )
}
