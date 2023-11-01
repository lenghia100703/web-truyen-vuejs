import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css';
import axios from 'axios'

import App from '@/App.vue'
import router from '@/router'
import { useAuthStore } from '@/stores/useAuthStore'

const app = createApp(App)

axios.defaults.baseURL = 'http://localhost:8888/v1';
axios.defaults.withCredentials = true;

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    const login = authStore.isLoggedIn;
    if (to.matched.some((record) => record.meta.requiresAuth) && !login) {
        next({ path: '/dang-nhap' });
    } else if (login) {
        switch (to.name) {
            case 'login' || 'register':
                next({ path: '/' });
                break;
            default:
                next();
                break;
        }
    } else {
        next();
    }
});



app.use(ElementPlus)
app.use(createPinia())
app.use(router)

app.mount('#app')
