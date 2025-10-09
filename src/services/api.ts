import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'
import { UserApi } from './endpoints/user'
import { setCredentials, logout } from '@/store/slices/authSlice'
import type { RootState } from '@/store/store'

// fetchBaseQuery 타입 지정
const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> =
  fetchBaseQuery({
    baseUrl: '/',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  })

// Access Token 재발급 로직 포함
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)

  if (result.error?.status === 401) {
    const refreshToken = (api.getState() as RootState).auth.refreshToken
    if (!refreshToken) {
      api.dispatch(logout())
      return result
    }

    try {
      const reissueResult = await api
        .dispatch(
          UserApi.endpoints.reissue.initiate({
            tokenRefreshRequest: { refreshToken },
          }),
        )
        .unwrap()

      if (reissueResult.data) {
        // Redux와 localStorage에 새 토큰 저장
        api.dispatch(
          setCredentials({
            ...(api.getState() as RootState).auth,
            accessToken: reissueResult.data,
          }),
        )

        // 원래 요청 재실행
        result = await baseQuery(args, api, extraOptions)
      }
    } catch {
      api.dispatch(logout())
    }
  }

  return result
}

// RTK Query Api 생성
export const api = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    user: builder.query<{ status: string }, void>({
      query: () => 'user',
    }),
  }),
  reducerPath: 'api',
  tagTypes: ['Example'],
})

export const { useUserQuery } = api
