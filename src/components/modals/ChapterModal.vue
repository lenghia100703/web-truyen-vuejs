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
                <el-button type="primary" :loading='chapterLoading' @click="handleUpload"> Xác nhận </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/useAuthStore';
import { ElMessage } from 'element-plus';
import { ChapterServices } from '@/services/chapter/ChapterServices';
import { createAxiosJwt } from '@/utils/createInstance';

const authStore = useAuthStore();
const httpJwt = createAxiosJwt(authStore.userInfo)

const visible = ref<boolean>(false);
const chapterLoading = ref<boolean>(false)
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
    try {
        chapterLoading.value = true
        const formData = new FormData();
        formData.append('title', title.value);
        images.value?.forEach((image, index) => {
            formData.append('images', image, `image${index + 1}`);
        });
        await ChapterServices.create(formData, _id.value, authStore.userInfo, httpJwt)
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
