export const UserDoubleCircleIcon = ({ className = '' }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
    >
      <ellipse
        cx="12"
        cy="17.5"
        rx="7"
        ry="3.5"
        stroke={'currentColor'}
       strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="7"
        r="4"
        stroke={'currentColor'}
       strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}
