<script lang='ts' setup>
import { computed, ref } from 'vue';
import SearchInput from '@/components/SearchInput.vue';
import { useAuthStore } from '@/stores/useAuthStore';
import router from '@/router';
import InfoDrawer from '@/components/drawers/InfoDrawer.vue';

const authStore = useAuthStore();
const user = computed(() => authStore.userInfo);
const login = computed(() => authStore.isLoggedIn);
const isCollapse = ref<boolean>(false);
const infoRef = ref<InstanceType<typeof InfoDrawer>>()

const handleCollapse = () => {
    isCollapse.value = !isCollapse.value;
};

const handleRoute = (path: any) => {
    isCollapse.value = false
    router.push(path);
};

const handleOpenDrawer = (user: any) => {
    infoRef.value?.openDrawer(user)
    isCollapse.value = false
}

</script>

<template>
    <el-header id='header' class='hidden-md-and-up'>
        <div class='header-content'>
            <el-menu class='menu' mode='horizontal' :ellipsis='false' background-color='#fff' menu-trigger='click'>
                <el-menu-item class='no-hover logo' index='1'>
                    <router-link to='/'> Web Truyen</router-link>
                </el-menu-item>
                <div class='flex-grow'></div>

                <el-menu-item class='no-hover' index='2'>
                    <el-button size='large' @click='handleCollapse'>
                        <svg viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' data-v-ea893728='' class='icon'>
                            <path
                                fill='currentColor'
                                d='M176 416a112 112 0 1 0 0 224 112 112 0 0 0 0-224m0 64a48 48 0 1 1 0 96 48 48 0 0 1 0-96zm336-64a112 112 0 1 1 0 224 112 112 0 0 1 0-224zm0 64a48 48 0 1 0 0 96 48 48 0 0 0 0-96zm336-64a112 112 0 1 1 0 224 112 112 0 0 1 0-224zm0 64a48 48 0 1 0 0 96 48 48 0 0 0 0-96z'
                            ></path>
                        </svg>
                    </el-button>
                </el-menu-item>

                <Transition name='collapse'>
                    <div class='collapse' v-if='isCollapse' v-bind:style="{ maxHeight: isCollapse ? '500px' : '0' }">
                        <el-menu mode='vertical' :ellipsis='false' class='menu-bar' background-color='#f1f1f1'
                                 menu-trigger='click'>
                            <el-menu-item class='no-hover' index='1'>
                                <SearchInput />
                            </el-menu-item>
                            <el-menu-item class='no-hover' index='2' @click='handleRoute("/hot")'>
                                HOT
                            </el-menu-item>
                            <el-menu-item class='no-hover' index='3' @click='handleRoute("/theo-doi")'>
                                Theo dõi
                            </el-menu-item>

                            <el-sub-menu class='no-hover category' index='4'>
                                <template #title>Thể loại</template>
                                <el-menu-item class='no-hover' index='4-1' @click='handleRoute("/the-loai/tat-ca")'>Tất cả</el-menu-item>
                                <el-menu-item class='no-hover' index='4-2' @click='handleRoute("/the-loai/truyen-tranh/manga")'>
                                    Manga
                                </el-menu-item>
                                <el-menu-item class='no-hover' index='4-3' @click='handleRoute("/the-loai/truyen-tranh/manhua")'>
                                    Manhua
                                </el-menu-item>
                                <el-menu-item class='no-hover' index='4-2' @click='handleRoute("/the-loai/truyen-tranh/manhwa")'>
                                    Manhwa
                                </el-menu-item>
                            </el-sub-menu>

                            <el-menu-item class='no-hover' v-if='login' index='5'>
                                <span class='name-user' @click='handleOpenDrawer(user)'>
                                    <el-avatar :src='user?.avatar' class='avatar-image' />
                                    <span class='avatar'>{{ user?.username }}</span>
                                </span>
                            </el-menu-item>

                            <template v-else class='no-hover'>
                                <el-menu-item class='no-hover' index='6'>
                                    <el-button type='primary' link @click='handleRoute("/dang-ky")'> Đăng ký</el-button>
                                </el-menu-item>
                                <el-menu-item class='no-hover' index='7'>
                                    <el-button type='primary' link @click='handleRoute("/dang-nhap")'> Đăng nhập
                                    </el-button>
                                </el-menu-item>
                            </template>
                        </el-menu>
                    </div>
                </Transition>

            </el-menu>
        </div>
    </el-header>

    <InfoDrawer ref='infoRef' />
</template>

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
    transition: all 0.3s ease-in-out
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