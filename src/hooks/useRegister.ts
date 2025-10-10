import { useContext, useState } from 'react'
import { UserApi } from '@/services/endpoints/user'
import { useNavigate } from 'react-router-dom'
import { hasMessage } from '@/utils/errorGuards'
import { ToastContext } from '@/components/ToastProvider'

/**
 * 회원가입 로직을 관리하는 훅
 * - 입력값 상태 관리(email, password 등)
 * - 비밀번호 일치 검증
 * - API 요청 상태(isLoading) 관리
 * - 에러 메시지 상태 관리(apiError)
 */
export const useRegister = () => {
  // 입력값 상태
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [verificationCode, setVerificationCode] = useState('')

  // 비밀번호 불일치 오류 메시지
  const [passwordMatchError, setPasswordMatchError] = useState('')

  // API 요청 실패 시 표시할 에러 메시지
  const [apiError, setApiError] = useState('')

  // 인증 상태 메시지
  const [emailVerifyMessage, setEmailVerifyMessage] = useState('')

  // 인증 성공 여부
  const [isEmailVerified, setIsEmailVerified] = useState(false)

  // 회원가입 요청 중 상태
  const [isLoading, setIsLoading] = useState(false)

  // RTK Query의 register mutation
  const [register] = UserApi.useRegisterMutation()
  const navigate = useNavigate()
  const [sendVerificationEmail] = UserApi.useSendVerificationEmailMutation()
  const [confirmVerificationEmail] =
    UserApi.useConfirmVerificationEmailMutation()

  // 토스트
  const toastContext = useContext(ToastContext)
  if (!toastContext) throw new Error('ToastProvider 필요!')
  const { showToast } = toastContext

  /**
   * 비밀번호와 비밀번호 재확인이 일치하는지 검증
   * @param pwd 비밀번호
   * @param confirmPwd 비밀번호 재확인
   */
  const validatePasswords = (pwd: string, confirmPwd: string) => {
    if (pwd && confirmPwd && pwd !== confirmPwd) {
      setPasswordMatchError('비밀번호가 일치하지 않습니다.')
    } else {
      setPasswordMatchError('')
    }
  }

  /**
   * 비밀번호 입력값 변경 처리
   * @param value 비밀번호
   */
  const handlePasswordChange = (value: string) => {
    setPassword(value)
    validatePasswords(value, confirmPassword)
  }

  /**
   * 비밀번호 재확인 입력값 변경 처리
   * @param value 비밀번호 재확인
   */
  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value)
    validatePasswords(password, value)
  }

  // 이메일 인증번호 전송
  const handleSendVerification = async (
    e?: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e?.preventDefault()
    if (!email) return setApiError('이메일을 입력해주세요.')

    try {
      setApiError('')
      setEmailVerifyMessage('')
      setIsEmailVerified(false)
      await sendVerificationEmail({
        emailVerificationRequest: { email },
      }).unwrap()
      setEmailVerifyMessage('인증번호가 전송되었습니다.')
    } catch (err: unknown) {
      const userMessage = hasMessage(err)
        ? err.data.message
        : '인증번호 전송에 실패했습니다.'
      setApiError(userMessage)
    }
  }

  // 이메일 인증번호 확인
  const handleConfirmVerification = async (
    e?: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e?.preventDefault()
    if (!email || !verificationCode)
      return setApiError('이메일과 인증번호를 입력해주세요.')

    try {
      await confirmVerificationEmail({
        emailVerificationConfirmRequest: { email, verificationCode },
      }).unwrap()
      setIsEmailVerified(true)
      setEmailVerifyMessage('인증 되었습니다.')
      setApiError('')
    } catch (err: unknown) {
      const userMessage = hasMessage(err)
        ? err.data.message
        : '인증에 실패했습니다.'
      setApiError(userMessage)
      setIsEmailVerified(false)
      console.error('인증 실패', err)
    }
  }

  /**
   * 회원가입 폼 제출 처리
   * - 비밀번호 일치 여부 확인
   * - API 요청 수행
   * - 요청 중 로딩 상태 관리
   * - 요청 실패 시 에러 메시지 상태 업데이트
   * - 요청 성공 시 로그인 페이지로 이동
   */
  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // 비밀번호가 일치하지 않으면 요청 차단
    if (password !== confirmPassword) return

    try {
      setApiError('') // 이전 에러 초기화
      setIsLoading(true) // 요청 시작
      await register({
        registerRequest: { email, password, agreed: true },
      }).unwrap()
      showToast({ message: '회원가입 완료!', messageType: 'success' })
      navigate('/login') // 성공 시 로그인 페이지로 이동
    } catch (err: unknown) {
      const userMessage = hasMessage(err)
        ? err.data.message
        : '회원가입에 실패했습니다.'
      setApiError(userMessage)
      showToast({ message: userMessage, messageType: 'error' })
      console.error('회원가입 실패:', err)
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
    apiError,
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
  }
}
