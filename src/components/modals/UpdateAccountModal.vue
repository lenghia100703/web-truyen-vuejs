<script setup lang="ts">
import { ElForm, ElMessage } from 'element-plus';
import { reactive, ref } from 'vue';
import { UserServices } from '@/services/user/UserServices';
import { useAuthStore } from '@/stores/useAuthStore';
import { createAxiosJwt } from '@/utils/createInstance';

const visible = ref<boolean>(false);
const updateLoading = ref<boolean>(false);
const imageInput = ref<HTMLInputElement | null>(null);
const updateId = ref<string>('');
const authStore = useAuthStore();
const httpJwt = createAxiosJwt(authStore.userInfo);
const userInfoForm = reactive<{
    username: string;
    email: string;
    phone: string;
    address: string;
    avatar: any | null;
}>({
    username: '',
    email: '',
    phone: '',
    address: '',
    avatar: null,
});
const userInfoFormRef = ref<typeof ElForm | null>(null);

const props = defineProps<{
    tableData: any[];
}>();

const handleChangeImage = () => {
    if (imageInput.value?.files && imageInput.value?.files[0]) {
        userInfoForm.avatar = imageInput.value.files[0];
    }
};

const handleUpdate = async (data: any) => {
    try {
        updateLoading.value = true;
        const formData = new FormData();
        formData.append('username', data.username);
        formData.append('email', data.email);
        formData.append('phone', data.phone);
        formData.append('address', data.address);
        formData.append('avatar', data.avatar);
        const res = await UserServices.update(authStore.userInfo, updateId.value, formData, httpJwt);
        visible.value = false;
        data.username = '';
        data.email = '';
        data.address = '';
        data.avatar = null;
        const index = props.tableData.findIndex((item: any) => item._id === updateId.value);
        if (index !== -1) {
            props.tableData[index] = {
                username: res.username,
                email: res.email,
                phone: res.phone,
                address: res.address,
            };
        }
        ElMessage({
            message: 'Sửa thành công.',
            type: 'success',
        });
    } catch (error) {
        console.error('Failed to submit' + error);
        data.username = '';
        data.email = '';
        data.address = '';
        data.avatar = null;
        ElMessage.error('Sửa thất bại.');
    } finally {
        updateLoading.value = false;
    }
};

const submitForm = (formEl: typeof ElForm | null) => {
    if (!formEl) return;
    formEl.validate((valid: any) => {
        if (valid) {
            handleUpdate(userInfoForm);
        } else {
            return false;
        }
    });
};

async function openModal(rowData: any) {
    visible.value = true;
    userInfoForm.username = rowData.username;
    userInfoForm.phone = (rowData.phone as string) || '';
    userInfoForm.email = rowData.email;
    userInfoForm.address = (rowData.address as string) || '';
    updateId.value = rowData._id;
}

defineExpose({
    openModal,
});
</script>

<template>
    <el-dialog v-model="visible" title="Tạo tài khoản cho người dùng" width="40%">
        <el-form :model="userInfoForm" label-position="top" class="info-form" ref="userInfoFormRef">
            <el-form-item
                label="Họ tên:"
                prop="username"
                :rules="[
                    {
                        required: true,
                        message: 'Vui lòng nhập tên người dùng',
                        trigger: 'blur',
                    },
                ]"
            >
                <el-input v-model="userInfoForm.username" type="text" />
            </el-form-item>
            <el-form-item
                label="Email:"
                prop="email"
                :rules="[
                    {
                        required: true,
                        message: 'Vui lòng nhập email',
                        trigger: 'blur',
                    },
                    {
                        type: 'email',
                        message: 'Vui lòng nhập đúng email',
                        trigger: ['blur', 'change'],
                    },
                ]"
            >
                <el-input v-model="userInfoForm.email" type="text" />
            </el-form-item>
            <el-form-item label="Số điện thoại:" prop="phone">
                <el-input v-model="userInfoForm.phone" type="text" />
            </el-form-item>
            <el-form-item label="Địa chỉ:" prop="address">
                <el-input v-model="userInfoForm.address" type="text" />
            </el-form-item>
            <el-form-item
                label="Chọn avatar cho người dùng"
                prop="avatar"
                :rules="[
                    {
                        required: true,
                        message: 'Vui lòng chọn ảnh đại diện mới',
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
                <el-button type="primary" :loading="updateLoading" @click="submitForm(userInfoFormRef)">
                    Xác nhận
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<style scoped></style>
