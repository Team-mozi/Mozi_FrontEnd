import { useState } from 'react'

import SideSheet from '@/components/SideSheet'
import ToggleButton from '@/components/ToggleButton'
import { useGetCommentsQuery, useCreateCommentMutation } from '@/services/endpoints/user-emoji'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store/store'
import type { UserEmojiDetailResponse } from '@/services/endpoints/user-emoji'

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

  return (
    <SideSheet isOpen={isOpen} onClose={onClose}>
      {/* 헤더 */}
      <SideSheet.Header>
        <SideSheetHeader
          userName={userName}
          postTime={postTime}
          onClose={onClose}
        />
      </SideSheet.Header>

      {/* 콘텐츠 */}
      <SideSheet.Content>
        {!isChatExpanded && (
          <>
            {/* 이미지 영역 */}
            <PostImages emojiDetail={emojiDetail} />
            {/* 텍스트 영역 */}
            <PostContent emojiDetail={emojiDetail} />
          </>
        )}

        <div className='mt-4 flex-1 min-h-0 overflow-y-auto pr-1'>
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
      </SideSheet.Content>

      {/* 푸터 */}
      <SideSheet.Footer>
        <ChatInput
          inputValue={inputValue}
          onInputChange={setInputValue}
          onSendMessage={handleSendMessage}
        />
      </SideSheet.Footer>
    </SideSheet>
  )
}

export default PostSideSheet
