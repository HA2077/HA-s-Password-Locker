# HA's Password Locker 🔒

> **Status:** v0.2 (Engine & Encryption Complete)  
> **Mission:** A privacy-first, local-only password manager browser extension.

## 👋 What is this?
**HA's Password Locker** is a browser extension that gives you total control over your credentials. Unlike commercial password managers, this stores data **locally** on your device, encrypted with your personal master key.

Currently, the **Core Logic** (Generation) and **Cryptography Engine** (AES-GCM) are fully implemented and tested.

---

## 🚀 How to Test the Logic
You can run the password generator right now in your terminal to verify the entropy and randomness.

### Prerequisites
* You need [Node.js](https://nodejs.org/) installed.

### 1. Test Password Generation
Verify entropy and randomness:

1.  **Clone the repo:**
    ```bash
    git clone https://github.com/HA2077/HA-s-Password-Locker.git
    ```

2.  **Go into the folder:**
    ```bash
    cd HA-s-Password-Locker
    cd core
    ```

3.  **Run the Test Script:**
    ```bash
    node LOGICTEST.js
    ```

### ✅ Expected Output
If the engine is working correctly, you will see something like this:

```text
 --- HA's Password Locker: Logic Test ---

🔹 TEST 1: Standard (16 chars, All options)
   Output: 5lP?a`)yhrn<oU5~
   ✅ PASS

🔹 TEST 2: PIN Code (20 chars, Numbers only)
   Output: 92932745521638488050
   ✅ PASS

🔹 TEST 3: Fallback (No options selected)
   No character types selected! Defaulting to lowercase.
   Output: dndrioxdzk
   ✅ PASS (Defaulted to Lowercase)

🔹 TEST 4: Unique Constraint Check
   ⚠️ Cannot fulfill 'Unique' request. Pool size (10) < Length (12). Disabling uniqueness.
   Output: 892838464308
   ✅ PASS: Logic correctly allowed duplicates (Pool 10 < Length 12).

-------------------------------------------
```

---

### 2. Test Encryption (NEW 🔐)
Verify that data is correctly scrambled (AES-GCM) and can be decrypted with the correct key:

    node core/ENCRYPTIONTEST.js

**Expected Output:**

    --- 🔐 HA's Password Locker: Encryption Test ---

    🔹 Input Text:  "lh`lMQ9|yy?]K?0|"
    🔄 Encrypting...
    ✅ Encrypted Package: [Salt]::[IV]::[Ciphertext]

    🔄 Decrypting...
    ✅ SUCCESS: Decrypted text matches original!

---

## 🛠️ Tech Stack
* **Core:** JavaScript (ES6 Modules)
* **Encryption:** AES-GCM (via Web Crypto API)
* **Key Derivation:** PBKDF2 (SHA-256)
* **Architecture:** Local-First (No Cloud)

---

## 🔜 Next Steps
1.  `manifest.json` Configuration
2.  Popup UI Implementation
3.  Browser Integration

---

**Author:** [@HA2077](https://github.com/HA2077)  
*Open Source | Privacy First*
