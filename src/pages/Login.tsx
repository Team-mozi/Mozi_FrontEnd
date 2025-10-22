import LoginForm from '@/features/auth/LoginForm'
import Button from '@/components/Button'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store/store'
import { useNavigate } from 'react-router-dom'
import BackSheet from '@/components/BackSheet'
import { useEffect } from 'react'
import useMobile from '@/hooks/useMobile'

const Login = () => {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth)
  const navigate = useNavigate()
  const isMobile = useMobile() // 모바일 여부 판단

  // 로그인 상태면 로그인 페이지 접근 차단
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/') // 홈으로 이동
    }
  }, [isLoggedIn, navigate])

  // 모바일 헤더
  const MobileHeader = (
    <div className='w-full px-6 pt-6'>
      <h1 className='text-4xl font-extrabold text-orange_five'>MOZI</h1>
      <p className='text-base font-medium mt-2'>
        당신의 하루, 하나의 이모지로 전하세요 😊
      </p>
    </div>
  )

  const loginContent = (
    <div className='flex flex-col w-full h-full items-center'>
      {/* 모바일 상단 헤더 */}
      {isMobile && MobileHeader}

      <div className='flex w-full h-full justify-center'>
        {/* 왼쪽 영역 (모바일에서는 숨김) */}
        {!isMobile && (
          <div className='w-full flex flex-col justify-center p-12 rounded-l-xl'>
            <h1 className='text-4xl font-extrabold text-orange_five'>MOZI</h1>
            <p className='text-lg font-medium mt-4'>
              당신의 하루, 하나의 이모지로 전하세요 😊
            </p>
            <p className='text-md pt-24'>
              아직 가입하지 않으셨나요? <br />
              가입하고 오늘의 기분을 남겨보세요
            </p>
            <Button
              label='회원가입'
              type='button'
              onClick={() => navigate('/register')}
              className='mt-6'
            />
          </div>
        )}

        {/* 중앙 구분선 (모바일에서는 숨김) */}
        {!isMobile && (
          <div className='absolute top-20 bottom-20 left-1/2 w-px bg-gray_one'></div>
        )}

        {/* 로그인 폼 영역 */}
        <div className='w-full flex flex-col justify-center items-center py-12 px-6'>
          <LoginForm />

          {/* 모바일 회원가입 버튼 */}
          {isMobile && (
            <Button
              label='회원가입'
              type='button'
              onClick={() => navigate('/register')}
              className='mt-8'
            />
          )}
        </div>
      </div>
    </div>
  )

  // 모바일과 PC 모드를 구분하여 return
  return isMobile ? loginContent : <BackSheet>{loginContent}</BackSheet>
}

export default Login
