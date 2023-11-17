<template>
    <div class='container'>
        <el-row :justify="isMobile ? 'center' : 'start'">
            <el-col :span='24'>
                <div class='profile-info'>
                    <el-form :model='userInfoForm' label-position='top' class='info-form'>
                        <el-row :gutter='isMobile ? 0 : 40' justify='space-around'>
                            <el-col :span='isMobile ? 24 : 8'>
                                <el-form-item class='avatar-uploader'>
                                    <input
                                        type='file'
                                        class='avatar-input'
                                        ref='avatarInput'
                                        @change='handleChangeAvatar'
                                    />
                                    <img v-if='imageUrl' :src='imageUrl' class='avatar' alt='anh' />
                                </el-form-item>
                                <h1>Hồ sơ cá nhân</h1></el-col
                            >
                            <el-col :span='isMobile ? 18 : 12'>
                                <el-form-item
                                    label='Họ tên:'
                                    prop='username'
                                    :rules="[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập tên người dùng',
                                            trigger: 'blur',
                                        },
                                    ]"
                                >
                                    <el-input v-model='username' type='text' />
                                </el-form-item>
                                <el-form-item
                                    label='Email:'
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
                                    <el-input v-model='email' type='text' />
                                </el-form-item>
                                <el-form-item label='Vai trò:' prop='role'>
                                    <el-input v-model='role' :disabled='true' />
                                </el-form-item>
                                <el-form-item label='Số điện thoại:' prop='phone'>
                                    <el-input v-model='phone' type='text' />
                                </el-form-item>
                                <el-form-item label='Địa chỉ:' prop='address'>
                                    <el-input v-model='address' type='text' />
                                </el-form-item>
                                <el-form-item class='btn-submit'>
                                    <el-button type='primary' :loading='submitLoading' @click='handleSubmit'>Lưu lại
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

<script lang='ts' setup>
import { computed, onMounted, ref } from 'vue';
import { useAuthStore } from '@/stores/useAuthStore';
import { loadingFullScreen } from '@/utils/loadingFullScreen';
import { ElMessage } from 'element-plus';
import router from '@/router';
import { UserServices } from '@/services/user/UserServices';
import { createAxiosJwt } from '@/utils/createInstance';
import type { UserInfo } from '@/interfaces';

const authStore = useAuthStore();
const httpJwt = createAxiosJwt(authStore.userInfo);
const isMobile = ref<boolean>(false);
const submitLoading = ref<boolean>(false);

const imageUrl: string | undefined = authStore.userInfo?.avatar;

const userInfoForm = ref<UserInfo | null>(authStore.userInfo);

const username = ref<string>(<string>userInfoForm.value?.username);
const email = ref<string>(<string>userInfoForm.value?.email);
const phone = ref<string>(<string>userInfoForm.value?.phone || '');
const address = ref<string>(String(<string>userInfoForm.value?.address || ''));
const avatar = ref<any | null>();
const avatarInput = ref<HTMLInputElement | null>(null);
const admin: boolean = false;
const user = computed(() => authStore.userInfo);
const role: string = authStore.userInfo.admin ? 'Quản trị viên' : 'Người đọc truyện';

const handleChangeAvatar = () => {
    if (avatarInput.value?.files && avatarInput.value.files[0]) {
        avatar.value = avatarInput.value.files[0];
    }
};

const handleResize = () => {
    isMobile.value = window.innerWidth <= 992;
};

const handleSubmit = async () => {
    try {
        submitLoading.value = true;
        const formData = new FormData();
        formData.append('username', username.value);
        formData.append('email', email.value);
        formData.append('phone', phone.value);
        formData.append('address', address.value);
        formData.append('avatar', avatar.value);
        await UserServices.update(user.value, formData, httpJwt);
        loadingFullScreen('Đang xử lý');
        ElMessage({
            message: 'Sửa thành công. Bạn cần đăng nhập lại.',
            type: 'success',
        });
        if (user.value !== null) {
            authStore.logout(user.value, httpJwt);
            await router.push({ name: 'login' });
        }
    } catch (error) {
        console.error('Failed to submit' + error);
        ElMessage.error('Sửa thất bại.');
    } finally {
        submitLoading.value = false;
    }
};

onMounted(() => {
    loadingFullScreen('Đang xử lý');
    window.addEventListener('resize', handleResize);
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
