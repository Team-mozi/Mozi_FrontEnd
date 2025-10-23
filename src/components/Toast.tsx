import { useEffect, useState } from 'react'
import successIcon from '../assets/success_icon.svg' // 성공 아이콘
import errorIcon from '../assets/error_icon.svg' // 에러 아이콘
import failIcon from '../assets/fail_icon.svg' // 실패 아이콘

/**
 * Toast Message 컴포넌트가 사용할 수 있는 위치를 정의합니다.
 *
 * top-center : 중앙 상단 (기본값)
 *
 * bottom-center : 중앙 하단
 *
 * bottom-left : 좌측 하단
 *
 * bottom-right : 우측 하단
 */
export type ToastPosition =
  | 'top-center'
  | 'bottom-center'
  | 'bottom-left'
  | 'bottom-right'

/**
 * Toast Message 컴포넌트가 받을 수 있는 props의 타입을 정의합니다.
 */
export type ToastProps = {
  id?: number // 상태 관리를 위한 고유 ID
  message: string // Toast Message에 표시될 내용
  className?: string // 스타일 커스텀 (Tailwind CSS)
  messageType?: 'success' | 'fail' | 'error' // Toast Message 유형을 설정합니다. (기본값: 'success')
  size?: 's' | 'm' | 'l' // Toast Message의 크기를 설정합니다. (기본값: 'm')
  duration?: number // Toast Message가 표시될 시간(ms)입니다. (기본값: 2000)
  position?: ToastPosition // Toast Message가 나타날 위치를 정합니다. (기본값: 'top-center')
}

type IndividualToastProps = ToastProps & {
  onDismiss: () => void
}

const Toast = ({
  message,
  messageType = 'success',
  size = 'm',
  duration = 2000,
  className,
  onDismiss,
}: IndividualToastProps) => {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      // 애니메이션 시간을 기다린 후 컴포넌트 제거
      setTimeout(onDismiss, 200) // 200ms는 transition 시간과 일치시킵니다.
    }, duration)

    return () => {
      clearTimeout(timer)
    }
  }, [duration, onDismiss])

  // 타입별 스타일: 흰색 배경, 2px 두께의 타입별 테두리, 타입별 아이콘 색상
  const typeClasses = {
    success: 'bg-white border-2 border-green_one',
    fail: 'bg-white border-2 border-yellow_one',
    error: 'bg-white border-2 border-red_one',
  }

  // 사이즈별 텍스트 및 레이아웃 스타일
  const sizeClasses = {
    s: 'min-w-[220px] py-2 px-5 text-sm',
    m: 'min-w-[275px] py-3 px-3 text-base', // 기본값
    l: 'min-w-[320px] py-4 px-8 text-xl',
  }

  // 사이즈별 아이콘 크기 스타일
  const iconSizeClasses = {
    s: 'w-5 h-5',
    m: 'w-6 h-6',
    l: 'w-7 h-7',
  }

  // 타입별 아이콘 이미지 소스
  const typeIconSources = {
    success: successIcon,
    fail: failIcon,
    error: errorIcon,
  }

  return (
    <div
      className={`
        flex items-center justify-center rounded-[50px]
        transition-all duration-300 ease-in-out
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        ${typeClasses[messageType]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      <div className='flex items-center'>
        <img
          src={typeIconSources[messageType]}
          alt={`${messageType} icon`}
          className={`mr-3 shrink-0 ${iconSizeClasses[size]}`}
        />
        <span className='text-black'>{message}</span>
      </div>
    </div>
  )
}

export default Toast
