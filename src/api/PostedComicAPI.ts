export const PostedComicAPI = {
    LIST_BY_USER_POSTED: (userId: any) => `/post/${userId}`,
    CREATE: `/post`,
    DELETE: (comicId: any) => `/post/${comicId}`,
    UPDATE: (comicId: any) => `/post/${comicId}`,
};