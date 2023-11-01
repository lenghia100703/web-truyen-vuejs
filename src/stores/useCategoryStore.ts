import type { Category } from '@/views/ComicDetailView.vue';
import axios from 'axios';
import { defineStore } from 'pinia';
import { CategoryServices } from '@/services/category/CategoryServices';

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
            this.categories = await CategoryServices.getAll();
            console.log('Get all categories success');
        },
    },
});

export default useCategoryStore;
