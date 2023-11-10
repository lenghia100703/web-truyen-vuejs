<template>
    <div class="container">
        <el-row justify="center">
            <el-col :span="16">
                <h2 class="title">
                    {{ comicBySlug?.comic?.name }}
                </h2>
            </el-col>
        </el-row>
        <el-row justify="center">
            <el-col :span="5">
                <el-image class="image" :src="urlImage" fit="cover" />
            </el-col>
            <el-col :span="16">
                <el-form label-position="left" label-width="150px">
                    <el-form-item label="Tên tác giả" class="form-item">
                        {{ comicBySlug?.author?.username }}
                    </el-form-item>

                    <el-form-item label="Tình trạng" class="form-item">
                        {{ status }}
                    </el-form-item>

                    <el-form-item label="Thể loại" class="form-item">
                        {{ category?.name }}
                    </el-form-item>

                    <el-form-item label="Lượt xem" class="form-item">
                        {{ comicBySlug?.comic?.view }}
                    </el-form-item>

                    <el-form-item label="Lượt thích" class="form-item">
                        {{ comicBySlug?.comic?.likeCount }}
                    </el-form-item>
                </el-form>
                <span>
                    <el-button type="success" @click="handleFollow" v-if="isFollowed === false">Theo dõi</el-button>
                    <el-button type="danger" @click="handleUnFollow" v-else-if="isFollowed">Hủy theo dõi</el-button>
                    <span class="follow-text">{{ followCount }} Lượt theo dõi</span>
                </span>
            </el-col>
        </el-row>
        <el-row justify="center">
            <el-col :span="21" class="description"> NỘI DUNG</el-col>
        </el-row>
        <el-row justify="center">
            <el-col :span="21" class="">
                <p class="comic-desc-content" :class="{ shortened: isCollapsed }">
                    {{ comicBySlug?.comic?.description }}
                </p>
                <span class="btn-more" @click="toggleCollapse">
                    {{ isCollapsed ? 'Hiện thêm' : 'Ẩn bớt' }}
                    <span>
                        <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ea893728="" class="icon">
                            <path
                                fill="currentColor"
                                d="M340.864 149.312a30.592 30.592 0 0 0 0 42.752L652.736 512 340.864 831.872a30.592 30.592 0 0 0 0 42.752 29.12 29.12 0 0 0 41.728 0L714.24 534.336a32 32 0 0 0 0-44.672L382.592 149.376a29.12 29.12 0 0 0-41.728 0z"
                            ></path>
                        </svg>
                    </span>
                </span>
            </el-col>
        </el-row>
        <el-row justify="center">
            <el-col :span="21" class="description"> DANH SÁCH CHƯƠNG</el-col>
        </el-row>
        <el-row justify="center">
            <el-col :span="21">
                <el-table :data="data" @row-click="handleRowClick" empty-text="Chưa đăng chương truyện nào">
                    <el-table-column label="Số chương" prop="title"></el-table-column>
                    <el-table-column label="Ngày đăng" prop="time"></el-table-column>
                    <el-table-column label="Lượt xem" prop="view"></el-table-column>
                </el-table>
            </el-col>
        </el-row>
    </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { computed, onMounted, ref } from 'vue';
import { useAuthStore } from '@/stores/useAuthStore';
import { UserServices } from '@/services/user/UserServices';
import { ComicServices } from '@/services/comic/ComicServices';
import { CategoryServices } from '@/services/category/CategoryServices';
import router from '@/router/index';
import { createAxiosJwt } from '@/utils/createInstance';
import type { Category, Comic, UserInfo } from '@/interfaces';

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

const isFollowed = ref<boolean>(true);

const followCount = ref<number>(0);

const handleFollow = async () => {
    try {
        await UserServices.follow(comicBySlug.value?.comic._id, authStore.userInfo, httpJwt);
        followCount.value += 1;
        window.location.reload();
    } catch (error) {
        console.error('Failed to follow' + error);
    }
};

const handleUnFollow = async () => {
    try {
        await UserServices.unFollow(comicBySlug.value?.comic._id, authStore.userInfo, httpJwt);
        followCount.value -= 1;
        window.location.reload();
    } catch (error) {
        console.error('Failed to follow' + error);
    }
};

onMounted(async () => {
    try {
        const res = await ComicServices.getComicBySlug(slug);
        const cate = await CategoryServices.getCategoryById(res.comic.category);
        comicBySlug.value = res;
        followCount.value = res.comic?.followCount;
        category.value = cate;
        if (authStore.userInfo?.followComic.includes(res.comic._id) as boolean) {
            isFollowed.value = true;
        } else {
            isFollowed.value = false;
        }
    } catch (error) {
        console.error('Get Comic By Slug Failed: ' + error);
    }
});

const status = computed(() => (comicBySlug.value?.comic?.status ? 'Đã hoàn thành' : 'Đang tiến hành'));

const urlImage = computed(() => comicBySlug.value?.comic?.image);

const data = computed(() => comicBySlug.value?.comic?.chapters.reverse());

const handleRowClick = (row: any) => {
    const numberChapters = row.title.split(' ')[1];
    router.push(`/truyen-tranh/${slug}/chap-${numberChapters}`);
};

let isCollapsed = ref(true);

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
}

.follow-text {
    margin-left: 8px;
}

.icon {
    width: 1em;
    height: 1em;
    margin-top: 8px;
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
</style>
