import { defineStore } from 'pinia';
import { AuthServices } from '@/services/auth/AuthServices';
import type { UserInfo } from '@/interfaces';

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
                this.userInfo = await AuthServices.login(user);
                this.isLoggedIn = true;
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userInfo', JSON.stringify(this.userInfo));
                console.log('login successful');
            } catch (error) {
                console.error('Login failed:' + error);
            }
        },

        logout(user: any, httpJwt: any) {
            AuthServices.logout(user, httpJwt)
                .then((res) => {
                    this.isLoggedIn = false;
                    this.userInfo = null;
                    localStorage.removeItem('isLoggedIn');
                    localStorage.removeItem('userInfo');
                    console.log('logout successful');
                })
                .catch((error) => {
                    console.error('Fail ' + error);
                });
        },
    },
});
