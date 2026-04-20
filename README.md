# HA's Password Locker

> **Status:** v0.3 (Master Password System Complete)  
> **Mission:** A privacy-first, local-only password manager browser extension.

<p align="center">
  <img src="icons/Logo%20with%20Text.png" alt="HA's Password Locker Official Logo" width="300">
  <br>
  <b>Official Project Logo</b>
</p>

## 👋 What is this?

**HA's Password Locker** is a browser extension that gives you total control over your credentials. Unlike commercial password managers, this stores data **locally** on your device, encrypted with your personal master key.

---

## ✅ What's Built

### Core Modules
| Module | Description |
|--------|-------------|
| `core/logic.js` | Secure password generator with crypto.getRandomValues() |
| `core/passencryption.js` | AES-GCM encryption for passwords |
| `core/auth.js` | Master password hashing with PBKDF2 (600k iterations) |
| `core/storage.js` | Chrome storage API wrapper |
| `core/session.js` | Session management with auto-lock |

### UI Pages
| Page | Description |
|------|-------------|
| `ui/popup/` | Password generator popup |
| `ui/setup/` | First-time setup with master password |
| `ui/manager/` | Password manager (in development) |

---

## 🛠️ Tech Stack

* **Core:** JavaScript (ES6 Modules)
* **Encryption:** AES-GCM (via Web Crypto API)
* **Key Derivation:** PBKDF2-SHA256 (600,000 iterations)
* **Storage:** chrome.storage.local + chrome.storage.session
* **Architecture:** Local-First (No Cloud, No Network)

---

## 🔐 Security Features

- **Master Password:** Never stored - only salted PBKDF2 hash
- **Encryption:** AES-256-GCM for all stored passwords
- **Session:** chrome.storage.session (survives background hibernation)
- **Auto-Lock:** Configurable inactivity timeout

---

## 🔜 Next Steps (MVP)

- [ ] Storage Integration (password CRUD)
- [ ] Manager UI
- [ ] Popup Updates
- [ ] Background Script Polish
- [ ] Testing & Final Polish

---

**Author:** [@HA2077](https://github.com/HA2077)  
*Open Source | Privacy First*
