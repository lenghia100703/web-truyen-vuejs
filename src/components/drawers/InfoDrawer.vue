<script setup lang='ts'>
import { ref } from 'vue';
import type { UserInfo } from '@/interfaces';
import { loadingFullScreen } from '@/utils/loadingFullScreen';
import router from '@/router';
import { createAxiosJwt } from '@/utils/createInstance';
import { useAuthStore } from '@/stores/useAuthStore';
import { path } from '@/constants';
import SearchInput from '@/components/SearchInput.vue';

const visible = ref<boolean>(false);
const userInfo = ref<any>();
const authStore = useAuthStore();
const httpJwt = createAxiosJwt(authStore.userInfo);

const handleLogout = (user: UserInfo | null) => {
    if (user !== null) {
        loadingFullScreen('Đang xử lý');
        visible.value = false;
        authStore.logout(user, httpJwt);
        router.push({ name: 'login' });
    }
};

const handleRoute = (path: any) => {
    visible.value = false;
    router.push(`/${path}`);
};

function openDrawer(user: any) {
    visible.value = true;
    userInfo.value = user;
}

defineExpose({
    openDrawer,
});
</script>

<template>
    <el-drawer v-model='visible' title='I am the title' :with-header='false' size='80%'>
        <div class='name-user'>
            <el-avatar :src='userInfo?.avatar' class='avatar-image' />
            <span class='avatar'>{{ userInfo?.username }}</span>
        </div>
        <el-menu mode='vertical'>
            <el-menu-item class='no-hover'>
                <SearchInput />
            </el-menu-item>
            <el-menu-item @click='handleRoute(path.PROFILE)' index='1'>
                Hồ sơ cá nhân
            </el-menu-item>
            <el-sub-menu class='no-hover category' index='2'>
                <template #title>Thể loại</template>
                <el-menu-item class='no-hover' index='2-1'
                              @click='handleRoute(path.CATEGORY)'>Tất cả
                </el-menu-item>
                <el-menu-item class='no-hover' index='2-2'
                              @click='handleRoute(path.CATEGORY_DETAIL("manga"))'>
                    Manga
                </el-menu-item>
                <el-menu-item class='no-hover' index='2-3'
                              @click='handleRoute(path.CATEGORY_DETAIL("manhua"))'>
                    Manhua
                </el-menu-item>
                <el-menu-item class='no-hover' index='2-4'
                              @click='handleRoute(path.CATEGORY_DETAIL("manhwa"))'>
                    Manhwa
                </el-menu-item>
            </el-sub-menu>
            <template v-if='!authStore.userInfo?.admin'>
                <el-menu-item @click='handleRoute(path.FOLLOWING)' index='3'>
                    Truyện đã theo dõi
                </el-menu-item>
                <el-menu-item @click='handleRoute(path.POSTED_COMIC)' index='4'>
                    Truyện đã đăng
                </el-menu-item>
            </template>
            <template v-else>
                <el-menu-item @click='handleRoute(path.MANAGE_ACCOUNT)' index='5'>
                    Quản lý người dùng
                </el-menu-item>
                <el-menu-item @click='handleRoute(path.MANAGE_COMIC)' index='6'>
                    Quản lý truyện
                </el-menu-item>
            </template>
            <el-menu-item @click='() => handleLogout(userInfo)'>
                Đăng xuất
            </el-menu-item>
            <el-menu-item @click='visible = false'>
                Đóng
            </el-menu-item>
        </el-menu>
    </el-drawer>
</template>

<style scoped>
.el-menu {
    border: none;
}

.name-user {
    display: flex;
    align-items: center;
    padding: 10px 20px;
}

.avatar {
    margin-left: 8px;
}
</style>