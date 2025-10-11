import { api } from '../api'
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    socialLogin: build.mutation<SocialLoginApiResponse, SocialLoginApiArg>({
      query: (queryArg) => ({
        url: `/api/users/social-login`,
        method: 'POST',
        body: queryArg.socialLoginRequest,
      }),
    }),
    reissue: build.mutation<ReissueApiResponse, ReissueApiArg>({
      query: (queryArg) => ({
        url: `/api/users/reissue`,
        method: 'POST',
        body: queryArg.tokenRefreshRequest,
      }),
    }),
    register: build.mutation<RegisterApiResponse, RegisterApiArg>({
      query: (queryArg) => ({
        url: `/api/users/register`,
        method: 'POST',
        body: queryArg.registerRequest,
      }),
    }),
    sendPasswordResetEmail: build.mutation<
      SendPasswordResetEmailApiResponse,
      SendPasswordResetEmailApiArg
    >({
      query: (queryArg) => ({
        url: `/api/users/password-reset/send-email`,
        method: 'POST',
        body: queryArg.emailVerificationRequest,
      }),
    }),
    resetPassword: build.mutation<
      ResetPasswordApiResponse,
      ResetPasswordApiArg
    >({
      query: (queryArg) => ({
        url: `/api/users/password-reset/reset`,
        method: 'POST',
        body: queryArg.passwordResetRequest,
      }),
    }),
    verifyPasswordResetEmail: build.mutation<
      VerifyPasswordResetEmailApiResponse,
      VerifyPasswordResetEmailApiArg
    >({
      query: (queryArg) => ({
        url: `/api/users/password-reset/confirm-email`,
        method: 'POST',
        body: queryArg.emailVerificationConfirmRequest,
      }),
    }),
    updateUserNickname: build.mutation<
      UpdateUserNicknameApiResponse,
      UpdateUserNicknameApiArg
    >({
      query: (queryArg) => ({
        url: `/api/users/nickname`,
        method: 'POST',
        body: queryArg.nicknameRequest,
      }),
    }),
    logout: build.mutation<LogoutApiResponse, LogoutApiArg>({
      query: () => ({ url: `/api/users/logout`, method: 'POST' }),
    }),
    login: build.mutation<LoginApiResponse, LoginApiArg>({
      query: (queryArg) => ({
        url: `/api/users/login`,
        method: 'POST',
        body: queryArg.loginRequest,
      }),
    }),
    sendVerificationEmail: build.mutation<
      SendVerificationEmailApiResponse,
      SendVerificationEmailApiArg
    >({
      query: (queryArg) => ({
        url: `/api/users/email-verifications/send`,
        method: 'POST',
        body: queryArg.emailVerificationRequest,
      }),
    }),
    confirmVerificationEmail: build.mutation<
      ConfirmVerificationEmailApiResponse,
      ConfirmVerificationEmailApiArg
    >({
      query: (queryArg) => ({
        url: `/api/users/email-verifications/confirm`,
        method: 'POST',
        body: queryArg.emailVerificationConfirmRequest,
      }),
    }),
    checkNicknameDuplicate: build.query<
      CheckNicknameDuplicateApiResponse,
      CheckNicknameDuplicateApiArg
    >({
      query: (queryArg) => ({
        url: `/api/users/nickname/exists`,
        params: {
          nickname: queryArg.nickname,
        },
      }),
    }),
    withdraw: build.mutation<WithdrawApiResponse, WithdrawApiArg>({
      query: (queryArg) => ({
        url: `/api/users/me`,
        method: 'DELETE',
        body: queryArg.userWithdrawalRequest,
      }),
    }),
  }),
  overrideExisting: false,
})
export { injectedRtkApi as UserApi }
export type SocialLoginApiResponse =
  /** status 200 OK */ ApiResponseLoginResponse
export type SocialLoginApiArg = {
  socialLoginRequest: SocialLoginRequest
}
export type ReissueApiResponse = /** status 200 OK */ ApiResponseString
export type ReissueApiArg = {
  tokenRefreshRequest: TokenRefreshRequest
}
export type RegisterApiResponse = /** status 200 OK */ ApiResponseLong
export type RegisterApiArg = {
  registerRequest: RegisterRequest
}
export type SendPasswordResetEmailApiResponse =
  /** status 200 OK */ ApiResponseVoid
