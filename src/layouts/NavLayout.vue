<template>
    <div class="common-layout">
        <el-container>
            <Header />
            <el-container id="main">
                <el-main>
                    <router-view></router-view>
                </el-main>
                <Nav />
            </el-container>
            <Footer />
        </el-container>
    </div>
</template>

<script lang="ts" setup>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import Nav from '@/components/Nav.vue';
</script>

<style scoped>
#main {
    max-width: 80%;
    margin: 60px auto;
}
</style>
