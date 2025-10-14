import {
  useState,
  type FormEvent,
  type Dispatch,
  type SetStateAction,
  useContext,
} from 'react'
import Button from '@/components/Button'
import { useCreateUserEmojiMutation } from '@/services/endpoints/user-emoji'
import EmojiGrid from './EmojiGrid'
import ImageUploader from './ImageUploader'
import SideSheet from '@/components/SideSheet'
import BottomSheet from '@/components/BottomSheet'
import { ToastContext } from '@/components/ToastProvider'

interface PostFormProps {
  isMobile: boolean // 모바일 화면 여부
  setIsOpen: Dispatch<SetStateAction<boolean>> // Sheet 열고 닫기 상태
}

interface TextAreaInputProps {
  text: string
  setText: Dispatch<SetStateAction<string>>
  isMobile: boolean
}

const TextAreaInput = ({ text, setText, isMobile }: TextAreaInputProps) => {
  return (
    <div className='relative w-full'>
      <textarea
        value={text}
        onChange={(e) => {
          // 안전하게 값 세팅 (100자 제한)
          const v = e.target.value
          if (v.length <= 100) setText(v)
        }}
        maxLength={100}
        rows={4}
        className={`w-full p-3 rounded-xl border border-gray_one resize-none focus:outline-none ${
          isMobile ? 'text-sm' : 'text-base'
        }`}
        placeholder='하루를 100자로 표현해보세요'
      />
      <div className='absolute bottom-4 right-3 text-gray_one text-xs sm:text-sm'>
        {text.length}/100
      </div>
    </div>
  )
}
const PostForm = ({ isMobile, setIsOpen }: PostFormProps) => {
  const [selectedEmoji, setSelectedEmoji] = useState<number | null>(null) // 선택된 이모지
  const [text, setText] = useState('') // 입력 텍스트
  const [images, setImages] = useState<File[]>([]) // 업로드된 이미지 목록

  const [createUserEmoji, { isLoading }] = useCreateUserEmojiMutation() // API 호출

  const toastContext = useContext(ToastContext)
  const showToast = toastContext?.showToast

  // 폼 초기화
  const resetForm = () => {
    setSelectedEmoji(null)
    setText('')
    setImages([])
  }

  // 폼 제출 핸들러
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (selectedEmoji === null) {
      showToast?.({
        message: '하루를 표현할 이모티콘을 선택해주세요.',
        messageType: 'fail',
        duration: 2500,
        position: 'top-center',
      })
      return
    }

    const formData = new FormData()
    formData.append(
      'request',
      new Blob([JSON.stringify({ emojiId: selectedEmoji + 1, text })], {
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
      setIsOpen(false)
      resetForm()
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

  // Header 영역
  const Header = isMobile ? (
    <BottomSheet.Header>
      <p className='text-base font-bold pb-2'>하루의 기분 포스팅하기</p>
    </BottomSheet.Header>
  ) : (
    <SideSheet.Header>
      <p className='px-8 py-6 text-lg font-bold'>하루의 기분 포스팅하기</p>
    </SideSheet.Header>
  )

  // Content 영역
  const Content = isMobile ? (
    <BottomSheet.Content>
      <p className='text-sm mb-2'>
        현재 나를 표현할 이모티콘 1개를 선택해주세요
      </p>
      <EmojiGrid
        selectedEmoji={selectedEmoji}
        setSelectedEmoji={setSelectedEmoji}
        isMobile={isMobile}
      />
      <ImageUploader
        images={images}
        setImages={setImages}
        isMobile={isMobile}
      />
      <p className='text-sm mb-1'>현재 기분을 작성해보세요.</p>
      <TextAreaInput text={text} setText={setText} isMobile={isMobile} />
    </BottomSheet.Content>
  ) : (
    <SideSheet.Content>
      <p className='text-base mb-3'>
        현재 나를 표현할 이모티콘 1개를 선택해주세요
      </p>
      <EmojiGrid
        selectedEmoji={selectedEmoji}
        setSelectedEmoji={setSelectedEmoji}
        isMobile={isMobile}
      />
      <ImageUploader
        images={images}
        setImages={setImages}
        isMobile={isMobile}
      />
      <p className='text-base mb-1'>현재 기분을 작성해보세요.</p>
      <TextAreaInput text={text} setText={setText} isMobile={isMobile} />
    </SideSheet.Content>
  )

  // Footer 영역
  const Footer = isMobile ? (
    <BottomSheet.Footer>
      <Button label='작성 완료' baseButton type='submit' disabled={isLoading} />
    </BottomSheet.Footer>
  ) : (
    <SideSheet.Footer>
      <div className='px-3 mb-2'>
        <Button
          label='작성 완료'
          baseButton
          type='submit'
          disabled={isLoading}
        />
      </div>
    </SideSheet.Footer>
  )

  return (
    <form className='flex flex-col h-full' onSubmit={handleSubmit}>
      {Header}
      {Content}
      {Footer}
    </form>
  )
}

export default PostForm
