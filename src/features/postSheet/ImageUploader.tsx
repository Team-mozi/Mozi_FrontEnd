import type { Dispatch, SetStateAction } from 'react'

interface ImageUploaderProps {
  images: File[] // 현재 업로드된 이미지 파일들의 배열
  setImages: Dispatch<SetStateAction<File[]>> // 이미지 배열 상태를 변경하는 함수
  isMobile: boolean // 모바일 환경 여부
}

const ImageUploader = ({ images, setImages, isMobile }: ImageUploaderProps) => (
  <div className='flex gap-2 overflow-x-auto py-4 sm:py-6'>
    {/* 이미지 추가 버튼 역할을 하는 label */}
    <label
      className={`
        ${isMobile ? 'w-20 h-20' : 'w-24 h-24'} flex-shrink-0 rounded-xl border border-gray_one
        flex flex-col items-center justify-center cursor-pointer text-gray_one
        ${/* 이미지가 3개 이상이면 비활성화 스타일을 적용 */ ''}
        ${images.length >= 3 ? 'cursor-not-allowed opacity-50' : ''}
      `}
    >
      {/* 이미지 아이콘 SVG */}
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 576 512'
        className={isMobile ? 'w-6 h-6' : 'w-8 h-8'}
        fill='currentColor'
      >
        <path d='M96 96c0-35.3 28.7-64 64-64l320 0c35.3 0 64 28.7 64 64l0 256c0 35.3-28.7 64-64 64l-320 0c-35.3 0-64-28.7-64-64L96 96zM24 128c13.3 0 24 10.7 24 24l0 296c0 8.8 7.2 16 16 16l360 0c13.3 0 24 10.7 24 24s-10.7 24-24 24L64 512c-35.3 0-64-28.7-64-64L0 152c0-13.3 10.7-24 24-24zm168 32a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm196.5 11.5c-4.4-7.1-12.1-11.5-20.5-11.5s-16.1 4.4-20.5 11.5l-56.3 92.1-24.5-30.6c-4.6-5.7-11.4-9-18.7-9s-14.2 3.3-18.7 9l-64 80c-5.8 7.2-6.9 17.1-2.9 25.4S174.8 352 184 352l272 0c8.7 0 16.7-4.7 20.9-12.3s4.1-16.8-.5-24.3l-88-144z' />
      </svg>
      {/* 현재 업로드된 이미지 개수 표시 */}
      <span className={`${isMobile ? 'text-xs' : 'text-sm'} mt-1`}>
        {images.length}/3
      </span>
      {/* 이미지 파일 input */}
      <input
        type='file'
        accept='image/*' // 이미지 파일만 선택 가능하도록 제한
        multiple // 여러 파일 선택 가능
        className='hidden'
        disabled={images.length >= 3} // 이미지가 3개 이상이면 비활성화
        onChange={(e) => {
          if (!e.target.files) return
          const selectedFiles = Array.from(e.target.files)
          const remaining = 3 - images.length // 추가로 업로드 가능한 이미지 수
          // 기존 이미지 배열과 새로 선택한 파일들을 합쳐서 상태 업데이트 (최대 3개 제한)
          setImages([...images, ...selectedFiles.slice(0, remaining)])
        }}
      />
    </label>

    {/* 선택된 이미지들의 미리보기를 생성 */}
    {images.map((file, idx) => (
      <div
        key={idx}
        className={`${isMobile ? 'w-20 h-20' : 'w-24 h-24'} relative rounded-xl border border-gray_one flex-shrink-0`}
      >
        <img
          // URL.createObjectURL을 사용해 선택된 파일의 임시 URL을 생성하여 미리보기
          src={URL.createObjectURL(file)}
          alt={`selected-${idx}`}
          className='w-full h-full object-cover rounded-xl'
          onLoad={(e) => URL.revokeObjectURL(e.currentTarget.src)}
        />
        {/* 이미지 삭제 버튼 */}
        <button
          type='button'
          className={`${isMobile ? 'w-6 h-6 -top-2 -right-2' : 'w-8 h-8 -top-2 -right-2'} absolute rounded-full bg-red_one text-white flex items-center justify-center shadow-md`}
          // 클릭 시 해당 이미지를 배열에서 제거하여 상태를 업데이트
          onClick={() => setImages(images.filter((_, i) => i !== idx))}
        >
          {/* 삭제 아이콘 SVG */}
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='currentColor'
            viewBox='0 0 320 512'
            className={`${isMobile ? 'w-3.5 h-3.5' : 'w-5 h-5'}`}
          >
            <path d='M310.6 361.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L160 301.3 54.6 406.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L114.7 256 9.4 150.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 210.7 265.4 105.4c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3L205.3 256l105.3 105.4z' />
          </svg>
        </button>
      </div>
    ))}
  </div>
)

export default ImageUploader
