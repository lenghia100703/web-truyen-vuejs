import { http } from '@/utils/http';
import { ChapterAPI } from '@/api/ChapterAPI';

export const ChapterServices = {
    getChapter: async (comicSlug: any, numberChapter: any) => {
        return (await http.get(ChapterAPI.GET(comicSlug, numberChapter))).data;
    },

    getChapterById: async (chapterId: any) => {
        return (await http.get(ChapterAPI.CHAPTER_BY_ID(chapterId))).data;
    },

    create: async (data: any, comicId: any, user: any, httpJwt: any) => {
        await httpJwt.put(ChapterAPI.CREATE(comicId), data, {
            headers: {
                'Content-Type': 'multipart/form-data',
                token: `Bearer ${user.accessToken}`,
            },
        });
    },
};