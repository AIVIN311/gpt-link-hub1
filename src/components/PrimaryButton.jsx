import React from 'react'

function PrimaryButton({ href, className = '', children, ...props }) {
  const baseClass = 'px-3 py-1.5 text-sm bg-blue-500 text-white rounded'
  const combinedClass = `${baseClass} ${className}`.trim()

  if (href) {
    return (
      <a href={href} className={combinedClass} {...props}>
        {children}
      </a>
    )
  }

  return (
    <button className={combinedClass} {...props}>
      {children}
    </button>
  )
}

export default PrimaryButton

