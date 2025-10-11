import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWithdrawMutation } from '@/services/endpoints/user'
import { useDispatch } from 'react-redux'
import { logout } from '@/store/slices/authSlice'
import Button from '@/components/Button'
import Modal from '@/components/Modal'
import Input from '@/components/Input'
import { ToastContext } from '@/components/ToastProvider'

interface WithdrawalModalProps {
  isOpen: boolean
  onClose: () => void
}

const WithdrawalModal = ({ isOpen, onClose }: WithdrawalModalProps) => {
  const [password, setPassword] = useState('')
  const [withdraw, { isLoading }] = useWithdrawMutation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [passwordError, setPasswordError] = useState<string>('')
  const toast = useContext(ToastContext)

  const handleWithdrawal = async () => {
    try {
      await withdraw({ userWithdrawalRequest: { password } }).unwrap()
      dispatch(logout())
      onClose()
      toast?.showToast({
        message: '회원탈퇴가 완료되었습니다.',
        messageType: 'success',
        duration: 2500,
        position: 'top-center',
      })
      navigate('/login')
    } catch (err: any) {
      console.error('회원탈퇴 실패:', err)
      toast?.showToast({
        message: err?.data?.message || '비밀번호를 다시 입력해주세요.',
        messageType: 'error',
        duration: 2500,
        position: 'top-center',
      })
    }
  }

  // 버튼 활성화 여부
  const isButtonDisabled = !password || !!passwordError || isLoading

  return (
    <Modal isOpen={isOpen} size='md'>
      <div className='px-4 flex flex-col items-center text-center'>
        <h2 className='text-xl font-semibold mb-4'>회원탈퇴</h2>
        <p className='text-base md:text-lg mb-4'>
          정말 탈퇴하시겠습니까? <br />
          삭제된 계정은 복구되지 않습니다.
        </p>
        <div className='w-full'>
          <Input
            label=''
            name='password'
            type='password'
            placeholder='비밀번호를 입력하세요'
            onChange={(e) => setPassword(e)}
            onErrorChange={setPasswordError}
          ></Input>
        </div>

        <div className='flex justify-center gap-6 mt-8 w-full'>
          <Button
            label='탈퇴하기'
            baseButton
            onClick={handleWithdrawal}
            loading={isLoading}
            disabled={isButtonDisabled}
          />
          <Button label='취소' onClick={onClose} />
        </div>
      </div>
    </Modal>
  )
}

export default WithdrawalModal
