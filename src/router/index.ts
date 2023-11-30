import { createRouter, createWebHistory } from 'vue-router';
import { path } from '@/constants';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: () => import('@/layouts/DefaultLayout.vue'),
            children: [
                {
                    path: path.HOME,
                    component: () => import('@/views/HomeView.vue'),
                    name: 'home',
                    meta: {
                        adminRole: false,
                        requiresAuth: false,
                    },
                },
                {
                    path: path.HOT,
                    component: () => import('@/views/HotView.vue'),
                    name: 'hot',
                    meta: {
                        adminRole: false,
                        requiresAuth: false,
                    },
                },
                {
                    path: path.LOGIN,
                    component: () => import('@/views/LoginView.vue'),
                    name: 'login',
                    meta: {
                        adminRole: false,
                        requiresAuth: false,
                    },
                },
                {
                    path: path.REGISTER,
                    component: () => import('@/views/RegisterView.vue'),
                    name: 'register',
                    meta: {
                        adminRole: false,
                        requiresAuth: false,
                    },
                },
                {
                    path: path.COMIC_DETAIL(':slug'),
                    component: () => import('@/views/ComicDetailView.vue'),
                    name: 'comic-detail',
                    meta: {
                        adminRole: false,
                        requiresAuth: false,
                    },
                },
                {
                    path: path.POSTED_COMIC,
                    component: () => import('@/views/PostedComicView.vue'),
                    name: 'posted-comic',
                    meta: {
                        adminRole: false,
                        requiresAuth: true,
                    },
                },
                {
                    path: path.FOLLOWING,
                    component: () => import('@/views/FollowingView.vue'),
                    name: 'following',
                    meta: {
                        adminRole: false,
                        requiresAuth: true,
                    },
                },
                {
                    path: path.PROFILE,
                    component: () => import('@/views/ProfileView.vue'),
                    name: 'profile',
                    meta: {
                        adminRole: false,
                        requiresAuth: true,
                    },
                },
                {
                    path: path.SEARCH(':searchText'),
                    component: () => import('@/views/SearchView.vue'),
                    name: 'search',
                    meta: {
                        adminRole: false,
                        requiredAuth: false,
                    },
                },
                {
                    path: path.MANAGE_ACCOUNT,
                    component: () => import('@/views/ManageAccount.vue'),
                    name: 'manage-account',
                    meta: {
                        adminRole: true,
                        requiredAuth: true,
                    },
                },
                {
                    path: path.MANAGE_COMIC,
                    component: () => import('@/views/ManageComic.vue'),
                    name: 'manage-comic',
                    meta: {
                        adminRole: true,
                        requiredAuth: true,
                    },
                },
                {
                    path: path.NOT_FOUND,
                    component: () => import('@/views/NotFoundView.vue'),
                    name: 'not-found',
                    meta: {
                        adminRole: false,
                        requiredAuth: false,
                    },
                },
            ],
        },
        {
            path: '/',
            component: () => import('@/layouts/NavLayout.vue'),
            children: [
                {
                    path: path.CATEGORY,
                    component: () => import('@/views/CategoryView.vue'),
                    name: 'category',
                    meta: {
                        adminRole: false,
                        requiresAuth: false,
                    },
                },
                {
                    path: path.CATEGORY_DETAIL(':category'),
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
            path: '/',
            component: () => import('@/layouts/ChapterLayout.vue'),
            children: [
                {
                    path: path.CHAPTER(':slug', ':titleChapter'),
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
