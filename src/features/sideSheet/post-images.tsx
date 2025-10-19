import type { UserEmojiDetailResponse } from '@/services/endpoints/user-emoji'
import useMobile from '@/hooks/useMobile'

type PostImagesProps = {
  emojiDetail?: UserEmojiDetailResponse | null
}

const PostImages = ({ emojiDetail }: PostImagesProps) => {
  const isMobile = useMobile()
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
            className={`object-cover rounded-lg flex-shrink-0 ${
              isMobile 
                ? 'w-[150px] h-[150px]' 
                : 'w-[300px] h-[300px]'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default PostImages
