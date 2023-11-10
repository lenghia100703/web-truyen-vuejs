<template>
    <div class="card-item">
        <el-card :body-style="{ padding: '0px' }" shadow="hover">
            <el-image class="image" fit="cover" :src="data.image" />
            <span class="name-comic">
                <router-link :to="slug">{{ data.name }}</router-link>
            </span>
        </el-card>
    </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
const props = defineProps<{
    data: any;
}>();
const slug = computed(() => `/truyen-tranh/${props.data.slug}`);
</script>

<style scoped>
.card-item {
    width: 100%;
    max-width: 200px;
    cursor: pointer;
}

.image {
    height: 300px;
}

.name-comic {
    padding: 4px 16px;
    text-transform: capitalize;
    display: block;
    width: 100%;
    word-break: break-word;
}
</style>
