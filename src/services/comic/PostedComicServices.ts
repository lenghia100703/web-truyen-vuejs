import { PostedComicAPI } from '@/api/PostedComicAPI';

export const PostedComicServices = {
    getPostedComicByUser: async (user: any, page: any, httpJwt: any) => {
        return (
            await httpJwt.get(PostedComicAPI.LIST_BY_USER_POSTED(user._id, page), {
                headers: {
                    token: `Bearer ${user.accessToken}`,
                },
            })
        ).data;
    },

    create: async (data: any, user: any, httpJwt: any) => {
        return (
            await httpJwt.post(PostedComicAPI.CREATE, data, {
                headers: {
                    token: `Bearer ${user.accessToken}`,
                },
            })
        ).data;
    },

    delete: async (comicId: any, user: any, httpJwt: any) => {
        await httpJwt.delete(PostedComicAPI.DELETE(comicId), {
            headers: {
                token: `Bearer ${user?.accessToken}`,
            },
        });
    },

    update: async (comicId: any, user: any, data: any, httpJwt: any) => {
        return (
            await httpJwt.put(PostedComicAPI.UPDATE(comicId), data, {
                headers: {
                    token: `Bearer ${user?.accessToken}`,
                },
            })
        ).data;
    },
};
