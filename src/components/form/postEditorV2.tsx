import dynamic from 'next/dynamic'
import React, { useState } from 'react'
//@ts-ignore
import { EditorState, ContentState, convertToRaw } from 'draft-js'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

//@ts-ignore
const Editor: any = dynamic(() => import('react-draft-wysiwyg').then((mod) => mod.Editor), {
  ssr: false,
})

interface postEditorV2Props {
  onSubmit?: (val: string) => void
  defaultValue?: string
  btnLabel?: string
  validating?: boolean
}

export const PostEditorV2 = ({ defaultValue }: postEditorV2Props) => {
  const contentState = ContentState.createFromText(defaultValue || '')
  const [editorState, setEditorState] = useState(EditorState.createWithContent(contentState))

  const handleEditorChange = (data: any) => {
    setEditorState(data)
    console.log(convertToRaw(editorState.getCurrentContent()))
  }

  return (
    <div>
      <Editor
        editorState={editorState}
        onEditorStateChange={handleEditorChange}
        wrapperClassName="demo-wrapper"
        editorClassName="demo-editor min-h-[500px] border border-gray-200 rounded-md"
      />
    </div>
  )
}
