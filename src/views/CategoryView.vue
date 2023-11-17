<template>
    <div class='container'>
        <div class='page-header'>
            <span class='title hidden-sm-and-down'>
                <span>Thể loại: </span>
                <h1>Tất cả</h1>
            </span>
            <span class='description'>
                Tất cả thể loại truyện tranh
            </span>
        </div>
        <div class='card-list' v-loading='loading'>
            <div v-for='comicData in comicsData' :key='comicData._id'>
                <Card :data='comicData' />
            </div>
        </div>
        <div class='pagination'>
            <el-pagination
                v-model:current-page='currentPage'
                v-model:page-size='pageSize'
                :background='true'
                layout='prev, pager, next, jumper'
                :total='totalComics'
                @size-change='handleSizeChange'
                @current-change='handleCurrentChange'
            />
        </div>
    </div>
</template>

<script lang='ts' setup>
import Card from '@/components/Card.vue';
import { computed, onMounted, ref } from 'vue';
import { useComicStore } from '@/stores/useComicStore';
import type { Comic } from '@/interfaces';
import {loadingFullScreen} from '@/utils/loadingFullScreen';

const comicStore = useComicStore();
const categoryName = ref<string>('');
const comicsData = ref<Comic[]>([]);
const loading = ref<boolean>(false)

const currentPage = ref(1);
const pageSize = ref(15);
const totalComics = computed(() => comicStore.totalComics);


const handleSizeChange = () => {

}


const handleCurrentChange = async (val: number) => {
    try {
        loadingFullScreen('Đang xử lý')
        loading.value = true
        await comicStore.getAllComics(val);
        comicsData.value = comicStore.comics;
    }
    catch (e) {
        console.error('fail to get all comics ' + e)
    }
    finally {
        loading.value = false
    }

};

onMounted(async () => {
    try {
        loadingFullScreen('Đang xử lý')
        loading.value = true
        await comicStore.getAllComics(currentPage);
        comicsData.value = comicStore.comics;
        categoryName.value = 'Tất cả';

    } catch (error) {
        console.error('Failed to load category' + error);
    } finally {
        loading.value = false
    }
});
</script>

<style scoped>
.container {
    position: relative;
    height: auto;
}

.page-header {
    margin-bottom: 25px;
}

.title {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: 500;
}

.description {
    font-size: 18px;
    font-weight: 400;
}

span + h1 {
    margin-left: 8px;
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
