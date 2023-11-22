<template>
    <el-dialog v-model="visible" title="Đăng chương truyện" width="40%">
        <el-form :model="uploadForm" label-position="top" ref="uploadModalFormRef">
            <el-form-item
                label="Tên chương truyện"
                prop="title"
                :rules="[
                    {
                        required: true,
                        message: 'Vui lòng nhập tên chương truyện',
                        trigger: 'blur',
                    },
                ]"
            >
                <el-input autocomplete="off" type="text" v-model="uploadForm.title" />
            </el-form-item>
            <el-form-item
                label="Chọn ảnh cho truyện"
                prop="images"
                :rules="[
                    {
                        required: true,
                        message: 'Vui lòng chọn ảnh cho chapter',
                        trigger: ['change', 'blur'],
                    },
                ]"
            >
                <input type="file" multiple ref="imageInput" @change="handleChangeImages" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="visible = false">Huỷ bỏ</el-button>
                <el-button type="primary" :loading="chapterLoading" @click="submitForm(uploadModalFormRef)">
                    Xác nhận
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { useAuthStore } from '@/stores/useAuthStore';
import { ElMessage, ElForm } from 'element-plus';
import { ChapterServices } from '@/services/chapter/ChapterServices';
import { createAxiosJwt } from '@/utils/createInstance';

const authStore = useAuthStore();
const httpJwt = createAxiosJwt(authStore.userInfo);
const props = defineProps<{
    tableData: any;
}>();

const uploadModalFormRef = ref<typeof ElForm | null>(null);
const visible = ref<boolean>(false);
const chapterLoading = ref<boolean>(false);
const imageInput = ref<HTMLInputElement | null>(null);
const images = ref<any[]>([]);
const uploadForm = reactive<{
    _id: string;
    title: string;
    images: any[] | null;
}>({
    _id: '',
    title: '',
    images: null,
});
const handleChangeImages = () => {
    if (imageInput.value?.files) {
        uploadForm.images = Array.from(imageInput.value.files);
        images.value = Array.from(imageInput.value.files);
    }
};

const openModal = (rowData: any) => {
    visible.value = true;
    uploadForm._id = rowData._id;
};

const handleUpload = async (data: any) => {
    try {
        chapterLoading.value = true;
        const formData = new FormData();
        formData.append('title', data.title);
        data.images?.forEach((image: any, index: number) => {
            formData.append('images', image, `image${index + 1}`);
        });
        const res = await ChapterServices.create(formData, data._id, authStore.userInfo, httpJwt);
        visible.value = false;
        const index = props.tableData.findIndex((item: any) => item._id === data._id);
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
        data._id = '';
        data.title = '';
        data.images = [];
        ElMessage({
            message: 'Đăng chương truyện thành công.',
            type: 'success',
        });
    } catch (error) {
        console.error('Failed to upload chapter' + error);
        data._id = '';
        data.title = '';
        data.images = [];
        ElMessage.error('Đăng thất bại.');
    } finally {
        chapterLoading.value = false;
    }
};

const submitForm = (formEl: typeof ElForm | null) => {
    if (!formEl) return;
    formEl.validate((valid: any) => {
        if (valid) {
            handleUpload(uploadForm);
        } else {
            return false;
        }
    });
};

defineExpose({
    openModal,
});
</script>
