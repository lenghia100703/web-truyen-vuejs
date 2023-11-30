<script setup lang='ts'>
import { path } from '@/constants';
import { ref } from 'vue';
import router from '@/router';
import SearchInput from '@/components/SearchInput.vue';

const visible = ref<boolean>(false);

function openDrawer() {
    visible.value = true;
}

const handleRoute = (path: any) => {
    visible.value = false;
    router.push(`/${path}`);
};

defineExpose({
    openDrawer,
});
</script>
<template>
    <el-drawer v-model='visible' title='I am the title' :with-header='false' size='80%'>
        <el-menu mode='vertical' :ellipsis='false' class='menu-bar' menu-trigger='click'>
            <el-menu-item class='no-hover' >
                <SearchInput />
            </el-menu-item>
            <el-menu-item class='no-hover' index='2' @click='handleRoute(path.HOT)'>
                HOT
            </el-menu-item>
            <el-menu-item class='no-hover' index='3' @click='handleRoute(path.FOLLOWING)'>
                Theo dõi
            </el-menu-item>
            <el-sub-menu class='no-hover category' index='4'>
                <template #title>Thể loại</template>
                <el-menu-item class='no-hover' index='4-1'
                              @click='handleRoute(path.CATEGORY)'>Tất cả
                </el-menu-item>
                <el-menu-item class='no-hover' index='4-2'
                              @click='handleRoute(path.CATEGORY_DETAIL("manga"))'>
                    Manga
                </el-menu-item>
                <el-menu-item class='no-hover' index='4-3'
                              @click='handleRoute(path.CATEGORY_DETAIL("manhua"))'>
                    Manhua
                </el-menu-item>
                <el-menu-item class='no-hover' index='4-2'
                              @click='handleRoute(path.CATEGORY_DETAIL("manhwa"))'>
                    Manhwa
                </el-menu-item>
            </el-sub-menu>

            <el-menu-item class='no-hover' index='8'>
                <el-button type='primary' link @click='handleRoute(path.REGISTER)'> Đăng ký
                </el-button>
            </el-menu-item>
            <el-menu-item class='no-hover' index='9'>
                <el-button type='primary' link @click='handleRoute(path.LOGIN)'> Đăng nhập
                </el-button>
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
</style>