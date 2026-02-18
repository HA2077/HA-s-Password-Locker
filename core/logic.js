/*
This file is the core logic for generating a secure password. 
MADE BY : HA2077
*/

// Get all the characters we can use in our password
const CHARS ={
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    numbers: "0123456789",
    symbols: "!@#$%^&*()_+~`|}{[]:;?><,./-"
};

// Get a secure random int from (0 to max-1)
function getSecureRandomInt(max){
    const cryptoObj = (typeof crypto !== 'undefined') ? crypto : require('crypto').webcrypto;
    
    const array = new Uint32Array(1);
    cryptoObj.getRandomValues(array);
    
    return array[0] % max;
}

// A Secure Choice function that picks a random character
function secureChoice(str){
    if (!str.length) return '';
    const index = getSecureRandomInt(str.length);
    return str[index];
}

// Scrambles the array in place
function secureShuffle(array){
    for (let i = array.length-1;i > 0; i--){
        const j = getSecureRandomInt(i + 1);
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// The Main Function
function generatePassword(length = 16, useLower = true, useUpper = true, useSym = true, useNum = true, unique = false){
    let availableChars = "";
    let passwordArray = [];

    // Build the pool of allowed characters to put in availableChars
    if (useLower) availableChars += CHARS.lowercase;
    if (useUpper) availableChars += CHARS.uppercase;
    if (useSym)   availableChars += CHARS.symbols;
    if (useNum)   availableChars += CHARS.numbers;

    if (!availableChars){
        console.warn("No character types selected! Defaulting to lowercase.");
        availableChars = CHARS.lowercase;
    }

    // SAFETY CHECK: If length > pool size, duplicates MUST be allowed
    if (unique && length > availableChars.length){
        console.warn(`⚠️ Cannot fulfill 'Unique' request. Pool size (${availableChars.length}) < Length (${length}). Disabling uniqueness.`);
        unique = false;
    }
    
    // Helper to pick a char while respecting uniqueness
    const pickChar = (pool) =>{
        let char = secureChoice(pool);
        if (unique){
            let attempts = 0; 
            // Safety break after 50 tries to prevent infinite loops if logic fails
            while (passwordArray.includes(char) && attempts < 50){
                char = secureChoice(pool);
                attempts++;
            }
        }
        return char;
    };

    // Ensure at least one of each selected type is included
    if (useLower) passwordArray.push(pickChar(CHARS.lowercase));
    if (useUpper) passwordArray.push(pickChar(CHARS.uppercase));
    if (useSym)   passwordArray.push(pickChar(CHARS.symbols));
    if (useNum)   passwordArray.push(pickChar(CHARS.numbers));

    const remainingLength = length - passwordArray.length;
    for (let i = 0; i < remainingLength; i++){
        passwordArray.push(pickChar(availableChars));
    }

    // Scramble
    secureShuffle(passwordArray);

    return passwordArray.join('');
}
export { generatePassword };