import { ElLoading } from 'element-plus';

export const loadingFullScreen = () => {
    const loading = ElLoading.service({
        lock: true,
        text: 'Đang kiểm tra',
        background: 'rgb(0, 0, 0, 0.7)',
    });
    setTimeout(() => {
        loading.close();
    }, 750);
};
