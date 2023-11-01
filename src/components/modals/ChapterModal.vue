<template>
    <el-dialog v-model="visible" title="Đăng chương truyện" width="40%">
        <el-form :model="uploadForm" label-position="top">
            <el-form-item label="Tên chương truyện">
                <el-input autocomplete="off" type="text" v-model="title" />
            </el-form-item>
            <el-form-item label="Chọn ảnh cho truyện">
                <input type="file" multiple ref="imageInput" @change="handleChangeImages" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="visible = false">Huỷ bỏ</el-button>
                <el-button type="primary" @click="handleUpload"> Xác nhận </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { createAxiosJwt } from '@/utils/createInstance';
import { useAuthStore } from '../../stores/useAuthStore';
import { ElMessage } from 'element-plus';

const authStore = useAuthStore();
const axiosJwt = createAxiosJwt(authStore.userInfo);

const visible = ref<boolean>(false);
const imageInput = ref<HTMLInputElement | null>(null);
const images = ref<any[]>([]);
const uploadForm = ref<{
    _id: string;
    title: string;
}>();
const _id = ref<string>('');
const title = ref<string>('');

const handleChangeImages = () => {
    if (imageInput.value?.files) {
        images.value = Array.from(imageInput.value.files);
    }
};

const openModal = (rowData: any) => {
    visible.value = true;
    _id.value = rowData._id;
};

const handleUpload = async () => {
    const formData = new FormData();
    formData.append('title', title.value);
    images.value?.forEach((image, index) => {
        formData.append('images', image, `image${index + 1}`);
    });
    try {
        await axiosJwt.put(`/chapter/${_id.value}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                token: `Bearer ${authStore.userInfo?.accessToken}`,
            },
        });
        visible.value = false;
        ElMessage({
            message: 'Đăng chương truyện thành công.',
            type: 'success',
        });
    } catch (error) {
        console.error('Failed to upload chapter' + error);
        visible.value = true;
        ElMessage.error('Đăng thất bại.');
    }
};

defineExpose({
    openModal,
});
</script>
