import Input from '@/components/Input'
import Button from '@/components/Button'
import { useRegister } from '@/hooks/useRegister'
import { useTimer } from '@/hooks/useTimer'
import { useState } from 'react'
import { formatTime } from '@/utils/time'

const RegisterForm = () => {
  const {
    email,
    setEmail,
    password,
    confirmPassword,
    passwordMatchError,
    isLoading,
    emailVerifyMessage,
    verificationCode,
    setVerificationCode,
    isEmailVerified,
    handlePasswordChange,
    handleConfirmPasswordChange,
    handleSendVerification,
    handleConfirmVerification,
    handleSignup,
    emailConfirmError,
    setEmailConfirmError,
  } = useRegister()

  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  // 타이머 훅
  const verificationTimer = useTimer(300) // 5분 인증번호 유효
  const resendTimer = useTimer(30, false) // 30초 재전송 제한

  const handleSendVerificationWithTimer = async () => {
    await handleSendVerification()
    verificationTimer.start() // 5분 타이머 시작
    resendTimer.start() // 30초 재전송 제한 시작
  }

  // 인증 성공 시 5분 타이머 정지
  if (isEmailVerified && verificationTimer.isActive) {
    verificationTimer.stop()
  }

  const isAllFilled =
    email &&
    password &&
    confirmPassword &&
    verificationCode &&
    !emailError &&
    !passwordError &&
    !passwordMatchError &&
    isEmailVerified

  const isButtonDisabled = !isAllFilled || isLoading

  return (
    <form onSubmit={handleSignup} className='flex flex-col'>
      <div className='space-y-7'>
        {/* 이메일 입력 + 인증번호 전송 버튼 */}
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
            disabled={isEmailVerified}
          />
          <Button
            label={
              resendTimer.isActive
                ? `${resendTimer.timeLeft}초 후 재전송`
                : '인증번호 전송'
            }
            type='button'
            size='m'
            baseButton
            onClick={handleSendVerificationWithTimer}
            disabled={
              !!emailError || !email || isEmailVerified || resendTimer.isActive
            }
          />
        </div>

        {/* 이메일 인증번호 입력 + 확인 버튼 */}
        <div className='flex items-end space-x-2 w-full'>
          <Input
            label='이메일 인증 번호'
            name='emailConfirm'
            type='text'
            placeholder='이메일 인증 번호'
            onChange={(v) => setVerificationCode(v)}
            containerClassName='flex-1'
            errorMessage={
              emailVerifyMessage ? (
                <span className='text-green_two'>{emailVerifyMessage}</span>
              ) : emailConfirmError ? (
                <span className='text-red_one'>{emailConfirmError}</span>
              ) : undefined
            }
            showError={!!emailVerifyMessage || !!emailConfirmError}
            onErrorChange={setEmailConfirmError}
            timer={
              verificationTimer.isActive
                ? formatTime(verificationTimer.timeLeft)
                : null
            }
            disabled={isEmailVerified}
          />

          <Button
            label='인증 확인'
            type='button'
            size='m'
            baseButton
            onClick={handleConfirmVerification}
            disabled={!verificationCode || isEmailVerified}
          />
        </div>

        {/* 비밀번호 */}
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
        />
      </div>

      {/* 회원가입 버튼 */}
      <div className='pt-10'>
        <Button
          type='submit'
          baseButton
          label='회원가입 완료'
          loading={isLoading}
          disabled={isButtonDisabled}
        />
      </div>
    </form>
  )
}

export default RegisterForm
