<template>
    <form class='form-search' @submit='handleSubmit'>
        <div class='doc-search'>
            <input type='text' v-model='searchText' class='search-input' @focus='handleFocus' spellcheck='false' />
            <button class='search-btn' type='submit'>
                <span class='search-icon'>
                    <svg width='20' height='20' class='DocSearch-Search-Icon' viewBox='0 0 20 20'>
                        <path
                            d='M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z'
                            stroke='currentColor'
                            fill='none'
                            fill-rule='evenodd'
                            stroke-linecap='round'
                            stroke-linejoin='round'
                        ></path>
                    </svg>
                </span>
            </button>
        </div>
    </form>

    <div class='search-results' v-if='searchResults.length > 0 && showSearchResults'>
        <ul>
            <li v-for='(result, index) in searchResults' :key='index' @click='handleFocusLi'>
                <router-link :to='`/truyen-tranh/${result.slug}`' class='item-container'>
                    <div class='item-container-left'>
                        <img :src='result.image' :alt='result.name' class='img-item' />
                    </div>
                    <div class='item-container-right'>
                        <h6 class='name-item'>{{ result.name }}</h6>
                        <span class='category-item'>Số lượng chapter: {{ result.chapters.length }}</span>
                    </div>
                </router-link>
            </li>
        </ul>
    </div>
</template>

<script lang='ts' setup>
import { ref, watch } from 'vue';
import debounce from 'lodash.debounce';
import type { Comic } from '@/views/ComicDetailView.vue';
import router from '@/router';
import { ComicServices } from '@/services/comic/ComicServices';

const searchText = ref<string>('');
const searchResults = ref<Comic[]>([]);
const showSearchResults = ref<boolean>(false);
const handleBlur = () => {
    showSearchResults.value = false;
};

const handleFocus = () => {
    showSearchResults.value = true;
};

const handleFocusLi = () => {
    showSearchResults.value = false;
    searchText.value = '';
};

const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (searchText.value.trim() && searchResults) {
        router.push(`/tim-truyen/${searchText.value}`);
        searchText.value = '';
        showSearchResults.value = false;
    }
};
watch(
    searchText,
    debounce(async () => {
        if (searchText.value.length > 0) {
            try {
                const res = await ComicServices.getComicByName(searchText.value);
                searchResults.value = res.comics;
                showSearchResults.value = true;
            } catch (error) {
                console.error('Failed to watch' + error);
            }
        }
    }, 1000),
);
</script>

<style scoped>
.doc-search {
    background-color: #1618230f;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1.5px solid rgba(255, 255, 255, 0.2);
    border-radius: 16px;
    margin-right: 24px;
}

.search-input {
    padding: 8px 10px;
}

input {
    padding: 0;
    border: none;
    background-color: #00000000;
    outline: none;
}

.search-btn {
    width: 20%;
    font-size: 20px;
    cursor: pointer;
    outline: none;
    border: none;
    background: transparent;
    margin-left: 0;
    color: rgba(22, 24, 35, 0.34);
    padding: 6px 10px;
}

.search-icon {
    display: flex;
}

.search-results {
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 4px;
    position: absolute;
    top: 100%;
    left: 0;
    width: 300px;
}

.search-results ul {
    list-style: none;
    padding: 0;
}

.search-results li {
    border-bottom: 1px solid #ccc;
}

.search-results li:last-child {
    border-bottom: none;
}

.item-container {
    max-width: 300px;
    display: flex;
    padding: 9px 12px 0px 12px;
    cursor: pointer;
    color: black;
}

.item-container:hover {
    background-color: #aaafb2;
}

.item-container-right {
    text-align: left;
    padding-left: 10px;
}

.img-item {
    height: 70px;
    width: auto;
}

.name-item {
    line-height: 17px;
    white-space: pre-wrap;
    overflow-wrap: break-word;
    margin: 0;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    font-size: smaller;
}

.category-item {
    font-size: small;
}
</style>
