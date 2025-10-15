import type { UserEmojiDetailResponse } from '@/services/endpoints/user-emoji'

type PostContentProps = {
  emojiDetail?: UserEmojiDetailResponse | null
}

const PostContent = ({ emojiDetail }: PostContentProps) => {
  if (!emojiDetail) {
    return null
  }

  // 텍스트가 없거나 빈 문자열인 경우 렌더링하지 않음
  if (!emojiDetail.text || emojiDetail.text.trim() === '') {
    return null
  }

  return (
    <div className='bg-orange_two rounded-xl p-4'>
      {/* 본문 텍스트 영역 */}
      <p className='text-gray-800 text-regular text-md'>{emojiDetail.text}</p>
    </div>
  )
}

export default PostContent
