/**
 * ProgressIndicator 컴포넌트가 받을 수 있는 props의 타입을 정의합니다.
 */
type ProgressIndicatorProps = {
  position?: 'center' | 'top' | 'bottom' // 아이콘 위치 (기본값: 'center')
  size?: 's' | 'm' | 'l' // 아이콘 크기 (기본값: 'm')
  isLoading?: boolean // 처리 중 여부, true일 때 활성화 (기본값: false)
  text?: string // 아이콘 하단에 표시될 텍스트 (기본값: "")
  backgroundColor?: 'gray' | 'white' // 배경색 (기본값: 'gray')
}

const ProgressIndicator = ({
  position = 'center',
  size = 'm',
  isLoading = false,
  text = '',
  backgroundColor = 'gray',
}: ProgressIndicatorProps) => {
  // isLoading이 false이면 아무것도 렌더링하지 않습니다.
  if (!isLoading) {
    return null
  }

  // position prop에 따른 스타일
  const positionClasses = {
    center: 'items-center justify-center',
    top: 'items-start justify-center pt-20',
    bottom: 'items-end justify-center pb-20',
  }

  // size prop에 따른 아이콘 크기 스타일
  const sizeClasses = {
    s: 'h-8 w-8',
    m: 'h-12 w-12',
    l: 'h-20 w-20',
  }

  // backgroundColor prop에 따른 배경 및 아이콘/텍스트 색상 스타일
  const backgroundClasses =
    backgroundColor === 'white' ? 'bg-white/50' : 'bg-gray_two/80'

  const iconAndTextColor =
    backgroundColor === 'white' ? 'text-black' : 'text-white'

  return (
    // 전체 화면을 덮는 오버레이 컨테이너
    <div
      className={`fixed inset-0 z-50 flex ${positionClasses[position]}`}
      // 배경을 클릭해도 이벤트가 뒤로 전달되지 않도록 막습니다.
      onClick={(e) => e.stopPropagation()}
    >
      <div className={backgroundClasses + ' absolute inset-0'}></div>
      {/* 아이콘과 텍스트를 감싸는 컨테이너 */}
      <div className="z-10 flex flex-col items-center gap-4">
        {/* 스피너 아이콘 (SVG) */}
        <svg
          className={`animate-spin ${sizeClasses[size]} ${iconAndTextColor}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>

        {/* 텍스트가 있을 경우에만 렌더링 */}
        {text && (
          <p className={`text-lg font-semibold ${iconAndTextColor}`}>{text}</p>
        )}
      </div>
    </div>
  )
}

export default ProgressIndicator