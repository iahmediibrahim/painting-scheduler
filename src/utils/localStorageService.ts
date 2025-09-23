export function getFromStorage<T>(key: string, fallback: T): T {
	if (typeof window === 'undefined') return fallback
	try {
		const item = localStorage.getItem(key)
		return item ? (JSON.parse(item) as T) : fallback
	} catch {
		return fallback
	}
}

export function saveToStorage<T>(key: string, value: T) {
	if (typeof window !== 'undefined') {
		localStorage.setItem(key, JSON.stringify(value))
	}
}
