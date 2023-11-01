export const CategoryAPI = {
    LIST: `/category`,
    CATEGORY_BY_ID: (categoryId: any) => `/category/${categoryId}`,
    CATEGORY_BY_SLUG: (slug: any) => `/category/slug/${slug}`,
    CREATE: `/category`,
    UPDATE: (categoryId: any) => `/category/${categoryId}`,
};