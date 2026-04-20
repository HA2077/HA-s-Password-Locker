/*
  HA's Password Locker - Storage Module
  MADE BY : HA2077

  Chrome Storage API wrapper for local storage
  Handles: chrome.storage.local (persistent) and chrome.storage.session (session RAM)
    Provides async methods: get, set, getAll, remove, clear
*/

const STORAGE_AREA = chrome?.storage?.local;

const storage = {
    /*
      Get value by key
      Returns: Promise resolving to value
    */
    async get(key) {
        return new Promise((resolve, reject) => {
            if (!STORAGE_AREA) {
                reject(new Error("Storage not available"));
                return;
            }
            STORAGE_AREA.get(key, (result) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                    return;
                }
                resolve(result[key] ?? null);
            });
        });
    },

    /*
      Set key-value pair
      Returns: Promise
    */
    async set(key, value) {
        return new Promise((resolve, reject) => {
            if (!STORAGE_AREA) {
                reject(new Error("Storage not available"));
                return;
            }
            const data = { [key]: value };
            STORAGE_AREA.set(data, () => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                    return;
                }
                resolve(true);
            });
        });
    },

    /*
      Get all storage data
      Returns: Promise resolving to object
    */
    async getAll() {
        return new Promise((resolve, reject) => {
            if (!STORAGE_AREA) {
                reject(new Error("Storage not available"));
                return;
            }
            STORAGE_AREA.get(null, (result) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                    return;
                }
                resolve(result);
            });
        });
    },

    /*
      Remove key
      Returns: Promise
    */
    async remove(key) {
        return new Promise((resolve, reject) => {
            if (!STORAGE_AREA) {
                reject(new Error("Storage not available"));
                return;
            }
            STORAGE_AREA.remove(key, () => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                    return;
                }
                resolve(true);
            });
        });
    },

    /*
      Clear all storage
      Returns: Promise
    */
    async clear() {
        return new Promise((resolve, reject) => {
            if (!STORAGE_AREA) {
                reject(new Error("Storage not available"));
                return;
            }
            STORAGE_AREA.clear(() => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                    return;
                }
                resolve(true);
            });
        });
    }
};

const sessionStorage = {
    async get(key) {
        return new Promise((resolve, reject) => {
            if (!chrome?.storage?.session) {
                resolve(null);
                return;
            }
            chrome.storage.session.get(key, (result) => {
                if (chrome.runtime.lastError) {
                    resolve(null);
                    return;
                }
                resolve(result[key] ?? null);
            });
        });
    },

    async set(key, value) {
        return new Promise((resolve) => {
            if (!chrome?.storage?.session) {
                resolve(false);
                return;
            }
            chrome.storage.session.set({ [key]: value }, () => {
                resolve(!chrome.runtime.lastError);
            });
        });
    },

    async clear() {
        return new Promise((resolve) => {
            if (!chrome?.storage?.session) {
                resolve(false);
                return;
            }
            chrome.storage.session.clear(() => {
                resolve(!chrome.runtime.lastError);
            });
        });
    }
};

export { storage, sessionStorage };