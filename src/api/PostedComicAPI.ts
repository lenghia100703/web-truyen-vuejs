export const PostedComicAPI = {
    LIST_BY_USER_POSTED: (userId: any, page: any) => `/post/${userId}?page=${page}`,
    CREATE: `/post`,
    DELETE: (comicId: any) => `/post/${comicId}`,
    UPDATE: (comicId: any) => `/post/${comicId}`,
};
