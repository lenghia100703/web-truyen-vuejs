<template>
    <div class='container'>
        <div v-for='(comicData, index) in comicsData' :key='index'>
            <Card :data='comicData' />
        </div>
    </div>
</template>

<script lang='ts' setup>
import Card from '@/components/Card.vue';
import { onMounted, ref } from 'vue';
import { useAuthStore } from '@/stores/useAuthStore';
import type { Comic } from '@/views/ComicDetailView.vue';
import { ComicServices } from '@/services/comic/ComicServices';
import { createAxiosJwt } from '@/utils/createInstance';

const authStore = useAuthStore();
const comicsData = ref<Comic | null>();
const httpJwt = createAxiosJwt(authStore.userInfo)

onMounted(async () => {
    comicsData.value = await ComicServices.getComicByUserFollowed(authStore.userInfo, httpJwt);
});
</script>

<style scoped>
.container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(183px, 1fr));
    grid-gap: 20px;
}
</style>
