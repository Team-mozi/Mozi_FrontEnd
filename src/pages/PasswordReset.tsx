import BackSheet from '@/components/BackSheet'
import AuthForm from '@/features/auth/AuthForm'
import { useAuthForm } from '@/hooks/useAuthForm'
import useMobile from '@/hooks/useMobile'

const PasswordReset = () => {
  const authFormProps = useAuthForm('passwordReset')
  const isMobile = useMobile()

  const resetContent = (
    <div className='flex flex-col items-center justify-center w-full'>
      <div className='w-full max-w-[560px]'>
        <AuthForm
          {...authFormProps}
          mode='passwordReset'
          submitButtonLabel='비밀번호 재설정'
        />
      </div>
    </div>
  )

  return isMobile ? (
    resetContent
  ) : (
    <BackSheet showHeader title='비밀번호 찾기'>
      {resetContent}
    </BackSheet>
  )
}

export default PasswordReset
