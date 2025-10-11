import BackSheet from '@/components/BackSheet'
import AuthForm from '@/features/auth/AuthForm'
import { useAuthForm } from '@/hooks/useAuthForm'

const Register = () => {
  const authFormProps = useAuthForm('register')

  return (
    <BackSheet showHeader={true} title='회원가입'>
      <div className='flex flex-col items-center justify-center w-full'>
        <div className='w-full max-w-[448px]'>
          <AuthForm
            {...authFormProps}
            mode='register'
            submitButtonLabel='회원가입 완료'
          />
        </div>
      </div>
    </BackSheet>
  )
}

export default Register
