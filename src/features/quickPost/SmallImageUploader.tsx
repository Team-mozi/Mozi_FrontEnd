import type { Dispatch, SetStateAction } from 'react'

interface SmallImageUploaderProps {
  images: File[] // 현재 업로드된 이미지 파일들의 배열
  setImages: Dispatch<SetStateAction<File[]>> // 이미지 배열 상태를 변경하는 함수
}

/**
 * MainCommentInput에서 사용하는 작은 이미지 업로더 컴포넌트
 * 최대 3개까지 이미지 업로드 가능
 */
const SmallImageUploader = ({ images, setImages }: SmallImageUploaderProps) => (
  <div className='flex gap-2 py-1'>
    {/* 선택된 이미지들의 미리보기를 생성 - 이미지 추가 버튼 왼쪽에 배치 */}
    {images.map((file, idx) => (
      <div
        key={idx}
        className='w-12 h-12 relative rounded-lg border border-gray-300 flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity'
        // 이미지 전체를 클릭했을 때 제거
        onClick={() => setImages(images.filter((_, i) => i !== idx))}
      >
        <img
          // URL.createObjectURL을 사용해 선택된 파일의 임시 URL을 생성하여 미리보기
          src={URL.createObjectURL(file)}
          alt={`selected-${idx}`}
          className='w-full h-full object-cover rounded-lg'
          onLoad={(e) => URL.revokeObjectURL(e.currentTarget.src)}
        />
        {/* 이미지 삭제 버튼 */}
        <button
          type='button'
          className='w-3 h-3 -top-0.5 -right-0.5 absolute rounded-full bg-red-500 text-white flex items-center justify-center shadow-sm hover:bg-red-600 transition-colors'
          // 클릭 시 해당 이미지를 배열에서 제거하여 상태를 업데이트
          onClick={(e) => {
            e.stopPropagation() // 부모 요소의 클릭 이벤트 방지
            setImages(images.filter((_, i) => i !== idx))
          }}
        >
          {/* 삭제 아이콘 SVG */}
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='currentColor'
            viewBox='0 0 320 512'
            className='w-2 h-2'
          >
            <path d='M310.6 361.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L160 301.3 54.6 406.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L114.7 256 9.4 150.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 210.7 265.4 105.4c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3L205.3 256l105.3 105.4z' />
          </svg>
        </button>
      </div>
    ))}

    {/* 이미지 추가 버튼 역할을 하는 label - 맨 오른쪽에 배치 */}
    {images.length < 3 && (
      <label
        className="w-12 h-12 flex-shrink-0 rounded-lg flex flex-col items-center justify-center cursor-pointer text-gray-400 hover:text-gray-500 transition-colors border-2 border-dashed border-gray-300 hover:border-gray-400"
      >
        {/* 이미지 아이콘 SVG */}
        <img
          src="/src/assets/addImage.svg"
          alt="이미지 추가"
          className="w-6 h-6"
        />
        {/* 이미지 파일 input */}
        <input
          type='file'
          accept='image/*' // 이미지 파일만 선택 가능하도록 제한
          multiple // 여러 파일 선택 가능
          className='hidden'
          onChange={(e) => {
            if (!e.target.files) return
            const selectedFiles = Array.from(e.target.files)
            const remaining = 3 - images.length // 추가로 업로드 가능한 이미지 수
            // 기존 이미지 배열과 새로 선택한 파일들을 합쳐서 상태 업데이트 (최대 3개 제한)
            setImages([...images, ...selectedFiles.slice(0, remaining)])
          }}
        />
      </label>
    )}
  </div>
)

export default SmallImageUploader
