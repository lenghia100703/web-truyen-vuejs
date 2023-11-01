<template>
    <div class="container">
        <el-table :data="tableData" style="width: 80%">
            <el-table-column prop="stt" label="STT" />
            <el-table-column prop="name" label="Tên truyện" width="300">
                <template v-slot="scope">
                    <router-link :to="`/truyen-tranh/${scope.row.slug}`">{{ scope.row.name }}</router-link>
                </template>
            </el-table-column>
            <el-table-column prop="numberOfChapter" label="Số chương" />
            <el-table-column prop="view" label="Lượt xem" />
            <el-table-column fixed="right" label="Hành động" width="250">
                <template v-slot="scope">
                    <el-button type="primary" size="small" @click="updateRef?.openModal(scope.row)" plain
                        >Sửa</el-button
                    >
                    <el-button type="danger" size="small" @click="openDeleteDialog(scope.row)" plain>Xóa</el-button>
                    <el-button type="primary" size="small" @click="chapterRef?.openModal()" plain
                        >Đăng chương</el-button
                    >
                </template>
            </el-table-column>
        </el-table>
        <div class="btn-add">
            <el-button type="primary" circle style="width: 40px; height: 40px" @click="postRef?.openModal()">
                <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ea893728="" size="">
                    <path
                        fill="currentColor"
                        d="M480 480V128a32 32 0 0 1 64 0v352h352a32 32 0 1 1 0 64H544v352a32 32 0 1 1-64 0V544H128a32 32 0 0 1 0-64h352z"
                    ></path>
                </svg>
            </el-button>
        </div>
    </div>

    <!-- <el-dialog v-model="updateFormVisible" title="Chỉnh sửa truyện" width="50%">
        <el-form :model="updateForm" label-position="top">
            <el-form-item label="Tên truyện">
                <el-input v-model="updateForm.name" autocomplete="off" type="text" />
            </el-form-item>
            <el-form-item label="Mô tả truyện">
                <el-input v-model="updateForm.description" type="textarea" />
            </el-form-item>
            <el-form-item label="Đường dẫn truyện">
                <el-input v-model="updateForm.slug" autocomplete="off" type="text" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="updateFormVisible = false">Huỷ bỏ</el-button>
                <el-button type="primary" @click="handleUpdate"> Xác nhận </el-button>
            </span>
        </template>
    </el-dialog> -->

    <el-dialog v-model="deleteVisible" title="Xóa truyện" width="50%">
        <span style="font-size: 18px">Bạn có muốn xóa truyện này không ?</span>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="deleteVisible = false">Hủy bỏ</el-button>
                <el-button type="primary" @click="handleDelete"> Đồng ý </el-button>
            </span>
        </template>
    </el-dialog>

    <!-- <el-dialog v-model="uploadFormVisible" title="Đăng chương truyện" width="40%">
        <el-form :model="uploadForm" label-position="top">
            <el-form-item label="Tên chương truyện">
                <el-input autocomplete="off" type="text" v-model="uploadForm.title" />
            </el-form-item>
            <el-form-item label="Chọn ảnh cho truyện">
                <input type="file" multiple ref="imageInput" @change="handleChangeImages" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="uploadFormVisible = false">Huỷ bỏ</el-button>
                <el-button type="primary" @click="handleUpload"> Xác nhận </el-button>
            </span>
        </template>
    </el-dialog> -->

    <PostModal ref="postRef" />
    <ChapterModal ref="chapterRef" />
    <UpdateModal ref="updateRef" />
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { createAxiosJwt } from '@/utils/createInstance';
import { useAuthStore } from '@/stores/useAuthStore';
import type { Comic } from '@/views/ComicDetailView.vue';
import type { UserInfo } from '../stores/useAuthStore';
import { ElMessage } from 'element-plus';
import PostModal from '@/components/modals/PostModal.vue';
import UpdateModal from '@/components/modals/UpdateModal.vue';
import ChapterModal from '@/components/modals/ChapterModal.vue';

const authStore = useAuthStore();
const user: UserInfo | null = authStore?.userInfo;
const axiosJwt = createAxiosJwt(user);

const tableData = reactive<any>([]);

const postRef = ref<InstanceType<typeof PostModal>>();
const chapterRef = ref<InstanceType<typeof ChapterModal>>();
const updateRef = ref<InstanceType<typeof UpdateModal>>();

