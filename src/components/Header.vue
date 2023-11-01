<template>
    <el-header id='header'>
        <div class='header-content'>
            <el-menu class='menu' mode='horizontal' :ellipsis='false' background-color='#fff' menu-trigger='click'>
                <el-menu-item class='no-hover logo' index='0'>
                    <router-link to='/'> Web Truyen</router-link>
                </el-menu-item>
                <el-menu-item class='no-hover' index='1'>
                    <router-link to='/hot'>HOT</router-link>
                </el-menu-item>
                <el-menu-item class='no-hover' index='2'>
                    <router-link to='/theo-doi'>Theo dõi</router-link>
                </el-menu-item>

                <el-sub-menu class='no-hover' index='3'>
                    <template #title>Thể loại</template>
                    <el-menu-item class='no-hover'><a href='/the-loai/tat-ca'>Tất cả</a></el-menu-item>
                    <el-menu-item class='no-hover' v-for='(value, index) in category' :key='index'>
                        <a :href='`/the-loai/${value.name.toLowerCase()}`'>{{ value.name }}</a>
                    </el-menu-item>
                </el-sub-menu>
                <div class='flex-grow'></div>
                <el-menu-item class='no-hover'>
                    <SearchInput />
                </el-menu-item>

                <el-menu-item class='no-hover' v-if='login'>
                    <el-dropdown>
                        <span class='name-user'>
                            <el-avatar :src='user?.avatar' />
                            <span class='avatar'>{{ user?.username }}</span>
                        </span>

                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item>
                                    <router-link to='/ho-so'>Hồ sơ cá nhân</router-link>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <router-link to='/theo-doi'>Truyện đã theo dõi</router-link>
                                </el-dropdown-item>
                                <el-dropdown-item
                                >
                                    <router-link to='/truyen-da-dang'>Truyện đã đăng</router-link>
                                </el-dropdown-item
                                >
                                <el-dropdown-item>
                                    <span @click='() => handleLogout(user)'>Đăng xuất</span>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </el-menu-item>
                <el-menu-item v-else class='no-hover'>
                    <el-menu-item class='no-hover' index='5'>
                        <el-button type='primary' plain>
                            <router-link to='/dang-ky'>Đăng ký</router-link>
                        </el-button>
                    </el-menu-item>
                    <el-menu-item class='no-hover' index='6'>
                        <el-button type='primary'>
                            <router-link to='/dang-nhap'>Đăng nhập</router-link>
                        </el-button>
                    </el-menu-item>
                </el-menu-item>
            </el-menu>
        </div>
    </el-header>
</template>

<script lang='ts' setup>
import { computed, onMounted } from 'vue';
import SearchInput from '@/components/SearchInput.vue';
import { useAuthStore, type UserInfo } from '@/stores/useAuthStore';
import router from '@/router';
import { loadingFullScreen } from '@/utils/loadingFullScreen';
import useCategoryStore from '@/stores/useCategoryStore';
import { createAxiosJwt } from '@/utils/createInstance';

const authStore = useAuthStore();
const categoryStore = useCategoryStore();
const user = computed(() => authStore.userInfo);
const login = computed(() => authStore.isLoggedIn);
const httpJwt = createAxiosJwt(authStore.userInfo);

const handleLogout = (user: UserInfo | null) => {
    if (user !== null) {
        loadingFullScreen();
        authStore.logout(user, httpJwt);
        router.push({ name: 'login' });
    }
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
</style>
