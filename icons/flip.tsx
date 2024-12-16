import { JSX } from 'react'

const FlipIcon: React.FC<JSX.IntrinsicElements['svg']> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}>
      <path d="M2 9V5c0-1.1.9-2 2-2h4" />
      <path d="M22 15v4c0 1.1-.9 2-2 2h-4" />
      <path d="M18 4v16" />
      <path d="M6 20V4" />
    </svg>
  )
}

export default FlipIcon
