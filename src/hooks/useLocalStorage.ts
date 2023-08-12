import { useState, useEffect } from 'react';

function getValue<T>(key: string, defaultVal?: T): T | null {
	if (!window) return null;
	const storedVal = localStorage.getItem(key);
	if (!storedVal) return defaultVal || null;
	return JSON.parse(storedVal);
}

/**
 * Store data in local storage.
 */
export function useLocalStorage<T>(key: string, defaultVal?: T) {
	const [val, setVal] = useState(() => getValue(key, defaultVal));

	useEffect(() => {
		localStorage.setItem(key, JSON.stringify(val));
	}, [key, val]);

	return [val, setVal];
}
