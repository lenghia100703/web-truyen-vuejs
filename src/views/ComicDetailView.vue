<template>
    <div class='container'>
        <el-row justify='center'>
            <el-col :span='16'>
                <h2 class='title'>
                    {{ comicBySlug?.comic?.name }}
                </h2>
            </el-col>
        </el-row>
        <el-row justify='center'>
            <el-col :xs='11' :sm='9' :md='7' :lg='5'>
                <el-image class='image' :src='urlImage' fit='cover' />
            </el-col>
            <el-col :xs='10' :sm='12' :md='14' :lg='16'>
                <el-form label-position='left' label-width='100px'>
                    <el-form-item label='Tên tác giả' class='form-item'>
                        {{ comicBySlug?.author?.username }}
                    </el-form-item>

                    <el-form-item label='Tình trạng' class='form-item'>
                        {{ status }}
                    </el-form-item>

                    <el-form-item label='Thể loại' class='form-item'>
                        {{ category?.name }}
                    </el-form-item>

                    <el-form-item label='Lượt xem' class='form-item'>
                        {{ comicBySlug?.comic?.view }}
                    </el-form-item>

                    <el-form-item label='Lượt thích' class='form-item'>
                        {{ comicBySlug?.comic?.likeCount }}
                    </el-form-item>
                </el-form>
                <span>
                    <el-button type='success' :loading='followLoading' @click='handleFollow'
                               v-if='!followed'>Theo dõi</el-button>
                    <el-button type='danger' :loading='unFollowLoading' @click='handleUnFollow' v-else-if='followed'>Hủy theo dõi</el-button>
                    <span class='follow-text'>{{ followCount }} Lượt theo dõi</span>
                </span>
            </el-col>
        </el-row>
        <el-row justify='center'>
            <el-col :span='21' class='description'> NỘI DUNG</el-col>
        </el-row>
        <el-row justify='center'>
            <el-col :span='21' class=''>
                <p class='comic-desc-content' :class='{ shortened: isCollapsed }'>
                    {{ comicBySlug?.comic?.description }}
                </p>
                <span class='btn-more' @click='toggleCollapse'>
                    {{ isCollapsed ? 'Hiện thêm' : 'Ẩn bớt' }}
                    <span>
                        <ArrowRight />
                    </span>
                </span>
            </el-col>
        </el-row>
        <el-row justify='center'>
            <el-col :span='21' class='description'> DANH SÁCH CHƯƠNG</el-col>
        </el-row>
        <el-row justify='center'>
            <el-col :span='21'>
                <el-table :data='data' @row-click='handleRowClick' v-loading='loading'
                          empty-text='Chưa đăng chương truyện nào'>
                    <el-table-column class='chapter-row' label='Số chương' prop='title'></el-table-column>
                    <el-table-column class='chapter-row' label='Ngày đăng' prop='time'></el-table-column>
                    <el-table-column class='chapter-row' label='Lượt xem' prop='view'></el-table-column>
                </el-table>
            </el-col>
        </el-row>
    </div>
</template>

<script lang='ts' setup>
import { useRoute } from 'vue-router';
import { computed, onMounted, ref, watch } from 'vue';
import { useAuthStore } from '@/stores/useAuthStore';
import { UserServices } from '@/services/user/UserServices';
import { ComicServices } from '@/services/comic/ComicServices';
import { CategoryServices } from '@/services/category/CategoryServices';
import router from '@/router/index';
import { createAxiosJwt } from '@/utils/createInstance';
import type { Category, Comic, UserInfo } from '@/interfaces';
import { loadingFullScreen } from '@/utils/loadingFullScreen';
import { ElMessage } from 'element-plus';
import { path } from '@/constants';
import ArrowRight from '@/components/icons/ArrowRight.vue';

interface ComicBySlug {
    comic: Comic;
    author: UserInfo;
}

