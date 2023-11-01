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
            <el-col :span='5'>
                <el-image class='image' :src='urlImage' fit='cover' />
            </el-col>
            <el-col :span='16'>
                <el-form label-position='left' label-width='150px'>
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
                    <el-button :type='type'>{{ isFollowed ? 'Theo dõi' : 'Hủy theo dõi' }}</el-button>
                    <span class='follow-text'>{{ comicBySlug?.comic?.followCount }} Lượt theo dõi</span>
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
                        <svg
                            viewBox='0 0 1024 1024'
                            xmlns='http://www.w3.org/2000/svg'
                            data-v-ea893728=''
                            class='icon'
                        >
                            <path
                                fill='currentColor'
                                d='M340.864 149.312a30.592 30.592 0 0 0 0 42.752L652.736 512 340.864 831.872a30.592 30.592 0 0 0 0 42.752 29.12 29.12 0 0 0 41.728 0L714.24 534.336a32 32 0 0 0 0-44.672L382.592 149.376a29.12 29.12 0 0 0-41.728 0z'
                            ></path>
                        </svg>
                    </span>
                </span>
            </el-col>
        </el-row>
        <el-row justify='center'>
            <el-col :span='21' class='description'> DANH SÁCH CHƯƠNG</el-col>
        </el-row>
        <el-row justify='center'>
            <el-col :span='21'>
                <el-table :data='data' @row-click='handleRowClick'>
                    <el-table-column label='Số chương' prop='title'></el-table-column>
                    <el-table-column label='Ngày đăng' prop='time'></el-table-column>
                    <el-table-column label='Lượt xem' prop='view'></el-table-column>
                </el-table>
            </el-col>
        </el-row>
    </div>
</template>

<script lang='ts' setup>
import { useRoute } from 'vue-router';
import { computed, onMounted, ref } from 'vue';
import router from '@/router/index';
import type { UserInfo } from '@/stores/useAuthStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { UserServices } from '@/services/user/UserServices';
import { ComicServices } from '@/services/comic/ComicServices';
import { CategoryServices } from '@/services/category/CategoryServices';
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
const httpJwt = createAxiosJwt(authStore.userInfo);
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
        await UserServices.unFollow(comicBySlug.value?.comic._id, authStore.userInfo, httpJwt);
        isFollowed.value = true;
    } catch (error) {
        console.error('Failed to follow' + error);
    }
};

const handleUnFollow = async () => {
    try {
        await UserServices.follow(comicBySlug.value?.comic._id, authStore.userInfo, httpJwt);
        isFollowed.value = false;
    } catch (error) {
        console.error('Failed to follow' + error);
    }
};

onMounted(async () => {
    try {
        const res = await ComicServices.getComicBySlug(slug);
        const cate = await CategoryServices.getCategoryById(res.comic.category);
        comicBySlug.value = res;
        category.value = cate;
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
    height: auto
}

.form-item {
    margin-bottom: 12px
}

.follow-text {
    margin-left: 8px
}

.icon {
    width: 1em;
    height: 1em;
    margin-top: 8px
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
    color: rgb(128, 128, 128);
    font-size: 14px;
}


.btn-more {
    padding: 8px 8px 8px 0;
    cursor: pointer;
    color: #2980b9;
    display: flex;
    align-items: center;
}
</style>
