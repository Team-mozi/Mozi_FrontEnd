import React, { useState, useContext } from 'react'
import MainInput from '@/components/MainInput'
import SendButton from '@/components/SendButton'
import SmallImageUploader from './SmallImageUploader'
import { useCreateUserEmojiMutation } from '@/services/endpoints/user-emoji'
import { ToastContext } from '@/components/ToastProvider'

type MainCommentInputProps = {
  inputValue: string
  onInputChange: (value: string) => void
  onSendMessage: () => void
  selectedEmojiId: number | null
  onLoadingChange?: (isLoading: boolean) => void
  placeholder?: string
}

/**
 * 메인화면에서 사용하는 댓글 입력창 컴포넌트
 * QuickEmojiBar 하단에 표시되며, 이모지 선택 시에만 보여짐
 */
const MainCommentInput: React.FC<MainCommentInputProps> = ({
  inputValue,
  onInputChange,
  onSendMessage,
  selectedEmojiId,
  onLoadingChange,
  placeholder = '내용을 작성해주세요.'
}) => {
  const [images, setImages] = useState<File[]>([])
  const [createUserEmoji, { isLoading }] = useCreateUserEmojiMutation()
  
  const toastContext = useContext(ToastContext)
  const showToast = toastContext?.showToast

  // 로딩 상태를 부모 컴포넌트에 전달
  React.useEffect(() => {
    onLoadingChange?.(isLoading)
  }, [isLoading, onLoadingChange])

  // 컴포넌트 언마운트 시 로딩 상태 초기화
  React.useEffect(() => {
    return () => {
      onLoadingChange?.(false)
    }
  }, [onLoadingChange])

  // 폼 초기화
  const resetForm = () => {
    onInputChange('')
    setImages([])
  }

  // 실제 등록 처리 함수
  const handleSubmit = async () => {
    if (!selectedEmojiId) {
      showToast?.({
        message: '이모지를 선택해주세요.',
        messageType: 'fail',
        duration: 2500,
        position: 'top-center',
      })
      return
    }

    if (!inputValue.trim()) {
      showToast?.({
        message: '내용을 입력해주세요.',
        messageType: 'fail',
        duration: 2500,
        position: 'top-center',
      })
      return
    }

    const formData = new FormData()
    formData.append(
      'request',
      new Blob([JSON.stringify({ emojiId: selectedEmojiId, text: inputValue })], {
        type: 'application/json',
      }),
    )
    images.forEach((file) => formData.append('images', file))

    try {
      await createUserEmoji({ body: formData as any }).unwrap()
      showToast?.({
        message: '이모지 작성이 완료되었습니다.',
        messageType: 'success',
        duration: 2500,
        position: 'top-center',
      })
      resetForm()
      onSendMessage() // 부모 컴포넌트의 상태 초기화를 위해 호출
    } catch (error) {
      console.error(error)
      showToast?.({
        message: '작성에 실패했습니다.',
        messageType: 'error',
        duration: 2500,
        position: 'top-center',
      })
    }
  }
  return (
    <div className={`w-full transition-all duration-300 ${
      images.length === 0 ? 'max-w-2xl' : 
      images.length === 1 ? 'max-w-3xl' :
      images.length === 2 ? 'max-w-4xl' :
      'max-w-5xl'
    }`}>
      {/* 데스크톱: 가로 배치 */}
      <div className="hidden sm:flex items-center gap-3 min-h-[75px] w-full bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg border border-gray-200">
        {/* 이미지 추가 버튼 - 입력창 좌측에 배치 */}
        <div className="flex-shrink-0">
          <SmallImageUploader images={images} setImages={setImages} />
        </div>
        
        <MainInput
          value={inputValue}
          onChange={onInputChange}
          onKeyPress={(e) => e.key === 'Enter' && inputValue.trim() && selectedEmojiId && handleSubmit()}
          placeholder={placeholder}
          showMainEmoji={false}
          className="bg-transparent border-0 shadow-none flex-1"
        />
        <SendButton 
          onClick={handleSubmit} 
          className={inputValue.trim() && selectedEmojiId ? '' : 'opacity-50 cursor-not-allowed'}
          disabled={!inputValue.trim() || !selectedEmojiId || isLoading}
        />
      </div>

      {/* 모바일: 세로 배치 */}
      <div className="flex sm:hidden flex-col gap-3">
        {/* 입력창 */}
        <div className="flex items-center gap-3 min-h-[75px] w-full bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg border border-gray-200">
          <MainInput
            value={inputValue}
            onChange={onInputChange}
            onKeyPress={(e) => e.key === 'Enter' && inputValue.trim() && selectedEmojiId && handleSubmit()}
            placeholder={placeholder}
            showMainEmoji={false}
            className="bg-transparent border-0 shadow-none flex-1"
          />
        </div>
        
        {/* 이미지 추가 영역과 전송 버튼 */}
        <div className="flex items-center justify-between gap-3 w-full bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg border border-gray-200">
          <SmallImageUploader images={images} setImages={setImages} />
          <SendButton 
            onClick={handleSubmit} 
            className={inputValue.trim() && selectedEmojiId ? '' : 'opacity-50 cursor-not-allowed'}
            disabled={!inputValue.trim() || !selectedEmojiId || isLoading}
          />
        </div>
      </div>
    </div>
  )
}

export default MainCommentInput
