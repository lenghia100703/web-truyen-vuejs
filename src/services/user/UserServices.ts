import { http } from '@/utils/http';
import { UserAPI } from '@/api/UserAPI';
import { useAuthStore } from '@/stores/useAuthStore';
import { refreshToken } from '@/utils/createInstance';

const authStore = useAuthStore();

export const UserServices = {
    getAll: async (user: any, httpJwt: any) => {
        return (
            await httpJwt.get(UserAPI.LIST, {
                headers: {
                    token: `Bearer ${user.accessToken}`,
                },
            })
        ).data;
    },

    getUserById: async (user: any) => {
        return (
            await http.get(UserAPI.USER_BY_ID(user._id), {
                headers: {
                    token: `Bearer ${user.accessToken}`,
                },
            })
        ).data;
    },

    update: async (user: any, data: any, httpJwt: any) => {
        await httpJwt.put(UserAPI.UPDATE(user._id), data, {
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

        const updatedUser = res.updatedUser
        console.log(res)
        const data = await refreshToken();
        const newUser = {
            ...updatedUser,
            accessToken: data.accessToken,
        };
        authStore.userInfo = newUser;
        localStorage.setItem('userInfo', JSON.stringify(newUser));
        return res
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
        const updatedUser = res.updatedUser

        const data = await refreshToken();
        const newUser = {
            ...updatedUser,
            accessToken: data.accessToken,
        };
        authStore.userInfo = newUser;
        localStorage.setItem('userInfo', JSON.stringify(newUser));
        return res
    },
};
