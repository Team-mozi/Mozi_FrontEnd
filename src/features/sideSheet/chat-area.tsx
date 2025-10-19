import React from 'react'

import ChatBubble from '@/features/sideSheet/chat-bubble'
import type { CommentResponse } from '@/services/endpoints/user-emoji'

type ChatAreaProps = {
  comments: CommentResponse[]
  currentUserId?: number
  currentUserNickname?: string
  isLoading?: boolean
  postAuthorNickname?: string
}

const ChatArea: React.FC<ChatAreaProps> = ({ 
  comments, 
  currentUserId, 
  currentUserNickname, 
  isLoading = false,
  postAuthorNickname
}) => {
  // 댓글을 시간순으로 정렬
  const sortedComments = [...comments].sort((a, b) => {
    const dateA = new Date(a.createdAt || '').getTime()
    const dateB = new Date(b.createdAt || '').getTime()
    return dateA - dateB
  })

  if (isLoading) {
    return (
      <div className='text-center text-gray-500 py-8'>
        댓글을 불러오는 중...
      </div>
    )
  }

  return (
    <div className='space-y-2'>
      {sortedComments.length === 0 ? (
        <div className='text-center text-gray-500 py-8'>
          아직 댓글이 없습니다. 첫 댓글을 작성해보세요!
        </div>
      ) : (
        sortedComments.map((comment, index) => (
          <ChatBubble
            key={comment.commentId || index}
            senderId={comment.authorNickname || '익명'}
            message={comment.content || ''}
            timestamp={new Date(comment.createdAt || '')}
            currentUserId={currentUserNickname || ''}
            isOwnMessage={comment.userId === currentUserId}
            postAuthorNickname={postAuthorNickname}
          />
        ))
      )}
    </div>
  )
}

export default ChatArea
