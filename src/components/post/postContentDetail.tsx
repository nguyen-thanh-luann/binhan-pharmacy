const PostContentDetail = ({ content }: { content: string }) => {
  return (
    <div
      className="p-12 max-w-[1280px] w-full mx-auto h-full post-content"
      dangerouslySetInnerHTML={{ __html: content }}
    ></div>
  )
}

export { PostContentDetail }
