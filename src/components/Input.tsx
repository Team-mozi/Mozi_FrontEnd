import React, { useState } from 'react'

type InputProps = {
  label: string // 라벨 텍스트 (예: "이메일", "비밀번호")
  name: string // input name-id 값 (폼 제출 시 key로 사용)
  type?: 'text' | 'email' | 'password' // input 타입 (기본값: text)
  placeholder?: string // placeholder 텍스트
  required?: boolean // 필수 입력 여부
  onChange?: (value: string) => void // 값 변경 시 실행되는 콜백
  isConfirmPassword?: boolean // 비밀번호 확인용 여부 (true일 경우 규칙 검증 스킵)
  className?: string // 스타일 커스터마이징
  minLength?: number // 최소 글자 수
  maxLength?: number // 최대 글자 수
  showLength?: boolean // 글자 수 표시 여부
  hasShadow?: boolean // 그림자 효과 여부
  size?: 's' | 'm' | 'l' | 'xl' | 'full' // 넓이 설정 ('s', 'm', 'l', 'xl', 'full') (기본값: 'full')
  errorMessage?: string | React.ReactNode // 외부에서 내려주는 에러 메시지
  errorClassName?: string // 에러 메시지 CSS 커스터마이징
  containerClassName?: string // input 컨테이너 스타일 커스터마이징
  showError?: boolean // 에러 메시지 표시 여부
  onErrorChange?: (error: string) => void
  timer?: React.ReactNode // 타이머
  disabled?: boolean // 비활성화
}

const Input = ({
  className = '',
  isConfirmPassword = false,
  label,
  name,
  onChange,
  placeholder,
  required = false,
  type = 'text',
  minLength,
  maxLength,
  showLength = false,
  hasShadow = false,
  size = 'full',
  errorMessage,
  errorClassName = 'text-red_one',
  containerClassName = '',
  showError = true,
  onErrorChange,
  timer,
  disabled = false,
}: InputProps) => {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  const inputSizeClasses = {
    s: 'w-[180px]',
    m: 'w-[288px]',
    l: 'w-[300px]',
    xl: 'w-[448px]',
    full: 'w-full',
  }

  const validate = (inputValue: string) => {
    if (isConfirmPassword) return ''

    if (type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(inputValue))
        return '이메일 주소를 정확히 입력해주세요.'
    }

    if (type === 'password') {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/
      if (!passwordRegex.test(inputValue))
        return '8자 이상, 대소문자, 숫자, 특수문자를 포함해야 합니다.'
    }

    return ''
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    setValue(inputValue)

    const validationError = validate(inputValue)
    setError(validationError)

    if (onChange) onChange(inputValue)
    if (onErrorChange) onErrorChange(validationError || '')
  }

  const inputPaddingRightClass = maxLength && showLength ? 'pr-14' : 'pr-4'

  return (
    <div className={`relative flex flex-col gap-1 ${containerClassName}`}>
      {/* 라벨 조건부 렌더링 */}
      {label && (
        <label
          htmlFor={name}
          className='font-normal text-sm sm:text-base text-black'
        >
          {label}
        </label>
      )}
      <div>
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={handleChange}
          minLength={minLength}
          maxLength={maxLength}
          disabled={disabled}
          className={`h-12 border rounded-xl px-4 transition-colors duration-300 focus:outline-none focus:ring-1 hover:border-orange_three font-normal text-sm sm:text-base 
            ${hasShadow ? 'shadow-md' : ''}
            ${inputPaddingRightClass}
            ${timer} 
            ${error || errorMessage ? 'focus:ring-red-500' : 'focus:ring-orange_three'}
            placeholder-gray_one
            placeholder:font-light
            ${inputSizeClasses[size]}
            ${className}`}
        />
        {/* 입력 길이 표시 조건부 렌더링 */}
        {showLength && maxLength && (
          <span className='absolute right-4 top-12 text-gray_one text-xs pointer-events-none'>
            {value.length}/{maxLength}
          </span>
        )}
        {/* timer 표시 */}
        {timer && (
          <span className='absolute right-4 top-12 text-gray_one text-xs pointer-events-none'>
            {timer}
          </span>
        )}
      </div>
      {/* 에러 메시지 조건부 렌더링 */}
      {showError && (errorMessage || error) && (
        <p
          className={`absolute -bottom-5 px-2 text-[10px] sm:text-[12px] mt-1 ${errorClassName}`}
        >
          {errorMessage || error}
        </p>
      )}
    </div>
  )
}

export default Input
