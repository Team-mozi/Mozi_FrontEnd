import { useState, useEffect, useCallback } from 'react'
import Input from '@/components/Input'
import Button from '@/components/Button'
import { useDispatch, useSelector } from 'react-redux'
import { setCredentials } from '@/store/slices/authSlice'
import { UserApi } from '@/services/endpoints/user'
import type { RootState } from '@/store/store'

interface NicknameModalProps {
  onClose: () => void
}

const NicknameForm = ({ onClose }: NicknameModalProps) => {
  const [nickname, setNickname] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const [isAvailable, setIsAvailable] = useState(false)

  const dispatch = useDispatch()
  const { userId, accessToken, email } = useSelector(
    (state: RootState) => state.auth,
  )

  // API 훅
  const [updateNickname] = UserApi.useUpdateUserNicknameMutation()
  const [checkNicknameDuplicate] = UserApi.useLazyCheckNicknameDuplicateQuery()

  /**
   * 닉네임 중복 체크 (디바운스)
   * - 닉네임 입력이 멈춘 후 0.5초 뒤 실행
   * - 중복이면 error 메시지, 사용 가능하면 가능 메시지 표시
   */
  useEffect(() => {
    if (!nickname.trim()) {
      // 입력이 없을 경우 상태 초기화
      setError('')
      setIsAvailable(false)
      setIsChecking(false)
      return
    }

    setError('')
    setIsChecking(true)
    setIsAvailable(false)

    let isActive = true

    const handler = setTimeout(async () => {
      try {
        const result = await checkNicknameDuplicate({ nickname }).unwrap()
        if (!isActive) return

        if (result.data?.exists) {
          setError('이미 사용 중인 닉네임입니다.')
          setIsAvailable(false)
        } else {
          setError('')
          setIsAvailable(true)
        }
      } catch {
        if (!isActive) return
        setError('닉네임 등록에 실패했습니다.')
        setIsAvailable(false)
      } finally {
        if (isActive) setIsChecking(false)
      }
    }, 500)

    return () => {
      isActive = false
      clearTimeout(handler)
    }
  }, [nickname, checkNicknameDuplicate])

  /**
   * 닉네임 업데이트 제출 처리
   */
  const handleSubmit = useCallback(async () => {
    if (!nickname.trim() || error || !isAvailable) return

    try {
      setIsLoading(true)
      const updatedUser = await updateNickname({
        nicknameRequest: { nickname },
      }).unwrap()

      // Redux 상태 업데이트 (기존 값은 유지, nickname만 교체)
      dispatch(
        setCredentials({
          isLoggedIn: true,
          nickname: updatedUser.data?.nickname,
          userId,
          accessToken,
          email,
        }),
      )
      onClose()
    } finally {
      setIsLoading(false)
    }
  }, [
    nickname,
    error,
    isAvailable,
    updateNickname,
    dispatch,
    userId,
    accessToken,
    email,
    onClose,
  ])

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        if (isLoading || isChecking || !!error || !isAvailable) return
        await handleSubmit()
      }}
    >
      <p className='text-lg font-medium mb-4'>닉네임을 입력해주세요</p>

      {/* 닉네임 입력 필드 */}
      <div className='relative'>
        <Input
          label=''
          name='nickname'
          placeholder='닉네임 입력'
          required
          minLength={2}
          maxLength={20}
          showLength
          onChange={(value) => setNickname(value)}
          errorMessage={error}
        />

        {/* 성공 메시지 */}
        {nickname && isAvailable && !error && (
          <p className='absolute -bottom-5 text-[10px] sm:text-[12px] flex items-center gap-1 text-green_two'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 640 640'
              className='w-4 h-4'
              fill='currentColor'
            >
              <path d='M320 576C178.6 576 64 461.4 64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576zM320 112C205.1 112 112 205.1 112 320C112 434.9 205.1 528 320 528C434.9 528 528 434.9 528 320C528 205.1 434.9 112 320 112zM390.7 233.9C398.5 223.2 413.5 220.8 424.2 228.6C434.9 236.4 437.3 251.4 429.5 262.1L307.4 430.1C303.3 435.8 296.9 439.4 289.9 439.9C282.9 440.4 276 437.9 271.1 433L215.2 377.1C205.8 367.7 205.8 352.5 215.2 343.2C224.6 333.9 239.8 333.8 249.1 343.2L285.1 379.2L390.7 234z' />
            </svg>
            사용 가능한 닉네임입니다.
          </p>
        )}

        {/* 닉네임 체크 로딩 스피너 */}
        {isChecking && (
          <div className='absolute right-3 top-1/2 -translate-y-1/2'>
            <div className='w-4 h-4 border-2 border-orange_two border-r-orange_five rounded-full animate-spin'></div>
          </div>
        )}
      </div>

      {/* 완료 버튼 */}
      <div className='mt-8 flex justify-end space-x-2'>
        <Button
          label='완료'
          loading={isLoading}
          type='submit'
          baseButton
          disabled={isChecking || !!error || !isAvailable}
        />
      </div>
    </form>
  )
}

export default NicknameForm
