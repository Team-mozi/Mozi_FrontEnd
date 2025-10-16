import type { Dispatch, SetStateAction } from 'react'

const emojiModules = import.meta.glob('/src/assets/emoji-icons/*.svg', {
  eager: true,
  as: 'url',
})

// 999.svg는 제외하고, 실제 이모지 번호와 URL을 매핑
const emojis = Object.entries(emojiModules)
  .filter(([path]) => !path.endsWith('999.svg'))
  .map(([path, url]) => {
    // 파일명에서 숫자 추출 (예: "/src/assets/emoji-icons/1.svg" -> 1)
    const match = path.match(/(\d+)\.svg$/)
    const emojiNumber = match ? parseInt(match[1], 10) : 1
    return { number: emojiNumber, url }
  })
  .sort((a, b) => a.number - b.number) // 번호 순으로 정렬

// EmojiGrid 컴포넌트의 props 타입을 정의
interface EmojiGridProps {
  selectedEmoji: number | null // 현재 선택된 이모티콘의 번호
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
      {emojis.map((emoji) => (
        <button
          type='button'
          key={emoji.number}
          onClick={() => setSelectedEmoji(emoji.number)} // 클릭 시 해당 이모티콘의 번호로 상태 업데이트
          className={`
            ${isMobile ? 'w-10 h-10' : 'w-14 h-14'}
            flex items-center justify-center rounded-full transition-all duration-300 ease-in-out
            ${/* 선택된 이모티콘일 경우 배경색을 적용 */ ''}
            ${selectedEmoji === emoji.number ? 'bg-orange_one' : 'bg-transparent'}
            hover:scale-105
          `}
        >
          <img
            src={emoji.url}
            alt={`emoji-${emoji.number}`}
            className={`${isMobile ? 'w-6 h-6' : 'w-10 h-10'}`}
          />
        </button>
      ))}
    </div>
  </div>
)

export default EmojiGrid
