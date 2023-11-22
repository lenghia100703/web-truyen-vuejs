<template>
    <el-dialog v-model="visible" title="Đăng truyện mới" width="60%">
        <el-form :model="postForm" label-position="top" ref="postModalFormRef">
            <el-form-item
                label="Tên truyện"
                prop="name"
                :rules="[
                    {
                        required: true,
                        message: 'Vui lòng nhập tên truyện',
                        trigger: 'blur',
                    },
                ]"
            >
                <el-input v-model="postForm.name" type="text" />
            </el-form-item>
            <el-form-item label="Mô tả truyện" prop="description">
                <el-input v-model="postForm.description" type="textarea" />
            </el-form-item>
            <el-form-item
                label="Chọn thể loại"
                prop="category"
                :rules="[
                    {
                        required: true,
                        message: 'Vui lòng chọn thể loại truyện',
                        trigger: ['change', 'blur'],
                    },
                ]"
            >
                <el-select
                    v-model="postForm.category"
                    class="m-2"
                    placeholder="Các thể loại truyện"
                    @change="handleChooseCategory"
                >
                    <el-option v-for="(item, index) in options" :key="index" :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item
                label="Đường dẫn truyện"
                prop="slug"
                :rules="[
                    {
                        required: true,
                        message: 'Vui lòng nhập đường dẫn truyện',
                        trigger: 'blur',
                    },
                ]"
            >
                <el-input v-model="postForm.slug" type="text" />
            </el-form-item>
            <el-form-item
                label="Chọn image cho truyện"
                prop="image"
                :rules="[
                    {
                        required: true,
                        message: 'Vui lòng chọn ảnh cho truyện',
                        trigger: ['change', 'blur'],
                    },
                ]"
            >
                <input type="file" ref="imageInput" @change="handleChangeImage" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="visible = false">Huỷ bỏ</el-button>
                <el-button type="primary" :loading="postLoading" @click="submitForm(postModalFormRef)">
                    Xác nhận
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive } from 'vue';
import { useAuthStore } from '@/stores/useAuthStore';
import { ElForm, ElMessage } from 'element-plus';
import { PostedComicServices } from '@/services/comic/PostedComicServices';
import { createAxiosJwt } from '@/utils/createInstance';
import { categoryId } from '@/constants';

interface Option {
    value: string;
    label: string;
}

const props = defineProps<{
    tableData: any;
}>();

const postForm = reactive<{
    name: string;
    description: string;
    category: string;
    slug: string;
    image: any | null;
}>({
    name: '',
    description: '',
    category: '',
    slug: '',
    image: null,
});

const postModalFormRef = ref<typeof ElForm | null>(null);
const postLoading = ref<boolean>(false);
const visible = ref<boolean>(false);
const authStore = useAuthStore();
const httpJwt = createAxiosJwt(authStore.userInfo);

const options = ref<Option[]>([
    {
        label: 'Manga',
        value: categoryId.MANGA,
    },
    {
        label: 'Manhua',
        value: categoryId.MANHUA,
    },
    {
        label: 'Manhwa',
        value: categoryId.MANHWA,
    },
]);

const image = ref<any | null>();
const imageInput = ref<HTMLInputElement | null>(null);

const handleChangeImage = () => {
    if (imageInput.value?.files && imageInput.value?.files[0]) {
        const selectedImage = imageInput.value.files[0];
        postForm.image = selectedImage;
        image.value = selectedImage;
    }
};

const handleChooseCategory = () => {
    console.log(postForm.category);
};

async function openModal() {
    visible.value = true;
}

defineExpose({
    openModal,
});

const handleCreate = async (data: any) => {
    try {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('category', data.category);
        formData.append('slug', data.slug);
        formData.append('image', data.image);
        console.log(data);
        postLoading.value = true;
        const res = await PostedComicServices.create(formData, authStore.userInfo, httpJwt);
        visible.value = false;
        props.tableData.push({
            _id: res._id,
            stt: props.tableData.length + 1,
            name: res.name,
            numberOfChapter: res.chapters.length,
            view: res.view,
            slug: res.slug,
            description: res.description,
        });
        data.name = '';
        data.description = '';
        data.category = '';
        data.slug = '';
        data.image = null;
        ElMessage({
            message: 'Đăng truyện thành công.',
            type: 'success',
        });
    } catch (error) {
        console.error('Failed to post comic' + error);
        data.name = '';
        data.description = '';
        data.category = '';
        data.slug = '';
        data.image = null;
        ElMessage.error('Đăng truyện thất bại.');
    } finally {
        postLoading.value = false;
    }
};

const submitForm = (formEl: typeof ElForm | null) => {
    if (!formEl) return;
    formEl.validate((valid: any) => {
        if (valid) {
            handleCreate(postForm);
        } else {
            return false;
        }
    });
};

onMounted(async () => {});
</script>
