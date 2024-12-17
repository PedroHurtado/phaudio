const dbName = 'myDatabase';
const storeName = 'myStore';
const dbVersion = 1;

function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, dbVersion);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;            
            db.createObjectStore(storeName);
        };

        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(`Error opening DB: ${event.target.error}`);
    });
}



export function add(key, value) {
    return new Promise(async (resolve, reject) => {
        const db = await openDB();
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);

        const request = store.put(value, key); // Clave externa
        request.onsuccess = () => resolve(`Data added with key: ${key}`);
        request.onerror = () => reject(`Error adding data: ${request.error}`);
    });
}


export function update(key, value) {
    return add(key, value);
}


export function remove(key) {
    return new Promise(async (resolve, reject) => {
        const db = await openDB();
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);

        const request = store.delete(key);
        request.onsuccess = () => resolve(`Data removed for key: ${key}`);
        request.onerror = () => reject(`Error removing data: ${request.error}`);
    });
}


export function get(key) {
    return new Promise(async (resolve, reject) => {
        const db = await openDB();
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);

        const request = store.get(key);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(`Error getting data: ${request.error}`);
    });
}

