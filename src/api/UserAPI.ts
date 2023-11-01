export const UserAPI = {
    LIST: `/user`,
    USER_BY_ID: (userId: any) => `/user/${userId}`,
    UPDATE: (userId: any) => `/user/${userId}`,
    FOLLOW_COMIC: (comicId: any) => `/user/follow/${comicId}`,
    UNFOLLOW_COMIC: (comicId: any) => `/user/unfollow/${comicId}`,
};