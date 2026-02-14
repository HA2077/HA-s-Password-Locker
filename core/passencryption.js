/*
  HA's Password Locker - Encryption Module
  MADE BY : HA2077
*/

const cryptoObj = (typeof crypto !== 'undefined') ? crypto : require('crypto').webcrypto;
const ALGO_NAME = "AES-GCM";
const PBKDF2_ITERATIONS = 100000;
const SALT_LEN = 16;
const IV_LEN = 12;

/*
  HELPER: Derive a Cryptographic Key from the Master Key string
  Returns: CryptoKey object
*/
async function deriveKey(masterKeyString, salt){
    const encoder = new TextEncoder();
    const keyMaterial = await cryptoObj.subtle.importKey(
        "raw",
        encoder.encode(masterKeyString),
        { name: "PBKDF2" },
        false,
        ["deriveKey"]
    );

    return await cryptoObj.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: salt,
            iterations: PBKDF2_ITERATIONS,
            hash: "SHA-256"
        },
        keyMaterial,
        { name: ALGO_NAME, length: 256 },
        false,
        ["encrypt", "decrypt"]
    );
}

// Helper functions to convert between ArrayBuffer and Base64 strings for easy storage
function buffToBase64(buffer) {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

function base64ToBuff(base64) {
    return Uint8Array.from(atob(base64), c => c.charCodeAt(0));
}

// Encryption function
async function encrypt(Mkey, password){
    try{
        // Generate random Salt and IV
        const salt = cryptoObj.getRandomValues(new Uint8Array(SALT_LEN));
        const iv = cryptoObj.getRandomValues(new Uint8Array(IV_LEN));

        // Derive the actual crypto key from Mkey + Salt
        const key = await deriveKey(Mkey, salt);

        // Encrypt the password
        const encoder = new TextEncoder();
        const encryptedContent = await cryptoObj.subtle.encrypt(
            { name: ALGO_NAME, iv: iv },
            key,
            encoder.encode(password)
        );

        const package = `${buffToBase64(salt)}::${buffToBase64(iv)}::${buffToBase64(encryptedContent)}`;
        return package;

    } 
    catch (e){
        console.error("Encryption Failed:", e);
        return null;
    }
}

// Decryption function
async function decrypt(Mkey, encryptedPackage){
    try {
        // Extract Salt, IV, and Ciphertext from the encrypted package
        const parts = encryptedPackage.split("::");
        if (parts.length !== 3) throw new Error("Invalid encrypted format");

        const salt = base64ToBuff(parts[0]);
        const iv = base64ToBuff(parts[1]);
        const ciphertext = base64ToBuff(parts[2]);

        // Derive the SAME key using Mkey + extracted Salt
        const key = await deriveKey(Mkey, salt);

        // Decrypt
        const decryptedContent = await cryptoObj.subtle.decrypt(
            { name: ALGO_NAME, iv: iv },
            key,
            ciphertext
        );

        // Decode
        const dec = new TextDecoder();
        return dec.decode(decryptedContent);

    } 
    catch (e){
        console.error("Decryption Failed:", e);
        return null; 
    }
}

module.exports = { encrypt, decrypt };