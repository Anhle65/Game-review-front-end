import {create} from "zustand/react";

interface UserState {
    userId: string;
    token: string;
    setAuthorization: (userId: string, token: string) => void;
    removeAuthorization: () => void;
}
const getLocalStorage =(key: string): string => window.localStorage.getItem(key) || '';

const setLocalStorage =(key: string, value: string) => window.localStorage.setItem(key, value);

const useStore = create<UserState>((set) => ({
    userId: getLocalStorage('userId') || '',
    token: getLocalStorage('token') || '',
    setAuthorization: (userId: string, token: string) => set(() => {
        setLocalStorage('userId', userId);
        setLocalStorage('token', token);
        return {userId: userId, token: token};
    }),
    removeAuthorization: () => set(() => {
        setLocalStorage('token', '');
        setLocalStorage('userId', '');
        return { userId: '', token: '' };
    })
}))

export const useUserStore = useStore;