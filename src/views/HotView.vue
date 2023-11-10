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
import { useComicStore } from '@/stores/useComicStore';
import { computed, onMounted, ref } from 'vue';
import { ComicServices } from '@/services/comic/ComicServices';

const comicStore = useComicStore();
const hotComic = ref<any[]>([]);
const getHotComic = async (currentPage: any) => {
    try {
        const res = await ComicServices.getHotComic(currentPage);
        hotComic.value = res.comics;
    } catch (error) {
        console.error('failed to get comic hot ' + error);
    }
};
onMounted(async () => {
    await getHotComic(currentPage.value);
});
const comicsData = computed(() => hotComic.value);
const currentPage = ref(1);
const pageSize = ref(15);
const totalComics = computed(() => comicStore.totalComics);

const handleSizeChange = (val: number) => {
    console.log(`${val} items per page`);
};
const handleCurrentChange = async (val: number) => {
    await getHotComic(val);
};
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
