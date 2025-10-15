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
import PostSheet from '@/features/postSheet/PostSheet'
import PostSideSheet from '@/features/sideSheet/main-side-sheet'
import { useLazyGetUserEmojiDetailQuery } from '@/services/endpoints/user-emoji'
import type { UserEmojiDetailResponse } from '@/services/endpoints/user-emoji'

const Home = () => {
  const { isLoggedIn, nickname } = useSelector((state: RootState) => state.auth)
  const navigate = useNavigate()
  const [isModalOpen, setModalOpen] = useState(false)
  const [isPostSheetOpen, setPostSheetOpen] = useState(false)
  const [isSideSheetOpen, setSideSheetOpen] = useState(false)
  const [selectedEmojiDetail, setSelectedEmojiDetail] = useState<UserEmojiDetailResponse | null>(null)
  const { randomEmojis, latestMyEmoji, emojiPositions, isLoading, updateLatestEmoji } = useHighlights()
  
  // 이모지 상세 정보 조회 API
  const [getUserEmojiDetail, { isLoading: isDetailLoading }] = useLazyGetUserEmojiDetailQuery()

  // 로그인 상태 + 닉네임 null => 닉네임 모달 열기
  useEffect(() => {
    if (isLoggedIn && !nickname) {
      setModalOpen(true)
    }
  }, [isLoggedIn, nickname])

  const handleLoginClick = () => {
    navigate('/login')
  }

  const handleMyEmojiClick = async () => {
    if (isLoggedIn) {
      // latestMyEmoji?.emojiId가 존재하지 않을 때만 PostSheet 열기
      if (!latestMyEmoji?.emojiId) {
        setPostSheetOpen(true)
      } else {
        // emojiId가 존재한다면 본인 이모지 게시글 열기
        if (latestMyEmoji.userEmojiId) {
          try {
            const result = await getUserEmojiDetail({ id: Number(latestMyEmoji.userEmojiId) }).unwrap()
            if (result.data) {
              setSelectedEmojiDetail(result.data)
              setSideSheetOpen(true)
            }
          } catch (error) {
            console.error('이모지 상세 정보 조회 실패:', error)
          }
        }
      }
    }
  }

  const handleRandomEmojiClick = async (userEmojiId: number) => {
    if (isLoggedIn) {
      try {
        const result = await getUserEmojiDetail({ id: userEmojiId }).unwrap()
        if (result.data) {
          setSelectedEmojiDetail(result.data)
          setSideSheetOpen(true)
        }
      } catch (error) {
        console.error('이모지 상세 정보 조회 실패:', error)
      }
    }
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
      onClick={isLoggedIn ? handleMyEmojiClick : handleLoginClick} 
    />
    
    {/* PostSheet (이모지 상세 작성) */}
    <PostSheet 
      isOpen={isPostSheetOpen}
      onClose={() => setPostSheetOpen(false)}
      showButton={false}
      onEmojiCreated={updateLatestEmoji}
    />
    
    {/* PostSideSheet (게시글) */}
    <PostSideSheet
      isOpen={isSideSheetOpen}
      onClose={() => setSideSheetOpen(false)}
      userName={selectedEmojiDetail?.nickname || nickname || '사용자'}
      emojiDetail={selectedEmojiDetail}
    />
    
    {/* 랜덤 이모지들을 원형으로 배치 */}
    {randomEmojis.map((emoji, index) => {
      const position = emojiPositions[index]
      if (!position) return null
      
      return (
        <div
          key={`random-${emoji.userEmojiId}-${index}`}
          className={`absolute transition-all duration-300 ease-in-out ${isLoggedIn ? 'cursor-pointer' : 'cursor-pointer'}`}
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            zIndex: 1,
          }}
          onClick={isLoggedIn ? () => handleRandomEmojiClick(Number(emoji.userEmojiId!)) : handleLoginClick}
        >
          <Emoji 
            size="ml" 
            number={emoji.emojiId} 
            className="opacity-80 hover:opacity-100 transition-opacity duration-300"
          />
        </div>
      )
    })}
    
    {/* 플러스 아이콘 버튼 - 중앙 하단 (로그인한 사용자만) */}
    {isLoggedIn && (
      <button
        onClick={() => setPostSheetOpen(true)}
        className='fixed bottom-8 left-1/2 transform -translate-x-1/2 text-orange_five hover:scale-110 transition-transform z-20'
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
    )}

    {/* 닉네임 설정 모달 */}
    <Modal isOpen={isModalOpen} size='md'>
      <NicknameForm onClose={() => setModalOpen(false)} />
    </Modal>
    
    {/* API 호출 중 로딩 인디케이터 */}
    <ProgressIndicator 
      isLoading={isLoading || isDetailLoading} 
      text={isDetailLoading ? "게시글을 불러오는 중..." : "이모지를 불러오는 중..."} 
    />
    </div>
  )
}

export default Home
