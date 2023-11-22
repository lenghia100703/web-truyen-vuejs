<script setup lang="ts">
import { reactive, ref } from 'vue';
import { ElForm, ElMessage } from 'element-plus';
import { AuthServices } from '@/services/auth/AuthServices';

const visible = ref<boolean>(false);
const createLoading = ref<boolean>(false);
const props = defineProps<{
    tableData: any;
}>();
const registerFormRef = ref<typeof ElForm | null>(null);
const registerForm = reactive<{
    username: string;
    email: string;
    password: string;
}>({
    username: '',
    email: '',
    password: '',
});

const handleCreate = async (data: any) => {
    try {
        createLoading.value = true;
        const res = await AuthServices.register(data);
        visible.value = false;
        props.tableData.push(res);
        data.username = '';
        data.email = '';
        data.password = '';
        ElMessage({
            message: 'Tạo tài khoản thành công.',
            type: 'success',
        });
    } catch (e) {
        console.error(e);
        data.username = '';
        data.email = '';
        data.password = '';
        ElMessage.error('Tạo tài khoản thất bại.');
    } finally {
        createLoading.value = false;
    }
};

const submitForm = (formEl: typeof ElForm | null) => {
    if (!formEl) return;
    formEl.validate((valid: any) => {
        if (valid) {
            handleCreate(registerForm);
        } else {
            return false;
        }
    });
};

async function openModal() {
    visible.value = true;
}

defineExpose({
    openModal,
});
</script>

<template>
    <el-dialog v-model="visible" title="Tạo tài khoản cho người dùng" width="40%">
        <el-form label-position="top" :model="registerForm" ref="registerFormRef">
            <el-form-item
                label="Tên người dùng"
                prop="username"
                :rules="[
                    {
                        required: true,
                        message: 'Vui lòng nhập tên người dùng',
                        trigger: 'blur',
                    },
                ]"
            >
                <el-input v-model="registerForm.username" type="text" />
            </el-form-item>
            <el-form-item
                label="Email"
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
                <el-input v-model="registerForm.email" type="text" />
            </el-form-item>
            <el-form-item
                label="Mật khẩu"
                prop="password"
                :rules="[
                    {
                        required: true,
                        message: 'Vui lòng nhập mật khẩu',
                        trigger: 'blur',
                    },
                ]"
            >
                <el-input v-model="registerForm.password" type="password" :show-password="true" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="visible = false">Huỷ bỏ</el-button>
                <el-button type="primary" :loading="createLoading" @click="submitForm(registerFormRef)">
                    Xác nhận
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<style scoped></style>
