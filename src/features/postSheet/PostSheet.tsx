import { useState, useMemo } from 'react'
import SideSheet from '@/components/SideSheet'
import BottomSheet from '@/components/BottomSheet'
import useMobile from '@/hooks/useMobile'
import PostForm from './postForm'

export default function PostSheet() {
  // Sheet 열림/닫힘 상태
  const [isOpen, setIsOpen] = useState(false)
  const isMobile = useMobile()

  // PostForm을 useMemo로 메모이제이션하여 불필요한 리렌더 방지
  const formElement = useMemo(
    () => <PostForm isMobile={isMobile} setIsOpen={setIsOpen} />,
    [isMobile],
  )

  return (
    <div>
      {/* 플러스 아이콘 버튼 */}
      <button
        onClick={() => setIsOpen(true)}
        className='text-orange_five hover:scale-110 transition-transform'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 448 512'
          className='w-6 h-6'
          fill='currentColor'
        >
          <path d='M256 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 160-160 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l160 0 0 160c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160 160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-160 0 0-160z' />
        </svg>
      </button>

      {/* 시트 표시 */}
      {isMobile ? (
        <BottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
          {formElement}
        </BottomSheet>
      ) : (
        <SideSheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
          {formElement}
        </SideSheet>
      )}
    </div>
  )
}
