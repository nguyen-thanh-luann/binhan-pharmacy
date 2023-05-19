export const CommentIcon = ({ className = '' }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
      width="1em"
      height="1em"
      fill="none"
    >
      <path
        d="M13 3H11C6.02944 3 2 7.02944 2 12V17C2 19.2091 3.79086 21 6 21H13C17.9706 21 22 16.9706 22 12C22 7.02944 17.9706 3 13 3Z"
        stroke={'currentColor'}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12.25" cy="12.25" r="1.25" fill={'currentColor'} />
      <circle cx="16.25" cy="12.25" r="1.25" fill={'currentColor'}  />
      <circle cx="8.25" cy="12.25" r="1.25" fill={'currentColor'}  />
    </svg>
  )
}
