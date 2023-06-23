export const Cache = {
    setCache: (key: string, value: any) => {
        let data = '';
        try {
            data = JSON.stringify(value);
        } catch (e) {
            console.log(e);
        }
        localStorage.setItem(key, data);

    },
    getCache: (key: string) => {
        const data = localStorage.getItem(key);
        if (!data) {
            return null;
        }
        let res = null;
        try {
            res = JSON.parse(data);
        } catch (e) {
            console.log(e);
        }
        return res;
    },
    delCache: (key: string) => localStorage.removeItem(key),
    clear: () => localStorage.clear()
}