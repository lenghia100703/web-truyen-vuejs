<template>
    <div class="container">
        <el-row justify="center">
            <el-col :xs="18" :sm="16" :md="14" :lg="10">
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
                        <el-input v-model="loginForm.email" type="text" />
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
                        <el-input v-model="loginForm.password" type="password" :show-password='true'/>
                    </el-form-item>
                    <el-button class="btn-submit" type="primary" :loading='submitLoading' @click="submitForm(loginFormRef)"
                        >Đăng nhập
                    </el-button>
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
import { onMounted, reactive, ref } from 'vue';
import { useAuthStore } from '@/stores/useAuthStore';
import { loadingFullScreen } from '@/utils/loadingFullScreen';
import router from '@/router/index';
import { ElForm } from 'element-plus';

const authStore = useAuthStore();
const loginForm = reactive({
    email: '',
    password: '',
});

const loginFormRef = ref<typeof ElForm | null>(null);
const submitLoading = ref<boolean>(false)

const login = async (loginForm: any) => {
    try {
        submitLoading.value = true
        await authStore.login(loginForm);
    }
    catch (e) {
        console.error('fail to login ' + e)
    }
    finally {
        submitLoading.value = false
    }
}

const submitForm = (formEl: typeof ElForm | null) => {
    if (!formEl) return;
    formEl.validate((valid: any) => {
        loadingFullScreen('Đang xử lý');
        if (valid) {
            login(loginForm)
            router.push({ name: 'home' });
        } else {
            return false;
        }
    });
};

onMounted(() => {
    loadingFullScreen('Đang xử lý')
})
</script>

<style scoped>
.title {
    text-align: center;
}

.btn-submit {
    width: 100%;
}
</style>
