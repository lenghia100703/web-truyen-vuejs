<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { loadingFullScreen } from '@/utils/loadingFullScreen';
import { UserServices } from '@/services/user/UserServices';
import { useComicStore } from '@/stores/useComicStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { createAxiosJwt } from '@/utils/createInstance';
import { CategoryServices } from '@/services/category/CategoryServices';
import { PostedComicServices } from '@/services/comic/PostedComicServices';
import { ElMessage } from 'element-plus';
import { ComicServices } from '@/services/comic/ComicServices';
import { categoryId } from '@/constants';

const control = ref<string>('all');
const loading = ref<boolean>(false);
const deleteLoading = ref<boolean>(false);
const deleteVisible = ref<boolean>(false);
const deleteForm = ref<string>('');
const comicStore = useComicStore();
const authStore = useAuthStore();
const httpJwt = createAxiosJwt(authStore.userInfo);

const mangaData = ref<any[]>([]);
const manhwaData = ref<any[]>([]);
const manhuaData = ref<any[]>([]);
const allData = ref<any[]>([]);
const allComics = ref<any[]>([]);

const currentPage = ref(1);
const pageSize = ref(10);
const totalData = ref<number>(0);

const handleSizeChange = (val: number) => {};
const handleCurrentChange = async (val: number) => {
    try {
        loading.value = true;
        await comicStore.getAllComics(val);
        allData.value = [];
        comicStore.comics.map(async (comic: any) => {
            const author = await UserServices.getUserById(authStore.userInfo, comic.userId, httpJwt);
            const category = await CategoryServices.getCategoryById(comic.category);
            allData.value.push({
                _id: comic._id,
                name: comic.name,
                author: author.username,
                category: category.name,
                chapterCount: comic.chapters.length,
                likeCount: comic.likeCount,
                followCount: comic.followCount,
            });
        });
    } catch (e) {
        console.error('fail to get all comics ' + e);
    } finally {
        loading.value = false;
    }
};

const openDeleteDialog = (rowData: any) => {
    deleteVisible.value = true;
    deleteForm.value = rowData._id;
};
const handleChangeRadio = () => {
    if (control.value === 'manga') {
        mangaData.value = allComics.value.filter((comic) => comic.category === 'Manga');
    } else if (control.value === 'manhua') {
        manhuaData.value = allComics.value.filter((comic) => comic.category === 'Manhua');
    } else if (control.value === 'manhwa') {
        manhwaData.value = allComics.value.filter((comic) => comic.category === 'Manhwa');
    }
};

const handleDelete = async () => {
    try {
        deleteLoading.value = true;
        await PostedComicServices.delete(deleteForm.value, authStore.userInfo, httpJwt);
        const index = allData.value.findIndex((item: any) => item._id === deleteForm.value);
        if (index !== -1) {
            allData.value.splice(index, 1);
        }
        deleteVisible.value = false;
        ElMessage({
            message: 'Xóa thành công.',
            type: 'success',
        });
    } catch (error) {
        console.error('Failed to delete' + error);
        ElMessage.error('Xóa không thành công.');
    } finally {
        deleteLoading.value = false;
    }
};

onMounted(async () => {
    try {
        loading.value = true;
        loadingFullScreen('Đang xử lý');
        await comicStore.getAllComics(currentPage.value);
        const res = await ComicServices.getComicByPage(0);
        totalData.value = comicStore.totalComics;
        comicStore.comics.map(async (comic: any) => {
            const author = await UserServices.getUserById(authStore.userInfo, comic.userId, httpJwt);
            const category = await CategoryServices.getCategoryById(comic.category);
            allData.value.push({
                _id: comic._id,
                name: comic.name,
                author: author.username,
                category: category.name,
                chapterCount: comic.chapters.length,
                likeCount: comic.likeCount,
                followCount: comic.followCount,
            });
        });

        res.map(async (comic: any) => {
            const author = await UserServices.getUserById(authStore.userInfo, comic.userId, httpJwt);
            const category = await CategoryServices.getCategoryById(comic.category);
            allComics.value.push({
                _id: comic._id,
                name: comic.name,
                author: author.username,
                category: category.name,
                chapterCount: comic.chapters.length,
                likeCount: comic.likeCount,
                followCount: comic.followCount,
            });
        });

        mangaData.value = allComics.value.filter((comic) => comic.category === 'Manga');
        manhuaData.value = allComics.value.filter((comic) => comic.category === 'Manhua');
        manhwaData.value = allComics.value.filter((comic) => comic.category === 'Manhwa');
    } catch (e) {
        console.error(e);
    } finally {
        loading.value = false;
    }
});
</script>

