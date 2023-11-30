<template>
    <el-row class="container" justify="center">
        <el-col :span="24">
            <div class="page-header">
                <span class="description">
                    Truyện đã đăng
                    <span>
                        <ArrowRightBold />
                    </span>
                </span>
            </div>
            <el-table
                :data="tableData"
                v-loading="tableLoading"
                class="table-container"
                empty-text="Chưa đăng truyện nào"
            >
                <el-table-column prop="stt" label="STT" />
                <el-table-column prop="name" label="Tên truyện" width="250">
                    <template v-slot="scope">
                        <router-link :to="`/${path.COMIC_DETAIL(scope.row.slug)}`">{{ scope.row.name }}</router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="numberOfChapter" label="Số chương" />
                <el-table-column prop="view" label="Lượt xem" />
                <el-table-column fixed="right" label="Hành động" width="170">
                    <template v-slot="scope" class="hidden-md-and-up">
                        <el-tooltip content="Sửa" placement="left" effect="light">
                            <el-button type="primary" size="small" @click="updateRef?.openModal(scope.row)" plain>
                                <Edit />
                            </el-button>
                        </el-tooltip>
                        <el-tooltip content="Xóa" placement="right" effect="light">
                            <el-button type="danger" size="small" @click="openDeleteDialog(scope.row)" plain>
                                <Delete />
                            </el-button>
                        </el-tooltip>
                        <el-tooltip content="Đăng chap" placement="right" effect="light">
                            <el-button type="primary" size="small" @click="chapterRef?.openModal(scope.row)" plain>
                                <Upload />
                            </el-button>
                        </el-tooltip>
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
            <div class="btn-add">
                <el-button type="primary" circle size="large" class="btn" @click="postRef?.openModal()">
                    <Plus />
                </el-button>
            </div>
        </el-col>
    </el-row>

    <el-dialog v-model="deleteVisible" title="Xóa truyện" width="30%">
        <span>Bạn có muốn xóa truyện này không ?</span>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="deleteVisible = false">Hủy bỏ</el-button>
                <el-button type="danger" :loading="deleteLoading" @click="handleDelete"> Đồng ý </el-button>
            </span>
        </template>
    </el-dialog>

    <PostModal ref="postRef" :call-function='loadTableData' />
    <ChapterModal ref="chapterRef" :call-function='loadTableData' />
    <UpdateModal ref="updateRef" :call-function='loadTableData' />
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useAuthStore } from '@/stores/useAuthStore';
import { ElMessage } from 'element-plus';
import PostModal from '@/components/modals/PostModal.vue';
import UpdateModal from '@/components/modals/UpdateModal.vue';
import ChapterModal from '@/components/modals/ChapterModal.vue';
import { PostedComicServices } from '@/services/comic/PostedComicServices';
import { createAxiosJwt } from '@/utils/createInstance';
import type { Comic, UserInfo } from '@/interfaces';
import { loadingFullScreen } from '@/utils/loadingFullScreen';
import { path } from '@/constants';
import ArrowRightBold from '@/components/icons/ArrowRightBold.vue';
import Plus from '@/components/icons/Plus.vue'
import Edit from '@/components/icons/Edit.vue';
import Delete from '@/components/icons/Delete.vue';
import Upload from '@/components/icons/Upload.vue';

const authStore = useAuthStore();
const user: UserInfo | null = authStore?.userInfo;
const httpJwt = createAxiosJwt(authStore.userInfo);

const tableData = ref<any[]>([]);
const tableLoading = ref<boolean>(false);
const deleteLoading = ref<boolean>(false);

const postRef = ref<InstanceType<typeof PostModal>>();
const chapterRef = ref<InstanceType<typeof ChapterModal>>();
const updateRef = ref<InstanceType<typeof UpdateModal>>();

const currentPage = ref(1);
const pageSize = ref(5);
const totalComics = ref<number>(0);
const totalData = computed(() => totalComics.value);

const handleSizeChange = () => {};

const loadTableData = async () => {
    try {
        tableLoading.value = true;
        const res = await PostedComicServices.getPostedComicByUser(user, currentPage.value, httpJwt);
        tableData.value = [];
        totalComics.value = res.totalComics;
        res.comics.map((comic: Comic, index: number) => {
            tableData.value.push({
                _id: comic._id,
                stt: index + 1,
                name: comic.name,
                numberOfChapter: comic.chapters.length,
                view: comic.view,
                slug: comic.slug,
                description: comic.description,
            });
        });
        console.log(tableData)
    }
    catch (e) {
        console.error('Failed to get table data' + e);
    } finally {
        tableLoading.value = false
    }
}

const handleCurrentChange = async (val: number) => {
    try {
        await loadTableData()
    } catch (error) {
        console.error('Failed to get table data' + error);
    }
};

onMounted(async () => {
    try {
        loadingFullScreen("Đang xử lý")
        await loadTableData()
    } catch (error) {
        console.error('Failed to get table data' + error);
    }
});

const deleteVisible = ref<boolean>(false);
const deleteForm = ref<string>();

const openDeleteDialog = (row: any) => {
    deleteVisible.value = true;
    deleteForm.value = row._id;
};

const handleDelete = async () => {
    try {
        deleteLoading.value = true;
        await PostedComicServices.delete(deleteForm.value, user, httpJwt);
        await loadTableData()
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
</script>

<style scoped>
.page-header {
    width: 80%;
    margin-bottom: 25px;
    margin-left: auto;
    margin-right: auto;
}

.description {
    display: flex;
    align-items: center;
    font-size: 18px;
}

.pagination {
    margin-top: 12px;
    display: flex;
    justify-content: center;
}

.icon {
    width: 14px;
}

.table-container {
    width: 80%;
    margin-left: auto;
    margin-right: auto;
}

.dialog-header {
    font-size: 18px;
}

.icon {
    width: 20px;
}

.btn-add {
    width: 90%;
    position: fixed;
    bottom: 80px;
    left: 0;
    right: 0;
    margin: 0 auto;
}

.btn {
    float: right;
}

@media only screen and (max-width: 1280px) {
    .page-header {
        width: 100%;
    }
    .table-container {
        width: 100%;
    }
}
</style>
