import { api } from '../api'
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    createUserEmoji: build.mutation<
      CreateUserEmojiApiResponse,
      CreateUserEmojiApiArg
    >({
      query: (queryArg) => ({
        url: `/api/user-emojis`,
        method: 'POST',
        body: queryArg.body,
      }),
    }),
    getComments: build.query<GetCommentsApiResponse, GetCommentsApiArg>({
      query: (queryArg) => ({
        url: `/api/user-emojis/${queryArg.userEmojiId}/comments`,
      }),
    }),
    createComment: build.mutation<
      CreateCommentApiResponse,
      CreateCommentApiArg
    >({
      query: (queryArg) => ({
        url: `/api/user-emojis/${queryArg.userEmojiId}/comments`,
        method: 'POST',
        body: queryArg.commentCreateRequest,
      }),
    }),
    getUserEmojiDetail: build.query<
      GetUserEmojiDetailApiResponse,
      GetUserEmojiDetailApiArg
    >({
      query: (queryArg) => ({ url: `/api/user-emojis/${queryArg.id}` }),
    }),
    deleteUserEmoji: build.mutation<
      DeleteUserEmojiApiResponse,
      DeleteUserEmojiApiArg
    >({
      query: (queryArg) => ({
        url: `/api/user-emojis/${queryArg.id}`,
        method: 'DELETE',
      }),
    }),
    getLatestUserEmoji: build.query<
      GetLatestUserEmojiApiResponse,
      GetLatestUserEmojiApiArg
    >({
      query: () => ({ url: `/api/user-emojis/latest` }),
    }),
    getUserEmojiHighlights: build.query<
      GetUserEmojiHighlightsApiResponse,
      GetUserEmojiHighlightsApiArg
    >({
      query: () => ({ url: `/api/user-emojis/highlights` }),
    }),
  }),
  overrideExisting: false,
})
export { injectedRtkApi as UserEmojiApi }
export type CreateUserEmojiApiResponse = /** status 200 OK */ ApiResponseLong
export type CreateUserEmojiApiArg = {
  body: {
    request: UserEmojiCreateRequest
    images?: Blob[]
  }
}
export type GetCommentsApiResponse =
  /** status 200 OK */ ApiResponseListCommentResponse
export type GetCommentsApiArg = {
  userEmojiId: number
}
export type CreateCommentApiResponse = /** status 200 OK */ ApiResponseVoid
export type CreateCommentApiArg = {
  userEmojiId: number
  commentCreateRequest: CommentCreateRequest
}
export type GetUserEmojiDetailApiResponse =
  /** status 200 OK */ ApiResponseUserEmojiDetailResponse
export type GetUserEmojiDetailApiArg = {
  id: number
}
export type DeleteUserEmojiApiResponse = /** status 200 OK */ ApiResponseVoid
export type DeleteUserEmojiApiArg = {
  id: number
}
export type GetLatestUserEmojiApiResponse =
  /** status 200 OK */ ApiResponseLatestMyEmojiResponse
export type GetLatestUserEmojiApiArg = void
export type GetUserEmojiHighlightsApiResponse =
  /** status 200 OK */ ApiResponseUserEmojiHighlightsResponse
export type GetUserEmojiHighlightsApiArg = void
export type ApiResponseLong = {
  code?: string
  message?: string
  data?: number
}
export type UserEmojiCreateRequest = {
  /** 선택한 이모지 번호 */
  emojiId: number
  /** 내용 */
  text?: string
}
export type CommentResponse = {
  commentId?: number
  content?: string
  authorNickname?: string
  createdAt?: string
}
export type ApiResponseListCommentResponse = {
  code?: string
  message?: string
  data?: CommentResponse[]
}
export type ApiResponseVoid = {
  code?: string
  message?: string
  data?: object
}
export type CommentCreateRequest = {
  content?: string
}
export type UserEmojiDetailResponse = {
  /** 유저 이모지 번호 */
  userEmojiId?: number
  /** 유저 닉네임 */
  nickname?: string
  /** 이모지 번호 */
  emojiId?: number
  /** 내용 */
  text?: string
  /** 이미지 URL 목록 */
  imageUrls?: string[]
  /** 생성 시각 */
  createdAt?: string
}
export type ApiResponseUserEmojiDetailResponse = {
  code?: string
  message?: string
  data?: UserEmojiDetailResponse
}
export type LatestMyEmojiResponse = {
  /** 유저 이모지 번호 */
  userEmojiId?: number
  /** 유저 번호 */
  userId?: number
  /** 이모지 번호 */
  emojiId?: number
}
export type ApiResponseLatestMyEmojiResponse = {
  code?: string
  message?: string
  data?: LatestMyEmojiResponse
}
export type RandomUserEmojiResponse = {
  /** 유저 이모지 번호 */
  userEmojiId?: number
  /** 이모지 번호 */
  emojiId?: number
}
export type RepresentativeEmojiResponse = {
  /** 이모지 번호 */
  emojiId?: number
}
export type UserEmojiHighlightsResponse = {
  /** 랜덤 이모지 목록 */
  randomEmojis?: RandomUserEmojiResponse[]
  /** 대표 이모지 목록 */
  representativeEmojis?: RepresentativeEmojiResponse[]
  latestMyEmojiResponse?: LatestMyEmojiResponse
}
export type ApiResponseUserEmojiHighlightsResponse = {
  code?: string
  message?: string
  data?: UserEmojiHighlightsResponse
}
export const {
  useCreateUserEmojiMutation,
  useGetCommentsQuery,
  useLazyGetCommentsQuery,
  useCreateCommentMutation,
  useGetUserEmojiDetailQuery,
  useLazyGetUserEmojiDetailQuery,
  useDeleteUserEmojiMutation,
  useGetLatestUserEmojiQuery,
  useLazyGetLatestUserEmojiQuery,
  useGetUserEmojiHighlightsQuery,
  useLazyGetUserEmojiHighlightsQuery,
} = injectedRtkApi
