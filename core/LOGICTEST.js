/*
This file is for testing the core logic
MADE BY : HA2077
*/

const { generatePassword } = require('./logic.js');

console.log("\n --- HA's Password Locker: Deep Logic Test ---\n");

// Helper to check regex matches
function testRegex(pass, regex, name) {
    if (regex.test(pass)) return true;
    console.log(`   ❌ FAILED: ${name} check missing in "${pass}"`);
    return false;
}

// TEST 1: Standard Strength 
console.log("🔹 TEST 1: Standard (16 chars, All options)");
const pass1 = generatePassword(16, true, true, true, true);
console.log(`   Output: ${pass1}`);
let t1_ok = pass1.length === 16 &&
            testRegex(pass1, /[a-z]/, "Lowercase") &&
            testRegex(pass1, /[A-Z]/, "Uppercase") &&
            testRegex(pass1, /[0-9]/, "Number") &&
            testRegex(pass1, /[!@#$%^&*()_+~`|}{[\]:;?><,./-]/, "Symbol");
if (t1_ok) console.log("   ✅ PASS");


// TEST 2: Numbers Only (PIN)
console.log("\n🔹 TEST 2: PIN Code (20 chars, Numbers only)");
const pass2 = generatePassword(20, false, false, false, true);
console.log(`   Output: ${pass2}`);
// Should contain ONLY numbers
if (/^\d+$/.test(pass2) && pass2.length === 20) console.log("   ✅ PASS");
else console.log("   ❌ FAIL: Contains non-numbers or wrong length");


// --- TEST 3: Edge Case - No Options Selected ---
console.log("\n🔹 TEST 3: Fallback (No options selected)");
// Should default to lowercase
const pass3 = generatePassword(10, false, false, false, false);
console.log(`   Output: ${pass3}`);
if (/[a-z]/.test(pass3) && pass3.length === 10) console.log("   ✅ PASS (Defaulted to Lowercase)");
else console.log("   ❌ FAIL: Did not handle empty selection gracefully");


// --- TEST 4: The "Unique" Limit ---
console.log("\n🔹 TEST 4: Unique Constraint Check");
// Pool of numbers is only 10. We ask for 12 unique chars. This SHOULD fallback to duplicates.
const pass4 = generatePassword(12, false, false, false, true, true); // (length 12, nums only, unique=true)
console.log(`   Output: ${pass4}`);

// Check for duplicates
const uniqueCount = new Set(pass4.split('')).size;
if (pass4.length === 12 && uniqueCount < 12)
    console.log(`   ✅ PASS: Logic correctly allowed duplicates (Pool 10 < Length 12).`);
else console.log("   ❌ FAIL: Logic didn't handle the overflow correctly.");

console.log("\n-------------------------------------------");