import { useState } from 'react'
import { UserApi } from '@/services/endpoints/user'
import { useDispatch } from 'react-redux'
import { setCredentials } from '@/store/slices/authSlice'
import { useNavigate } from 'react-router-dom'
import type { AppDispatch } from '@/store/store'
import { hasMessage } from '@/utils/errorGuards'

/**
 * 커스텀 훅: 로그인 관련 상태와 함수 관리
 * - 이메일, 비밀번호 상태 관리
 * - 로그인 API 호출
 * - 로그인 성공 시 Redux 상태와 localStorage 업데이트
 * - 로그인 실패 시 에러 메시지 처리
 */
export const useLogin = () => {
  // 이메일 입력 상태
  const [email, setEmail] = useState('')
  // 비밀번호 입력 상태
  const [password, setPassword] = useState('')
  // 로그인 실패 시 보여줄 에러 메시지
  const [error, setError] = useState('')

  // RTK Query 로그인 뮤테이션 훅
  const [login, { isLoading }] = UserApi.useLoginMutation()

  // Redux dispatch
  const dispatch = useDispatch<AppDispatch>()

  // 페이지 이동을 위한 React Router 훅
  const navigate = useNavigate()

  // 로그인 처리 함수
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault() // 페이지 리로드 방지
    setError('') // 이전 에러 초기화

    try {
      // RTK Query login mutation 호출
      const result = await login({ loginRequest: { email, password } }).unwrap()

      // 로그인 성공 시
      if (result.data?.accessToken) {
        // Redux 상태에 로그인 정보 저장
        dispatch(
          setCredentials({
            isLoggedIn: true, // 로그인 상태
            accessToken: result.data.accessToken, // 액세스 토큰
            refreshToken: result.data.refreshToken,
            userId: result.data.userId ?? 0, // ID 값
            nickname: result.data.nickname ?? '', // 닉네임
            email, // 이메일
          }),
        )
        navigate('/') // 로그인 성공 후 홈으로 이동
      } else {
        // API는 성공했지만 데이터가 없는 경우
        setError('로그인에 실패했습니다.')
      }
    } catch (err: unknown) {
      let userMessage = '로그인에 실패했습니다.'

      if (hasMessage(err)) {
        userMessage = err.data.message
      }
      setError(userMessage)
      console.error('로그인 실패:', err)
    }
  }

  // 훅에서 반환하는 값들
  return {
    email, // 이메일 상태
    setEmail, // 이메일 상태 변경 함수
    password, // 비밀번호 상태
    setPassword, // 비밀번호 상태 변경 함수
    error, // 로그인 실패 메시지
    isLoading, // 로그인 API 호출 중 여부
    handleLogin, // 로그인 처리 함수
  }
}
