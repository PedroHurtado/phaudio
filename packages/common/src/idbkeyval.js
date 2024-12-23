const dbName = 'KeyValDb';
const storeName = 'KeyStore';
const dbVersion = 1;

function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, dbVersion);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName);
            }
        };

        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(`Error opening DB: ${event.target.error}`);
    });
}

function handleDBOperation(mode, operationCallback) {
    return new Promise(async (resolve, reject) => {
        let db = null;
        try {
            db = await openDB();
            const tx = db.transaction(storeName, mode);
            const store = tx.objectStore(storeName);

            tx.oncomplete = () => {
                db.close();
                resolve();
            };
            tx.onerror = () => {
                db.close();
                reject(`Transaction error: ${tx.error}`);
            };
            tx.onabort = () => {
                db.close();
                reject(`Transaction aborted: ${tx.error}`);
            };

            operationCallback(store, resolve, reject);
        } catch (error) {
            if (db) db.close();
            reject(`Unexpected error: ${error}`);
        }
    });
}

export function add(key, value) {
    return handleDBOperation('readwrite', (store, resolve, reject) => {
        const request = store.put(value, key);
        request.onsuccess = () => resolve(`Data added with key: ${key}`);
        request.onerror = () => reject(`Error adding data: ${request.error}`);
    });
}

export function update(key, value) {
    return add(key, value); // Misma lógica que `add`
}

export function remove(key) {
    return handleDBOperation('readwrite', (store, resolve, reject) => {
        const request = store.delete(key);
        request.onsuccess = () => resolve(`Data removed for key: ${key}`);
        request.onerror = () => reject(`Error removing data: ${request.error}`);
    });
}

export function get(key) {
    return handleDBOperation('readonly', (store, resolve, reject) => {
        const request = store.get(key);
        request.onsuccess = () => {            
            resolve(request.result)}
        ;
        request.onerror = () => reject(`Error getting data: ${request.error}`);
    });
}