const route = useRoute();
const slug = route.params.slug;
const comicBySlug = ref<ComicBySlug | null>(null);
const category = ref<Category | null>(null);
const authStore = useAuthStore();
const httpJwt: any = createAxiosJwt(authStore.userInfo);
const loading = ref<boolean>(false);
const followLoading = ref<boolean>(false);
const unFollowLoading = ref<boolean>(false);
const isFollowed = ref<boolean>(false);
const followCount = ref<number>(0);
const tableData = ref<any[]>([]);

const handleFollow = async () => {
        try {
            if (authStore.isLoggedIn) {
                followLoading.value = true;
                await UserServices.follow(comicBySlug.value?.comic._id, authStore.userInfo, httpJwt);
                isFollowed.value = true;
                followCount.value += 1;
            } else {
                ElMessage({
                    message: 'Bạn cần đăng nhập.',
                    type: 'warning',
                });
                await router.push({ name: 'login' });
            }
        } catch (error) {
            console.error('Failed to follow' + error);
        } finally {
            followLoading.value = false;
        }
    }
;

const handleUnFollow = async () => {
        try {
            unFollowLoading.value = true;
            await UserServices.unFollow(comicBySlug.value?.comic._id, authStore.userInfo, httpJwt);
            isFollowed.value = false;
            followCount.value -= 1;
        } catch (error) {
            console.error('Failed to follow' + error);
        } finally {
            unFollowLoading.value = false;
        }
    }
;

watch(
    () => route.params.slug,
    async () => {
        loadingFullScreen('Đang xử lý');
        const res = await ComicServices.getComicBySlug(slug);
        const cate = await CategoryServices.getCategoryById(res.comic.category);
        comicBySlug.value = res;
        followCount.value = res.comic?.followCount;
        category.value = cate;
    },
    {
        immediate: true,
    },
);

onMounted(async () => {
    try {
        loadingFullScreen('Đang xử lý');
        loading.value = true;
        const res = await ComicServices.getComicBySlug(slug);
        const cate = await CategoryServices.getCategoryById(res.comic.category);
        comicBySlug.value = res;
        followCount.value = res.comic?.followCount;
        category.value = cate;
        tableData.value = res.comic.chapters.reverse();
        isFollowed.value = authStore.userInfo?.followComic.includes(res.comic._id) as boolean;
    } catch (error) {
        console.error('Get Comic By Slug Failed: ' + error);
    } finally {
        loading.value = false;
    }
});

const status = computed(() => (comicBySlug.value?.comic?.status ? 'Đã hoàn thành' : 'Đang tiến hành'));
const urlImage = computed(() => comicBySlug.value?.comic?.image);
const data = computed(() => comicBySlug.value?.comic?.chapters.reverse());
const followed = computed(() => authStore.userInfo?.followComic.includes(<string>comicBySlug.value?.comic?._id) as boolean);

const handleRowClick = (row: any) => {
    const numberChapters = row.title.split(' ')[1];
    router.push(`/${path.CHAPTER(route.params.slug, `chap-${numberChapters}`)}`)
};

const isCollapsed = ref(true);

const toggleCollapse = () => {
    isCollapsed.value = !isCollapsed.value;
};
</script>

<style scoped>
.title {
    text-align: center;
}

.image {
    width: 185px;
    height: auto;
}

.form-item {
    margin-bottom: 12px;
    width: auto;
}

.follow-text {
    margin-left: 8px;
}

.description {
    color: #2980b9;
    border-bottom: 2px solid #2980b9;
    font-weight: 300;
    font-size: 16px;
    text-transform: uppercase;
    margin: 10px 0;
    padding-bottom: 2px;
}

.shortened {
    max-height: 100%;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
}

.comic-desc-content {
    color: rgb(128, 128, 128);
    font-size: 14px;
}

.btn-more {
    width: 100px;
    padding: 8px 8px 8px 0;
    cursor: pointer;
    color: #2980b9;
    display: flex;
    align-items: center;
}

.chapter-row {
    cursor: pointer;
}

</style>
