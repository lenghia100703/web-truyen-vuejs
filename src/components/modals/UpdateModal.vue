<template>
    <el-dialog v-model="visible" title="Chỉnh sửa truyện" width="50%">
        <el-form :model="updateForm" label-position="top">
            <el-form-item label="Tên truyện">
                <el-input v-model="name" autocomplete="off" type="text" />
            </el-form-item>
            <el-form-item label="Mô tả truyện">
                <el-input v-model="description" type="textarea" />
            </el-form-item>
            <el-form-item label="Đường dẫn truyện">
                <el-input v-model="slug" autocomplete="off" type="text" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="visible = false">Huỷ bỏ</el-button>
                <el-button type="primary" :loading='updateLoading' @click="handleUpdate"> Xác nhận </el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script lang="ts" setup>
import { ElMessage } from 'element-plus';
import { ref } from 'vue';
import { useAuthStore } from '@/stores/useAuthStore';
import { PostedComicServices } from '@/services/comic/PostedComicServices';
import { createAxiosJwt } from '@/utils/createInstance';
import type { Comic } from '@/interfaces';
const authStore = useAuthStore();
const httpJwt = createAxiosJwt(authStore.userInfo);
const props = defineProps<{
    tableData: any[];
}>();

const visible = ref<boolean>(false);
const updateLoading = ref<boolean>(false)
const updateForm = ref<Comic | null>(null);
const _id = ref<string>('');
const name = ref<string>('');
const description = ref<string>('');
const slug = ref<string>('');

const openModal = (rowData: any) => {
    visible.value = true;
    _id.value = rowData._id;
    name.value = rowData.name;
    description.value = rowData.description;
    slug.value = rowData.slug;
};

const handleUpdate = async () => {
    const data = {
        name: name.value,
        description: description.value,
        slug: slug.value,
    };
    try {
        updateLoading.value = true
        const res = await PostedComicServices.update(_id.value, authStore.userInfo, data, httpJwt);
        const index = props.tableData.findIndex((item: any) => item._id === _id.value);
        if (index !== -1) {
            props.tableData[index] = {
                _id: res._id,
                stt: index + 1,
                name: res.name,
                numberOfChapter: res.chapters.length,
                view: res.view,
                slug: res.slug,
                description: res.description,
            };
        }
        visible.value = false;
        ElMessage({
            message: 'Sửa thành công.',
            type: 'success',
        });
    } catch (error) {
        console.error('Failed to update' + error);
        visible.value = true;
        ElMessage.error('Sửa thất bại.');
    }
};

defineExpose({
    openModal,
});
</script>
