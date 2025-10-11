import { useContext, useState } from 'react'
import { UserApi } from '@/services/endpoints/user'
import { useNavigate } from 'react-router-dom'
import { hasMessage } from '@/utils/errorGuards'
import { ToastContext } from '@/components/ToastProvider'

// 회원가입 또는 비밀번호 찾기 모드
type AuthMode = 'register' | 'passwordReset'

export const useAuthForm = (mode: AuthMode) => {
  // 입력값 상태
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [emailConfirmError, setEmailConfirmError] = useState('')

  // 비밀번호 불일치 오류 메시지
  const [passwordMatchError, setPasswordMatchError] = useState('')

  // 인증 상태 메시지
  const [emailVerifyMessage, setEmailVerifyMessage] = useState('')

  // 인증 성공 여부
  const [isEmailVerified, setIsEmailVerified] = useState(false)

  // 회원가입 요청 중 상태
  const [isLoading, setIsLoading] = useState(false)

  // RTK Query Mutations
  const navigate = useNavigate()
  const [register] = UserApi.useRegisterMutation()
  const [resetPassword] = UserApi.useResetPasswordMutation()
  const [sendVerificationEmail] = UserApi.useSendVerificationEmailMutation()
  const [sendPasswordResetEmail] = UserApi.useSendPasswordResetEmailMutation()
  const [confirmVerificationEmail] =
    UserApi.useConfirmVerificationEmailMutation()
  const [verifyPasswordResetEmail] =
    UserApi.useVerifyPasswordResetEmailMutation()

  // 토스트
  const toastContext = useContext(ToastContext)
  if (!toastContext) throw new Error('토스트 에러')
  const { showToast } = toastContext

  // 공통 로직 (비밀번호 검증)
  const validatePasswords = (pwd: string, confirmPwd: string) => {
    if (pwd && confirmPwd && pwd !== confirmPwd) {
      setPasswordMatchError('비밀번호가 일치하지 않습니다.')
    } else {
      setPasswordMatchError('')
    }
  }

  const handlePasswordChange = (value: string) => {
    setPassword(value)
    validatePasswords(value, confirmPassword)
  }

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value)
    validatePasswords(password, value)
  }

  // 모드에 따라 분기되는 로직

  // 1. 인증번호 전송 처리
  const handleSendVerification = async () => {
    if (!email) {
      setEmailConfirmError('이메일을 입력해주세요.')
      return false // 실패 반환
    }

    try {
      setEmailConfirmError('')
      setIsEmailVerified(false)

      // 회원가입
      if (mode === 'register') {
        await sendVerificationEmail({
          emailVerificationRequest: { email },
        }).unwrap()
      } else {
        // 비밀번호 찾기
        await sendPasswordResetEmail({
          emailVerificationRequest: { email },
        }).unwrap()
      }
      showToast({
        message: '인증번호가 전송되었습니다.',
        messageType: 'success',
      })
      return true // API 호출 성공 시 true 반환
    } catch (err: unknown) {
      const userMessage = hasMessage(err)
        ? err.data.message
        : '인증번호 전송에 실패했습니다.'
      showToast({
        message: userMessage,
        messageType: 'error',
      })
      return false // API 호출 실패 시 false 반환
    }
  }

  // 2. 이메일 인증번호 확인
  const handleConfirmVerification = async () => {
    if (!email || !verificationCode)
      return setEmailConfirmError('이메일과 인증번호를 입력해주세요.')

    try {
      setEmailConfirmError('')

      if (mode === 'register') {
        await confirmVerificationEmail({
          emailVerificationConfirmRequest: { email, verificationCode },
        }).unwrap()
      } else {
        await verifyPasswordResetEmail({
          emailVerificationConfirmRequest: { email, verificationCode },
        }).unwrap()
      }
      setIsEmailVerified(true)
      showToast({
        message: '인증되었습니다.',
        messageType: 'success',
      })
      setEmailVerifyMessage('')
    } catch (err: unknown) {
      const userMessage = hasMessage(err)
        ? err.data.message
        : '인증에 실패했습니다.'
      setIsEmailVerified(false)
      setEmailVerifyMessage('')
      showToast({
        message: userMessage,
        messageType: 'error',
      })
    }
  }

  // 3. 최종 제출 처리 (회원가입 또는 비밀번호 찾기)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      return
    }

    try {
      setIsLoading(true)
      setEmailConfirmError('')

      if (mode === 'register') {
        // 회원가입 로직
        await register({
          registerRequest: { email, password, agreed: true },
        }).unwrap()
        showToast({
          message: '회원가입이 완료되었습니다.',
          messageType: 'success',
        })
        navigate('/login')
      } else {
        // 비밀번호 찾기 로직
        await resetPassword({
          passwordResetRequest: {
            email,
            newPassword: password,
          },
        }).unwrap()
        showToast({
          message: '비밀번호가 재설정되었습니다.',
          messageType: 'success',
        })
        navigate('/login')
      }
    } catch (err: unknown) {
      const userMessage = hasMessage(err)
        ? err.data.message
        : mode === 'register'
          ? '회원가입에 실패했습니다.'
          : '비밀번호 재설정에 실패했습니다.'
      setEmailConfirmError(userMessage)
      showToast({ message: userMessage, messageType: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  return {
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
    handleSubmit,
    emailConfirmError,
    setEmailConfirmError,
  }
}
