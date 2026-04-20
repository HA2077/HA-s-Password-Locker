/*
  HA's Password Locker - Session Management
  MADE BY : HA2077
  
  Handles unlock/lock state using chrome.storage.session
  Survives Manifest V3 background worker hibernation
*/

import { storage } from './storage.js';
import { verifyPassword } from './auth.js';

/* Context for this file, the unlock function verifies the master password against the stored hash and salt. 
If valid, it updates the session state and saves it to chrome.storage.session. 
The lock function clears the session state and storage. 
The restoreSession function attempts to restore the session state from storage when the background worker wakes up. */

const SESSION_KEYS = {
    isUnlocked: 'session_unlocked',
    masterKey: 'session_master_key',
    lastActivity: 'session_last_activity'
};

let sessionState ={
    isUnlocked: false,
    masterKey: null,
    lastActivity: Date.now()
};

async function isSetupComplete(){
    try {
        const complete = await storage.get('setupComplete');
        return complete === true;
    } 
    catch (e){
        console.error('Failed to check setup:', e);
        return false;
    }
}

async function unlock(masterPassword){
    try {
        const storedHash = await storage.get('masterPasswordHash');
        const salt = await storage.get('salt');

        if (!storedHash || !salt) {
            throw new Error('No master password set');
        }

        const isValid = await verifyPassword(masterPassword, storedHash, salt);
        
        if (!isValid)
            return { success: false, error: 'Incorrect password' };

        sessionState.isUnlocked = true;
        sessionState.masterKey = masterPassword;
        sessionState.lastActivity = Date.now();

        await chrome.storage.session.set({
            [SESSION_KEYS.isUnlocked]: true,
            [SESSION_KEYS.masterKey]: masterPassword,
            [SESSION_KEYS.lastActivity]: Date.now()
        });

        return { success: true };
    } 
    catch (e){
        console.error('Unlock failed:', e);
        return { success: false, error: e.message };
    }
}

async function lock() {
    sessionState.isUnlocked = false;
    sessionState.masterKey = null;
    sessionState.lastActivity = Date.now();

    await chrome.storage.session.clear();
}

function isLocked() {
    return !sessionState.isUnlocked;
}

function getMasterKey() {
    return sessionState.masterKey;
}

function updateActivity(){
    sessionState.lastActivity = Date.now();
    chrome.storage.session.set({ [SESSION_KEYS.lastActivity]: Date.now() });
}

async function restoreSession(){
    try {
        const data = await chrome.storage.session.get([
            SESSION_KEYS.isUnlocked,
            SESSION_KEYS.masterKey,
            SESSION_KEYS.lastActivity
        ]);

        if (data[SESSION_KEYS.isUnlocked] && data[SESSION_KEYS.masterKey]) {
            sessionState.isUnlocked = true;
            sessionState.masterKey = data[SESSION_KEYS.masterKey];
            sessionState.lastActivity = data[SESSION_KEYS.lastActivity] || Date.now();
            return true;
        }
        return false;
    } 
    catch (e){
        console.error('Failed to restore session:', e);
        return false;
    }
}

function setupAutoLockListener(autoLockMinutes = 5) {
    chrome.runtime.onSuspend.addListener(async () => {
        await lock();
    });

    setInterval(() => {
        if (sessionState.isUnlocked) {
            const now = Date.now();
            const elapsed = now - sessionState.lastActivity;
            const timeout = autoLockMinutes * 60 * 1000;

            if (elapsed >= timeout) {
                lock();
            }
        }
    }, 30000);
}

export {
    isSetupComplete,
    unlock,
    lock,
    isLocked,
    getMasterKey,
    updateActivity,
    restoreSession,
    setupAutoLockListener,
    sessionState
};