import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/Button'
import { useLogoutMutation } from '@/services/endpoints/user'
import { useDispatch } from 'react-redux'
import { logout } from '@/store/slices/authSlice'
import Modal from '@/components/Modal'
import { ToastContext } from '@/components/ToastProvider'

interface LogoutModalProps {
  isOpen: boolean
  onClose: () => void
}

const LogoutModal = ({ isOpen, onClose }: LogoutModalProps) => {
  const [logoutApi, { isLoading }] = useLogoutMutation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const toast = useContext(ToastContext)

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap()
      dispatch(logout())
      onClose()
      toast?.showToast({
        message: '로그아웃되었습니다.',
        messageType: 'success',
        duration: 2000,
        position: 'top-center',
      })
      navigate('/login') // 로그아웃 후 로그인 페이지로 이동
    } catch (e) {
      console.error('로그아웃 실패', e)
      toast?.showToast({
        message: '로그아웃에 실패하였습니다.',
        messageType: 'error',
        duration: 2500,
        position: 'top-center',
      })
    }
  }

  return (
    <Modal isOpen={isOpen} size='md'>
      <div className='px-4 flex flex-col items-center text-center'>
        <h2 className='text-xl font-semibold mb-4'>로그아웃</h2>
        <p className='text-base md:text-lg text-gray-600 mb-6'>
          로그아웃 하시겠습니까?
        </p>

        <div className='flex justify-center gap-6 mt-4 w-full'>
          <Button
            label='확인'
            baseButton
            onClick={handleLogout}
            loading={isLoading}
          />
          <Button label='취소' onClick={onClose} />
        </div>
      </div>
    </Modal>
  )
}

export default LogoutModal
