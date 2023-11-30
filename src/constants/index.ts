export const categoryId = {
    MANGA: `645d5387b11bbed4f5fd2076`,
    MANHUA: `6460e4325c783646de0c3944`,
    MANHWA: `6460e4485c783646de0c3949`,
};

export const path = {
    HOME: `trang-chu`,
    HOT: `hot`,
    LOGIN: `dang-nhap`,
    REGISTER: `dang-ky`,
    COMIC_DETAIL: (slug: any) => `truyen-tranh/${slug}`,
    POSTED_COMIC: `truyen-da-dang`,
    FOLLOWING: `theo-doi`,
    PROFILE: `ho-so`,
    SEARCH: (searchText: any) => `tim-truyen/${searchText}`,
    MANAGE_ACCOUNT: `quan-ly/tai-khoan`,
    MANAGE_COMIC: `quan-ly/truyen-tranh`,
    NOT_FOUND: `khong-tim-thay`,
    CATEGORY: `the-loai/truyen-tranh/tat-ca/`,
    CATEGORY_DETAIL: (category: any) => `the-loai/truyen-tranh/tat-ca/${category}`,
    CHAPTER: (slug: any, titleChapter: any) => `truyen-tranh/${slug}/${titleChapter}`,
};

