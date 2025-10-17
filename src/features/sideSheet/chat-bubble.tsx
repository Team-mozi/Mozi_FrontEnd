import React from 'react'

interface ChatBubbleProps {
  message: string
  senderId: string
  currentUserId: string
  timestamp: Date
  isOwnMessage?: boolean
  postAuthorNickname?: string
}

const ChatBubble: React.FC<ChatBubbleProps> = ({
  currentUserId,
  message,
  senderId,
  timestamp,
  isOwnMessage = false,
  postAuthorNickname,
}) => {
  const isMyMessage = isOwnMessage || senderId === currentUserId
  const isPostAuthor = postAuthorNickname && senderId === postAuthorNickname

  // 1. 말풍선 스타일
  const myBubble = 'bg-orange_five text-black rounded-xl rounded-br-lg'
  const otherBubble = 'bg-orange_three text-black rounded-xl rounded-bl-lg'
  const bubbleClasses = isMyMessage ? myBubble : otherBubble

  // 2. 전체 블록 정렬: 이름, 말풍선+시간을 좌우로 정렬하는 기준
  const blockAlignmentClasses = isMyMessage ? 'justify-end' : 'justify-start'

  // 3. 시간 포맷 (추후 변경 예정)
  const formattedTime = new Date(timestamp).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  })
  const TimeStamp = (
    <div className='text-xs text-gray-500 mx-1'>{formattedTime}</div>
  )

  return (
    // 메인 컨테이너: 세로 방향 (이름 -> 말풍선+시간)
    <div className='flex flex-col mb-4'>
      {/* 1. 이름 (상대방 메시지에만 표시) */}
      <div className={`text-medium text-sm mb-1 flex ${blockAlignmentClasses}`}>
        <span>
          {senderId}
          {isPostAuthor && <span className="text-orange_five font-medium"> (작성자)</span>}
        </span>
      </div>

      {/* 2. 말풍선 + 시간*/}
      <div className={`flex items-end ${blockAlignmentClasses}`}>
        {isMyMessage && TimeStamp}

        {/* B. 말풍선 본문 */}
        <div className={`max-w-xs p-3 shadow-md ${bubbleClasses}`}>
          <p className='whitespace-pre-wrap'>{message}</p>
        </div>

        {/* C. 상대방 메시지일 때: 말풍선 -> 시간 순서 (좌측 정렬 시 시간은 오른쪽에 위치) */}
        {!isMyMessage && TimeStamp}
      </div>
    </div>
  )
}

export default ChatBubble
