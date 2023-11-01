import { http } from '@/utils/http';
import { UserAPI } from '@/api/UserAPI';

export const UserServices = {
    getAll: async (user: any) => {
        return (await http.get(UserAPI.LIST, {
            headers: {
                token: `Bearer ${user.accessToken}`,
            },
        })).data;
    },

    getUserById: async (user: any) => {
        return (await http.get(UserAPI.USER_BY_ID(user._id), {
            headers: {
                token: `Bearer ${user.accessToken}`,
            },
        })).data;
    },

    update: async (user: any, data: any, httpJwt: any) => {
        await httpJwt.put(UserAPI.UPDATE(user._id), data, {
            headers: {
                token: `Bearer ${user.accessToken}`,
            },
        });
    },

    follow: async (comicId: any, user: any, httpJwt: any) => {
        await httpJwt.put(UserAPI.FOLLOW_COMIC(comicId), {}, {
            headers: {
                token: `Bearer ${user.accessToken}`,
            },
        });
    },

    unFollow: async (comicId: any, user: any, httpJwt: any) => {
        await httpJwt.put(UserAPI.UNFOLLOW_COMIC(comicId), {}, {
            headers: {
                token: `Bearer ${user.accessToken}`,
            },
        });
    },
};