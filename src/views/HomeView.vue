<template>
    <div class="container">
        <div v-for="comicData in comicsData" :key="comicData._id">
            <Card :data="comicData" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import Card from '@/components/Card.vue';
import { useComicStore } from '@/stores/useComicStore';
import { computed, onMounted } from 'vue';

const comicStore = useComicStore();
onMounted(() => {
    comicStore.getAllComics();
});
const comicsData = computed(() => comicStore.comics);
</script>

<style scoped>
.container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(183px, 1fr));
    grid-gap: 20px;
}
</style>
