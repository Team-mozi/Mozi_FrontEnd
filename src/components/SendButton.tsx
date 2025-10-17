import React from 'react'

type SendButtonProps = {
  onClick: () => void
  className?: string
  children?: React.ReactNode
  disabled?: boolean
}

const SendButton: React.FC<SendButtonProps> = ({
  children = '↑',
  className = '',
  onClick,
  disabled = false,
}) => {
  return (
    <button
      className={`h-14 w-14 rounded-full border-3 border-orange-400 bg-white text-4xl text-orange-400 hover:bg-orange-400 hover:text-white drop-shadow-sm flex-shrink-0 shadow-md ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default SendButton
