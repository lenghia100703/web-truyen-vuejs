<template>
    <div class="container">
        <!-- <pre>{{ comicsData }}</pre> -->
        <div v-for="comicData in comicsData" :key="comicData._id">
            <Card :data="comicData" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import Card from '@/components/Card.vue';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useComicStore } from '@/stores/useComicStore';
import axios from 'axios';
import type { Comic } from '@/views/ComicDetailView.vue';

const route = useRoute();
const comicStore = useComicStore();
const categorySlug = computed(() => route.params.category);
const comicsData = ref<Comic[]>();

onMounted(async () => {
    try {
        if (categorySlug.value === 'tat-ca') {
            await comicStore.getAllComics();
            comicsData.value = comicStore.comics;
        } else {
            const cate = await axios.get(`/category/slug/${categorySlug.value}`);
            const res = await axios.get(`/comic/category/${cate.data[0]._id}`);
            comicsData.value = res.data;
        }
    } catch (error) {
        console.error('Failed to load category' + error);
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
