import { http } from '@/utils/http';
import { ComicAPI } from '@/api/ComicAPI';

export const ComicServices = {
    getComicByPage: async (page?: any) => {
        return (await http.get(ComicAPI.LIST_BY_PAGE(page))).data;
    },

    getHotComic: async (page: any) => {
        return (await http.get(ComicAPI.LIST_HOT(page))).data;
    },

    getComicById: async (comicId: any, user: any, httpJwt: any) => {
        return (
            await httpJwt.get(ComicAPI.COMIC_BY_ID(comicId), {
                headers: {
                    token: `Bearer ${user?.accessToken}`,
                },
            })
        ).data;
    },

    getComicBySlug: async (slug: any) => {
        return (await http.get(ComicAPI.COMIC_BY_SLUG(slug))).data;
    },

    getComicByCategory: async (categoryId: any) => {
        return (await http.get(ComicAPI.LIST_BY_CATEGORY(categoryId))).data;
    },

    getComicByUserFollowed: async (user: any, httpJwt: any) => {
        return (
            await httpJwt.get(ComicAPI.LIST_BY_USER_FOLLOWED(user?._id), {
                headers: {
                    token: `Bearer ${user?.accessToken}`,
                },
            })
        ).data;
    },

    getComicByName: async (name: any) => {
        return (await http.get(ComicAPI.LIST_BY_NAME(name))).data;
    },
};
