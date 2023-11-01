import { ref, watch } from 'vue';

function useDebounce(value: string, delay: number) {
    const debouncedValue = ref<string>(value);

    watch(debouncedValue, () => {
        const handler = setTimeout(() => {
            debouncedValue.value = value;
            return debouncedValue.value;
        }, delay);
        return () => clearTimeout(handler);
    });
    return debouncedValue;
}

export default useDebounce;
