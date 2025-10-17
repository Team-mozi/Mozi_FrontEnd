export const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

/**
 * 주어진 시간을 현재 시간과 비교하여 상대적 시간을 반환합니다.
 * @param createdAt - ISO 8601 형식의 시간 문자열
 * @returns "방금 전", "1분 전", "1시간 전", "1일 전" 등의 문자열
 */
export const getRelativeTime = (createdAt: string): string => {
  const now = new Date()
  const created = new Date(createdAt)
  const diffInMs = now.getTime() - created.getTime()
  
  // 밀리초를 초로 변환
  const diffInSeconds = Math.floor(diffInMs / 1000)
  
  if (diffInSeconds < 60) {
    return '방금 전'
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전`
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours}시간 전`
  }
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays}일 전`
  }
  
  const diffInWeeks = Math.floor(diffInDays / 7)
  if (diffInWeeks < 4) {
    return `${diffInWeeks}주 전`
  }
  
  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return `${diffInMonths}개월 전`
  }
  
  const diffInYears = Math.floor(diffInDays / 365)
  return `${diffInYears}년 전`
}
