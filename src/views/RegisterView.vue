<template>
    <div class="container">
        <el-row justify="center">
            <el-col :span="10">
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
                        <el-input v-model="registerForm.email" type="email" />
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
                        <el-input v-model="registerForm.password" type="password" />
                    </el-form-item>
                    <el-button class="btn-submit" type="primary" @click="submitForm(registerFormRef)"
                        >Đăng ký</el-button
                    >
                </el-form>
                <span>
                    Bạn đã có tài khoản?
                    <router-link to="/dang-nhap">Đăng nhập</router-link>
                </span>
            </el-col>
        </el-row>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { loadingFullScreen } from '@/utils/loadingFullScreen';
import axios from 'axios';
import router from '@/router/index';
import { ElForm } from 'element-plus';

interface RegisterUser {
    username: string;
    email: string;
    password: string;
}
const registerFormRef = ref<typeof ElForm | null>(null);
const registerForm = reactive<RegisterUser>({
    username: '',
    email: '',
    password: '',
});

const register = async (user: RegisterUser) => {
    try {
        await axios.post('/auth/register', user);
        console.log('Register successful');
    } catch (error) {
        console.error('Register failed: ' + error);
    }
};

const submitForm = (formEl: typeof ElForm | null) => {
    if (!formEl) return;
    formEl.validate((valid: any) => {
        loadingFullScreen();
        if (valid) {
            register(registerForm);
            router.push({ name: 'login' });
        } else {
            return false;
        }
    });
};
</script>

<style scoped>
.title {
    text-align: center;
}
.btn-submit {
    width: 100%;
}
</style>
