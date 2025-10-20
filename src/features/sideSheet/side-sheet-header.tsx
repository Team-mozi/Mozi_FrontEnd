import React from 'react'
import { getRelativeTime } from '@/utils/time'
import useMobile from '@/hooks/useMobile'

type SideSheetHeaderProps = {
  userName: string
  postTime: number
  createdAt?: string
  onClose: () => void
}

const SideSheetHeader: React.FC<SideSheetHeaderProps> = ({
  userName,
  postTime,
  createdAt,
  onClose,
}) => {
  const isMobile = useMobile()
  // 실제 생성 시간이 있으면 상대적 시간을 계산하고, 없으면 기본값 사용
  const displayTime = createdAt ? getRelativeTime(createdAt) : `${postTime}시간 전`
  return (
    <div className={`flex items-center justify-between py-6 ${
      isMobile ? 'px-4' : 'px-8'
    }`}>
      <div className={`min-w-0 ${isMobile ? 'flex-1' : 'flex-1'}`}>
        <div className={`font-bold flex items-center gap-2 ${
          isMobile ? 'text-base' : 'text-lg'
        }`}>
          {userName}님의 게시글
          <span className='text-gray_one text-medium text-xs pt-2'>
            {displayTime}
          </span>
        </div>
      </div>
      <button
        type='button'
        aria-label='Close'
        title='신고하기'
        onClick={onClose}
        className={`text-red-500 font-semibold hover:bg-gray-100 active:bg-gray-200 ${
          isMobile ? 'ml-4' : ''
        }`}
      >
        신고
      </button>
    </div>
  )
}

export default SideSheetHeader
