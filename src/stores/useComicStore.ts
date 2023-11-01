import { defineStore } from 'pinia';
import axios from 'axios';
import type { Comic } from '@/views/ComicDetailView.vue';

interface ComicState {
    comics: Comic[];
}

export const useComicStore = defineStore({
    id: 'comic',
    state: (): ComicState => ({
        comics: [],
    }),
    actions: {
        async getAllComics() {
            const res = await axios.get('/comic');
            this.comics = res.data;
            console.log('Get All Comics Successful');
        },
    },
});
