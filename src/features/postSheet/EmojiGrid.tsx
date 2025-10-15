import type { Dispatch, SetStateAction } from 'react'

const emojiModules = import.meta.glob('/src/assets/emoji-icons/*.svg', {
  eager: true,
  as: 'url',
})
// 999.svg는 제외
const emojis = Object.entries(emojiModules)
  .filter(([path]) => !path.endsWith('999.svg'))
  .map(([, url]) => url)
 // const emojis = Object.values(emojiModules)

// EmojiGrid 컴포넌트의 props 타입을 정의
interface EmojiGridProps {
  selectedEmoji: number | null // 현재 선택된 이모티콘의 인덱스
  setSelectedEmoji: Dispatch<SetStateAction<number | null>> // 이모티콘 선택 상태를 변경하는 함수
  isMobile: boolean // 모바일 환경 여부
}

const EmojiGrid = ({
  selectedEmoji,
  setSelectedEmoji,
  isMobile,
}: EmojiGridProps) => (
  <div className='border border-orange_two rounded-xl px-6 py-3'>
    <div className='grid grid-cols-5 gap-2 place-items-center'>
      {/* emojis 배열을 순회하며 각 이모티콘에 대한 버튼을 생성 */}
      {emojis.map((emoji, index) => (
        <button
          type='button'
          key={index}
          onClick={() => setSelectedEmoji(index)} // 클릭 시 해당 이모티콘의 인덱스로 상태 업데이트
          className={`
            ${isMobile ? 'w-10 h-10' : 'w-14 h-14'}
            flex items-center justify-center rounded-full transition-all duration-300 ease-in-out
            ${/* 선택된 이모티콘일 경우 배경색을 적용 */ ''}
            ${selectedEmoji === index ? 'bg-orange_one' : 'bg-transparent'}
            hover:scale-105
          `}
        >
          <img
            src={emoji}
            alt={`emoji-${index + 1}`}
            className={`${isMobile ? 'w-6 h-6' : 'w-10 h-10'}`}
          />
        </button>
      ))}
    </div>
  </div>
)

export default EmojiGrid
