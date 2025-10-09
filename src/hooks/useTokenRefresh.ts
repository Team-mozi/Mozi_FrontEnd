import { UserApi } from '@/services/endpoints/user'
import { useDispatch, useSelector } from 'react-redux'
import { setCredentials } from '@/store/slices/authSlice'
import type { AppDispatch, RootState } from '@/store/store'

export const useTokenRefresh = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [reissue] = UserApi.useReissueMutation()
  const auth = useSelector((state: RootState) => state.auth)

  const refreshAccessToken = async () => {
    if (!auth.refreshToken) return null

    try {
      const result = await reissue({
        tokenRefreshRequest: { refreshToken: auth.refreshToken },
      }).unwrap()
      if (result.data) {
        // 새 accessToken 받으면 Redux와 localStorage 업데이트
        dispatch(
          setCredentials({
            ...auth,
            accessToken: result.data,
          }),
        )
        return result.data
      }
    } catch (err) {
      console.error('토큰 재발급 실패:', err)

      return null
    }
  }

  return { refreshAccessToken }
}
