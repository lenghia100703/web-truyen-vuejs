<template>
    <el-header id="header">
        <div class="header-content">
            <el-menu class="menu" mode="horizontal" :ellipsis="false" background-color="#fff" menu-trigger="click">
                <el-menu-item class="no-hover logo" index="0">
                    <router-link to="/"> Web Truyen</router-link>
                </el-menu-item>
                <el-menu-item class="no-hover hidden-sm-and-down" index="1">
                    <router-link to="/hot">HOT</router-link>
                </el-menu-item>
                <el-menu-item class="no-hover hidden-sm-and-down" index="2">
                    <router-link to="/theo-doi">Theo dõi</router-link>
                </el-menu-item>

                <el-sub-menu class="no-hover hidden-sm-and-down" index="3">
                    <template #title>Thể loại</template>
                    <el-menu-item class="no-hover"><a href="/the-loai/tat-ca">Tất cả</a></el-menu-item>
                    <el-menu-item class="no-hover" v-for="(value, index) in category" :key="index">
                        <a :href="`/the-loai/${value.name.toLowerCase()}`">{{ value.name }}</a>
                    </el-menu-item>
                </el-sub-menu>
                <div class="flex-grow"></div>
                <el-menu-item class="no-hover hidden-sm-and-down">
                    <SearchInput />
                </el-menu-item>

                <el-menu-item class="no-hover hidden-sm-and-down" v-if="login">
                    <el-dropdown>
                        <span class="name-user">
                            <el-avatar :src="user?.avatar" />
                            <span class="avatar">{{ user?.username }}</span>
                        </span>

                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item>
                                    <router-link to="/ho-so">Hồ sơ cá nhân</router-link>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <router-link to="/theo-doi">Truyện đã theo dõi</router-link>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <router-link to="/truyen-da-dang">Truyện đã đăng</router-link>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <span @click="() => handleLogout(user)">Đăng xuất</span>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </el-menu-item>
                <el-menu-item v-else class="no-hover hidden-sm-and-down">
                    <el-menu-item class="no-hover" index="5">
                        <el-button type="primary" plain @click="handleChangeSignUpPage"> Đăng ký </el-button>
                    </el-menu-item>
                    <el-menu-item class="no-hover" index="6">
                        <el-button type="primary" @click="handleChangeSignInPage"> Đăng nhập </el-button>
                    </el-menu-item>
                </el-menu-item>

                <el-menu-item class="no-hover hidden-md-and-up">
                    <el-button size="large" @click="handleCollapse">
                        <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ea893728="" class="icon">
                            <path
                                fill="currentColor"
                                d="M176 416a112 112 0 1 0 0 224 112 112 0 0 0 0-224m0 64a48 48 0 1 1 0 96 48 48 0 0 1 0-96zm336-64a112 112 0 1 1 0 224 112 112 0 0 1 0-224zm0 64a48 48 0 1 0 0 96 48 48 0 0 0 0-96zm336-64a112 112 0 1 1 0 224 112 112 0 0 1 0-224zm0 64a48 48 0 1 0 0 96 48 48 0 0 0 0-96z"
                            ></path>
                        </svg>
                    </el-button>
                </el-menu-item>

                <div class="collapse" v-if="isCollapse">
                    <el-menu mode="vertical" :ellipsis="false" background-color="#f8f9fa" menu-trigger="click">
                        <el-menu-item class="no-hover">
                            <SearchInput />
                        </el-menu-item>
                        <el-menu-item class="no-hover" index="1">
                            <router-link to="/hot">HOT</router-link>
                        </el-menu-item>
                        <el-menu-item class="no-hover" index="2">
                            <router-link to="/theo-doi">Theo dõi</router-link>
                        </el-menu-item>

                        <el-sub-menu class="no-hover category" index="3">
                            <template #title>Thể loại</template>
                            <el-menu-item class="no-hover"><a href="/the-loai/tat-ca">Tất cả</a></el-menu-item>
                            <el-menu-item class="no-hover" v-for="(value, index) in category" :key="index">
                                <a :href="`/the-loai/${value.name.toLowerCase()}`">{{ value.name }}</a>
                            </el-menu-item>
                        </el-sub-menu>

                        <el-menu-item class="no-hover" v-if="login">
                            <el-dropdown>
                                <span class="name-user">
                                    <el-avatar :src="user?.avatar" />
                                    <span class="avatar">{{ user?.username }}</span>
                                </span>

                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item>
                                            <router-link to="/ho-so">Hồ sơ cá nhân</router-link>
                                        </el-dropdown-item>
                                        <el-dropdown-item>
                                            <router-link to="/theo-doi">Truyện đã theo dõi</router-link>
                                        </el-dropdown-item>
                                        <el-dropdown-item>
                                            <router-link to="/truyen-da-dang">Truyện đã đăng</router-link>
                                        </el-dropdown-item>
                                        <el-dropdown-item>
                                            <span @click="() => handleLogout(user)">Đăng xuất</span>
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>
                        </el-menu-item>

                        <el-menu-item class="no-hover" index="5">
                            <el-button type="primary" link @click="handleChangeSignUpPage"> Đăng ký </el-button>
                        </el-menu-item>
                        <el-menu-item class="no-hover" index="6">
                            <el-button type="primary" link @click="handleChangeSignInPage"> Đăng nhập </el-button>
                        </el-menu-item>
                    </el-menu>
                </div>
            </el-menu>
        </div>
    </el-header>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import SearchInput from '@/components/SearchInput.vue';
import { useAuthStore } from '@/stores/useAuthStore';
import router from '@/router';
import { loadingFullScreen } from '@/utils/loadingFullScreen';
import useCategoryStore from '@/stores/useCategoryStore';
import { createAxiosJwt } from '@/utils/createInstance';
import type { UserInfo } from '@/interfaces';

const authStore = useAuthStore();
const categoryStore = useCategoryStore();
const user = computed(() => authStore.userInfo);
const login = computed(() => authStore.isLoggedIn);
const httpJwt = createAxiosJwt(authStore.userInfo);
const isCollapse = ref<boolean>(false);

const handleCollapse = () => {
    isCollapse.value = !isCollapse.value;
};

const handleLogout = (user: UserInfo | null) => {
    if (user !== null) {
        loadingFullScreen();
        authStore.logout(user, httpJwt);
        router.push({ name: 'login' });
    }
};

const handleChangeSignInPage = () => {
    router.push({ name: 'login' });
};

const handleChangeSignUpPage = () => {
    router.push({ name: 'register' });
};

onMounted(() => {
    categoryStore.getAllCategory();
});

const category = computed(() => categoryStore.categories);
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
