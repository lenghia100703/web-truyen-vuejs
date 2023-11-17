import { ElLoading } from 'element-plus';

export const loadingFullScreen = (text: string) => {
    const loading = ElLoading.service({
        lock: true,
        text: text,
        background: 'rgb(0, 0, 0, 0.7)',
    });
    setTimeout(() => {
        loading.close();
    }, 750);
};
