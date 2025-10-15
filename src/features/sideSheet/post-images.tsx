import type { UserEmojiDetailResponse } from '@/services/endpoints/user-emoji'

type PostImagesProps = {
  emojiDetail?: UserEmojiDetailResponse | null
}

const PostImages = ({ emojiDetail }: PostImagesProps) => {
  if (!emojiDetail || !emojiDetail.imageUrls || emojiDetail.imageUrls.length === 0) {
    return null
  }

  return (
    <div className='mb-4'>
      <div className={`flex gap-2 ${
        emojiDetail.imageUrls.length > 1 
          ? 'overflow-x-auto scrollbar-hide' 
          : ''
      }`}>
        {emojiDetail.imageUrls.map((url, index) => (
          <img
            key={index}
            src={url}
            alt={`게시글 이미지 ${index + 1}`}
            className="w-[300px] h-[300px] object-cover rounded-lg flex-shrink-0"
          />
        ))}
      </div>
    </div>
  )
}

export default PostImages
