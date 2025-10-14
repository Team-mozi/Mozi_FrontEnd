import Emoji from "@/components/emoji"
import Logo from "@/components/Logo"
import { useSelector } from 'react-redux'
import type { RootState } from '@/store/store'
import { useNavigate } from 'react-router-dom'
import MyPage from "@/features/mypage"
import { useState, useEffect } from 'react'
import Modal from '@/components/Modal'
import NicknameForm from '@/features/modal/NickNameModal'
import ProgressIndicator from '@/components/ProgressIndicator'
import useHighlights from '@/hooks/useHighlights'

const Home = () => {
  const { isLoggedIn, nickname } = useSelector((state: RootState) => state.auth)
  const navigate = useNavigate()
  const [isModalOpen, setModalOpen] = useState(false)
  const { randomEmojis, latestMyEmoji, emojiPositions, isLoading } = useHighlights()

  // 로그인 상태 + 닉네임 null => 닉네임 모달 열기
  useEffect(() => {
    if (isLoggedIn && !nickname) {
      setModalOpen(true)
    }
  }, [isLoggedIn, nickname])

  const handleLoginClick = () => {
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-home-background bg-cover bg-center">
    <div className="absolute top-0 left-0 w-full flex items-center justify-between px-8 py-6 z-10">
      {/* 좌측 상단: Logo와 로그인 버튼 */}
      <div className="flex items-end gap-3">
        <Logo navigateOnClick />
        {isLoggedIn ? (
          <button
            type="button"
            className="py-7 text-sm font-bold text-gray_one rounded-lg"
            disabled
          >
            {nickname}님
          </button>
        ) : (
          <button
            type="button"
            className="py-7 text-ms font-medium text-orange_three hover:text-orange_three rounded-lg transition-colors"
            onClick={handleLoginClick}
          >
            로그인하기 &gt;
          </button>
        )}
      </div>
      {/* 우측 상단: 메뉴 버튼 */}
      {isLoggedIn && <MyPage />}
    </div>
    {/* 본인 이모지 */}
    <Emoji 
      size="xl" 
      number={latestMyEmoji?.emojiId || 999} 
      onClick={isLoggedIn ? () => {} : handleLoginClick} 
    />
    
    {/* 랜덤 이모지들을 원형으로 배치 */}
    {randomEmojis.map((emoji, index) => {
      const position = emojiPositions[index]
      if (!position) return null
      
      return (
        <div
          key={`random-${emoji.userEmojiId}-${index}`}
          className={`absolute transition-all duration-300 ease-in-out ${isLoggedIn ? 'pointer-events-none' : 'cursor-pointer'}`}
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            zIndex: 1,
          }}
          onClick={!isLoggedIn ? handleLoginClick : undefined}
        >
          <Emoji 
            size="ml" 
            number={emoji.emojiId} 
            className="opacity-80 hover:opacity-100 transition-opacity duration-300"
          />
        </div>
      )
    })}
    
    {/* 닉네임 설정 모달 */}
    <Modal isOpen={isModalOpen} size='md'>
      <NicknameForm onClose={() => setModalOpen(false)} />
    </Modal>
    
    {/* API 호출 중 로딩 인디케이터 */}
    <ProgressIndicator 
      isLoading={isLoading} 
      text="이모지를 불러오는 중..." 
    />
    </div>
  )
}

export default Home
