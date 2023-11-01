<template>
    <el-dialog v-model='visible' title='Chỉnh sửa truyện' width='60%'>
        <el-form :model='postForm' label-position='top'>
            <el-form-item label='Tên truyện'>
                <el-input v-model='name' type='text' />
            </el-form-item>
            <el-form-item label='Mô tả truyện'>
                <el-input v-model='description' type='textarea' />
            </el-form-item>
            <el-form-item label='Chọn thể loại'>
                <el-select v-model='category' class='m-2' placeholder='Các thể loại truyện'>
                    <el-option v-for='(item, index) in options' :key='index' :label='item.label' :value='item.value' />
                </el-select>
            </el-form-item>
            <el-form-item label='Đường dẫn truyện'>
                <el-input v-model='slug' type='text' />
            </el-form-item>
            <el-form-item label='Chọn image cho truyện'>
                <input type='file' ref='imageInput' @change='handleChangeImage' />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class='dialog-footer'>
                <el-button @click='visible = false'>Huỷ bỏ</el-button>
                <el-button type='primary' @click='handleCreate'> Xác nhận </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang='ts' setup>
import { ref, computed } from 'vue';
import type { Comic } from '@/views/ComicDetailView.vue';
import useCategoryStore from '@/stores/useCategoryStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { loadingFullScreen } from '@/utils/loadingFullScreen';
import { ElMessage } from 'element-plus';
import router from '@/router';
import { PostedComicServices } from '@/services/comic/PostedComicServices';
import { createAxiosJwt } from '@/utils/createInstance';

interface Option {
    value: string;
    label: string;
}

const postForm = ref<Comic>();
const visible = ref<boolean>(false);
const categoryStore = useCategoryStore();
const authStore = useAuthStore();
const httpJwt = createAxiosJwt(authStore.userInfo)

const categories = computed(() => categoryStore.categories);

const options: Option[] = [];

for (const category of categories.value) {
    options.push({
        label: category.name,
        value: category._id,
    });
}

const name = ref<string>('');
const description = ref<string>('');
const category = ref<string>('');
const slug = ref<string>('');

const image = ref<any | null>();
const imageInput = ref<HTMLInputElement | null>(null);
const handleChangeImage = () => {
    if (imageInput.value?.files && imageInput.value?.files[0]) {
        image.value = imageInput.value.files[0];
        console.log(image.value);
    }
};

async function openModal() {
    visible.value = true;
}

defineExpose({
    openModal,
});

const handleCreate = async () => {
    const formData = new FormData();
    formData.append('name', name.value);
    formData.append('description', description.value);
    formData.append('category', category.value);
    formData.append('slug', slug.value);
    formData.append('image', image.value);
    try {
        await PostedComicServices.create(formData, authStore.userInfo, httpJwt);
        loadingFullScreen();
        ElMessage({
            message: 'Đăng truyện thành công.',
            type: 'success',
        });
        await router.push({ name: 'home' });
    } catch (error) {
        console.error('Failed to post comic' + error);
        ElMessage.error('Đăng truyện thất bại.');
    }
};
</script>
