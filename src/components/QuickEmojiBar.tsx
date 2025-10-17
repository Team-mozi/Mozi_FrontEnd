import { useState, useEffect } from 'react'
import Emoji from './emoji'

interface QuickEmojiBarProps {
  onPlusClick: () => void
  onEmojiClick: (emojiId: number) => void
  isLoggedIn: boolean
  selectedEmojiId?: number | null
}

/**
 * 메인화면 하단에 표시되는 빠른 이모지 선택 바 컴포넌트
 * 5개의 랜덤 이모지와 1개의 플러스 버튼을 가로로 배치
 */
const QuickEmojiBar = ({ onPlusClick, onEmojiClick, isLoggedIn, selectedEmojiId }: QuickEmojiBarProps) => {
  const [randomEmojis, setRandomEmojis] = useState<number[]>([])

  // 랜덤 이모지 생성 (1-10번 이모지 중 중복 없이 5개 선택)
  useEffect(() => {
    const generateRandomEmojis = () => {
      const availableEmojis = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      const shuffled = [...availableEmojis].sort(() => Math.random() - 0.5)
      setRandomEmojis(shuffled.slice(0, 5))
    }

    generateRandomEmojis()
  }, [])

  // 로그인하지 않은 사용자는 클릭 시 로그인 페이지로 이동
  const handleEmojiClick = (emojiId: number) => {
    if (isLoggedIn) {
      onEmojiClick(emojiId)
    }
  }

  const handlePlusClick = () => {
    if (isLoggedIn) {
      onPlusClick()
    }
  }

  return (
    <div className="w-full max-w-sm sm:max-w-md px-4 sm:px-0">
      <div className="flex items-center justify-center gap-2 sm:gap-4 bg-white/90 backdrop-blur-sm rounded-full px-3 sm:px-6 py-2 sm:py-3 shadow-lg border border-gray-200">
        {/* 랜덤 이모지들 */}
        {randomEmojis.map((emojiId, index) => {
          const isSelected = selectedEmojiId === emojiId
          return (
            <div
              key={`quick-emoji-${emojiId}-${index}`}
              className={`cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 rounded-full p-1 sm:p-2 flex-shrink-0 ${
                isSelected 
                  ? 'bg-orange_five/20 ring-2 ring-orange_five/50' 
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => handleEmojiClick(emojiId)}
            >
              <Emoji 
                size="s" 
                number={emojiId}
                className={`transition-opacity scale-110 ${
                  isSelected 
                    ? 'opacity-100' 
                    : 'opacity-80 hover:opacity-100'
                }`}
              />
            </div>
          )
        })}
        
        {/* 구분선 */}
        <div className="w-px h-6 sm:h-8 bg-gray-300 mx-1 sm:mx-2 flex-shrink-0" />
        
        {/* 플러스 버튼 */}
        <button
          onClick={handlePlusClick}
          className="text-orange_five hover:scale-110 transition-transform duration-200 p-1 sm:p-2 rounded-full hover:bg-orange_five/10 flex-shrink-0"
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 448 512'
            className='w-4 h-4 sm:w-6 sm:h-6'
            fill='currentColor'
          >
            <path d='M256 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 160-160 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l160 0 0 160c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160 160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-160 0 0-160z' />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default QuickEmojiBar
