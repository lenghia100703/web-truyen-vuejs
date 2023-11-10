import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { useAuthStore } from '@/stores/useAuthStore';
import { http } from '@/utils/http';
import type { UserInfo } from '@/interfaces';

const authStore = useAuthStore();

export const refreshToken = async () => {
    try {
        const res = await http.post(
            '/auth/refresh',
            {},
            {
                withCredentials: true,
            },
        );
        return res.data;
    } catch (err) {
        console.log(err);
    }
};

interface Token {
    _id: string;
    admin: boolean;
    iat: number;
    exp: number;
}

export const createAxiosJwt = (user: UserInfo | null) => {
    const newInstance = axios.create({
        withCredentials: true,
        baseURL: 'http://localhost:8888/v1',
    });

    if (user !== null) {
        newInstance.interceptors.request.use(
            async (config) => {
                let date = new Date();
                const decodeToken: Token = jwt_decode(user?.accessToken);
                if (decodeToken.exp < date.getTime() / 1000) {
                    const data = await refreshToken();
                    const refreshUser = {
                        ...user,
                        accessToken: data?.accessToken,
                    };
                    authStore.userInfo = refreshUser;
                    localStorage.setItem('userInfo', JSON.stringify(refreshUser));
                    console.log('relogin successful');
                    config.headers['token'] = 'Bearer ' + data?.accessToken;
                }
                return config;
            },
            (err) => {
                return Promise.reject(err);
            },
        );
    }
    return newInstance;
};
