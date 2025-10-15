import { useState } from 'react'

import SideSheet from '@/components/SideSheet'
import ToggleButton from '@/components/ToggleButton'
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
  const [chatMessages, setChatMessages] = useState<string[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isChatExpanded, setIsChatExpanded] = useState(false)

  const handleSendMessage = () => {
    if (!inputValue.trim()) return
    setChatMessages((prev) => [...prev, inputValue])
    setInputValue('')
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
          <ChatArea messages={chatMessages} />
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
