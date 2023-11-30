<template>
    <div class='container'>
        <el-row class='chapter-header' justify='center'>
            <el-col :span='21'>
                <el-row justify='center'>
                    <el-col :span='24'
                    ><h2>{{ chapter?.nameComic }}</h2></el-col
                    >
                </el-row>
                <el-row justify='center'>
                    <el-col :span='24'>
                        <div class='menu-control'>
                            <!-- icon home -->
                            <div @click='handleRoute(path.HOME)' class='btn-control'>
                                <HomeFilled />
                            </div>
                            <!-- icon menu -->
                            <div @click='handleRoute(path.COMIC_DETAIL(slug))' class='btn-control'>
                                <Menu />
                            </div>
                            <!-- icon left  -->
                            <div
                                class='btn-control'
                                @click='handleRoute(path.CHAPTER(slug, `chap-${preChapter}`))'
                                :class='preChapter <= 0 && "disabled"'
                            >
                                <Back />
                            </div>
                            <!-- thanh select  -->
                            <el-select
                                class='m-2'
                                placeholder='Chọn chương truyện'
                                size='large'
                                @change='handleChangeOption'
                            >
                                <el-option
                                    v-for='(item, index) in options'
                                    :key='index'
                                    :label='item.label'
                                    :value='item.value'
                                />
                            </el-select>
                            <!-- icon right  -->
                            <div
                                class='btn-control'
                                @click='handleRoute(path.CHAPTER(slug, `chap-${nextChapter}`))'
                                :class='nextChapter > options.length && "disabled"'
                            >
                                <Right />
                            </div>
                            <!-- nut theo doi -->
                            <el-button type='success'>Theo dõi</el-button>
                        </div>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-row justify='center' class='chapter-body'>
            <el-col :span='21'>
                <div class='chapter-images' v-for='(image, index) in currentChapter?.images' :key='index'>
                    <el-image :src='image' class='image' />
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script lang='ts' setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { ChapterServices } from '@/services/chapter/ChapterServices';
import type { Chapter, ChapterDetail } from '@/interfaces';
import router from '@/router';
import { loadingFullScreen } from '@/utils/loadingFullScreen';
import { path } from '@/constants';
import HomeFilled from '@/components/icons/HomeFilled.vue';
import Menu from '@/components/icons/Menu.vue';
import Back from '@/components/icons/Back.vue';
import Right from '@/components/icons/Right.vue';

const route = useRoute();
const slug = route.params.slug;
const loading = ref<boolean>(false);
let numberChapter = (route.params.titleChapter as string).split('-')[1];
let preChapter = parseInt(numberChapter) - 1;
let nextChapter = parseInt(numberChapter) + 1;

const chapter = ref<Chapter | null>(null);
const handleRoute = (path: any) => {
    router.push(`/${path}`);
};

const getChapter = async () => {
    try {
        loadingFullScreen('Đang xử lý');
        loading.value = true;
        chapter.value = await ChapterServices.getChapter(slug, numberChapter);
    } catch (error) {
        console.error('Get Chapter Failed: ' + error);
    } finally {
        loading.value = false;
    }
};

watch(
    () => route.params,
    async () => {
        loadingFullScreen('Đang xử lý');
        chapter.value = await ChapterServices.getChapter(route.params.slug, (route.params.titleChapter as string).split('-')[1]);
        numberChapter = (route.params.titleChapter as string).split('-')[1];
        preChapter = parseInt(numberChapter) - 1;
        nextChapter = parseInt(numberChapter) + 1;
    },
    {
        immediate: true,
    },
);

onMounted(() => {
    getChapter();
});


const currentChapter = computed(() => chapter?.value?.chapterDetail);
const options = computed(() => {
    const newArr: {
        label: string;
        value: string;
    }[] = []; // eslint-disable-next-line
    chapter?.value?.chapters?.map((chapter: ChapterDetail, index: number) =>
        newArr.push({
            label: chapter.title,
            value: `/${path.CHAPTER(slug, `chap-${index + 1}`)}`,
        }),
    );
    return newArr;
});

const handleChangeOption = (e: string) => {
    router.push(e);
};


</script>

<style scoped>
.container {
    background-color: #333;
}

.chapter-images {
    display: flex;
    justify-content: center;
}

.chapter-header {
    background-color: white;
}

.chapter-body {
    background-color: white;
}

.image {
    max-width: 120%;
    height: auto;
}

.menu-control {
    display: flex;
    justify-content: center;
    align-items: center;
}

.btn-control {
    cursor: pointer;
}

.btn-control:hover {
    color: #2d1b84;
}

.disabled {
    cursor: not-allowed;
    color: #a8abb2;
    pointer-events: none;
}
</style>
