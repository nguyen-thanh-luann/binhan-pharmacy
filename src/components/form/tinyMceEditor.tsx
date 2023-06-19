import { TINYMCE_EDITOR_KEY } from '@/constants'
import { useUpload } from '@/hooks'
import { Editor } from '@tinymce/tinymce-react'
import { useEffect, useRef } from 'react'

export const TinyMceEditor = () => {
  const editorRef = useRef<any>(null)
  const { uploadSingleImage, isUploading } = useUpload()

  useEffect(() => {
    if (isUploading) {
      document.body.style.cursor = 'progress'
    } else {
      document.body.style.cursor = 'default'
    }
  }, [isUploading])

  useEffect(() => {
    console.log({ editorRef })
  }, [editorRef])

  return (
    <div>
      <Editor
        ref={editorRef}
        apiKey={TINYMCE_EDITOR_KEY}
        onEditorChange={(newValue, editor) => {
          console.log({
            newValue,
            editor,
          })
        }}
        init={{
          image_title: true,
          automatic_uploads: true,
          file_picker_types: 'image',
          file_picker_callback: (cb, value, meta) => {
            if (isUploading) return

            console.log({
              cb,
              value,
              meta,
            })

            const input = document.createElement('input')
            input.setAttribute('type', 'file')
            input.setAttribute('accept', 'image/*')
            input.click()
            input.onchange = (e: any) => {
              const files = e.target?.files
              if (!files?.length) return

              uploadSingleImage(files[0], (res: any) => {
                cb(res?.url, files?.[0])
              })
            }
          },
        }}
        plugins={[
          'a11ychecker',
          'advcode',
          'advlist',
          'anchor',
          'autolink',
          'codesample',
          'fullscreen',
          'help',
          'image',
          // 'editimage',
          // 'tinydrive',
          'lists',
          'link',
          // 'media',
          'powerpaste',
          'preview',
          'searchreplace',
          'table',
          'template',
          'tinymcespellchecker',
          'visualblocks',
          'wordcount',
        ]}
      />
    </div>
  )
}
