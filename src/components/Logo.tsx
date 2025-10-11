import logoImage from '../assets/logo.svg'

/**
 * Logo 컴포넌트가 받을 수 있는 props의 타입을 정의합니다.
 */
type LogoProps = {
  size?: 's' | 'm' | 'l' // 로고의 크기를 설정합니다. (기본값: 'm')
  onClick?: () => void // 로고 클릭 시 실행될 함수입니다. (기본값: 없음)
}

const Logo = ({ size = 'm', onClick }: LogoProps) => {
  const sizeClasses = {
    s: 'w-16 h-16', // 작은 사이즈
    m: 'w-24 h-24', // 중간 사이즈 (기본값)
    l: 'w-32 h-32', // 큰 사이즈
  }

  // onClick 핸들러가 있을 경우 커서를 포인터로 변경하여 클릭 가능함을 알립니다.
  const interactiveClasses = onClick ? 'cursor-pointer' : ''

  return (
    <img
      src={logoImage}
      alt="Mozi 로고"
      className={`${sizeClasses[size]} ${interactiveClasses}`}
      onClick={onClick}
    />
  )
}

export default Logo