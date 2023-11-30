<template>
    <el-header id="header" class="hidden-sm-and-down">
        <div class="header-content">
            <el-menu class="menu" mode="horizontal" :ellipsis="false" background-color="#fff" menu-trigger="click">
                <el-menu-item class="no-hover logo" index="1" @click="handleRoute(path.HOME)"> Web Truyen </el-menu-item>
                <el-menu-item class="no-hover" index="2" @click="handleRoute(path.HOT)"> HOT </el-menu-item>
                <el-menu-item class="no-hover" index="3" @click="handleRoute(path.FOLLOWING)"> Theo dõi </el-menu-item>

                <el-sub-menu class="no-hover" index="4">
                    <template #title>Thể loại</template>
                    <el-menu-item index="4-1" @click="handleRoute(path.CATEGORY)">
                        Tất cả
                    </el-menu-item>
                    <el-menu-item index="4-2" @click="handleRoute(path.CATEGORY_DETAIL('manga'))">
                        Manga
                    </el-menu-item>
                    <el-menu-item index="4-3" @click="handleRoute(path.CATEGORY_DETAIL('manhua'))">
                        Manhua
                    </el-menu-item>
                    <el-menu-item index="4-4" @click="handleRoute(path.CATEGORY_DETAIL('manhwa'))">
                        Manhwa
                    </el-menu-item>
                </el-sub-menu>
                <div class="flex-grow"></div>
                <el-menu-item class="no-hover">
                    <SearchInput />
                </el-menu-item>

                <el-menu-item class="no-hover" v-if="login">
                    <el-dropdown>
                        <span class="name-user">
                            <el-avatar :src="user?.avatar" />
                            <span class="avatar">{{ user?.username }}</span>
                        </span>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item @click="handleRoute(path.PROFILE)"> Hồ sơ cá nhân </el-dropdown-item>
                                <el-dropdown-item @click="handleRoute(path.FOLLOWING)">
                                    Truyện đã theo dõi
                                </el-dropdown-item>
                                <el-dropdown-item @click="handleRoute(path.POSTED_COMIC)">
                                    Truyện đã đăng
                                </el-dropdown-item>
                                <el-dropdown-item @click="() => handleLogout(user)"> Đăng xuất </el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </el-menu-item>

                <template v-else>
                    <el-menu-item class="no-hover">
                        <el-button type="primary" plain @click="handleRoute(path.REGISTER)"> Đăng ký</el-button>
                    </el-menu-item>
                    <el-menu-item class="no-hover">
                        <el-button type="primary" @click="handleRoute(path.LOGIN)"> Đăng nhập</el-button>
                    </el-menu-item>
                </template>
            </el-menu>
        </div>
    </el-header>

    <HeaderAdmin v-if="user?.admin" />

    <HeaderMobile />
</template>

<script lang="ts" setup>
import { computed, watch } from 'vue';
import SearchInput from '@/components/SearchInput.vue';
import { useAuthStore } from '@/stores/useAuthStore';
import router from '@/router';
import { loadingFullScreen } from '@/utils/loadingFullScreen';
import { createAxiosJwt } from '@/utils/createInstance';
import type { UserInfo } from '@/interfaces';
import HeaderMobile from '@/components/HeaderMobile.vue';
import HeaderAdmin from '@/components/HeaderAdmin.vue';
import { path } from '@/constants';

const authStore = useAuthStore();
const user = computed(() => authStore.userInfo);
const login = computed(() => authStore.isLoggedIn);
const httpJwt = createAxiosJwt(authStore.userInfo);

const handleRoute = (path: any) => {
    router.push(`/${path}`);
};

const handleLogout = (user: UserInfo | null) => {
    if (user !== null) {
        loadingFullScreen('Đang xử lý');
        authStore.logout(user, httpJwt);
        router.push({ name: 'login' });
    }
};
</script>

<style scoped>
#header {
    position: fixed;
    width: 100%;
    z-index: 12;
    transition: background-color 0.3s;
}

.menu {
    background-color: #fff;
}

.logo {
    font-size: 20px;
    font-weight: 500;
}

.avatar {
    margin-left: 8px;
}

.flex-grow {
    flex-grow: 1;
}

.no-hover:hover {
    color: inherit !important;
    background-color: transparent !important;
}

.name-user {
    display: flex;
    align-items: center;
}

.icon {
    width: 20px;
}

.collapse {
    position: absolute;
    top: 60px;
    width: 100%;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.collapse-enter-active,
.collapse-leave-active {
    transition: all 0.3s ease-in-out;
}

.collapse-enter-from,
.collapse-leave-to {
    transform: translateY(-30px);
    opacity: 0;
}

.menu-bar {
    border-radius: 8px;
}

.avatar-image {
    width: 30px;
    height: 30px;
}

.category {
    width: 106px;
}

@media screen and (max-width: 768px) {
    .el-header {
        padding: 0;
    }

    #header {
        background-color: #fff;
    }

    .menu {
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
}
</style>
