export const ComicAPI = {
    LIST_BY_PAGE: (page: any) => `/comic?page=${page}`,
    COMIC_BY_ID: (id: any) => `/comic/${id}`,
    COMIC_BY_SLUG: (slug: any) => `/comic/slug/${slug}`,
    LIST_BY_CATEGORY: (categoryId: any) => `/comic/category/${categoryId}`,
    LIST_BY_USER_FOLLOWED: (userId: any) => `/comic/followed/${userId}`,
    LIST_BY_NAME: (name: any) => `/comic/search?q=${name}&page=1`,
};
