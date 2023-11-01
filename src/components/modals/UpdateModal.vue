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
import { ref } from 'vue';

const visible = ref<boolean>(false);
const updateForm = ref<Comic>();
const name = ref<string>('');
const description = ref<string>('');
const slug = ref<string>('');

const handleUpdate = () => {};

const openModal = (rowData: any) => {
    visible.value = true;
    name.value = rowData.name;
    description.value = rowData.description;
    slug.value = rowData.slug;
};

defineExpose({
    openModal,
});
</script>
