// Test script for encryption module

const { encrypt, decrypt } = require('../passencryption.js');

if (typeof btoa === 'undefined') {
    global.btoa = (str) => Buffer.from(str).toString('base64');
    global.atob = (b64) => Buffer.from(b64, 'base64').toString('binary');
}

async function runTest(){
    console.log("\n--- 🔐 HA's Password Locker: Encryption Test ---\n");

    const myMasterKey = "298147298561958712983745"; // In real usage, this should be a strong, user-chosen password
    const secretPassword = "lh`lMQ9|yy?]K?0|";

    console.log(`🔹 Input Text:  "${secretPassword}"`);
    console.log(`🔹 Master Key:  "${myMasterKey}"`);

    console.log("\n🔄 Encrypting...");
    const cipherText = await encrypt(myMasterKey, secretPassword);
    
    console.log(`✅ Encrypted Package:`);
    console.log(cipherText); 

    console.log("\n🔄 Decrypting...");
    const plainText = await decrypt(myMasterKey, cipherText);

    if (plainText === secretPassword)
        console.log(`\n✅ SUCCESS: Decrypted text matches original! -> "${plainText}"`);
    else
        console.log(`\n❌ FAILED: Got "${plainText}" instead.`);

    console.log("\n🔄 Testing Wrong Key...");
    const failTest = await decrypt("WrongKey", cipherText);
    if (failTest === null)
        console.log("✅ PASS: Decryption correctly failed with wrong key.");
    else 
        console.log("❌ FAIL: Decryption should have failed.");
}

runTest();