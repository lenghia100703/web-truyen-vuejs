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
                <el-image style="width: 185px; height: auto" :src="urlImage" fit="cover" />
            </el-col>
            <el-col :span="16">
                <el-form label-position="left" label-width="150px">
                    <el-form-item label="Tên tác giả" style="margin-bottom: 12px">
                        {{ comicBySlug?.author?.username }}
                    </el-form-item>

                    <el-form-item label="Tình trạng" style="margin-bottom: 12px">
                        {{ status }}
                    </el-form-item>

                    <el-form-item label="Thể loại" style="margin-bottom: 12px">
                        {{ category?.name }}
                    </el-form-item>

                    <el-form-item label="Lượt xem" style="margin-bottom: 12px">
                        {{ comicBySlug?.comic?.view }}
                    </el-form-item>

                    <el-form-item label="Lượt thích" style="margin-bottom: 12px">
                        {{ comicBySlug?.comic?.likeCount }}
                    </el-form-item>
                </el-form>
                <span>
                    <el-button :type="type">{{ isFollowed ? 'Theo dõi' : 'Hủy theo dõi' }}</el-button>
                    <span style="margin-left: 8px">{{ comicBySlug?.comic?.followCount }} Lượt theo dõi</span>
                </span>
            </el-col>
        </el-row>
        <el-row justify="center">
            <el-col :span="21" class="description"> NỘI DUNG </el-col>
        </el-row>
        <el-row justify="center">
            <el-col :span="21" class="">
                <p class="comic-desc-content" :class="{ shortened: isCollapsed }">
                    {{ comicBySlug?.comic?.description }}
                </p>
                <span class="btn-more" @click="toggleCollapse">
                    {{ isCollapsed ? 'Hiện thêm' : 'Ẩn bớt' }}
                    <span>
                        <svg
                            viewBox="0 0 1024 1024"
                            xmlns="http://www.w3.org/2000/svg"
                            data-v-ea893728=""
                            style="width: 1em; height: 1em; margin-top: 8px"
                        >
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
            <el-col :span="21" class="description"> DANH SÁCH CHƯƠNG </el-col>
        </el-row>
        <el-row justify="center">
            <el-col :span="21">
                <el-table :data="data" @row-click="handleRowClick">
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
import axios from 'axios';
import router from '@/router/index';
import type { UserInfo } from '../stores/useAuthStore';
import { useAuthStore } from '../stores/useAuthStore';
import { createAxiosJwt } from '@/utils/createInstance';

export interface Comic {
    _id: string;
    name: string;
    description: string;
    userId: string;
    likeCount: number;
    view: number;
    slug: string;
    image: string;
    followCount: number;
    category: string;
    chapters: any[];
    status: boolean;
}

export interface Category {
    _id: string;
    name: string;
    description: string;
    comics: any[];
}

interface ComicBySlug {
    comic: Comic;
    author: UserInfo;
}

const route = useRoute();
const slug = route.params.slug;
const comicBySlug = ref<ComicBySlug | null>({
    comic: {
        _id: '',
        name: '',
        description: '',
        userId: '',
        likeCount: 0,
        view: 0,
        slug: '',
        image: '',
        followCount: 0,
        category: '',
        chapters: [],
        status: false,
    },
    author: {
        _id: '',
        admin: false,
        username: '',
        accessToken: '',
        refreshToken: '',
        followComic: [],
        address: '',
        avatar: '',
        phone: '',
        email: '',
    },
});
const category = ref<Category | null>(null);
const authStore = useAuthStore();
const axiosJwt = createAxiosJwt(authStore.userInfo);
const isFollowed = computed({
    get() {
        if (comicBySlug.value?.comic._id) {
            let x: boolean = authStore.userInfo?.followComic.includes(comicBySlug.value?.comic._id) as boolean;
            return x;
        }
    },
    set(value) {
        isFollowed.value = value;
    },
});

const type = computed(() => {
    if (!isFollowed.value) {
        return 'success';
    } else {
        return 'danger';
    }
});

const handleFollow = async () => {
    try {
        await axiosJwt.put(`/user/follow/${comicBySlug.value?.comic._id}`, {
            headers: {
                token: `Bearer ${authStore.userInfo?.accessToken}`,
            },
        });
        isFollowed.value = true;
    } catch (error) {
        console.error('Failed to follow' + error);
    }
};

const handleUnFollow = async () => {
    try {
        await axiosJwt.put(`/user/unfollow/${comicBySlug.value?.comic._id}`, {
            headers: {
                token: `Bearer ${authStore.userInfo?.accessToken}`,
            },
        });
        isFollowed.value = false;
    } catch (error) {
        console.error('Failed to follow' + error);
    }
};

onMounted(async () => {
    try {
        const res = await axios.get(`/comic/slug/${slug}`);
        const cate = await axios.get(`/category/${res.data.comic.category}`);
        comicBySlug.value = res.data;
        category.value = cate.data;
    } catch (error) {
        console.error('Get Comic By Slug Failed: ' + error);
    }
});

const status = computed(() => (comicBySlug.value?.comic?.status ? 'Đã hoàn thành' : 'Đang tiến hành'));

const urlImage = computed(() => comicBySlug.value?.comic?.image);

const data = computed(() => comicBySlug.value?.comic?.chapters);

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

.el-row {
    margin-bottom: 20px;
}

.el-form {
    --el-form-label-font-size: 18px;
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

.comic-desc-content {
    color: gray;
    font-size: 14px;
}

.shortened {
    /* max-height: 300px; */
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
}

.collapse {
    padding: 10px;
    background-color: #f0f0f0;
    border: 1px solid #ddd;
}

.btn-more {
    padding: 8px 8px 8px 0;
    cursor: pointer;
    color: #2980b9;
    display: flex;
    align-items: center;
}
</style>
