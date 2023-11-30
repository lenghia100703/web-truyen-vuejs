<template>
    <el-dialog v-model='visible' title='Chỉnh sửa truyện' width='50%'>
        <el-form :model='updateForm' label-position='top' ref='updateModalFormRef'>
            <el-form-item
                label='Tên truyện'
                prop='name'
                :rules="[
                    {
                        required: true,
                        message: 'Vui lòng nhập tên truyện',
                        trigger: 'blur',
                    },
                ]"
            >
                <el-input v-model='updateForm.name' type='text' placeholder='Nhập tên truyện' />
            </el-form-item>
            <el-form-item label='Mô tả truyện' prop='description'>
                <el-input v-model='updateForm.description' type='textarea' placeholder='Nhập mô tả truyện' />
            </el-form-item>
            <el-form-item
                label='Đường dẫn truyện'
                prop='slug'
                :rules="[
                    {
                        required: true,
                        message: 'Vui lòng nhập đường dẫn truyện',
                        trigger: 'blur',
                    },
                ]"
            >
                <el-input v-model='updateForm.slug' autocomplete='off' type='text' placeholder='Nhập code truyện' />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class='dialog-footer'>
                <el-button @click='visible = false'>Huỷ bỏ</el-button>
                <el-button type='primary' :loading='updateLoading' @click='submitForm(updateModalFormRef)'>
                    Xác nhận
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script lang='ts' setup>
import { ElForm, ElMessage } from 'element-plus';
import { ref, reactive } from 'vue';
import { useAuthStore } from '@/stores/useAuthStore';
import { PostedComicServices } from '@/services/comic/PostedComicServices';
import { createAxiosJwt } from '@/utils/createInstance';

const authStore = useAuthStore();
const httpJwt = createAxiosJwt(authStore.userInfo);
const props = defineProps<{
    callFunction: () => Promise<void>
}>();

const visible = ref<boolean>(false);
const updateLoading = ref<boolean>(false);
const updateModalFormRef = ref<typeof ElForm | null>(null);
const updateForm = reactive<{
    name: string;
    description: string;
    slug: string;
}>({
    name: '',
    description: '',
    slug: '',
});
const _id = ref<string>('');
const name = ref<string>('');
const description = ref<string>('');
const slug = ref<string>('');

const openModal = async (rowData: any) => {
    visible.value = true;
    _id.value = rowData._id;
    updateForm.name = rowData.name;
    updateForm.description = rowData.description;
    updateForm.slug = rowData.slug;
};

const handleUpdate = async (data: any) => {
    try {
        updateLoading.value = true;
        const res = await PostedComicServices.update(_id.value, authStore.userInfo, data, httpJwt);
        visible.value = false;
        await props.callFunction()
        ElMessage({
            message: 'Sửa thành công.',
            type: 'success',
        });
    } catch (error) {
        console.error('Failed to update' + error);
        name.value = '';
        description.value = '';
        slug.value = '';
        ElMessage.error('Sửa thất bại.');
    } finally {
        updateLoading.value = false;
    }
};

const submitForm = (formEl: typeof ElForm | null) => {
    if (!formEl) return;
    formEl.validate((valid: any) => {
        if (valid) {
            handleUpdate(updateForm);
        } else {
            return false;
        }
    });
};

defineExpose({
    openModal,
});
</script>
