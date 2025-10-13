import { useEffect, useState } from 'react'

/**
 * 이모지 컴포넌트의 사이즈를 정의합니다.
 *
 * ss: 24x24px
 * 
 * s: 36x36px
 *
 * ms: 64x64px
 * 
 * m: 96x96px (기본값)
 *
 * l: 216x216px
 */
export type EmojiSize = 'ss' | 's' | 'ms' | 'm' | 'l'

/**
 * Emoji 컴포넌트가 받을 수 있는 props의 타입을 정의합니다.
 */
export type EmojiProps = {
  size?: EmojiSize
  onClick?: () => void
  className?: string // 스타일 커스텀 (Tailwind CSS)
  number?: number // '/src/assets/emoji-icons/' 폴더의 이모지 번호
  url?: string // (선택) 외부 이미지 URL
}

/**
 * 이모지(SVG)를 표시하고 클릭 상호작용을 처리하는 컴포넌트입니다.
 * 'number' 또는 'url' prop 중 하나를 통해 이미지 소스를 제공해야 합니다.
 */
const Emoji = ({
  size = 'm',
  onClick,
  className,
  number,
  url,
}: EmojiProps) => {
  const [imageSrc, setImageSrc] = useState<string>('')

  useEffect(() => {
    // url prop이 있으면 최우선으로 사용합니다.
    if (url) {
      setImageSrc(url)
      return
    }

    // number prop이 있으면 동적으로 아이콘을 가져옵니다.
    // Vite/Next.js 등 최신 번들러는 이 구문을 지원합니다.
    if (number) {
      import(`../assets/emoji-icons/${number}.svg`)
        .then((module) => {
          setImageSrc(module.default)
        })
        .catch((err) => {
          console.error(`Emoji #${number} 로딩에 실패했습니다:`, err)
          setImageSrc('') // 에러 발생 시 이미지 소스 초기화
        })
    }
  }, [number, url])

  // 사이즈별 크기 스타일
  const sizeClasses: { [key in EmojiSize]: string } = {
    ss: 'w-6 h-6', // 24px
    s: 'w-9 h-9', // 36px
    ms: 'w-16 h-16', // 64px
    m: 'w-24 h-24', // 96px
    l: 'w-36 h-36', // 216px
  }

  // 클릭 이벤트가 있을 경우 상호작용 스타일 추가
  const interactionClasses = onClick
    ? 'cursor-pointer transition-transform duration-200 ease-in-out hover:scale-105 active:scale-95'
    : ''

  // 이미지 소스가 없으면 아무것도 렌더링하지 않습니다.
  if (!imageSrc) {
    return null
  }

  return (
    <img
      src={imageSrc}
      alt={number ? `Emoji ${number}` : 'Custom emoji'}
      onClick={onClick}
      className={`
        object-contain
        ${sizeClasses[size]}
        ${interactionClasses}
        ${className || ''}
      `}
    />
  )
}

export default Emoji