export type SendPasswordResetEmailApiArg = {
  emailVerificationRequest: EmailVerificationRequest
}
export type ResetPasswordApiResponse = /** status 200 OK */ ApiResponseVoid
export type ResetPasswordApiArg = {
  passwordResetRequest: PasswordResetRequest
}
export type VerifyPasswordResetEmailApiResponse =
  /** status 200 OK */ ApiResponseVoid
export type VerifyPasswordResetEmailApiArg = {
  emailVerificationConfirmRequest: EmailVerificationConfirmRequest
}
export type UpdateUserNicknameApiResponse =
  /** status 200 OK */ ApiResponseUserResponse
export type UpdateUserNicknameApiArg = {
  nicknameRequest: NicknameRequest
}
export type LogoutApiResponse = /** status 200 OK */ ApiResponseVoid
export type LogoutApiArg = void
export type LoginApiResponse = /** status 200 OK */ ApiResponseLoginResponse
export type LoginApiArg = {
  loginRequest: LoginRequest
}
export type SendVerificationEmailApiResponse =
  /** status 200 OK */ ApiResponseVoid
export type SendVerificationEmailApiArg = {
  emailVerificationRequest: EmailVerificationRequest
}
export type ConfirmVerificationEmailApiResponse =
  /** status 200 OK */ ApiResponseVoid
export type ConfirmVerificationEmailApiArg = {
  emailVerificationConfirmRequest: EmailVerificationConfirmRequest
}
export type CheckNicknameDuplicateApiResponse =
  /** status 200 OK */ ApiResponseNicknameExistsResponse
export type CheckNicknameDuplicateApiArg = {
  nickname: string
}
export type WithdrawApiResponse = /** status 200 OK */ ApiResponseVoid
export type WithdrawApiArg = {
  userWithdrawalRequest: UserWithdrawalRequest
}
export type LoginResponse = {
  /** 회원 번호 */
  userId?: number
  /**  회원 닉네임 */
  nickname?: string
  /** 액세스 토큰 */
  accessToken?: string
  /** 리프래시 토큰 */
  refreshToken?: string
}
export type ApiResponseLoginResponse = {
  code?: string
  message?: string
  data?: LoginResponse
}
export type SocialLoginRequest = {
  /** 소셜 제공자 */
  provider: string
  /** 소셜 인증 토큰 */
  providerToken: string
}
export type ApiResponseString = {
  code?: string
  message?: string
  data?: string
}
export type TokenRefreshRequest = {
  refreshToken?: string
}
export type ApiResponseLong = {
  code?: string
  message?: string
  data?: number
}
export type RegisterRequest = {
  /** 이메일 */
  email: string
  /** 비밀번호 */
  password: string
  /** 약관동의 여부 */
  agreed?: boolean
}
export type ApiResponseVoid = {
  code?: string
  message?: string
  data?: object
}
export type EmailVerificationRequest = {
  /** 인증을 진행할 이메일 */
  email: string
}
export type PasswordResetRequest = {
  /** 인증 완료된 이메일 */
  email: string
  /** 새로운 비밀번호 */
  newPassword: string
}
export type EmailVerificationConfirmRequest = {
  /** 인증을 진행한 이메일 */
  email: string
  /** 이메일로 발송된 인증 코드 */
  verificationCode: string
}
export type UserResponse = {
  /** 회원 번호 */
  userId?: number
  /** 닉네임 */
  nickname?: string
}
export type ApiResponseUserResponse = {
  code?: string
  message?: string
  data?: UserResponse
}
export type NicknameRequest = {
  /** 설정할 닉네임 */
  nickname: string
}
export type LoginRequest = {
  /** 이메일 */
  email: string
  /** 비밀번호 */
  password: string
}
export type NicknameExistsResponse = {
  exists?: boolean
}
export type ApiResponseNicknameExistsResponse = {
  code?: string
  message?: string
  data?: NicknameExistsResponse
}
export type UserWithdrawalRequest = {
  /** 현재 계정의 비밀번호 */
  password: string
}
export const {
  useSocialLoginMutation,
  useReissueMutation,
  useRegisterMutation,
  useSendPasswordResetEmailMutation,
  useResetPasswordMutation,
  useVerifyPasswordResetEmailMutation,
  useUpdateUserNicknameMutation,
  useLogoutMutation,
  useLoginMutation,
  useSendVerificationEmailMutation,
  useConfirmVerificationEmailMutation,
  useCheckNicknameDuplicateQuery,
  useLazyCheckNicknameDuplicateQuery,
  useWithdrawMutation,
} = injectedRtkApi