onMounted(async () => {
    try {
        const res = await axiosJwt.get(`/post/${user?._id}`, {
            headers: {
                token: `Bearer ${user?.accessToken}`,
            },
        });
        res.data.map((comic: Comic, index: number) => {
            tableData.push({
                _id: comic._id,
                stt: index + 1,
                name: comic.name,
                numberOfChapter: comic.chapters.length,
                view: comic.view,
                slug: comic.slug,
                description: comic.description,
            });
        });
    } catch (error) {
        console.error('Failed to get table data' + error);
    }
});

const updateFormVisible = ref<boolean>(false);
const deleteVisible = ref<boolean>(false);
const uploadFormVisible = ref<boolean>(false);
const updateForm = ref<{
    _id: string;
    name: string;
    description: string;
    slug: string;
}>({
    _id: '',
    name: '',
    description: '',
    slug: '',
});
const uploadForm = ref<{
    _id: string;
    title: string;
}>({
    _id: '',
    title: '',
});
const deleteForm = ref<string>();
const imageInput = ref<HTMLInputElement | null>();
const images = ref<any[]>();

const nameComic = computed({
    get() {
        return updateForm.value?.name || '';
    },
    set(name) {
        if (typeof updateForm.value?.name === 'string') {
            updateForm.value = { ...updateForm.value, name };
        }
    },
});

const description = computed({
    get() {
        return updateForm.value?.description || '';
    },
    set(description) {
        if (typeof updateForm.value?.description === 'string') {
            updateForm.value = { ...updateForm.value, description };
        }
    },
});

const slug = computed({
    get() {
        return updateForm.value?.slug || '';
    },
    set(slug) {
        if (typeof updateForm.value?.slug === 'string') {
            updateForm.value = { ...updateForm.value, slug };
        }
    },
});

const title = computed({
    get() {
        return uploadForm.value?.title || '';
    },
    set(title) {
        if (typeof uploadForm.value?.title === 'string') {
            uploadForm.value = { ...uploadForm.value, title };
        }
    },
});

const openUpdateDialog = (row: any) => {
    updateFormVisible.value = true;
    updateForm.value._id = row._id;
    nameComic.value = row.name;
    description.value = row.description;
    slug.value = row.slug;
};

const openDeleteDialog = (row: any) => {
    deleteVisible.value = true;
    deleteForm.value = row._id;
};

const openUploadDialog = (row: any) => {
    uploadFormVisible.value = true;
    uploadForm.value._id = row._id;
};

const handleChangeImages = () => {
    if (imageInput.value?.files) {
        images.value = Array.from(imageInput.value.files);
    }
    console.log(images.value);
};

const handleUpdate = async () => {
    updateFormVisible.value = false;
    const { _id, ...others } = updateForm.value;
    console.log({ ...others });
    try {
        const res = await axiosJwt.put(
            `/post/${updateForm.value._id}`,
            { ...others },
            {
                headers: {
                    token: `Bearer ${user?.accessToken}`,
                },
            },
        );
        const index = tableData.findIndex((item: any) => item._id === updateForm.value._id);
        if (index !== -1) {
            tableData[index] = {
                _id: res.data._id,
                stt: index + 1,
                name: res.data.name,
                numberOfChapter: res.data.chapters.length,
                view: res.data.view,
                slug: res.data.slug,
                description: res.data.description,
            };
        }
        ElMessage({
            message: 'Sửa thành công.',
            type: 'success',
        });
    } catch (error) {
        console.error('Failed to update' + error);
        ElMessage.error('Sửa thất bại.');
    }
};

const handleDelete = async () => {
    deleteVisible.value = false;
    try {
        await axiosJwt.delete(`/post/${deleteForm.value}`, {
            headers: {
                token: `Bearer ${user?.accessToken}`,
            },
        });
        const index = tableData.findIndex((item: any) => item._id === deleteForm.value);
        if (index !== -1) {
            tableData.splice(index, 1);
        }

        ElMessage({
            message: 'Xóa thành công.',
            type: 'success',
        });
    } catch (error) {
        console.error('Failed to delete' + error);
        ElMessage.error('Xóa không thành công.');
    }
};

const handleUpload = async () => {
    uploadFormVisible.value = false;
    const formData = new FormData();
    formData.append('title', title.value);
    images.value?.forEach((image, index) => {
        formData.append('images', image, `image${index + 1}`);
    });
    try {
        await axiosJwt.put(`http://localhost:8888/v1/chapter/${uploadForm.value?._id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                token: `Bearer ${user?.accessToken}`,
            },
        });
    } catch (error) {
        console.error('Failed to upload chapter' + error);
    }
};
</script>

<style scoped>
.container {
    display: flex;
    justify-content: center;
}

.btn-add {
    position: absolute;
    bottom: 90px;
    right: 290px;
}
</style>
