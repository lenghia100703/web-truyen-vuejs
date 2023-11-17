<script setup lang='ts'>
import { reactive, ref } from 'vue';
import { ElForm } from 'element-plus';

const visible = ref<boolean>(false)
const createLoading = ref<boolean>(false)

const registerFormRef = ref<typeof ElForm | null>(null);
const registerForm = reactive<RegisterUser>({
    username: '',
    email: '',
    password: '',
});

const handleCreate = () => {

}

async function openModal() {
    visible.value = true
}

defineExpose({
    openModal
})
</script>

<template>
    <el-dialog v-model='visible' title='Tạo tài khoản cho người dùng' width='40%'>
        <el-form label-position='top' :model='registerForm' ref='registerFormRef'>
            <el-form-item
                label='Tên người dùng'
                prop='username'
                :rules="[
                            {
                                required: true,
                                message: 'Vui lòng nhập tên người dùng',
                                trigger: 'blur',
                            },
                        ]"
            >
                <el-input v-model='registerForm.username' type='text' />
            </el-form-item>
            <el-form-item
                label='Email'
                prop='email'
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
                <el-input v-model='registerForm.email' type='text' />
            </el-form-item>
            <el-form-item
                label='Mật khẩu'
                prop='password'
                :rules="[
                            {
                                required: true,
                                message: 'Vui lòng nhập mật khẩu',
                                trigger: 'blur',
                            },
                        ]"
            >
                <el-input v-model='registerForm.password' type='password' :show-password='true' />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class='dialog-footer'>
                <el-button @click='visible = false'>Huỷ bỏ</el-button>
                <el-button type='primary' :loading='createLoading' @click='handleCreate'> Xác nhận </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<style scoped>

</style>