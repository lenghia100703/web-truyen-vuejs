<template>
    <div class="page-header">
        <span class="description">
            Truyện hot
            <span>
                <ArrowRightBold />
            </span>
        </span>
    </div>
    <div class="container">
        <div class="card-list" v-loading="loading">
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
import { loadingFullScreen } from '@/utils/loadingFullScreen';
import ArrowRightBold from '@/components/icons/ArrowRightBold.vue';

const comicStore = useComicStore();
const hotComic = ref<any[]>([]);
const loading = ref<boolean>(false);
const getHotComic = async (currentPage: any) => {
    try {
        loadingFullScreen('Đang xử lý');
        loading.value = true;
        const res = await ComicServices.getHotComic(currentPage);
        hotComic.value = res.comics;
    } catch (error) {
        console.error('failed to get comic hot ' + error);
    } finally {
        loading.value = false;
    }
};
onMounted(async () => {
    await getHotComic(currentPage.value);
});
const comicsData = computed(() => hotComic.value);
const currentPage = ref(1);
const pageSize = ref(15);
const totalComics = computed(() => comicStore.totalComics);

const handleSizeChange = (val: number) => {};
const handleCurrentChange = async (val: number) => {
    await getHotComic(val);
};
</script>

<style scoped>
.page-header {
    margin-bottom: 25px;
}

.description {
    display: flex;
    align-items: center;
    font-size: 18px;
}

.icon {
    width: 14px;
}

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
