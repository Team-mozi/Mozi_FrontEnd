import Input from '@/components/Input'
import Button from '@/components/Button'
import { useTimer } from '@/hooks/useTimer'
import { useState } from 'react'
import { formatTime } from '@/utils/time'
import type { useAuthForm } from '@/hooks/useAuthForm'
import useMobile from '@/hooks/useMobile'
import Header from '@/components/Header'

type AuthFormProps = ReturnType<typeof useAuthForm> & {
  submitButtonLabel: string
  mode: 'register' | 'passwordReset' // 회원가입 또는 비밀번호 찾기 모드
}
const AuthForm = ({
  email,
  setEmail,
  password,
  confirmPassword,
  passwordMatchError,
  isLoading,
  verificationCode,
  setVerificationCode,
  isEmailVerified,
  handlePasswordChange,
  handleConfirmPasswordChange,
  handleSendVerification,
  handleConfirmVerification,
  handleSubmit,
  submitButtonLabel,
  mode,
}: AuthFormProps) => {
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const isMobile = useMobile() // 모바일 구분
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [isSending, setIsSending] = useState(false) // 이메일 전송 로딩 상태

  // 타이머 훅
  const verificationTimer = useTimer(300)
  const resendTimer = useTimer(30, false)

  const handleSendVerificationWithTimer = async () => {
    // API 호출 전, 기존 메시지 초기화
    setEmailError('')
    setIsSending(true) // 전송 시작 시 로딩 true

    try {
      // handleSendVerification을 호출하고 성공 여부를 받습니다.
      const isSuccess = await handleSendVerification()

      if (isSuccess) {
        verificationTimer.start()
        resendTimer.start()
        setIsEmailSent(true)
      }
    } finally {
      setIsSending(false) // 로딩 종료
    }
  }

  if (isEmailVerified && verificationTimer.isActive) {
    verificationTimer.stop()
  }

  // 비밀번호 찾기에서 버튼 활성화 조건에 isEmailVerified를 포함
  const isPasswordResetFieldsFilled =
    isEmailVerified && // 이메일 인증 완료 필수
    password && // 비밀번호 입력 필수
    confirmPassword && // 비밀번호 재확인 입력 필수
    !passwordMatchError &&
    !passwordError

  const isRegisterFieldsFilled =
    email &&
    password &&
    confirmPassword &&
    verificationCode &&
    !emailError &&
    !passwordError &&
    !passwordMatchError &&
    isEmailVerified

  const isButtonDisabled =
    isLoading ||
    (mode === 'register'
      ? !isRegisterFieldsFilled
      : !isPasswordResetFieldsFilled)

  // 인증이 완료되었을 때
  const showPasswordFields =
    mode === 'register' || (mode === 'passwordReset' && isEmailVerified)

  // 인증이 완료되지 않았을 때
  const showAuthFields =
    mode === 'register' || (mode === 'passwordReset' && !isEmailVerified)

  // 인증 완료 후 인증 관련 input/button disable 처리
  const isAuthComplete = isEmailVerified

  // 모바일 상단 헤더
  const MobileHeader = (
    <div className='w-full py-6'>
      <Header
        title={mode === 'register' ? '회원가입' : '비밀번호 찾기'}
        showBackButton
      />
      <p className='text-base font-medium mt-2'>
        {mode === 'register' ? '회원가입' : '비밀번호 찾기'}
      </p>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className='flex flex-col px-6'>
      {isMobile && MobileHeader}
      <div className='space-y-7'>
        {showAuthFields && (
          <>
            {/* 이메일 입력 */}
            <div className='flex items-end space-x-2 w-full'>
              <Input
                label='이메일'
                name='email'
                type='email'
                placeholder='이메일'
                required
                onChange={(value) => setEmail(value)}
                containerClassName='flex-1'
                errorMessage={emailError}
                showError={!!emailError}
                onErrorChange={setEmailError}
                disabled={isEmailSent || isEmailVerified}
              />
              <Button
                label={
                  resendTimer.isActive
                    ? `00:${resendTimer.timeLeft}`
                    : '인증번호 전송'
                }
                type='button'
                size='s'
                baseButton
                onClick={handleSendVerificationWithTimer}
                loading={isSending}
                disabled={
                  !!emailError ||
                  !email ||
                  resendTimer.isActive ||
                  isAuthComplete ||
                  isSending
                }
              />
            </div>

            {/* 이메일 인증번호 입력 */}
            <div className='flex items-end space-x-2 w-full'>
              <Input
                label='이메일 인증 번호'
                name='emailConfirm'
                type='text'
                placeholder='인증 번호'
                onChange={(v) => setVerificationCode(v)}
                containerClassName='flex-1'
                autoComplete='one-time-code'
                showError={false}
                timer={
                  verificationTimer.isActive
                    ? formatTime(verificationTimer.timeLeft)
                    : null
                }
                disabled={!isEmailSent || isAuthComplete}
              />
              <Button
                label='인증 확인'
                type='button'
                size='s'
                baseButton
                onClick={handleConfirmVerification}
                disabled={!verificationCode || isAuthComplete}
              />
            </div>
          </>
        )}
        {showPasswordFields && (
          <>
            {/* 비밀번호 입력 */}
            <Input
              label='비밀번호'
              name='password'
              type='password'
              placeholder='비밀번호'
              required
              onChange={handlePasswordChange}
              errorMessage={passwordError}
              showError={!!passwordError}
              onErrorChange={setPasswordError}
              autoComplete='new-password'
            />

            {/* 비밀번호 재확인 */}
            <Input
              label='비밀번호 재확인'
              name='confirmPassword'
              type='password'
              placeholder='비밀번호 재확인'
              required
              isConfirmPassword
              onChange={handleConfirmPasswordChange}
              errorMessage={passwordMatchError}
              showError={!!passwordMatchError}
              autoComplete='new-password'
            />
          </>
        )}
      </div>
      {/* 최종 제출 버튼 */}
      {showPasswordFields && (
        <div className='pt-10'>
          <Button
            type='submit'
            baseButton
            label={submitButtonLabel}
            loading={isLoading}
            disabled={isButtonDisabled}
          />
        </div>
      )}
    </form>
  )
}

export default AuthForm
