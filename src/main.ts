import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import 'element-plus/theme-chalk/display.css';

import './assets/main.css';
import App from '@/App.vue';
import router from '@/router';
import { useAuthStore } from '@/stores/useAuthStore';
import { path } from '@/constants';

const app = createApp(App);

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    const login = authStore.isLoggedIn;
    const isAdmin = authStore.userInfo?.admin;
    if (to.matched.some((record) => record.meta.requiresAuth) && !login) {
        next({ path: path.LOGIN });
    } else if (!login && to.matched.some((record) => record.meta.adminRole) ) {
        next({path: path.LOGIN})
    }
    else if (login && !isAdmin && to.matched.some((record) => record.meta.adminRole)) {
        switch (to.name) {
            case 'manage-account' || 'manage-comic':
                next({ path: path.NOT_FOUND });
                break;
            default:
                next();
                break;
        }
    } else if (login) {
        switch (to.name) {
            case 'login' || 'register':
                next({ path: path.HOME });
                break;
            default:
                next();
                break;
        }
    } else {
        next();
    }
});

app.use(ElementPlus);
app.use(createPinia());
app.use(router);

app.mount('#app');
