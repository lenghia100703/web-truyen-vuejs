export interface UserInfo {
    _id: string;
    admin: boolean;
    username: string;
    accessToken: string;
    refreshToken: string;
    followComic: string[];
    address: string;
    avatar: string;
    phone: string;
    email: string;
}

export interface Comic {
    _id: string;
    name: string;
    description: string;
    userId: string;
    likeCount: number;
    view: number;
    slug: string;
    image: string;
    followCount: number;
    category: string;
    chapters: any[];
    status: boolean;
}

export interface Category {
    _id: string;
    name: string;
    description: string;
    comics: any[];
}

export interface ChapterDetail {
    title: string;
    images: string[];
    view: number;
}

export interface Chapter {
    chapterDetail: ChapterDetail;
    nameComic: string;
    chapters: ChapterDetail[];
}
