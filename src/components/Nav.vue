<template>
    <el-aside class='hidden-sm-and-down'>
        <el-table :data="tableData">
            <el-table-column>
                <template v-slot="scope">
                    <router-link :to="`/the-loai/truyen-tranh/${validate(scope.row.column1)}`">{{ scope.row.column1 }}</router-link>
                </template>
            </el-table-column>
            <el-table-column>
                <template v-slot="scope">
                    <router-link :to="`/the-loai/truyen-tranh/${validate(scope.row.column2)}`">{{ scope.row.column2 }}</router-link>
                </template>
            </el-table-column>
        </el-table>
    </el-aside>
</template>

<script lang="ts" setup>
const tableData = [
    {
        column1: 'Tất cả',
        column2: 'Manga',
    },
    {
        column1: 'Manhua',
        column2: 'Manhwa',
    },
];

const validate = (str: string) => {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .toLowerCase()
        .split(' ')
        .join('-');
};
</script>

<style scoped></style>
