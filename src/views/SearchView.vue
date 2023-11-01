<template>
    <div class="container">
        <div v-for="(comicData, index) in comicsData" :key="index">
            <Card :data="comicData" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import Card from '@/components/Card.vue';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import type { Comic } from '@/views/ComicDetailView.vue';
import { ComicServices } from '@/services/comic/ComicServices';

const route = useRoute();
console.log(route.params.searchText);
const searchText = route.params.searchText;
const comicsData = ref<Comic[]>();
onMounted(async () => {
    try {
        const res = await ComicServices.getComicByName(searchText);
        comicsData.value = res.comics;
    } catch (error) {
        console.error('Failed to load comic' + error);
    }
});
</script>

<style scoped>
.container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(183px, 1fr));
    grid-gap: 20px;
}
</style>
