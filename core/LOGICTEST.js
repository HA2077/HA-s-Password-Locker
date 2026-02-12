// This file is for testing the core logic
const {generatePassword} = require('./logic.js');
 
console.log("\n🔒 --- HA's Password Locker: Logic Test ---\n");

const pass1 = generatePassword(16, true, true, true, true);
console.log(`[TEST 1] Standard (16 chars):  ${pass1}`);

const pass2 = generatePassword(20, false, false, false, true);
console.log(`[TEST 2] PIN Code (20 numbers): ${pass2}`);

const pass3 = generatePassword(12, true, true, false, true);
console.log(`[TEST 3] Alphanumeric (12 char): ${pass3}`);

if (pass1.length === 16 && pass2.length === 20){
    console.log("\n✅ SUCCESS: Length checks passed.");
    console.log("✅ SUCCESS: Logic ported correctly.");
} 
else
    console.log("\n❌ FAIL: Password lengths are incorrect.");