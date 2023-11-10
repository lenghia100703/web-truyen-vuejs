import { defineStore } from 'pinia';
import { ComicServices } from '@/services/comic/ComicServices';
import type { Comic } from '@/interfaces';

interface ComicState {
    comics: Comic[];
    totalComics: number;
}

export const useComicStore = defineStore({
    id: 'comic',
    state: (): ComicState => ({
        comics: [],
        totalComics: 0,
    }),
    actions: {
        async getAllComics(page: any) {
            const res = await ComicServices.getComicByPage(page);
            this.comics = res.comics;
            this.totalComics = res.totalComics;
            console.log('Get All Comics Successful');
        },
    },
});
