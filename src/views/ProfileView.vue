<template>
    <div class="container">
        <el-row :justify="isMobile ? 'center' : 'start'">
            <el-col :span="24">
                <div class="profile-info">
                    <el-form :model="userInfoForm" label-position="top" class="info-form" ref="userInfoFormRef">
                        <el-row :gutter="isMobile ? 0 : 40" justify="space-around">
                            <el-col :span="isMobile ? 24 : 8">
                                <el-form-item
                                    class="avatar-uploader"
                                    prop="avatar"
                                    :rules="[
                                        {
                                            required: true,
                                            message: 'Vui lòng chọn ảnh đại diện mới',
                                            trigger: ['change', 'blur'],
                                        },
                                    ]"
                                >
                                    <input
                                        type="file"
                                        class="avatar-input"
                                        ref="avatarInput"
                                        @change="handleChangeAvatar"
                                    />
                                    <img v-if="imageUrl" :src="imageUrl" class="avatar" alt="anh" />
                                </el-form-item>
                                <h1>Hồ sơ cá nhân</h1></el-col
                            >
                            <el-col :span="isMobile ? 18 : 12">
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
                                <el-form-item label="Vai trò:" prop="role">
                                    <el-input v-model="role" :disabled="true" />
                                </el-form-item>
                                <el-form-item label="Số điện thoại:" prop="phone">
                                    <el-input v-model="userInfoForm.phone" type="text" />
                                </el-form-item>
                                <el-form-item label="Địa chỉ:" prop="address">
                                    <el-input v-model="userInfoForm.address" type="text" />
                                </el-form-item>
                                <el-form-item class="btn-submit">
                                    <el-button
                                        type="primary"
                                        :loading="submitLoading"
                                        @click="submitForm(userInfoFormRef)"
                                        >Lưu lại
                                    </el-button>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, reactive } from 'vue';
import { useAuthStore } from '@/stores/useAuthStore';
import { loadingFullScreen } from '@/utils/loadingFullScreen';
import { ElMessage, ElForm } from 'element-plus';
import { UserServices } from '@/services/user/UserServices';
import { createAxiosJwt } from '@/utils/createInstance';
import router from '@/router';

const authStore = useAuthStore();
const httpJwt = createAxiosJwt(authStore.userInfo);
const isMobile = ref<boolean>(false);
const submitLoading = ref<boolean>(false);

const user = computed(() => authStore.userInfo);
const userInfoForm = reactive<{
    username: string;
    email: string;
    phone: string;
    address: string;
    avatar: any | null;
}>({
    username: user.value?.username as string,
    email: user.value?.email as string,
    phone: (user.value?.phone as string) || '',
    address: (user.value?.address as string) || '',
    avatar: null,
});
const userInfoFormRef = ref<typeof ElForm | null>(null);
const avatarInput = ref<HTMLInputElement | null>(null);
const imageUrl = ref<string>(user.value?.avatar as string);
const role: string = authStore.userInfo?.admin ? 'Quản trị viên' : 'Người đọc truyện';

const handleChangeAvatar = () => {
    if (avatarInput.value?.files && avatarInput.value.files[0]) {
        userInfoForm.avatar = avatarInput.value.files[0];
    }
};

const handleResize = () => {
    isMobile.value = window.innerWidth <= 992;
};

const handleSubmit = async (data: any) => {
    try {
        submitLoading.value = true;
        const formData = new FormData();
        formData.append('username', data.username);
        formData.append('email', data.email);
        formData.append('phone', data.phone);
        formData.append('address', data.address);
        formData.append('avatar', data.avatar);
        await UserServices.update(user.value, user.value?._id, formData, httpJwt);

        ElMessage({
            message: 'Sửa thành công. Bạn cần đăng nhập lại',
            type: 'success',
        });
        if (user.value !== null) {
            authStore.logout(user.value, httpJwt);
            router.push({ name: 'login' });
        }
    } catch (error) {
        console.error('Failed to submit' + error);
        ElMessage.error('Sửa thất bại.');
    } finally {
        submitLoading.value = false;
    }
};

const submitForm = (formEl: typeof ElForm | null) => {
    if (!formEl) return;
    formEl.validate((valid: any) => {
        if (valid) {
            handleSubmit(userInfoForm);
        } else {
            return false;
        }
    });
};

const obj = {
    name: 'nghia',
    age: '18',
};

onMounted(() => {
    loadingFullScreen('Đang xử lý');
    window.addEventListener('resize', handleResize);
    console.log({
        ...obj,
        name: 'asd',
    });
});
</script>

<style scoped>
.container {
    margin-top: 40px;
}

.avatar-uploader .avatar {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 50%;
    cursor: pointer;
}

h1 {
    text-align: center;
}

.avatar-input {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    padding: 0;
    margin: 0;
    cursor: pointer;
    border-radius: 50%;
    opacity: 0;
}

.btn-submit {
    float: left !important;
}

.el-form-item__content {
    display: flex;
    justify-content: center;
}

@media only screen and (max-width: 992px) {
    .el-form-item__content {
        justify-content: center;
    }

    .avatar-input {
        width: 60%;
    }

    .avatar-uploader .avatar {
        width: 60%;
        height: auto;
    }

    .info-form {
        max-width: 100%;
    }
}
</style>
