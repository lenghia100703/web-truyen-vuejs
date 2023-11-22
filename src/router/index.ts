import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: () => import('@/layouts/DefaultLayout.vue'),
            children: [
                {
                    path: '',
                    component: () => import('@/views/HomeView.vue'),
                    name: 'home',
                    meta: {
                        adminRole: false,
                        requiresAuth: false,
                    },
                },
                {
                    path: 'hot',
                    component: () => import('@/views/HotView.vue'),
                    name: 'hot',
                    meta: {
                        adminRole: false,
                        requiresAuth: false,
                    },
                },
                {
                    path: 'dang-nhap',
                    component: () => import('@/views/LoginView.vue'),
                    name: 'login',
                    meta: {
                        adminRole: false,
                        requiresAuth: false,
                    },
                },
                {
                    path: 'dang-ky',
                    component: () => import('@/views/RegisterView.vue'),
                    name: 'register',
                    meta: {
                        adminRole: false,
                        requiresAuth: false,
                    },
                },
                {
                    path: 'truyen-tranh/:slug',
                    component: () => import('@/views/ComicDetailView.vue'),
                    name: 'comic-detail',
                    meta: {
                        adminRole: false,
                        requiresAuth: false,
                    },
                },
                {
                    path: 'truyen-da-dang',
                    component: () => import('@/views/PostedComicView.vue'),
                    name: 'posted-comic',
                    meta: {
                        adminRole: false,
                        requiresAuth: true,
                    },
                },
                {
                    path: 'theo-doi',
                    component: () => import('@/views/FollowingView.vue'),
                    name: 'following',
                    meta: {
                        adminRole: false,
                        requiresAuth: true,
                    },
                },
                {
                    path: 'ho-so',
                    component: () => import('@/views/ProfileView.vue'),
                    name: 'profile',
                    meta: {
                        adminRole: false,
                        requiresAuth: true,
                    },
                },
                {
                    path: 'tim-truyen/:searchText',
                    component: () => import('@/views/SearchView.vue'),
                    name: 'search',
                    meta: {
                        adminRole: false,
                        requiredAuth: false,
                    },
                },
                {
                    path: 'quan-ly/tai-khoan',
                    component: () => import('@/views/ManageAccount.vue'),
                    name: 'manage-account',
                    meta: {
                        adminRole: true,
                        requiredAuth: true,
                    },
                },
                {
                    path: 'quan-ly/truyen-tranh',
                    component: () => import('@/views/ManageComic.vue'),
                    name: 'manage-comic',
                    meta: {
                        adminRole: true,
                        requiredAuth: true,
                    },
                },
                {
                    path: 'khong-tim-thay',
                    component: () => import('@/views/NotFoundView.vue'),
                    name: 'not-found',
                    meta: {
                        adminRole: false,
                        requiredAuth: false,
                    },
                }
            ],
        },
        {
            path: '/the-loai/truyen-tranh/tat-ca',
            component: () => import('@/layouts/NavLayout.vue'),
            children: [
                {
                    path: '',
                    component: () => import('@/views/CategoryView.vue'),
                    name: 'category',
                    meta: {
                        adminRole: false,
                        requiresAuth: false,
                    },
                },

            ],
        },
        {
            path: '/the-loai/truyen-tranh/:category',
            component: () => import('@/layouts/NavLayout.vue'),
            children: [
                {
                    path: '',
                    component: () => import('@/views/CategoryDetailView.vue'),
                    name: 'category-detail',
                    meta: {
                        adminRole: false,
                        requiresAuth: false,
                    },
                },

            ],
        },
        {
            path: '/truyen-tranh/:slug/:titleChapter',
            component: () => import('@/layouts/ChapterLayout.vue'),
            children: [
                {
                    path: '',
                    component: () => import('@/views/ChapterView.vue'),
                    name: 'chapter',
                    meta: {
                        adminRole: false,
                        requiresAuth: false,
                    },
                },
            ],
        },
    ],
});

export default router;
