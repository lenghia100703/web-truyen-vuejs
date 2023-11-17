<template>
    <div class='page-header'>
        <span class='description'>
            Từ khóa: {{searchText}}

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
import { useRoute } from 'vue-router';
import { ComicServices } from '@/services/comic/ComicServices';
import type { Comic } from '@/interfaces';
import { loadingFullScreen } from '@/utils/loadingFullScreen';

const route = useRoute();
const searchText = route.params.searchText;
const comicsData = ref<Comic[] | null>(null);
const loading = ref<boolean>(false);


onMounted(async () => {
    try {
        loadingFullScreen('Đang xử lý');
        loading.value = true;
        const res = await ComicServices.getComicByName(searchText);
        comicsData.value = res.comics;
    } catch (error) {
        console.error('Failed to load comic' + error);
    } finally {
        loading.value = false;
    }
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

.container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(183px, 1fr));
    grid-gap: 20px;
}
</style>
