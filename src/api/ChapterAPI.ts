export const ChapterAPI = {
    CHAPTER_BY_ID: (chapterId: any) => `/chapter/${chapterId}`,
    GET: (comicSlug: any, numberChapter: any) => `/chapter/${comicSlug}/${numberChapter}`,
    CREATE: (comicId: any) => `/chapter/${comicId}`,
};