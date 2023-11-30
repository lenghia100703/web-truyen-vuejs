<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import { loadingFullScreen } from '@/utils/loadingFullScreen';
import CreateAccountModal from '@/components/modals/CreateAccountModal.vue';
import UpdateAccountModal from '@/components/modals/UpdateAccountModal.vue';
import { UserServices } from '@/services/user/UserServices';
import { useAuthStore } from '@/stores/useAuthStore';
import { createAxiosJwt } from '@/utils/createInstance';
import { ElMessage } from 'element-plus';
import ArrowRightBold from '@/components/icons/ArrowRightBold.vue';
import Plus from '@/components/icons/Plus.vue';
import Edit from '@/components/icons/Edit.vue';
import Delete from '@/components/icons/Delete.vue';
import { PostedComicServices } from '@/services/comic/PostedComicServices';
import { Comic } from '@/interfaces';

const authStore = useAuthStore();
const httpJwt = createAxiosJwt(authStore.userInfo);
const tableLoading = ref<boolean>(false);
const createRef = ref<InstanceType<typeof CreateAccountModal>>();
const updateRef = ref<InstanceType<typeof UpdateAccountModal>>();
const tableData = ref<any[]>([]);
const deleteVisible = ref<boolean>(false);
const deleteLoading = ref<boolean>(false);
const deleteForm = ref<string>('');

const openDeleteDialog = (rowData: any) => {
    deleteVisible.value = true;
    deleteForm.value = rowData._id;
};

const currentPage = ref(1);
const pageSize = ref(5);
const totalData = ref<number>(0);

const handleSizeChange = (val: number) => {
};


const loadTableData = async () => {
    try {
        tableLoading.value = true;
        tableData.value = []
        const res = await UserServices.getAll(authStore.userInfo, currentPage.value, httpJwt);
        tableData.value = res.accounts;
        totalData.value = res.totalAccounts;
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
    } catch (e) {
        console.error('fail to get all comics ' + e);
    }
};

const handleDelete = async () => {
    try {
        deleteLoading.value = true;
        await UserServices.delete(authStore.userInfo, deleteForm.value, httpJwt);
        await loadTableData()
        deleteVisible.value = false;
        ElMessage({
            message: 'Xóa thành công.',
            type: 'success',
        });
    } catch (e) {
        console.error(e);
        ElMessage.error('Xóa không thành công.');
    } finally {
        deleteLoading.value = false;
    }
};

onMounted(async () => {
    loadingFullScreen('Đang xử lý');
    try {
        await loadTableData()
    } catch (e) {
        console.error(e);
    }
});
</script>

<template>
    <el-row class='container' justify='center'>
        <el-col :span='24'>
            <div class='page-header'>
                <span class='description'>
                    Quản lý tài khoản người dùng
                    <span>
                        <ArrowRightBold />
                    </span>
                </span>
            </div>
            <el-table
                :data='tableData'
                v-loading='tableLoading'
                class='table-container'
                empty-text='Chưa có tài khoản nào'
            >
                <el-table-column prop='username' label='Họ tên' />
                <el-table-column prop='email' label='Email' width='280' />
                <el-table-column prop='phone' label='Số điện thoại' />
                <el-table-column prop='address' label='Địa chỉ' width='280' />
                <el-table-column fixed='right' label='Hành động' width='150'>
                    <template v-slot='scope' class='hidden-md-and-up'>
                        <el-tooltip content='Sửa' placement='left' effect='light'>
                            <el-button type='primary' size='small' @click='updateRef?.openModal(scope.row)' plain>
                                <Edit />
                            </el-button>
                        </el-tooltip>
                        <el-tooltip content='Xóa' placement='right' effect='light'>
                            <el-button type='danger' size='small' @click='openDeleteDialog(scope.row)' plain>
                                <Delete />
                            </el-button>
                        </el-tooltip>
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
                <el-button type='primary' circle size='large' class='btn' @click='createRef?.openModal()'>
                    <Plus />
                </el-button>
            </div>
        </el-col>
    </el-row>

    <el-dialog v-model='deleteVisible' title='Xóa truyện' width='30%'>
        <span>Bạn có muốn xóa tài khoản này không ?</span>
        <template #footer>
            <span class='dialog-footer'>
                <el-button @click='deleteVisible = false'>Hủy bỏ</el-button>
                <el-button type='danger' :loading='deleteLoading' @click='handleDelete'> Đồng ý </el-button>
            </span>
        </template>
    </el-dialog>

    <CreateAccountModal :call-function='loadTableData' ref='createRef' />
    <UpdateAccountModal :call-function='loadTableData' ref='updateRef' />
</template>

<style scoped>
.page-header {
    width: 90%;
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
    width: 90%;
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
