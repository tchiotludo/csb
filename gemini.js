// content.js
(function() {
    'use strict';

    const params = new URLSearchParams(window.location.search);
    const promptText = params.get('prompt') || params.get('q'); // 支援 ?prompt= 或 ?q=

    if (!promptText) return;

    function fillGeminiInput() {
        const inputBox = document.querySelector('div[contenteditable="true"][role="textbox"]');
        if (inputBox) {
            inputBox.focus();

            // execCommand fires proper input events that Angular's change detection listens to
            document.execCommand('selectAll', false, null);
            document.execCommand('insertText', false, promptText);

            setTimeout(() => {
                inputBox.dispatchEvent(new KeyboardEvent('keydown', {
                    key: 'Enter', code: 'Enter', keyCode: 13,
                    bubbles: true, cancelable: true
                }));
            }, 100);

            return true;
        }
        return false;
    }

    let attempts = 0;
    const maxAttempts = 20;

    const intervalId = setInterval(() => {
        attempts++;
        const success = fillGeminiInput();

        if (success || attempts >= maxAttempts) {
            clearInterval(intervalId);
        }
    }, 200);
})();
