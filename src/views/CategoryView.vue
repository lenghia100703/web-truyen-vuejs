<template>
    <div class="container">
        <div class="card-list">
            <div v-for="comicData in comicsData" :key="comicData._id">
                <Card :data="comicData" />
            </div>
        </div>
        <div class="pagination">
            <el-pagination
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
                :background="true"
                layout="prev, pager, next, jumper"
                :total="totalComics"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import Card from '@/components/Card.vue';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useComicStore } from '@/stores/useComicStore';
import { CategoryServices } from '@/services/category/CategoryServices';
import { ComicServices } from '@/services/comic/ComicServices';
import type { Comic } from '@/interfaces';

const route = useRoute();
const comicStore = useComicStore();
const categorySlug = computed(() => route.params.category);
const comicsData = ref<Comic[]>([]);

const currentPage = ref(1);
const pageSize = ref(15);
const totalComics = computed(() => comicStore.totalComics);

const handleSizeChange = (val: number) => {
    console.log(`${val} items per page`);
};
const handleCurrentChange = async (val: number) => {
    await comicStore.getAllComics(val);
    comicsData.value = comicStore.comics;
};

onMounted(async () => {
    try {
        if (categorySlug.value === 'tat-ca') {
            await comicStore.getAllComics(currentPage);
            comicsData.value = comicStore.comics;
        } else {
            const cate = await CategoryServices.getCategoryBySlug(categorySlug.value);
            comicsData.value = await ComicServices.getComicByCategory(cate[0]._id);
        }
    } catch (error) {
        console.error('Failed to load category' + error);
    }
});
</script>

<style scoped>
.container {
    position: relative;
    height: auto;
}

.card-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(183px, 1fr));
    grid-gap: 20px;
    padding-bottom: 50px;
}

.pagination {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 0;
}
</style>
