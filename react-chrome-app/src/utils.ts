export const Cache = {
    setCache: (key: string, value: any) => localStorage.setItem(key, JSON.stringify(value)),
    getCache: (key: string) => JSON.parse(localStorage.getItem(key) || '{}'),
    delCache: (key: string) => localStorage.removeItem(key),
    clear: () => localStorage.clear()
}