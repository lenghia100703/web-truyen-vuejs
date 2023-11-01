import type { Category } from '@/views/ComicDetailView.vue';
import axios from 'axios';
import { defineStore } from 'pinia';

interface CategoryState {
    categories: Category[];
}

const useCategoryStore = defineStore({
    id: 'category',
    state: (): CategoryState => ({
        categories: [],
    }),
    actions: {
        async getAllCategory() {
            const res = await axios.get('/category');
            this.categories = res.data;
            console.log('Get all categories success');
        },
    },
});

export default useCategoryStore;
