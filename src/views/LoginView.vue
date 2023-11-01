<template>
    <div class="container">
        <el-row justify="center">
            <el-col :span="10">
                <h2 class="title">Đăng nhập</h2>
                <el-form label-position="top" :model="loginForm" ref="loginFormRef">
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
                        <el-input v-model="loginForm.email" type="email" />
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
                        <el-input v-model="loginForm.password" type="password" />
                    </el-form-item>
                    <el-button class="btn-submit" type="primary" @click="submitForm(loginFormRef)"
                        >Đăng nhập</el-button
                    >
                </el-form>
                <span>
                    Bạn chưa có tài khoản?
                    <router-link to="/dang-ky">Đăng ký</router-link>
                </span>
            </el-col>
        </el-row>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { useAuthStore } from '@/stores/useAuthStore';
import { loadingFullScreen } from '@/utils/loadingFullScreen';
import router from '@/router/index'
import {ElForm} from 'element-plus'

const authStore = useAuthStore();
        const loginForm = reactive({
            email: '',
            password: '',
        });

        const loginFormRef = ref<typeof ElForm | null>(null);

        const submitForm = (formEl: typeof ElForm | null) => {
            if (!formEl) return;
            formEl.validate((valid: any) => {
                loadingFullScreen();
                if (valid) {
                    authStore.login(loginForm);
                    router.push({ name: 'home' });
                } else {
                    return false;
                }
            });
        };
</script>

<style scoped>
.container {
}

.title {
    text-align: center;
}

.btn-submit {
    width: 100%;
}
</style>
