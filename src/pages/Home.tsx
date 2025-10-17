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
import QuickEmojiBar from '@/components/QuickEmojiBar'
import MainCommentInput from '@/components/MainCommentInput'

const Home = () => {
  const { isLoggedIn, nickname } = useSelector((state: RootState) => state.auth)
  const navigate = useNavigate()
  const [isModalOpen, setModalOpen] = useState(false)
  const [isPostSheetOpen, setPostSheetOpen] = useState(false)
  const [isSideSheetOpen, setSideSheetOpen] = useState(false)
  const [isMyPageOpen, setIsMyPageOpen] = useState(false) // MyPage 열림 상태
  const [selectedEmojiDetail, setSelectedEmojiDetail] = useState<UserEmojiDetailResponse | null>(null)
  const [selectedQuickEmoji, setSelectedQuickEmoji] = useState<number | null>(null) // 간편 등록에서 선택된 이모지 상태
  const [commentInput, setCommentInput] = useState('') // 댓글 입력 상태
  const [isQuickPostLoading, setIsQuickPostLoading] = useState(false) // 간편 등록 로딩 상태
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

  // QuickEmojiBar에서 이모지 선택 시 처리
  const handleQuickEmojiClick = (emojiId: number) => {
    if (isLoggedIn) {
      setSelectedQuickEmoji(emojiId)
      // TODO: 선택된 이모지로 간편 등록 기능 구현 예정
      console.log('선택된 이모지:', emojiId)
    }
  }

  // 댓글 전송 처리 (MainCommentInput에서 실제 등록 처리 후 호출됨)
  const handleSendComment = () => {
    // 등록 완료 후 상태 초기화
    setCommentInput('')
    setSelectedQuickEmoji(null)
    setIsQuickPostLoading(false) // 로딩 상태 초기화
    // 최신 이모지 업데이트
    updateLatestEmoji()
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
      {isLoggedIn && <MyPage onOpenChange={setIsMyPageOpen} />}
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
    
    {/* 간편 등록 - MyPage가 열려있지 않을 때만 표시 */}
    {isLoggedIn && !isMyPageOpen && (
      <div className="fixed bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center gap-3 w-full max-w-4xl px-4">
        <QuickEmojiBar
          onPlusClick={() => setPostSheetOpen(true)}
          onEmojiClick={handleQuickEmojiClick}
          isLoggedIn={isLoggedIn}
          selectedEmojiId={selectedQuickEmoji}
        />
        
        {/* 댓글 입력창 - 이모지 선택 시에만 표시 */}
        {selectedQuickEmoji && (
          <MainCommentInput
            inputValue={commentInput}
            onInputChange={setCommentInput}
            onSendMessage={handleSendComment}
            selectedEmojiId={selectedQuickEmoji}
            onLoadingChange={setIsQuickPostLoading}
          />
        )}
      </div>
    )}

    {/* 닉네임 설정 모달 */}
    <Modal isOpen={isModalOpen} size='md'>
      <NicknameForm onClose={() => setModalOpen(false)} />
    </Modal>
    
    {/* API 호출 중 로딩 인디케이터 */}
    <ProgressIndicator 
      isLoading={isLoading || isDetailLoading || isQuickPostLoading} 
      text={
        isQuickPostLoading ? "게시물을 등록하는 중..." :
        isDetailLoading ? "게시글을 불러오는 중..." : 
        "이모지를 불러오는 중..."
      } 
    />
    </div>
  )
}

export default Home
