<template>
    <div class="common-layout">
        <el-container>
            <Header />
            <el-main id="main">
                <router-view></router-view>
            </el-main>
            <Footer />
        </el-container>
    </div>
</template>

<script lang="ts" setup>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
</script>

<style scoped>
#main {
    margin-top: 60px;
    margin-bottom: 60px;
    max-width: 80%;
    margin-right: auto;
    margin-left: auto;
}
</style>
