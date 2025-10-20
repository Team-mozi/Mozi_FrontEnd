import { useState } from 'react'

import SideSheet from '@/components/SideSheet'
import BottomSheet from '@/components/BottomSheet'
import ToggleButton from '@/components/ToggleButton'
import { useGetCommentsQuery, useCreateCommentMutation } from '@/services/endpoints/user-emoji'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store/store'
import type { UserEmojiDetailResponse } from '@/services/endpoints/user-emoji'
import useMobile from '@/hooks/useMobile'

import ChatArea from './chat-area'
import ChatInput from './chat-input'
import PostContent from './post-content'
import PostImages from './post-images'
import SideSheetHeader from './side-sheet-header'

type PostSideSheetProps = {
  isOpen: boolean
  onClose: () => void
  userName: string
  postTime?: number
  emojiDetail?: UserEmojiDetailResponse | null
}

/**
 * 게시글 + 채팅 기능이 포함된 사이드시트
 */
const PostSideSheet: React.FC<PostSideSheetProps> = ({
  isOpen,
  onClose,
  postTime = 1,
  userName,
  emojiDetail,
}) => {
  const [inputValue, setInputValue] = useState('')
  const [isChatExpanded, setIsChatExpanded] = useState(false)
  
  // Redux에서 현재 사용자 정보 가져오기
  const { userId, nickname } = useSelector((state: RootState) => state.auth)
  
  // 모바일 여부 확인
  const isMobile = useMobile()
  
  // 댓글 조회 API
  const { data: commentsData, isLoading: isCommentsLoading, refetch } = useGetCommentsQuery(
    { userEmojiId: emojiDetail?.userEmojiId || 0 },
    { skip: !emojiDetail?.userEmojiId || !isOpen }
  )
  
  // 댓글 작성 API
  const [createComment] = useCreateCommentMutation()

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !emojiDetail?.userEmojiId) return
    
    try {
      await createComment({
        userEmojiId: emojiDetail.userEmojiId,
        commentCreateRequest: { content: inputValue.trim() }
      }).unwrap()
      
      setInputValue('')
      // 댓글 목록 새로고침
      refetch()
    } catch (error) {
      console.error('댓글 작성 실패:', error)
    }
  }

  // 공통 헤더 콘텐츠
  const headerContent = (
    <SideSheetHeader
      userName={userName}
      postTime={postTime}
      createdAt={emojiDetail?.createdAt}
      onClose={onClose}
    />
  )

  // 공통 콘텐츠
  const sheetContent = (
    <>
      {!isChatExpanded && (
        <>
          {/* 이미지 영역 */}
          <PostImages emojiDetail={emojiDetail} />
          {/* 텍스트 영역 */}
          <PostContent emojiDetail={emojiDetail} />
        </>
      )}

      <div className={`mt-4 flex-1 min-h-0 overflow-y-auto ${isMobile ? 'pr-0' : 'pr-1'}`}>
        <ToggleButton
          isExpanded={isChatExpanded}
          onToggle={() => setIsChatExpanded(!isChatExpanded)}
          expandedText='채팅창 축소하기'
          collapsedText='채팅창 확대하기'
        />
        <ChatArea 
          comments={commentsData?.data || []} 
          currentUserId={userId}
          currentUserNickname={nickname}
          isLoading={isCommentsLoading}
          postAuthorNickname={emojiDetail?.nickname}
        />
      </div>
    </>
  )

  // 공통 푸터 콘텐츠
  const footerContent = (
    <ChatInput
      inputValue={inputValue}
      onInputChange={setInputValue}
      onSendMessage={handleSendMessage}
    />
  )

  return (
    <>
      {/* 반응형: 화면 크기에 따라 SideSheet / BottomSheet 전환 */}
      {isMobile ? (
        <BottomSheet isOpen={isOpen} onClose={onClose}>
          {/* 헤더 */}
          <BottomSheet.Header>
            {headerContent}
          </BottomSheet.Header>

          {/* 콘텐츠 */}
          <BottomSheet.Content>
            {sheetContent}
          </BottomSheet.Content>

          {/* 푸터 */}
          <BottomSheet.Footer>
            {footerContent}
          </BottomSheet.Footer>
        </BottomSheet>
      ) : (
        <SideSheet isOpen={isOpen} onClose={onClose}>
          {/* 헤더 */}
          <SideSheet.Header>
            {headerContent}
          </SideSheet.Header>

          {/* 콘텐츠 */}
          <SideSheet.Content>
            {sheetContent}
          </SideSheet.Content>

          {/* 푸터 */}
          <SideSheet.Footer>
            {footerContent}
          </SideSheet.Footer>
        </SideSheet>
      )}
    </>
  )
}

export default PostSideSheet
