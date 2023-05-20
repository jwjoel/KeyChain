class KeyStorage {
  constructor() {
    this.dbName = "KeyVault";
    this.objectStoreName = "keys";
    this.keyStoreName = "encryptionKeys";
    this.init();
  }

  async init() {
    const request = indexedDB.open(this.dbName);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      db.createObjectStore(this.objectStoreName, {
        keyPath: "id",
        autoIncrement: true,
      });
      db.createObjectStore(this.keyStoreName, { keyPath: "id" });
    };
    console.log(request);
    request.onsuccess = (event) => {
      const db = event.target.result;
      const keyTransaction = db.transaction(this.keyStoreName);
      const keyObjectStore = keyTransaction.objectStore(this.keyStoreName);
      const getRequest = keyObjectStore.get(1);
      getRequest.onsuccess = async () => {
        if (!getRequest.result) {
          const generatedKey = await this.generateKey();
          const exportedKey = await crypto.subtle.exportKey(
            "jwk",
            generatedKey
          );
          this.encryptionKey = generatedKey;
          const keyRequest = indexedDB.open(this.dbName);
          keyRequest.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(this.keyStoreName, "readwrite");
            const objectStore = transaction.objectStore(this.keyStoreName);
            objectStore.add({ id: 1, key: exportedKey });
          };
        } else {
          this.encryptionKey = await crypto.subtle.importKey(
            "jwk",
            getRequest.result.key,
            {
              name: "AES-GCM",
              length: 256,
            },
            true,
            ["encrypt", "decrypt"]
          );
        }
      };
    };
  }

  generateKey() {
    return crypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 256,
      },
      true,
      ["encrypt", "decrypt"]
    );
  }

  async encrypt(plaintext, key) {
    const encoder = new TextEncoder();
    const encoded = encoder.encode(plaintext);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ciphertext = await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      encoded
    );
    return {
      iv: iv,
      ciphertext: ciphertext,
    };
  }

  async decrypt(ciphertext, iv, key) {
    
    const decoder = new TextDecoder();
    const decrypted = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      ciphertext
    );
    return String(decoder.decode(decrypted));
  }

  async exportEncryptedKeys() {
    const keys = await this.getEncryptedKeys();
    console.log(keys)
    const encryptedKeys = [];

    for (const key of keys) {
      const encryptedKeyInfo = {
        id: key.id,
        source: key.source,
        key: {
          ciphertext: arrayBufferToBase64(key.key.ciphertext), // 使用 base64 编码
          iv: arrayBufferToBase64(key.key.iv), // 使用 base64 编码
        },
        expiration: key.expiration,
      };
      encryptedKeys.push(encryptedKeyInfo);
    }

    const exportedKey = await crypto.subtle.exportKey("jwk", this.encryptionKey);
    return {
      keys: encryptedKeys,
      encryptionKey: exportedKey,
    };
  }

  async importEncryptedKeys(data) {
    const importedKey = await crypto.subtle.importKey(
      "jwk",
      data.encryptionKey,
      {
        name: "AES-GCM",
        length: 256,
      },
      true,
      ["encrypt", "decrypt"]
    );
    this.encryptionKey = importedKey;
    await this.removeAllKeys();
    console.log(this.encryptionKey)
    console.log(data)
    for (const key of data.keys) {
      console.log(key)
      const decryptedApikey = await this.decrypt(
        base64ToArrayBuffer(key.key.ciphertext), // 使用 base64 解码
        base64ToArrayBuffer(key.key.iv), // 使用 base64 解码
        this.encryptionKey
      );
      console.log(decryptedApikey)
      const keyInfo = {
        id: key.id,
        source: key.source,
        key: decryptedApikey,
        expiration: key.expiration,
      };
      await this.addKey(keyInfo);
    }
  }

  async exportPlainKeys() {
    let plaintextKeys = await this.getKeys()
  
    const exportedKey = await crypto.subtle.exportKey("jwk", this.encryptionKey);
    return {
      keys: plaintextKeys,
      encryptionKey: exportedKey
    };
  }
  
  async importPlainKeys(data) {
    const importedKey = await crypto.subtle.importKey(
      "jwk",
      data.encryptionKey,
      {
        name: "AES-GCM",
        length: 256,
      },
      true,
      ["encrypt", "decrypt"]
    );
    this.encryptionKey = importedKey;
    await this.removeAllKeys();
  
    for (let tempKey of data.keys) {
      const keyInfo = {
        id: tempKey.id,
        source: tempKey.source,
        key: tempKey.key,
        expiration: tempKey.expiration,
      };
      await this.addKey(keyInfo);
    }
  }
  

  async removeAllKeys() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName);
      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(this.objectStoreName, "readwrite");
        const objectStore = transaction.objectStore(this.objectStoreName);
        const clearRequest = objectStore.clear();

        clearRequest.onsuccess = () => resolve(clearRequest.result);
        transaction.onerror = () => reject(transaction.error);
      };
    });
  }

  async addKey(keyInfo) {
    return new Promise(async (resolve, reject) => {
      const encryptedApikey = await this.encrypt(keyInfo.key, this.encryptionKey);
      keyInfo.key = encryptedApikey;
      const request = indexedDB.open(this.dbName);
      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(this.objectStoreName, "readwrite");
        const objectStore = transaction.objectStore(this.objectStoreName);
        const addRequest = objectStore.add(keyInfo);

        addRequest.onsuccess = () => resolve(addRequest.result);
        transaction.onerror = () => reject(transaction.error);
      };
    });
  }

  async getEncryptedKeys() {
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
            resolve(keys)
          }
        };
      }
    })
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
          }
        };
  
        transaction.oncomplete = async () => {
          console.log(1)
          for (const key of keys) {
            console.log(key.key)
            key.key = await this.decrypt(key.key.ciphertext, key.key.iv, this.encryptionKey);
            console.log(key.key)
          }
          resolve(keys);
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
        const transaction = db.transaction(this.objectStoreName, "readwrite");
        const objectStore = transaction.objectStore(this.objectStoreName);
        const deleteRequest = objectStore.delete(id);

        deleteRequest.onsuccess = () => resolve(deleteRequest.result);
        transaction.onerror = () => reject(transaction.error);
      };
    });
  }
}
