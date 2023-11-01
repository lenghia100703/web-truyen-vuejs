import { http } from '@/utils/http';
import { CategoryAPI } from '@/api/CategoryAPI';


export const CategoryServices = {
    getAll: async () => {
        return (await http.get(CategoryAPI.LIST)).data;
    },

    getCategoryById: async (categoryId: any) => {
        return (await http.get(CategoryAPI.CATEGORY_BY_ID(categoryId))).data;
    },

    getCategoryBySlug: async (slug: any) => {
        return (await http.get(CategoryAPI.CATEGORY_BY_SLUG(slug))).data;
    },

};