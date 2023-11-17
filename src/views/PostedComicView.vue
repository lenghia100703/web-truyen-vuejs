<template>
    <el-row class='container' justify='center'>
        <el-col :span="24" >
            <div class='page-header'>
            <span class='description'>
                Truyện đã đăng
                <span>
                    <svg viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' data-v-ea893728='' class='icon'><path
                        fill='currentColor'
                        d='M338.752 104.704a64 64 0 0 0 0 90.496l316.8 316.8-316.8 316.8a64 64 0 0 0 90.496 90.496l362.048-362.048a64 64 0 0 0 0-90.496L429.248 104.704a64 64 0 0 0-90.496 0z'></path></svg>
                </span>
            </span>
            </div>
            <el-table :data='tableData' v-loading='tableLoading'  class='table-container' empty-text='Chưa đăng truyện nào'>
                <el-table-column prop='stt' label='STT' />
                <el-table-column prop='name' label='Tên truyện' width='250'>
                    <template v-slot='scope'>
                        <router-link :to='`/truyen-tranh/${scope.row.slug}`'>{{ scope.row.name }}</router-link>
                    </template>
                </el-table-column>
                <el-table-column prop='numberOfChapter' label='Số chương' />
                <el-table-column prop='view' label='Lượt xem' />
                <el-table-column fixed='right' label='Hành động' width='250'>
                    <template v-slot='scope' class='hidden-md-and-up'>
                        <el-button type='primary' size='small' @click='updateRef?.openModal(scope.row)' plain>
                            Sửa
                        </el-button>
                        <el-button type='danger' size='small' @click='openDeleteDialog(scope.row)' plain>Xóa</el-button>
                        <el-button type='primary' size='small' @click='chapterRef?.openModal(scope.row)' plain
                        >Đăng chương
                        </el-button>
                    </template>

                </el-table-column>
            </el-table>

            <div class='pagination'>
                <el-pagination
                    v-model:current-page='currentPage'
                    v-model:page-size='pageSize'
                    :background='true'
                    layout='prev, pager, next, jumper'
                    :total='totalData'
                    @size-change='handleSizeChange'
                    @current-change='handleCurrentChange'
                />
            </div>
            <div class='btn-add'>
                <el-button type='primary' circle size='large' class='btn' @click='postRef?.openModal()'>
                    <svg viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' data-v-ea893728='' class='icon'>
                        <path
                            fill='currentColor'
                            d='M480 480V128a32 32 0 0 1 64 0v352h352a32 32 0 1 1 0 64H544v352a32 32 0 1 1-64 0V544H128a32 32 0 0 1 0-64h352z'
                        ></path>
                    </svg>
                </el-button>
            </div>
        </el-col>
    </el-row>

    <el-dialog v-model='deleteVisible' title='Xóa truyện' width='30%'>
        <span >Bạn có muốn xóa truyện này không ?</span>
        <template #footer>
            <span class='dialog-footer'>
                <el-button @click='deleteVisible = false'>Hủy bỏ</el-button>
                <el-button type='danger' :loading='deleteLoading' @click='handleDelete'> Đồng ý </el-button>
            </span>
        </template>
    </el-dialog>

    <PostModal ref='postRef' />
    <ChapterModal ref='chapterRef' />
    <UpdateModal ref='updateRef' :tableData='tableData' />
</template>

<script lang='ts' setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { useAuthStore } from '@/stores/useAuthStore';
import { ElMessage } from 'element-plus';
import PostModal from '@/components/modals/PostModal.vue';
import UpdateModal from '@/components/modals/UpdateModal.vue';
import ChapterModal from '@/components/modals/ChapterModal.vue';
import { PostedComicServices } from '@/services/comic/PostedComicServices';
import { createAxiosJwt } from '@/utils/createInstance';
import type { Comic, UserInfo } from '@/interfaces';

const authStore = useAuthStore();
const user: UserInfo | null = authStore?.userInfo;
const httpJwt = createAxiosJwt(authStore.userInfo);

let tableData = reactive<any>([]);
const tableLoading = ref<boolean>(false)
const deleteLoading = ref<boolean>(false)

const postRef = ref<InstanceType<typeof PostModal>>();
const chapterRef = ref<InstanceType<typeof ChapterModal>>();
const updateRef = ref<InstanceType<typeof UpdateModal>>();

const currentPage = ref(1);
const pageSize = ref(3);
const totalData = computed(() => tableData.length)

console.log(totalData)
const handleSizeChange = () => {

};

const handleCurrentChange = (val: number) => {
    console.log(val)
};

onMounted(async () => {
    try {
        tableLoading.value = true
        const res = await PostedComicServices.getPostedComicByUser(user, httpJwt);
        res.map((comic: Comic, index: number) => {
            tableData.push({
                _id: comic._id,
                stt: index + 1,
                name: comic.name,
                numberOfChapter: comic.chapters.length,
                view: comic.view,
                slug: comic.slug,
                description: comic.description,
            });
        });
    } catch (error) {
        console.error('Failed to get table data' + error);
    } finally {
        tableLoading.value = false
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
        const index = tableData.findIndex((item: any) => item._id === deleteForm.value);
        if (index !== -1) {
            tableData.splice(index, 1);
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
    font-weight: 400;
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
