import { defineStore } from 'pinia';
import { AuthServices } from '@/services/auth/AuthServices';
import type { UserInfo } from '@/interfaces';
import router from '@/router';
import { ElMessage } from 'element-plus';

interface AuthState {
    isLoggedIn: boolean;
    userInfo: UserInfo | any;
}

const loggedInData = localStorage.getItem('isLoggedIn');
const userInfoData = localStorage.getItem('userInfo');

const isLoggedIn: boolean = loggedInData ? JSON.parse(loggedInData) : false;
const userInfo: UserInfo | any = userInfoData ? JSON.parse(userInfoData) : null;

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
                ElMessage({
                    type: 'success',
                    message: 'Đăng nhập thành công.'
                })
                await router.push({ name: 'home' })
            } catch (error) {
                ElMessage.error('Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin đăng nhập.');
                console.error('Login failed:' + error);
            }
        },

        logout(user: any, httpJwt: any) {
            AuthServices.logout(user, httpJwt)
                .then(() => {
                    this.isLoggedIn = false;
                    this.userInfo = null;
                    localStorage.removeItem('isLoggedIn');
                    localStorage.removeItem('userInfo');
                    console.log('logout successful');
                    ElMessage({
                        type: 'success',
                        message: 'Đăng xuất thành công.'
                    })
                })
                .catch((error) => {
                    console.error('Fail ' + error);
                    ElMessage.error('Đăng xuất không thành công. Vui lòng thử lại.');
                });
        },
    },
});
