/*
  HA's Password Locker - Authentication Module
  MADE BY : HA2077
*/

const cryptoObj = (typeof crypto !== 'undefined') ? crypto : require('crypto').webcrypto;
const PBKDF2_ITERATIONS = 600000;
const SALT_LEN = 16;

function buffToBase64(buffer) {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

function base64ToBuff(base64) {
    return Uint8Array.from(atob(base64), c => c.charCodeAt(0));
}

// Generate a random salt for PBKDF2           Returns: base64 encoded salt
function generateSalt() {
    const salt = cryptoObj.getRandomValues(new Uint8Array(SALT_LEN));
    return buffToBase64(salt);
}

// Hash a password using PBKDF2 with SHA-256   Returns: base64 encoded hash
async function hashPassword(password, salt) {
    const encoder = new TextEncoder();
    const saltBytes = base64ToBuff(salt);
    
    const keyMaterial = await cryptoObj.subtle.importKey(
        "raw",
        encoder.encode(password),
        { name: "PBKDF2" },
        false,
        ["deriveKey"]
    );

    const derivedKey = await cryptoObj.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: saltBytes,
            iterations: PBKDF2_ITERATIONS,
            hash: "SHA-256"
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt"]
    );

    const exportedKey = await cryptoObj.subtle.exportKey("raw", derivedKey);
    return buffToBase64(exportedKey);
}

// Verify a password against a stored hash      Returns: boolean
async function verifyPassword(password, storedHash, salt) {
    const computedHash = await hashPassword(password, salt);
    return computedHash === storedHash;
}

export { hashPassword, verifyPassword, generateSalt, PBKDF2_ITERATIONS };