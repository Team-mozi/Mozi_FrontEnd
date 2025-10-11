import BackSheet from '@/components/BackSheet'
import AuthForm from '@/features/auth/AuthForm'
import { useAuthForm } from '@/hooks/useAuthForm'

const PasswordReset = () => {
  const authFormProps = useAuthForm('passwordReset')

  return (
    <BackSheet showHeader={true} title='비밀번호 찾기'>
      <div className='flex flex-col items-center justify-center w-full'>
        <div className='w-full max-w-[448px]'>
          <AuthForm
            {...authFormProps}
            mode='passwordReset'
            submitButtonLabel='비밀번호 재설정'
          />
        </div>
      </div>
    </BackSheet>
  )
}

export default PasswordReset
