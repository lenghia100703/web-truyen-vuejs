<script setup lang='ts'>
    import { ref } from 'vue';
    import type { UserInfo } from '@/interfaces';
    import { loadingFullScreen } from '@/utils/loadingFullScreen';
    import router from '@/router';
    import { createAxiosJwt } from '@/utils/createInstance';
    import { useAuthStore } from '@/stores/useAuthStore';

    const visible = ref<boolean>(false)
    const userInfo = ref<any>()
    const authStore = useAuthStore()
    const httpJwt = createAxiosJwt(authStore.userInfo)

    const handleLogout = (user: UserInfo | null) => {
        if (user !== null) {
            loadingFullScreen('Đang xử lý');
            visible.value = false
            authStore.logout(user.value, httpJwt);
            router.push({ name: 'login' });
        }
    };

    const handleRoute = (path: any) => {
        visible.value = false
        router.push(path)
    }

     function openDrawer(user: any) {
         visible.value = true
         userInfo.value = user
    }

    defineExpose({
        openDrawer
    })
</script>

<template>
    <el-drawer v-model="visible" title="I am the title" :with-header="false" size='50%'>
        <div class='name-user'>
            <el-avatar :src='userInfo?.avatar' class='avatar-image' />
            <span class='avatar'>{{userInfo?.username }}</span>
        </div>
        <el-menu mode='vertical'>
            <el-menu-item @click='handleRoute("/ho-so")'>
                Hồ sơ cá nhân
            </el-menu-item>
            <el-menu-item @click='handleRoute("/theo-doi")'>
                Truyện đã theo dõi
            </el-menu-item>
            <el-menu-item @click='handleRoute("/truyen-da-dang")'>
                Truyện đã đăng
            </el-menu-item>
            <el-menu-item @click='() => handleLogout(userInfo)'>
                Đăng xuất
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