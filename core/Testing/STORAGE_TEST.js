/*
  Test script for storage module
  Uses mock Chrome API for Node.js testing
  MADE BY : HA2077
*/

// Mock Chrome API for Node.js
const mockStorage = {};
global.chrome = {
    storage: {
        local: {
            get: (key, callback) => {
                setTimeout(() => {
                    if (key === null) {
                        callback({...mockStorage});
                    } else {
                        callback(mockStorage[key] !== undefined ? { [key]: mockStorage[key] } : {});
                    }
                }, 0);
            },
            set: (data, callback) => {
                setTimeout(() => {
                    Object.assign(mockStorage, data);
                    callback();
                }, 0);
            },
            remove: (key, callback) => {
                setTimeout(() => {
                    delete mockStorage[key];
                    callback();
                }, 0);
            },
            clear: (callback) => {
                setTimeout(() => {
                    Object.keys(mockStorage).forEach(k => delete mockStorage[k]);
                    callback();
                }, 0);
            }
        },
        session: {
            get: (key, callback) => {
                setTimeout(() => callback({ [key]: null }), 0);
            },
            set: (data, callback) => {
                setTimeout(() => callback(), 0);
            },
            clear: (callback) => {
                setTimeout(() => callback(), 0);
            }
        }
    },
    runtime: {
        lastError: null
    }
};

const { storage, sessionStorage } = require('../storage.js');

async function runTests(){
    console.log("\n--- 💾 HA's Password Locker: Storage Test ---\n");

    console.log("🔄 Testing storage.set...");
    await storage.set("testKey", "testValue");
    console.log("✅ set() completed");

    console.log("\n🔄 Testing storage.get...");
    const value = await storage.get("testKey");
    if (value === "testValue")
        console.log("✅ PASS: Retrieved correct value");
    else
        console.log(`❌ FAIL: Got "${value}" instead of "testValue"`);

    console.log("\n🔄 Testing storage.get (non-existent)...");
    const missing = await storage.get("nonExistent");
    if (missing === null)
        console.log("✅ PASS: Returns null for missing key");
    else
        console.log(`❌ FAIL: Should return null`);

    console.log("\n🔄 Testing storage.set (object)...");
    await storage.set("userData", { name: "HA2077", age: 17 });
    const userData = await storage.get("userData");
    if (userData && userData.name === "HA2077")
        console.log("✅ PASS: Stores and retrieves objects");
    else
        console.log("❌ FAIL: Object storage failed");

    console.log("\n🔄 Testing storage.getAll...");
    await storage.set("key1", "value1");
    await storage.set("key2", "value2");
    const all = await storage.getAll();
    if (all.key1 === "value1" && all.key2 === "value2")
        console.log("✅ PASS: getAll() returns all data");
    else
        console.log("❌ FAIL: getAll() issue");

    console.log("\n🔄 Testing storage.remove...");
    await storage.remove("testKey");
    const removed = await storage.get("testKey");
    if (removed === null)
        console.log("✅ PASS: Key removed");
    else
        console.log("❌ FAIL: Remove failed");

    console.log("\n🔄 Testing storage.clear...");
    await storage.clear();
    const cleared = await storage.getAll();
    if (Object.keys(cleared).length === 0)
        console.log("✅ PASS: Storage cleared");
    else
        console.log("❌ FAIL: Clear failed");

    console.log("\n--- Storage Test Complete ---\n");
}

runTests();