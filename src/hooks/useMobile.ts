import { useEffect, useState } from 'react'

// 모바일 브레이크포인트 기준 (768px)
const MOBILE_BREAKPOINT = 768

/**
 * useMobile 훅
 * - 현재 화면이 모바일 사이즈(<= 768px)인지 여부를 반환
 * - 반응형 UI 구성 시 사용
 */
const useMobile = () => {
  // 초기 상태: 브라우저가 존재할 경우 화면 너비로 판단, 아닐 경우 false
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined'
      ? window.innerWidth <= MOBILE_BREAKPOINT
      : false,
  )

  useEffect(() => {
    // 화면 크기 변경될 때마다 모바일 여부를 갱신하는 함수
    const handleResize = () => {
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT)
    }

    handleResize() // 초기 렌더 시 한 번 실행해서 현재 상태 반영

    // 리사이즈 이벤트 리스너 등록
    window.addEventListener('resize', handleResize)

    // 컴포넌트 언마운트 시 이벤트 리스너 정리
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return isMobile // 모바일 여부 반환
}

export default useMobile
