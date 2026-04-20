document.getElementById('tab-man').addEventListener('click', () => {
    const managerUrl = chrome.runtime.getURL('ui/manager/manager.html');

    chrome.tabs.query({ url: managerUrl }, (tabs) => {
        if (tabs && tabs.length > 0){
            const tab = tabs[0];
            chrome.tabs.update(tab.id, { active: true });
            chrome.windows.update(tab.windowId, { focused: true });
        } 
        else
            chrome.tabs.create({ url: managerUrl });
    });
});

const display = document.getElementById('password-output');
const lengthInput = document.getElementById('length-val');
const generateBtn = document.getElementById('generate-btn');
const copyBtn = document.getElementById('copy-btn');

const checkboxes = {
    upper: document.getElementById('use-upper'),
    lower: document.getElementById('use-lower'),
    number: document.getElementById('use-numbers'),
    symbol: document.getElementById('use-symbols')
};

async function runGeneration() {
    let len = parseInt(lengthInput.value);
    const min = parseInt(lengthInput.min);
    const max = parseInt(lengthInput.max);

    if (isNaN(len) || len < min) len = min;
    if (len > max) len = max;
    lengthInput.value = len; 

    if (!Object.values(checkboxes).some(cb => cb.checked)) {
        checkboxes.lower.checked = true;
    }

    try{
        const { generatePassword } = await import('../../core/logic.js');
        
        const pass = generatePassword(
            len,
            checkboxes.lower.checked,
            checkboxes.upper.checked,
            checkboxes.symbol.checked,
            checkboxes.number.checked
        );
        
        display.value = pass;
    } catch (err) {
        console.error('Generation failed:', err);
    }
}

generateBtn.addEventListener('click', runGeneration);

copyBtn.addEventListener('click', () => {
    if (!display.value) return;

    display.select();
    display.setSelectionRange(0, 99999);

    try{
        document.execCommand('copy');
        
        const originalText = copyBtn.innerText;
        copyBtn.innerText = '✅';
        setTimeout(() => { copyBtn.innerText = originalText; }, 1500);
        
        window.getSelection().removeAllRanges();
    } 
    catch (err){
        console.error('Copy failed:', err); }
});