<script setup lang='ts'>
import { ElForm } from 'element-plus';
import { ref } from 'vue';

const visible = ref<boolean>(false)
const updateLoading = ref<boolean>(false)
const username = ref<string>('')
const phone = ref<string>('')
const email = ref<string>('')
const address = ref<string>('')

const handleUpdate = () => {

}

async function openModal(rowData: any) {
    visible.value = true
    username.value = rowData.username
    phone.value = rowData.phone
    email.value = rowData.email
    address.value = rowData.address
}

defineExpose({
    openModal
})

</script>

<template>
    <el-dialog v-model='visible' title='Tạo tài khoản cho người dùng' width='40%'>
        <el-form :model='userInfoForm' label-position='top' class='info-form'>
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
            <el-form-item label='Số điện thoại:' prop='phone'>
                <el-input v-model='phone' type='text' />
            </el-form-item>
            <el-form-item label='Địa chỉ:' prop='address'>
                <el-input v-model='address' type='text' />
            </el-form-item>

        </el-form>
        <template #footer>
            <span class='dialog-footer'>
                <el-button @click='visible = false'>Huỷ bỏ</el-button>
                <el-button type='primary' :loading='updateLoading' @click='handleUpdate'> Xác nhận </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<style scoped>

</style>