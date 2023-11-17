<template>
    <div class='card-item'>
        <router-link :to='slug'>
            <el-card class='card-body' shadow='hover'>
                <el-image class='image' fit='cover' :src='data.image' />
                <span class='name-comic'>
                {{ data.name }}
                </span>
            </el-card>
        </router-link>

    </div>
</template>
<script lang='ts' setup>
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

.card-body {
    padding: 0;
}


.image {
    height: 250px;
    width: auto;
}

.name-comic {
    height: 50px;
    padding: 4px 0;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
}

@media only screen and (max-width: 576px) {
    /* .card-item {
        width: 45%;
    } */
}
</style>
