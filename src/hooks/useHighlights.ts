import { useSelector } from 'react-redux'
import { useState, useEffect, useCallback } from 'react'
import type { RootState } from '@/store/store'
import { useGetUserEmojiHighlightsQuery } from '@/services/endpoints/user-emoji'

/**
 * 사용자 이모지 하이라이트 데이터와 위치 계산을 관리하는 커스텀 훅
 * 로그인된 사용자와 닉네임이 있을 때만 API를 호출하고, 화면 비율에 맞는 이모지 위치를 계산합니다.
 */
const useHighlights = () => {
  const { isLoggedIn, nickname } = useSelector((state: RootState) => state.auth)
  const [emojiPositions, setEmojiPositions] = useState<Array<{x: number, y: number}>>([])
  const [guestRandomEmojis, setGuestRandomEmojis] = useState<Array<{userEmojiId: string, emojiId: number}>>([])
  const [guestLatestEmoji, setGuestLatestEmoji] = useState<{userEmojiId: string, userId: number, emojiId: number} | null>(null)
  
  // 로그인된 사용자와 닉네임이 있을 때만 API 호출
  const shouldFetch = isLoggedIn && !!nickname
  
  const {
    data: highlightsData,
    isLoading,
    error,
    refetch
  } = useGetUserEmojiHighlightsQuery(undefined, {
    skip: !shouldFetch, // 조건이 맞지 않으면 API 호출하지 않음
  })

  // 로그인하지 않은 사용자를 위한 랜덤 이모지 생성
  const generateRandomEmojiNumber = () => Math.floor(Math.random() * 10) + 1
  
  const generateGuestRandomEmojis = () => {
    const emojiCount = 5
    return Array.from({ length: emojiCount }, (_, index) => ({
      userEmojiId: `guest-${index}`,
      emojiId: generateRandomEmojiNumber()
    }))
  }

  // 로그인하지 않은 사용자를 위한 초기 데이터 생성
  useEffect(() => {
    if (!isLoggedIn) {
      const randomEmojis = generateGuestRandomEmojis()
      const latestEmoji = {
        userEmojiId: 'guest-center',
        userId: 0,
        emojiId: generateRandomEmojiNumber()
      }
      setGuestRandomEmojis(randomEmojis)
      setGuestLatestEmoji(latestEmoji)
    }
  }, [isLoggedIn])

  // 최신 이모지 업데이트 함수
  const updateLatestEmoji = useCallback(async () => {
    if (isLoggedIn) {
      try {
        // highlights 데이터를 다시 가져와서 최신 이모지 업데이트
        await refetch()
      } catch (error) {
        console.error('최신 이모지 업데이트 실패:', error)
      }
    }
  }, [isLoggedIn, refetch])

  // 로그인 상태에 따른 데이터 결정
  const randomEmojis = isLoggedIn ? (highlightsData?.data?.randomEmojis || []) : guestRandomEmojis
  const representativeEmojis = highlightsData?.data?.representativeEmojis || []
  const latestMyEmoji = isLoggedIn ? highlightsData?.data?.latestMyEmojiResponse : guestLatestEmoji

  // 이모지 위치 계산 함수
  const calculateEmojiPositions = useCallback(() => {
    if (randomEmojis.length === 0) return []

    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2
    
    // 화면 비율 계산
    const aspectRatio = window.innerWidth / window.innerHeight
    const isWideScreen = aspectRatio > 1.2 // 가로가 더 긴 화면
    const isTallScreen = aspectRatio < 0.8 // 세로가 더 긴 화면
    
    // 중앙 이모지 크기 고려 (xl 크기: 216px)
    const centerRadius = 150 // 중앙 이모지 반지름
    const minRadius = centerRadius + 100 // 최소 반지름
    
    // 화면 비율에 따른 최대 반지름 조정 (가중치 증가)
    let maxRadiusX, maxRadiusY
    if (isWideScreen) {
      // 가로가 긴 경우: 가로 방향으로 더 넓게 배치 (가중치 증가)
      maxRadiusX = (window.innerWidth / 2) - 80
      maxRadiusY = (window.innerHeight / 2) - 200
    } else if (isTallScreen) {
      // 세로가 긴 경우: 세로 방향으로 더 넓게 배치 (가중치 증가)
      maxRadiusX = (window.innerWidth / 2) - 200
      maxRadiusY = (window.innerHeight / 2) - 80
    } else {
      // 정사각형에 가까운 경우: 균등하게 배치
      maxRadiusX = (window.innerWidth / 2) - 120
      maxRadiusY = (window.innerHeight / 2) - 120
    }
    
    const positions: Array<{x: number, y: number}> = []
    const minDistance = 60 // 이모지 간 최소 거리 (30px * 2)
    const maxAttempts = 50 // 최대 시도 횟수
    
    for (let index = 0; index < randomEmojis.length; index++) {
      let attempts = 0
      let validPosition = false
      let x = 0, y = 0
      
      while (!validPosition && attempts < maxAttempts) {
        // 각도를 균등하게 분배
        const angle = (2 * Math.PI * index) / randomEmojis.length + (Math.random() - 0.5) * 0.5
        
        // 화면 비율에 따른 타원형 배치
        const radiusX = minRadius + Math.random() * (maxRadiusX - minRadius)
        const radiusY = minRadius + Math.random() * (maxRadiusY - minRadius)
        
        // 타원형 좌표 계산 (화면 비율에 맞춰)
        x = centerX + radiusX * Math.cos(angle)
        y = centerY + radiusY * Math.sin(angle)
        
        // 화면 경계 체크 및 조정 (최소 거리 증가)
        const margin = 100 // 화면 경계에서 최소 100px 거리 유지
        x = Math.max(margin, Math.min(window.innerWidth - margin, x))
        y = Math.max(margin, Math.min(window.innerHeight - margin, y))
        
        // 기존 이모지들과의 거리 체크
        validPosition = true
        for (const existingPos of positions) {
          const distance = Math.sqrt(
            Math.pow(x - existingPos.x, 2) + Math.pow(y - existingPos.y, 2)
          )
          if (distance < minDistance) {
            validPosition = false
            break
          }
        }
        
        attempts++
      }
      
      // 최대 시도 횟수 초과 시 강제로 위치 설정
      if (!validPosition) {
        x = centerX + (minRadius + Math.random() * 100) * Math.cos((2 * Math.PI * index) / randomEmojis.length)
        y = centerY + (minRadius + Math.random() * 100) * Math.sin((2 * Math.PI * index) / randomEmojis.length)
        
        // 화면 경계 체크 및 조정 (최소 거리 증가)
        const margin = 100 // 화면 경계에서 최소 100px 거리 유지
        x = Math.max(margin, Math.min(window.innerWidth - margin, x))
        y = Math.max(margin, Math.min(window.innerHeight - margin, y))
      }
      
      positions.push({ x, y })
    }
    
    return positions
  }, [randomEmojis])

  // 화면 크기 변경 시 이모지 위치 재계산
  useEffect(() => {
    const handleResize = () => {
      setEmojiPositions(calculateEmojiPositions())
    }

    // 초기 위치 설정
    setEmojiPositions(calculateEmojiPositions())

    // 리사이즈 이벤트 리스너 추가
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [randomEmojis.length]) // randomEmojis.length로 변경하여 무한 루프 방지

  return {
    randomEmojis,
    representativeEmojis,
    latestMyEmoji,
    emojiPositions,
    isLoading,
    error,
    refetch,
    updateLatestEmoji
  }
}

export default useHighlights