<template>
    <div class="control-group-btn">
        <el-radio-group v-model="control" @change="handleChangeRadio">
            <el-radio-button label="all">Tất cả</el-radio-button>
            <el-radio-button label="manga"> Manga</el-radio-button>
            <el-radio-button label="manhwa"> Manhwa</el-radio-button>
            <el-radio-button label="manhua"> Manhua</el-radio-button>
        </el-radio-group>
    </div>
    <template v-if="control === 'all'">
        <el-table :data="allData" v-loading="loading">
            <el-table-column prop="name" label="Tên truyện" sortable></el-table-column>
            <el-table-column prop="author" label="Tác giả" width="200"></el-table-column>
            <el-table-column prop="category" label="Thể loại" width="120"></el-table-column>
            <el-table-column prop="chapterCount" label="Số chapter" width="120" sortable></el-table-column>
            <el-table-column prop="likeCount" label="Lượt thích" width="120" sortable></el-table-column>
            <el-table-column prop="followCount" label="Lượt theo dõi" width="150" sortable></el-table-column>
            <el-table-column fixed="right" label="Hành động" width="100">
                <template v-slot="scope" class="hidden-md-and-up">
                    <el-button type="danger" size="small" @click="openDeleteDialog(scope.row)" plain>Xóa</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div class="pagination">
            <el-pagination
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
                :background="true"
                layout="prev, pager, next, jumper"
                :total="totalData"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            />
        </div>
    </template>

    <template v-if="control === 'manga'">
        <el-table :data="mangaData" v-loading="loading">
            <el-table-column prop="name" label="Tên truyện" sortable></el-table-column>
            <el-table-column prop="author" label="Tác giả" width="200"></el-table-column>
            <el-table-column prop="category" label="Thể loại" width="120"></el-table-column>
            <el-table-column prop="chapterCount" label="Số chapter" width="120" sortable></el-table-column>
            <el-table-column prop="likeCount" label="Lượt thích" width="120" sortable></el-table-column>
            <el-table-column prop="followCount" label="Lượt theo dõi" width="150" sortable></el-table-column>
            <el-table-column fixed="right" label="Hành động" width="100">
                <template v-slot="scope" class="hidden-md-and-up">
                    <el-button type="danger" size="small" @click="openDeleteDialog(scope.row)" plain>Xóa</el-button>
                </template>
            </el-table-column>
        </el-table>
    </template>

    <template v-if="control === 'manhwa'">
        <el-table :data="manhwaData" v-loading="loading">
            <el-table-column prop="name" label="Tên truyện" sortable></el-table-column>
            <el-table-column prop="author" label="Tác giả" width="200"></el-table-column>
            <el-table-column prop="category" label="Thể loại" width="120"></el-table-column>
            <el-table-column prop="chapterCount" label="Số chapter" width="120" sortable></el-table-column>
            <el-table-column prop="likeCount" label="Lượt thích" width="120" sortable></el-table-column>
            <el-table-column prop="followCount" label="Lượt theo dõi" width="150" sortable></el-table-column>
            <el-table-column fixed="right" label="Hành động" width="100">
                <template v-slot="scope" class="hidden-md-and-up">
                    <el-button type="danger" size="small" @click="openDeleteDialog(scope.row)" plain>Xóa</el-button>
                </template>
            </el-table-column>
        </el-table>
    </template>

    <template v-if="control === 'manhua'">
        <el-table :data="manhuaData" v-loading="loading">
            <el-table-column prop="name" label="Tên truyện" sortable></el-table-column>
            <el-table-column prop="author" label="Tác giả" width="200"></el-table-column>
            <el-table-column prop="category" label="Thể loại" width="120"></el-table-column>
            <el-table-column prop="chapterCount" label="Số chapter" width="120" sortable></el-table-column>
            <el-table-column prop="likeCount" label="Lượt thích" width="120" sortable></el-table-column>
            <el-table-column prop="followCount" label="Lượt theo dõi" width="150" sortable></el-table-column>
            <el-table-column fixed="right" label="Hành động" width="100">
                <template v-slot="scope" class="hidden-md-and-up">
                    <el-button type="danger" size="small" @click="openDeleteDialog(scope.row)" plain>Xóa</el-button>
                </template>
            </el-table-column>
        </el-table>
    </template>

    <el-dialog v-model="deleteVisible" title="Xóa truyện" width="30%">
        <span>Bạn có muốn xóa truyện này không ?</span>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="deleteVisible = false">Hủy bỏ</el-button>
                <el-button type="danger" :loading="deleteLoading" @click="handleDelete"> Đồng ý </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<style scoped>
.control-group-btn {
    display: flex;
    justify-content: center;
    margin-bottom: 30px;
}

.pagination {
    margin-top: 12px;
    display: flex;
    justify-content: center;
}
</style>
