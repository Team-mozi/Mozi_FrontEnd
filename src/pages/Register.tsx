import BackSheet from '@/components/BackSheet'
import AuthForm from '@/features/auth/AuthForm'
import { useAuthForm } from '@/hooks/useAuthForm'
import useMobile from '@/hooks/useMobile'

const Register = () => {
  const authFormProps = useAuthForm('register')
  const isMobile = useMobile()

  const registerContent = (
    <div className='flex flex-col items-center justify-center w-full'>
      <div className='w-full max-w-[560px]'>
        <AuthForm
          {...authFormProps}
          mode='register'
          submitButtonLabel='회원가입 완료'
        />
      </div>
    </div>
  )

  return isMobile ? (
    registerContent
  ) : (
    <BackSheet showHeader title='회원가입'>
      {registerContent}
    </BackSheet>
  )
}

export default Register
