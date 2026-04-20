/*
  HA's Password Locker - Setup Module
  MADE BY : HA2077
*/

// UI Elements - load immediately
const form = document.getElementById('setup-form');
const passwordInput = document.getElementById('master-password');
const confirmInput = document.getElementById('confirm-password');
const togglePasswordBtn = document.getElementById('toggle-password');
const toggleConfirmBtn = document.getElementById('toggle-confirm');
const strengthFill = document.getElementById('strength-fill');
const strengthText = document.getElementById('strength-text');
const matchText = document.getElementById('match-text');
const reqLength = document.getElementById('req-length');
const setupBtn = document.getElementById('setup-btn');
const errorMessage = document.getElementById('error-message');

function showError(message){
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
    errorMessage.style.display = 'block';
}

function clearError() {
    errorMessage.classList.remove('show');
    errorMessage.style.display = 'none';
}

togglePasswordBtn.addEventListener('click', () => {
    const isVisible = passwordInput.type === 'text';
    passwordInput.type = isVisible ? 'password' : 'text';
    togglePasswordBtn.textContent = isVisible ? '👁' : '🔒';
});

toggleConfirmBtn.addEventListener('click', () => {
    const isVisible = confirmInput.type === 'text';
    confirmInput.type = isVisible ? 'password' : 'text';
    toggleConfirmBtn.textContent = isVisible ? '👁' : '🔒';
});

function calculateStrength(password){
    let score = 0;
    
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;
    
    return score;
}

function updateStrengthUI(password){
    const strength = calculateStrength(password);
    
    let width = 10;
    let color = '#444';
    let text = 'Type a password...';
    
    if (password.length > 0){
        if (strength <= 2) {
            width = 25;
            color = '#ff4444';
            text = 'Weak';
        } 
        else if (strength <= 4){
            width = 50;
            color = '#ffaa00';
            text = 'Fair';
        } 
        else if (strength <= 6){
            width = 75;
            color = '#00C853';
            text = 'Good';
        } 
        else{
            width = 100;
            color = '#00C853';
            text = 'Strong';
        }
    }
    
    strengthFill.style.width = width + '%';
    strengthFill.style.backgroundColor = color;
    strengthText.textContent = text;
    strengthText.style.color = color;
    
    if (password.length >= 8) {
        reqLength.classList.add('valid');
    } else {
        reqLength.classList.remove('valid');
    }
}

function updateMatchUI() {
    const password = passwordInput.value;
    const confirm = confirmInput.value;
    
    if (confirm.length === 0) {
        matchText.textContent = '';
        matchText.className = 'match-text';
        return false;
    }
    
    if (password === confirm) {
        matchText.textContent = '✓ Passwords match';
        matchText.className = 'match-text success';
        return true;
    } else {
        matchText.textContent = '✗ Passwords do not match';
        matchText.className = 'match-text error';
        return false;
    }
}

passwordInput.addEventListener('input', () => {
    updateStrengthUI(passwordInput.value);
    if (confirmInput.value) updateMatchUI();
});

confirmInput.addEventListener('input', updateMatchUI);

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearError();
    
    const password = passwordInput.value;
    const confirm = confirmInput.value;
    
    if (password.length < 8) {
        showError('Password must be at least 8 characters');
        passwordInput.focus();
        return;
    }
    
    if (password !== confirm) {
        showError('Passwords do not match');
        confirmInput.focus();
        return;
    }
    
    setupBtn.disabled = true;
    setupBtn.textContent = 'Creating Vault...';
    
    try {

        const [{ hashPassword, generateSalt }, { storage }] = await Promise.all([
            import('../../core/auth.js'),
            import('../../core/storage.js')
        ]);
        
        const salt = generateSalt();
        const hash = await hashPassword(password, salt);
        
        await storage.set('masterPasswordHash', hash);
        await storage.set('salt', salt);
        await storage.set('setupComplete', true);
        
        setupBtn.textContent = '✓ Vault Created!';
        
        setTimeout(() => {
            const managerUrl = chrome.runtime.getURL('ui/manager/manager.html');
            window.location.href = managerUrl;
        }, 1000);
        
    } 
    catch (error){
        console.error('Setup failed:', error);
        showError('Setup failed. Please try again.');
        setupBtn.disabled = false;
        setupBtn.textContent = 'CREATE VAULT';
    }
});

updateStrengthUI('');