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

const visible = ref<boolean>(false);
const imageInput = ref<HTMLInputElement | null>(null);
const images = ref<any[]>([]);
const uploadForm = ref<{
    _id: string;
    title: string;
}>();
const title = ref<string>('');

const handleChangeImages = () => {
    if (imageInput.value?.files) {
        images.value = Array.from(imageInput.value.files);
    }
};

const handleUpload = () => {};

const openModal = () => {
    visible.value = true;
};

defineExpose({
    openModal,
});
</script>
