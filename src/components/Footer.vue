<template>
    <el-footer id="footer">
        <div class="footer-content">Copyright © 2023 WebTruyen</div>
    </el-footer>
</template>

<script lang="ts" setup></script>

<style scoped>
#footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: var(--el-menu-bg-color);
    z-index: 12;
}

.footer-content {
    border-top: 1px solid var(--el-menu-border-color);
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>