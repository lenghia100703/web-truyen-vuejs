import { UserAPI } from '@/api/UserAPI';
import { useAuthStore } from '@/stores/useAuthStore';
import { refreshToken } from '@/utils/createInstance';

const authStore = useAuthStore();

export const UserServices = {
    getAll: async (user: any, page: any, httpJwt: any) => {
        return (
            await httpJwt.get(UserAPI.LIST(page), {
                headers: {
                    token: `Bearer ${user.accessToken}`,
                },
            })
        ).data;
    },

    getUserById: async (user: any, userId: string, httpJwt: any) => {
        return (
            await httpJwt.get(UserAPI.USER_BY_ID(userId), {
                headers: {
                    token: `Bearer ${user.accessToken}`,
                },
            })
        ).data;
    },

    update: async (user: any, userId: any, data: any, httpJwt: any) => {
        const res = await httpJwt.put(UserAPI.UPDATE(userId), data, {
            headers: {
                token: `Bearer ${<string>user.accessToken}`,
            },
        });
        return res.data;
    },

    delete: async (user: any, userId: any, httpJwt: any) => {
        await httpJwt.delete(UserAPI.DELETE(userId), {
            headers: {
                token: `Bearer ${user.accessToken}`,
            },
        });
    },

    follow: async (comicId: any, user: any, httpJwt: any) => {
        const res = (
            await httpJwt.put(
                UserAPI.FOLLOW_COMIC(comicId),
                {},
                {
                    headers: {
                        token: `Bearer ${user.accessToken}`,
                    },
                },
            )
        ).data;

        const updatedUser = res.updatedUser;
        const data = await refreshToken();
        const newUser = {
            ...updatedUser,
            accessToken: data.accessToken,
        };
        authStore.userInfo = newUser;
        localStorage.setItem('userInfo', JSON.stringify(newUser));
        return res;
    },

    unFollow: async (comicId: any, user: any, httpJwt: any) => {
        const res = (
            await httpJwt.put(
                UserAPI.UNFOLLOW_COMIC(comicId),
                {},
                {
                    headers: {
                        token: `Bearer ${user.accessToken}`,
                    },
                },
            )
        ).data;
        const updatedUser = res.updatedUser;

        const data = await refreshToken();
        const newUser = {
            ...updatedUser,
            accessToken: data.accessToken,
        };
        authStore.userInfo = newUser;
        localStorage.setItem('userInfo', JSON.stringify(newUser));
        return res;
    },
};
