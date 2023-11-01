<template>
    <div class="common-layout">
        <el-container>
            <Header />
            <el-main id="main">
                <router-view></router-view>
            </el-main>
        </el-container>
    </div>
</template>

<script lang="ts" setup>
import Header from '@/components/Header.vue';
</script>

<style scoped>
.common-layout {
}

#main {
    display: flex;
    justify-content: center;
    margin-top: 60px;
    max-width: 100%;
    background-color: #333;
}
</style>
