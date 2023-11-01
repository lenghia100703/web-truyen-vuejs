<template>
    <div class="container">
        <el-table :data="tableData" style="width: 80%">
            <el-table-column prop="stt" label="STT" />
            <el-table-column prop="name" label="Tên truyện" width="300">
                <template v-slot="scope">
                    <router-link :to="`/truyen-tranh/${scope.row.slug}`">{{ scope.row.name }}</router-link>
                </template>
            </el-table-column>
            <el-table-column prop="numberOfChapter" label="Số chương" />
            <el-table-column prop="view" label="Lượt xem" />
            <el-table-column fixed="right" label="Hành động" width="250">
                <template v-slot="scope">
                    <el-button type="primary" size="small" @click="updateRef?.openModal(scope.row)" plain
                        >Sửa</el-button
                    >
                    <el-button type="danger" size="small" @click="openDeleteDialog(scope.row)" plain>Xóa</el-button>
                    <el-button type="primary" size="small" @click="chapterRef?.openModal(scope.row)" plain
                        >Đăng chương</el-button
                    >
                </template>
            </el-table-column>
        </el-table>
        <div class="btn-add">
            <el-button type="primary" circle style="width: 40px; height: 40px" @click="postRef?.openModal()">
                <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ea893728="" size="">
                    <path
                        fill="currentColor"
                        d="M480 480V128a32 32 0 0 1 64 0v352h352a32 32 0 1 1 0 64H544v352a32 32 0 1 1-64 0V544H128a32 32 0 0 1 0-64h352z"
                    ></path>
                </svg>
            </el-button>
        </div>
    </div>

    <el-dialog v-model="deleteVisible" title="Xóa truyện" width="50%">
        <span style="font-size: 18px">Bạn có muốn xóa truyện này không ?</span>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="deleteVisible = false">Hủy bỏ</el-button>
                <el-button type="primary" @click="handleDelete"> Đồng ý </el-button>
            </span>
        </template>
    </el-dialog>

    <PostModal ref="postRef" />
    <ChapterModal ref="chapterRef" />
    <UpdateModal ref="updateRef" :tableData="tableData" />
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import { createAxiosJwt } from '@/utils/createInstance';
import { useAuthStore } from '@/stores/useAuthStore';
import type { Comic } from '@/views/ComicDetailView.vue';
import type { UserInfo } from '../stores/useAuthStore';
import { ElMessage } from 'element-plus';
import PostModal from '@/components/modals/PostModal.vue';
import UpdateModal from '@/components/modals/UpdateModal.vue';
import ChapterModal from '@/components/modals/ChapterModal.vue';

const authStore = useAuthStore();
const user: UserInfo | null = authStore?.userInfo;
const axiosJwt = createAxiosJwt(user);

const tableData = reactive<any>([]);

const postRef = ref<InstanceType<typeof PostModal>>();
const chapterRef = ref<InstanceType<typeof ChapterModal>>();
const updateRef = ref<InstanceType<typeof UpdateModal>>();

onMounted(async () => {
    try {
        const res = await axiosJwt.get(`/post/${user?._id}`, {
            headers: {
                token: `Bearer ${user?.accessToken}`,
            },
        });
        res.data.map((comic: Comic, index: number) => {
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
    }
});

const deleteVisible = ref<boolean>(false);
const deleteForm = ref<string>();

const openDeleteDialog = (row: any) => {
    deleteVisible.value = true;
    deleteForm.value = row._id;
};

const handleDelete = async () => {
    deleteVisible.value = false;
    try {
        await axiosJwt.delete(`/post/${deleteForm.value}`, {
            headers: {
                token: `Bearer ${user?.accessToken}`,
            },
        });
        const index = tableData.findIndex((item: any) => item._id === deleteForm.value);
        if (index !== -1) {
            tableData.splice(index, 1);
        }

        ElMessage({
            message: 'Xóa thành công.',
            type: 'success',
        });
    } catch (error) {
        console.error('Failed to delete' + error);
        ElMessage.error('Xóa không thành công.');
    }
};
</script>

<style scoped>
.container {
    display: flex;
    justify-content: center;
}

.btn-add {
    position: absolute;
    bottom: 90px;
    right: 290px;
}
</style>
