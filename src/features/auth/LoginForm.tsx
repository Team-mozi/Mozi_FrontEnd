import Input from '@/components/Input'
import Button from '@/components/Button'
import { useLogin } from '@/hooks/useLogin'
import { useNavigate } from 'react-router-dom'
import { useState, useContext, useEffect } from 'react'
import { ToastContext } from '@/components/ToastProvider'

const LoginForm = () => {
  const {
    email,
    password,
    setEmail,
    setPassword,
    error,
    setError,
    isLoading,
    handleLogin,
  } = useLogin()

  const navigate = useNavigate()
  const toastContext = useContext(ToastContext)

  const handlePasswordReset = () => {
    navigate('/password-reset')
  }

  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  // 버튼 활성화 조건
  const isButtonDisabled =
    !email || !password || !!emailError || !!passwordError || isLoading

  // 로그인 실패 시 Toast 표시
  useEffect(() => {
    if (error && toastContext) {
      toastContext.showToast({
        message: error,
        messageType: 'error',
        position: 'top-center',
      })
      setError('')
    }
  }, [error, toastContext, setError])

  return (
    <form onSubmit={handleLogin} className='flex flex-col w-full space-y-4'>
      <div className='space-y-7'>
        <Input
          label='이메일'
          name='email'
          type='email'
          placeholder='이메일'
          required
          onChange={(value) => setEmail(value)}
          onErrorChange={setEmailError}
          autoComplete='username'
        />
        <Input
          label='비밀번호'
          name='password'
          type='password'
          placeholder='비밀번호'
          required
          onChange={(value) => setPassword(value)}
          onErrorChange={setPasswordError}
          autoComplete='current-password'
        />
      </div>

      <button
        type='button'
        onClick={handlePasswordReset}
        className='text-base text-orange_five hover:underline self-end mt-1 p-2'
      >
        비밀번호 찾기
      </button>

      <Button
        type='submit'
        baseButton
        label='로그인'
        loading={isLoading}
        disabled={isButtonDisabled}
      />
    </form>
  )
}

export default LoginForm
