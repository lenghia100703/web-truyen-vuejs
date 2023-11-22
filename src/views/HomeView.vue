<template>
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
import { loadingFullScreen } from '@/utils/loadingFullScreen';

const comicStore = useComicStore();
const loading = ref<boolean>(false);

const getAll = async () => {
    try {
        loading.value = true;
        loadingFullScreen('Đang xử lý');
        await comicStore.getAllComics(currentPage.value);
    } catch (e) {
        console.error('fail to get all comics ' + e);
    } finally {
        loading.value = false;
    }
};
onMounted(async () => {
    await getAll();
});
const comicsData = computed(() => comicStore.comics);
const currentPage = ref(1);
const pageSize = ref(10);
const totalComics = computed(() => comicStore.totalComics);

const handleSizeChange = (val: number) => {};
const handleCurrentChange = async (val: number) => {
    try {
        loading.value = true;
        await comicStore.getAllComics(val);
    } catch (e) {
        console.error('fail to get all comics ' + e);
    } finally {
        loading.value = false;
    }
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

@media only screen and (max-width: 576px) {
    .container {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }

    /* .card-list {
        width: 120%;
    } */
}
</style>
