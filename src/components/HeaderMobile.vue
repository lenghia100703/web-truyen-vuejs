<script lang='ts' setup>
import { computed, ref } from 'vue';
import SearchInput from '@/components/SearchInput.vue';
import { useAuthStore } from '@/stores/useAuthStore';
import router from '@/router';
import InfoDrawer from '@/components/drawers/InfoDrawer.vue';
import { path } from '@/constants';
import More from '@/components/icons/More.vue';
import BasicDrawer from '@/components/drawers/BasicDrawer.vue';

const authStore = useAuthStore();
const user = computed(() => authStore.userInfo);
const login = computed(() => authStore.isLoggedIn);
const isCollapse = ref<boolean>(false);
const infoRef = ref<InstanceType<typeof InfoDrawer>>();
const basicRef = ref<InstanceType<typeof BasicDrawer>>();

const handleCollapse = () => {
    isCollapse.value = !isCollapse.value;
};

const handleRoute = (path: any) => {
    isCollapse.value = false;
    router.push(`/${path}`);
};

const handleOpenDrawer = (user: any) => {
    console.log(user)
    if (login && user) {
        infoRef.value?.openDrawer(user);
    } else if (user === null) {
        basicRef.value?.openDrawer()
    }
    // isCollapse.value = false;
};

</script>

<template>
    <el-header id='header' class='hidden-md-and-up'>
        <div class='header-content'>
            <el-menu class='menu' mode='horizontal' :ellipsis='false' background-color='#fff' menu-trigger='click'>
                <el-menu-item class='no-hover logo' index='1' @click='handleRoute(path.HOME)'>
                    Web Truyen
                </el-menu-item>
                <div class='flex-grow'></div>

                <el-menu-item class='no-hover' index='2'>
                    <el-button size='large' @click='handleOpenDrawer(user)'>
                        <More />
                    </el-button>
                </el-menu-item>

<!--                <Transition name='collapse'>-->
<!--                    <div class='collapse' v-if='isCollapse' v-bind:style="{ maxHeight: isCollapse ? '500px' : '0' }">-->
<!--                        <el-menu mode='vertical' :ellipsis='false' class='menu-bar' background-color='#f1f1f1'-->
<!--                                 menu-trigger='click'>-->
<!--                            <template v-if='(login && !authStore.userInfo?.admin) || !login'>-->
<!--                                <el-menu-item class='no-hover' index='1'>-->
<!--                                    <SearchInput />-->
<!--                                </el-menu-item>-->
<!--                                <el-menu-item class='no-hover' index='2' @click='handleRoute(path.HOT)'>-->
<!--                                    HOT-->
<!--                                </el-menu-item>-->
<!--                                <el-menu-item class='no-hover' index='3' @click='handleRoute(path.FOLLOWING)'>-->
<!--                                    Theo dõi-->
<!--                                </el-menu-item>-->

<!--                                <el-sub-menu class='no-hover category' index='4'>-->
<!--                                    <template #title>Thể loại</template>-->
<!--                                    <el-menu-item class='no-hover' index='4-1'-->
<!--                                                  @click='handleRoute(path.CATEGORY)'>Tất cả-->
<!--                                    </el-menu-item>-->
<!--                                    <el-menu-item class='no-hover' index='4-2'-->
<!--                                                  @click='handleRoute(path.CATEGORY_DETAIL("manga"))'>-->
<!--                                        Manga-->
<!--                                    </el-menu-item>-->
<!--                                    <el-menu-item class='no-hover' index='4-3'-->
<!--                                                  @click='handleRoute(path.CATEGORY_DETAIL("manhua"))'>-->
<!--                                        Manhua-->
<!--                                    </el-menu-item>-->
<!--                                    <el-menu-item class='no-hover' index='4-2'-->
<!--                                                  @click='handleRoute(path.CATEGORY_DETAIL("manhwa"))'>-->
<!--                                        Manhwa-->
<!--                                    </el-menu-item>-->
<!--                                </el-sub-menu>-->
<!--                            </template>-->
<!--                            <template v-else-if='login && authStore.userInfo?.admin'>-->
<!--                                <el-menu-item class='no-hover' index='1'>-->
<!--                                    <SearchInput />-->
<!--                                </el-menu-item>-->
<!--                                <el-menu-item class='no-hover' index='5' @click='handleRoute(path.MANAGE_ACCOUNT)'>-->
<!--                                    Quản lý người dùng-->
<!--                                </el-menu-item>-->
<!--                                <el-menu-item class='no-hover' index='6' @click='handleRoute(path.MANAGE_COMIC)'>-->
<!--                                    Quản lý truyện-->
<!--                                </el-menu-item>-->
<!--                            </template>-->


<!--                            <el-menu-item class='no-hover' v-if='login' index='7'>-->
<!--                                <span class='name-user' @click='handleOpenDrawer(user)'>-->
<!--                                    <el-avatar :src='user?.avatar' class='avatar-image' />-->
<!--                                    <span class='avatar'>{{ user?.username }}</span>-->
<!--                                </span>-->
<!--                            </el-menu-item>-->

<!--                            <template v-else class='no-hover'>-->
<!--                                <el-menu-item class='no-hover' index='8'>-->
<!--                                    <el-button type='primary' link @click='handleRoute(path.REGISTER)'> Đăng ký-->
<!--                                    </el-button>-->
<!--                                </el-menu-item>-->
<!--                                <el-menu-item class='no-hover' index='9'>-->
<!--                                    <el-button type='primary' link @click='handleRoute(path.LOGIN)'> Đăng nhập-->
<!--                                    </el-button>-->
<!--                                </el-menu-item>-->
<!--                            </template>-->
<!--                        </el-menu>-->
<!--                    </div>-->
<!--                </Transition>-->

            </el-menu>
        </div>
    </el-header>

    <InfoDrawer ref='infoRef' />
    <BasicDrawer ref='basicRef' />
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