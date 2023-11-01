<template>
    <div class="container">
        <div v-for="(comicData, index) in comicsData" :key="index">
            <Card :data="comicData" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { createAxiosJwt } from '@/utils/createInstance';
import Card from '@/components/Card.vue';
import { onMounted, ref } from 'vue';
import { useAuthStore } from '@/stores/useAuthStore';
import type { Comic } from '@/views/ComicDetailView.vue';

const authStore = useAuthStore();
const comicsData = ref<Comic | null>();
const axiosJwt = createAxiosJwt(authStore?.userInfo);
onMounted(async () => {
    const res = await axiosJwt.get(`/comic/followed/${authStore?.userInfo?._id}`, {
        headers: {
            token: `Bearer ${authStore?.userInfo?.accessToken}`,
        },
    });
    console.log(res.data);
    comicsData.value = res.data;
});
</script>

<style scoped>
.container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(183px, 1fr));
    grid-gap: 20px;
}
</style>
