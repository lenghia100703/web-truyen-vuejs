import { http } from '@/utils/http';
import { AuthAPI } from '@/api/AuthAPI';

export const AuthServices = {
    login: async (user: any) => {
        return (await http.post(AuthAPI.LOGIN, user)).data;
    },

    logout: async (user: any, httpJwt: any) => {
        await httpJwt.post(AuthAPI.LOGOUT, user?._id, {
            headers: {
                token: `Bearer ${user?.accessToken}`,
            },
        });
    },

    register: async (user: any) => {
        return (await http.post(AuthAPI.REGISTER, user)).data;
    },

    refreshToken: async () => {
        return (await http.post(AuthAPI.REFRESH_TOKEN, {})).data;
    },
};
