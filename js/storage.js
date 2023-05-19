class KeyStorage {
    constructor() {
        this.dbName = 'KeyVault';
        this.objectStoreName = 'keys';
        this.init();
    }

    async init() {
        const request = indexedDB.open(this.dbName);
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            db.createObjectStore(this.objectStoreName, { keyPath: 'id', autoIncrement: true });
        };
    }

    async addKey(keyInfo) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName);
            request.onsuccess = (event) => {
                const db = event.target.result;
                const transaction = db.transaction(this.objectStoreName, 'readwrite');
                const objectStore = transaction.objectStore(this.objectStoreName);
                const addRequest = objectStore.add(keyInfo);

                addRequest.onsuccess = () => resolve(addRequest.result);
                transaction.onerror = () => reject(transaction.error);
            };
        });
    }

    async getKeys() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName);
            request.onsuccess = (event) => {
                const db = event.target.result;
                const transaction = db.transaction(this.objectStoreName);
                const objectStore = transaction.objectStore(this.objectStoreName);
                const keys = [];
                objectStore.openCursor().onsuccess = (event) => {
                    const cursor = event.target.result;
                    if (cursor) {
                        keys.push(cursor.value);
                        cursor.continue();
                    } else {
                        resolve(keys);
                    }
                };
                transaction.onerror = () => reject(transaction.error);
            };
        });
    }

    async updateKey(id, newKeyInfo) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName);
            request.onsuccess = (event) => {
                const db = event.target.result;
                const transaction = db.transaction(this.objectStoreName, 'readwrite');
                const objectStore = transaction.objectStore(this.objectStoreName);
                const getRequest = objectStore.get(id);
                getRequest.onsuccess = () => {
                    const storedKey = getRequest.result;
                    Object.assign(storedKey, newKeyInfo);
                    const putRequest = objectStore.put(storedKey);
                    putRequest.onsuccess = () => resolve(putRequest.result);
                };

                transaction.onerror = () => reject(transaction.error);
            };
        });
    }

    async removeKey(id) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName);
            request.onsuccess = (event) => {
                const db = event.target.result;
                const transaction = db.transaction(this.objectStoreName, 'readwrite');
                const objectStore = transaction.objectStore(this.objectStoreName);
                const deleteRequest = objectStore.delete(id);

                deleteRequest.onsuccess = () => resolve(deleteRequest.result);
                transaction.onerror = () => reject(transaction.error);
            };
        });
    }
}
