<template>
    <div class="container">
        <el-row justify="center">
            <el-col :xs="18" :sm="16" :md="14" :lg="10">
                <h2 class="title">Đăng ký</h2>
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
                    <el-form-item
                        label="Xác nhận mật khẩu"
                        prop="confirmPassword"
                        :rules="[
                            {
                                required: true,
                                message: 'Vui lòng xác nhận mật khẩu',
                                trigger: 'blur',
                            },
                            {
                                validator: (rule: any, value: any, callback: any) => {
                                    if (value !== registerForm.password) {
                                        callback('Mật khẩu xác nhận không khớp');
                                    } else {
                                        callback();
                                    }
                                },
                                trigger: 'blur',
                            },
                        ]"
                    >
                        <el-input v-model="registerForm.confirmPassword" type="password" :show-password="true" />
                    </el-form-item>
                    <el-button
                        class="btn-submit"
                        type="primary"
                        :loading="submitLoading"
                        @click="submitForm(registerFormRef)"
                        >Đăng ký
                    </el-button>
                </el-form>
                <span>
                    Bạn đã có tài khoản?
                    <router-link class="btn-login" :to="`/${path.LOGIN}`">Đăng nhập</router-link>
                </span>
            </el-col>
        </el-row>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import { loadingFullScreen } from '@/utils/loadingFullScreen';
import router from '@/router/index';
import { ElForm, ElMessage } from 'element-plus';
import { AuthServices } from '@/services/auth/AuthServices';
import { path } from '@/constants';

interface RegisterUser {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const registerFormRef = ref<typeof ElForm | null>(null);
const submitLoading = ref<boolean>(false);
const registerForm = reactive<RegisterUser>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
});

const register = async (user: RegisterUser) => {
    try {
        submitLoading.value = true;
        await AuthServices.register(user);
        console.log('Register successful');
        ElMessage({
            type: 'success',
            message: 'Đăng ký thành công.'
        })
        await router.push({ name: 'login' });
    } catch (error) {
        console.error('Register failed: ' + error);
        ElMessage.error("Đăng ký thất bại. Kiểm tra lại thông tin.")
    } finally {
        submitLoading.value = false;
    }
};

const submitForm = (formEl: typeof ElForm | null) => {
    if (!formEl) return;
    formEl.validate((valid: any) => {
        if (valid) {
            register(registerForm);
        } else {
            return false;
        }
    });
};

onMounted(() => {
    loadingFullScreen('Đang xử lý');
});
</script>

<style scoped>
.title {
    text-align: center;
}

.btn-submit {
    width: 100%;
}

.btn-login:hover {
    text-decoration: underline;
}
</style>
