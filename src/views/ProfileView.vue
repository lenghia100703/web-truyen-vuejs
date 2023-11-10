<template>
    <div class="container">
        <el-row justify="center">
            <el-col :span="24">
                <div class="profile-info">
                    <el-form :model="userInfoForm" label-position="top" class="info-form">
                        <el-row :gutter="40" justify="space-around">
                            <el-col :span="8">
                                <el-form-item class="avatar-uploader">
                                    <input
                                        type="file"
                                        class="avatar-input"
                                        ref="avatarInput"
                                        @change="handleChangeAvatar"
                                    />
                                    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                                </el-form-item>
                                <h1>Hồ sơ cá nhân</h1></el-col
                            >
                            <el-col :span="12">
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
                                    <el-input v-model="username" type="text" />
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
                                    <el-input v-model="email" type="email" />
                                </el-form-item>
                                <el-form-item label="Vai trò:" prop="role">
                                    <el-input v-model="role" :disabled="true" />
                                </el-form-item>
                                <el-form-item label="Số điện thoại:" prop="phone">
                                    <el-input v-model="phone" type="text" />
                                </el-form-item>
                                <el-form-item label="Địa chỉ:" prop="address">
                                    <el-input v-model="address" type="text" />
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click="handleSubmit">Lưu lại</el-button>
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
import { computed, ref } from 'vue';
import { useAuthStore } from '@/stores/useAuthStore';
import { loadingFullScreen } from '@/utils/loadingFullScreen';
import { ElMessage } from 'element-plus';
import router from '@/router';
import { UserServices } from '@/services/user/UserServices';
import { createAxiosJwt } from '@/utils/createInstance';
import type { UserInfo } from '@/interfaces';

const authStore = useAuthStore();
const httpJwt = createAxiosJwt(authStore.userInfo);

const imageUrl: string | undefined = authStore.userInfo?.avatar;

const userInfoForm = ref<UserInfo | null>(authStore.userInfo);

const username = computed({
    get() {
        return userInfoForm.value?.username || '';
    },
    set(username) {
        if (typeof userInfoForm.value?.username === 'string') {
            userInfoForm.value = { ...userInfoForm.value, username };
        }
    },
});

const email = computed({
    get() {
        return userInfoForm.value?.email || '';
    },
    set(email) {
        if (typeof userInfoForm.value?.email === 'string') {
            userInfoForm.value = { ...userInfoForm.value, email };
        }
    },
});

const phone = computed({
    get() {
        return userInfoForm.value?.phone || '';
    },
    set(phone) {
        if (typeof userInfoForm.value?.phone === 'string') {
            userInfoForm.value = { ...userInfoForm.value, phone };
        }
    },
});

const address = computed({
    get() {
        return userInfoForm.value?.address || '';
    },
    set(address) {
        if (typeof userInfoForm.value?.address === 'string') {
            userInfoForm.value = { ...userInfoForm.value, address };
        }
    },
});

const avatar = ref<any | null>();
const avatarInput = ref<HTMLInputElement | null>(null);
const admin: boolean = false;
const user = computed(() => authStore.userInfo);
const role: string = admin ? 'Quản trị viên' : 'Người đọc truyện';

const handleChangeAvatar = () => {
    if (avatarInput.value?.files && avatarInput.value.files[0]) {
        const newFile = avatarInput.value.files[0];
        avatar.value = newFile;
        console.log(avatar.value);
    }
};

const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('username', username.value);
    formData.append('email', email.value);
    formData.append('phone', phone.value);
    formData.append('address', address.value);
    formData.append('avatar', avatar.value);
    try {
        await UserServices.update(user.value, formData, httpJwt);
        loadingFullScreen();
        ElMessage({
            message: 'Sửa thành công. Bạn cần đăng nhập lại.',
            type: 'success',
        });
        if (user.value !== null) {
            authStore.logout(user.value, httpJwt);
            await router.push({ name: 'login' });
        }
        // console.log(formData);
    } catch (error) {
        console.error('Failed to submit' + error);
        ElMessage.error('Sửa thất bại.');
    }
};
</script>

<style scoped>
.container {
    margin-top: 40px;
}

.avatar-uploader .avatar {
    width: 360px;
    height: 360px;
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
</style>
