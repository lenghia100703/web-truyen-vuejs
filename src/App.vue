<script setup lang="ts">
  
</script>

<template>
  <router-view></router-view>
</template>

<style>
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

html {
    font-size: 100%;
}

body {
    /* font-family: var(--font-family); */
    line-height: 1.5;
    text-rendering: optimizeSpeed;
    overflow-y: overlay;
}

html *::-webkit-scrollbar {
    border-radius: 0;
    width: 8px;
}
html *::-webkit-scrollbar {
    border-radius: 0;
    width: 8px;
}
html *::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.15);
}
html *::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.15);
}
html *::-webkit-scrollbar-track {
    border-radius: 0;
    background-color: rgba(0, 0, 0, 0);
}
html *::-webkit-scrollbar-track {
    border-radius: 0;
    background-color: rgba(0, 0, 0, 0);
}
a {
    text-decoration: none;
}

#app {
    margin: 0;
    padding: 0;
}
</style>
