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
                            <router-link to='/'>
                                <svg
                                    viewBox='0 0 1024 1024'
                                    xmlns='http://www.w3.org/2000/svg'
                                    data-v-ea893728=''
                                    class='icon'
                                >
                                    <path
                                        fill='currentColor'
                                        d='M512 128 128 447.936V896h255.936V640H640v256h255.936V447.936z'
                                    ></path>
                                </svg>
                            </router-link>
                            <!-- icon menu -->
                            <router-link :to='url'>
                                <svg
                                    viewBox='0 0 1024 1024'
                                    xmlns='http://www.w3.org/2000/svg'
                                    data-v-ea893728=''
                                    class='icon'
                                >
                                    <path
                                        fill='currentColor'
                                        d='M160 448a32 32 0 0 1-32-32V160.064a32 32 0 0 1 32-32h256a32 32 0 0 1 32 32V416a32 32 0 0 1-32 32H160zm448 0a32 32 0 0 1-32-32V160.064a32 32 0 0 1 32-32h255.936a32 32 0 0 1 32 32V416a32 32 0 0 1-32 32H608zM160 896a32 32 0 0 1-32-32V608a32 32 0 0 1 32-32h256a32 32 0 0 1 32 32v256a32 32 0 0 1-32 32H160zm448 0a32 32 0 0 1-32-32V608a32 32 0 0 1 32-32h255.936a32 32 0 0 1 32 32v256a32 32 0 0 1-32 32H608z'
                                    ></path>
                                </svg>
                            </router-link>
                            <!-- icon left  -->
                            <router-link
                                :to='`/truyen-tranh/${slug}/chap-${preChapter}`'
                                :class='preChapter <= 0 && "disabled"'
                            >
                                <svg
                                    viewBox='0 0 1024 1024'
                                    xmlns='http://www.w3.org/2000/svg'
                                    data-v-ea893728=''
                                    width='40px'
                                >
                                    <path
                                        fill='currentColor'
                                        d='M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z'
                                    ></path>
                                    <path
                                        fill='currentColor'
                                        d='m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z'
                                    ></path>
                                </svg>
                            </router-link>
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
                            <router-link
                                :to='`/truyen-tranh/${slug}/chap-${nextChapter}`'
                                :class='nextChapter > options.length && "disabled"'
                            >
                                <svg
                                    viewBox='0 0 1024 1024'
                                    xmlns='http://www.w3.org/2000/svg'
                                    data-v-ea893728=''
                                    class='icon'>
                                    <path
                                        fill='currentColor'
                                        d='M754.752 480H160a32 32 0 1 0 0 64h594.752L521.344 777.344a32 32 0 0 0 45.312 45.312l288-288a32 32 0 0 0 0-45.312l-288-288a32 32 0 1 0-45.312 45.312L754.752 480z'>

                                    </path>
                                </svg>
                            </router-link>
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

const route = useRoute();
const slug = route.params.slug;
const loading = ref<boolean>(false)
let numberChapter = (route.params.titleChapter as string).split('-')[1];
let preChapter = parseInt(numberChapter) - 1;
let nextChapter = parseInt(numberChapter) + 1;

const chapter = ref<Chapter | null>(null);

const getChapter = async () => {
    try {
        loadingFullScreen('Đang xử lý')
        loading.value = true
        chapter.value = await ChapterServices.getChapter(slug, numberChapter);
    } catch (error) {
        console.error('Get Chapter Failed: ' + error);
    } finally {
        loading.value = false
    }
};

watch(
    () => route.params,
    async () => {
        loadingFullScreen('Đang xử lý')
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
const url = computed(() => `/truyen-tranh/${slug}`);
const options = computed(() => {
    const newArr: {
        label: string;
        value: string;
    }[] = []; // eslint-disable-next-line
    chapter?.value?.chapters?.map((chapter: ChapterDetail, index: number) =>
        newArr.push({
            label: chapter.title,
            value: `/truyen-tranh/${slug}/chap-${index + 1}`,
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

.icon {
    width: 40px;
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

.disabled {
    cursor: not-allowed;
    color: #a8abb2;
}
</style>
