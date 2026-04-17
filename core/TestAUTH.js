// Test script for auth module

const { hashPassword, verifyPassword, generateSalt, PBKDF2_ITERATIONS } = require('./auth.js');

if (typeof btoa === 'undefined') {
    global.btoa = (str) => Buffer.from(str).toString('base64');
    global.atob = (b64) => Buffer.from(b64, 'base64').toString('binary');
}

async function runTest() {
    console.log("\n--- 🔐 HA's Password Locker: Auth Test ---");
    console.log(`Iterations: ${PBKDF2_ITERATIONS}\n`);

    const password = "MySecretPassword123";
    
    console.log(`🔹 Test Password: "${password}"`);

    console.log("\n🔄 Generating salt...");
    const salt = generateSalt();
    console.log(`✅ Salt: ${salt}`);

    console.log("\n🔄 Hashing password...");
    const startTime = Date.now();
    const hash = await hashPassword(password, salt);
    const endTime = Date.now();
    console.log(`✅ Hash: ${hash}`);
    console.log(`⏱️  Time: ${endTime - startTime}ms`);

    console.log("\n🔄 Verifying correct password...");
    const correctVerify = await verifyPassword(password, hash, salt);
    if (correctVerify)
        console.log("✅ PASS: Correct password verified!");
    else
        console.log("❌ FAIL: Should have verified.");

    console.log("\n🔄 Verifying wrong password...");
    const wrongVerify = await verifyPassword("WrongPassword", hash, salt);
    if (!wrongVerify)
        console.log("✅ PASS: Wrong password rejected!");
    else
        console.log("❌ FAIL: Should have rejected.");

    console.log("\n--- Test Complete ---\n");
}

runTest();