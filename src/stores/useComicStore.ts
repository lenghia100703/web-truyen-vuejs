import { defineStore } from 'pinia';
import axios from 'axios';
import type { Comic } from '@/views/ComicDetailView.vue';
import { ComicServices } from '@/services/comic/ComicServices';

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
            this.comics = await ComicServices.getAll();
            console.log('Get All Comics Successful');
        },
    },
});
