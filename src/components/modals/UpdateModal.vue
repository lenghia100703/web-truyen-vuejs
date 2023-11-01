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
                <el-button type="primary" @click="handleUpdate"> Xác nhận </el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script lang="ts" setup>
import type { Comic } from '@/views/ComicDetailView.vue';
import { ElMessage } from 'element-plus';
import { ref } from 'vue';
import { createAxiosJwt } from '@/utils/createInstance';
import { useAuthStore } from '@/stores/useAuthStore';

const authStore = useAuthStore();
const axiosJwt = createAxiosJwt(authStore.userInfo);

const props = defineProps<{
    tableData: any[];
}>();

const visible = ref<boolean>(false);
const updateForm = ref<Comic>();
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
        const res = await axiosJwt.put(`/post/${_id.value}`, data, {
            headers: {
                token: `Bearer ${authStore.userInfo?.accessToken}`,
            },
        });
        const index = props.tableData.findIndex((item: any) => item._id === _id.value);
        if (index !== -1) {
            props.tableData[index] = {
                _id: res.data._id,
                stt: index + 1,
                name: res.data.name,
                numberOfChapter: res.data.chapters.length,
                view: res.data.view,
                slug: res.data.slug,
                description: res.data.description,
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
