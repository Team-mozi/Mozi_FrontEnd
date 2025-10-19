import React from 'react'
import { getRelativeTime } from '@/utils/time'

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
  // 실제 생성 시간이 있으면 상대적 시간을 계산하고, 없으면 기본값 사용
  const displayTime = createdAt ? getRelativeTime(createdAt) : `${postTime}시간 전`
  return (
    <div className='flex items-center justify-between px-8 py-6'>
      <div className='min-w-0 flex-1'>
        <div className='text-lg font-bold flex items-center gap-2'>
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
        className='text-red-500 font-semibold hover:bg-gray-100 active:bg-gray-200'
      >
        신고
      </button>
    </div>
  )
}

export default SideSheetHeader
