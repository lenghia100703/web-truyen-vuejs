import { defineStore } from 'pinia';
import axios from 'axios';


export interface UserInfo {
    _id: string;
    admin: boolean;
    username: string;
    accessToken: string;
    refreshToken: string;
    followComic: string[];
    address: string;
    avatar: string;
    phone: string;
    email: string;
}

interface AuthState {
    isLoggedIn: boolean;
    userInfo: UserInfo | null;
} 

const loggedInData = localStorage.getItem('isLoggedIn');
const userInfoData = localStorage.getItem('userInfo');


const isLoggedIn: boolean = loggedInData ? JSON.parse(loggedInData) : false;
const userInfo: UserInfo | null = userInfoData ? JSON.parse(userInfoData) : null;

export const useAuthStore = defineStore({
    id: 'auth',
    state: (): AuthState => ({
        isLoggedIn: isLoggedIn,
        userInfo: userInfo,
    }),
    actions: {
        async login(user: any) {
            try {
                const res = await axios.post('/auth/login', user);
                this.isLoggedIn = true;
                this.userInfo = res.data;
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userInfo', JSON.stringify(res.data));
                console.log('login successful');
            } catch (error) {
                console.error('Login failed:' + error);
            }
        },

        async logout(user: UserInfo) {
            try {
                await axios.post('/auth/logout', user._id, {
                    headers: {
                        token: `Bearer ${user.accessToken}`,
                    },
                });
                this.isLoggedIn = false;
                this.userInfo = null;
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userInfo');
                console.log('logout successful');
            } catch (error) {
                console.error('Logout failed:' + error);
            }
        },
    },
});
