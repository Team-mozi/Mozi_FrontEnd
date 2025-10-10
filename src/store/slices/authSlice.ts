import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

// Redux에서 관리할 인증(Auth) 상태 타입 정의
export interface AuthState {
  isLoggedIn: boolean // 로그인 여부
  accessToken?: string // 로그인 성공 시 발급받은 JWT 토큰
  refreshToken?: string //
  userId?: number // 로그인한 사용자 ID
  nickname?: string // 사용자 닉네임
  email?: string // 사용자 이메일
}

// 초기 상태 정의
const initialState: AuthState = {
  isLoggedIn: false, // 기본값은 로그인 안 된 상태
  accessToken: undefined,
  refreshToken: undefined,
  userId: undefined,
  nickname: undefined,
  email: undefined,
}

// localStorage에 저장된 로그인 상태가 있으면 불러오기
const stored = localStorage.getItem('auth')
if (stored) {
  const parsed: AuthState = JSON.parse(stored)
  // 기존 초기 상태를 덮어쓰기 (새로고침 후에도 로그인 상태 유지)
  Object.assign(initialState, parsed)
}

// Redux Slice 생성
const authSlice = createSlice({
  name: 'auth', // slice 이름
  initialState, // 초기 상태
  reducers: {
    // 로그인 성공 시 상태 업데이트

    setCredentials: (state, action: PayloadAction<Partial<AuthState>>) => {
      Object.assign(state, action.payload)
      state.isLoggedIn = !!state.accessToken
      localStorage.setItem('auth', JSON.stringify(state))
    },

    // 로그아웃 시 상태 초기화
    logout: (state) => {
      state.isLoggedIn = false
      state.accessToken = undefined
      state.refreshToken = undefined
      state.userId = undefined
      state.nickname = undefined
      state.email = undefined
      // localStorage에서도 삭제
      localStorage.removeItem('auth')
    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer
