<template>
    <div class='page-header'>
        <span class='description'>
            Truyện đã theo dõi
            <span>
                <ArrowRightBold />
            </span>
        </span>
    </div>
    <div class='container' v-loading='loading'>
        <div v-for='(comicData, index) in comicsData' :key='index'>
            <Card :data='comicData' />
        </div>
    </div>
</template>

<script lang='ts' setup>
import Card from '@/components/Card.vue';
import { onMounted, ref } from 'vue';
import { useAuthStore } from '@/stores/useAuthStore';
import { ComicServices } from '@/services/comic/ComicServices';
import { createAxiosJwt } from '@/utils/createInstance';
import type { Comic } from '@/interfaces';
import { loadingFullScreen } from '@/utils/loadingFullScreen';
import ArrowRightBold from '@/components/icons/ArrowRightBold.vue';

const authStore = useAuthStore();
const comicsData = ref<Comic | null>(null);
const httpJwt = createAxiosJwt(authStore.userInfo);
const loading = ref<boolean>(false);

const getComic = async () => {
    try {
        loadingFullScreen('Đang xử lý');
        loading.value = true;
        comicsData.value = await ComicServices.getComicByUserFollowed(authStore.userInfo, httpJwt);
    } catch (e) {
        console.error('failt to get comic by user ' + e);
    } finally {
        loading.value = false;
    }
};

onMounted(async () => {
    await getComic();
});
</script>

<style scoped>
.page-header {
    margin-bottom: 25px;
}

.description {
    display: flex;
    align-items: center;
    font-size: 18px;
    font-weight: 400;
}

.icon {
    width: 14px;
}

.container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(183px, 1fr));
    grid-gap: 20px;
}
</style>
