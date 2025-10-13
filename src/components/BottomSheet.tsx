import React, { createContext, useEffect, useRef, useState } from 'react'

type BottomSheetContextType = {
  isOpen: boolean
  onClose: () => void
  className?: string
  overlayClassName?: string
  disableOverlayClose?: boolean
}

const BottomSheetContext = createContext<BottomSheetContextType | null>(null)

export type BottomSheetProps = {
  /** 바텀시트 열림/닫힘 상태 */
  isOpen: boolean
  /** 바텀시트 닫기 콜백 함수 */
  onClose: () => void
  /** 바텀시트 컨테이너 추가 CSS 클래스 */
  className?: string
  overlayClassName?: string
  disableOverlayClose?: boolean
  children: React.ReactNode
}

/**
 * 기본 바텀시트 컴포넌트
 * - 하단 슬라이드 인 애니메이션
 * - Header, Content 슬롯 제공
 */
const BottomSheet: React.FC<BottomSheetProps> & {
  Header: typeof BottomSheetHeader
  Content: typeof BottomSheetContent
} = ({
  children,
  className,
  disableOverlayClose,
  isOpen,
  onClose,
  overlayClassName,
}) => {
  const sheetRef = useRef<HTMLDivElement>(null)
  const startY = useRef(0)
  const [translateY, setTranslateY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const contextValue: BottomSheetContextType = {
    className,
    disableOverlayClose,
    isOpen,
    onClose,
    overlayClassName,
  }

  // body 스크롤 제어
  useEffect(() => {
    if (isOpen) {
      const original = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = original
      }
    }
  }, [isOpen])

  // ESC 키로 닫기
  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose])

  // translateY 초기화
  useEffect(() => {
    if (isOpen) setTranslateY(0)
  }, [isOpen])

  // 드래그 시작
  const startDrag = (clientY: number) => {
    startY.current = clientY
    setIsDragging(true)
  }

  // 드래그 중
  const moveDrag = (clientY: number) => {
    if (!isDragging) return
    const deltaY = clientY - startY.current
    if (deltaY > 0) setTranslateY(deltaY)
  }

  // 드래그 종료
  const endDrag = () => {
    if (!isDragging) return
    setIsDragging(false)

    if (translateY > 120) {
      onClose()
    } else {
      setTranslateY(0)
    }
  }

  return (
    <BottomSheetContext.Provider value={contextValue}>
      {/* 배경 오버레이 */}
      <div
        className={[
          'fixed inset-0 z-40 transition-opacity duration-300 ease-out',
          isOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none',
          overlayClassName || '',
        ].join(' ')}
        onClick={() => {
          if (!disableOverlayClose) onClose()
        }}
      />

      {/* 바텀시트 래퍼 */}
      <div
        ref={sheetRef}
        className={[
          'fixed left-0 bottom-0 z-50 w-full transform transition-transform duration-300 ease-out',
          isOpen ? 'translate-y-0' : 'translate-y-full',
        ].join(' ')}
        style={{
          transform: isOpen
            ? `translateY(${translateY}px)`
            : `translateY(100%)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out',
        }}
        // 모바일 드래그
        onTouchStart={(e) => startDrag(e.touches[0].clientY)}
        onTouchMove={(e) => moveDrag(e.touches[0].clientY)}
        onTouchEnd={endDrag}
        // PC 드래그
        onMouseDown={(e) => startDrag(e.clientY)}
        onMouseMove={(e) => moveDrag(e.clientY)}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
      >
        {/* 바텀시트 메인 컨테이너 */}
        <aside
          role='dialog'
          aria-modal='true'
          className={[
            'bg-white rounded-t-3xl max-h-[80vh] flex flex-col overflow-hidden',
            'shadow-[0_-4px_10px_rgba(0,0,0,0.15)]',
            className || '',
          ].join(' ')}
          style={{ height: '80vh', maxHeight: '80vh' }}
        >
          {/* 드래그 핸들 */}
          <div
            className='flex justify-center py-4 cursor-grab active:cursor-grabbing select-none'
            onMouseDown={(e) => startDrag(e.clientY)}
            onTouchStart={(e) => startDrag(e.touches[0].clientY)}
          >
            <div className='w-28 h-1.5 bg-gray-300 rounded-full' />
          </div>
          <div className='flex-1 overflow-y-auto'>{children}</div>
        </aside>
      </div>
    </BottomSheetContext.Provider>
  )
}

/**
 * 바텀시트 헤더 컴포넌트
 */
const BottomSheetHeader: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <div className='flex-shrink-0 px-6 pt-6'>{children}</div>
}

/**
 * 바텀시트 콘텐츠 컴포넌트
 */
const BottomSheetContent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <div className='flex-1 overflow-y-auto px-6'>{children}</div>
}

// 복합 컴포넌트 패턴 설정 (Header, Content만)
BottomSheet.Header = BottomSheetHeader
BottomSheet.Content = BottomSheetContent

export default BottomSheet
