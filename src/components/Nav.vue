<template>
    <el-aside class='hidden-sm-and-down'>
        <el-table :data="tableData">
            <el-table-column>
                <template v-slot="scope">
                    <router-link :to="scope.row.column1.path">{{ scope.row.column1.title }}</router-link>
                </template>
            </el-table-column>
            <el-table-column>
                <template v-slot="scope">
                    <router-link :to="scope.row.column2.path">{{ scope.row.column2.title }}</router-link>
                </template>
            </el-table-column>
        </el-table>
    </el-aside>
</template>

<script lang="ts" setup>
import { path } from '@/constants';

const tableData = [
    {
        column1: {
            title: "Tất cả",
            path: `/${path.CATEGORY}`
        },
        column2: {
            title: "Manga",
            path: `/${path.CATEGORY_DETAIL("manga")}`
        },
    },
    {
        column1: {
            title: "Manhua",
            path: `/${path.CATEGORY_DETAIL("manhua")}`
        },
        column2: {
            title: "Manhwa",
            path: `/${path.CATEGORY_DETAIL("manhwa")}`
        },
    },
];
</script>

<style scoped></style>
