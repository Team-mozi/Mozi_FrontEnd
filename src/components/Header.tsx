import { useNavigate } from 'react-router-dom'

interface HeaderProps {
  title: string
  showBackButton?: boolean
  onBackClick?: () => void
}

const Header = ({
  title,
  showBackButton = false,
  onBackClick,
}: HeaderProps) => {
  const navigate = useNavigate()

  const handleBack = () => {
    if (onBackClick) {
      onBackClick() // 부모 컴포넌트에서 전달된 콜백이 있으면 실행
    } else {
      navigate(-1) // 기본적으로 이전 페이지로 이동
    }
  }

  return (
    <div className='fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200'>
      <div className='flex items-center justify-between px-4 md:px-8 h-14 md:h-16 relative'>
        {/* 뒤로가기 버튼 */}
        {showBackButton ? (
          <button onClick={handleBack} className='text-black'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 320 512'
              className='w-5 h-5 fill-current'
            >
              <path d='M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z' />
            </svg>
          </button>
        ) : null}

        {/* 타이틀 */}
        <h1 className='absolute left-1/2 -translate-x-1/2 text-lg font-semibold text-black'>
          {title}
        </h1>
      </div>
    </div>
  )
}

export default Header
