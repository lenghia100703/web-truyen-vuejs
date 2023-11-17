import { PostedComicAPI } from '@/api/PostedComicAPI';

export const PostedComicServices = {
    getPostedComicByUser: async (user: any, httpJwt: any) => {
        return (await httpJwt.get(PostedComicAPI.LIST_BY_USER_POSTED(user._id), {
            headers: {
                token: `Bearer ${user.accessToken}`,
            },
        })).data;
    },

    create: async (data: any, user: any, httpJwt: any) => {
        await httpJwt.post(PostedComicAPI.CREATE, data, {
            headers: {
                token: `Bearer ${user.accessToken}`,
            },
        });
    },

    delete: async (comicId: any, user: any, httpJwt: any) => {
        await httpJwt.delete(PostedComicAPI.DELETE(comicId), {
            headers: {
                token: `Bearer ${user?.accessToken}`,
            },
        });
    },

    update: async (comicId: any, user: any, data: any, httpJwt: any) => {
        return (await httpJwt.put(PostedComicAPI.UPDATE(comicId), data, {
            headers: {
                token: `Bearer ${user?.accessToken}`,
            },
        })).data;
    },


};