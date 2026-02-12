# HA's Password Locker 🔒

> **Status:** v0.1 (Core Logic Prototype)  
> **Mission:** A privacy-first, local-only password manager browser extension.

## 👋 What is this?
This is the early development build of **HA's Password Locker**. 

Right now, the **Core Generation Engine** is complete. I AM porting the logic from Python to JavaScript to prepare for the browser extension release.

---

## 🚀 How to Test the Logic
You can run the password generator right now in your terminal to verify the entropy and randomness.

### Prerequisites
* You need [Node.js](https://nodejs.org/) installed.

### Steps
1.  **Clone the repo:**
    ```bash
    git clone [https://github.com/HA2077/HA-s-Password-Locker.git](https://github.com/HA2077/HA-s-Password-Locker.git)
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
 --- HA's Password Locker: Deep Logic Test ---

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

### 🛠️ Tech Stack

    1. Core: JavaScript (ES6 Modules)
    2. Cryptography: crypto.getRandomValues() (Web Crypto API)
    3. Architecture: Local-First (No Cloud)

### 🔜 Coming Next

    1. manifest.json Configuration
    2. Popup UI Implementation
    3. Browser Extension Integration (Chrome/Edge/Firefox)

---

THIS PROJECT IS STILL UNDER DEVELOPMENT SO GIVE IT A STAR OR IF YOU WANT A FEAT IN IT YOU CAN FORK IT AND MAKE A PULL REQUSET OR MAKE AN ISSUE. CHEERS.

MADE BY: [@HA2077](https://github.com/HA2077)
