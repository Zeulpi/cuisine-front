const presets = {
    default: /[a-zA-Z0-9\s.,()éèàç-]/,
    strict: /[a-zA-Z0-9]/,
    email: /[a-zA-Z0-9@._-]/,
};
  
// Nettoie une chaîne en fonction d'une regex
export const sanitizeInput = (value, allowedRegex) =>
    [...value].filter((char) => allowedRegex.test(char)).join('');

    // Sécurise un champ unique
    export const setupSecureInput = (element, allowedRegex) => {
    if (!element) return;

    element.addEventListener('keypress', (e) => {
        if (!allowedRegex.test(e.key)) {
        e.preventDefault();
        }
    });

    element.addEventListener('paste', (e) => {
        e.preventDefault();
        const pasted = (e.clipboardData || window.clipboardData).getData('text');
        const clean = sanitizeInput(pasted, allowedRegex);
        element.value += clean;
    });
};
  
// Applique automatiquement les règles à tous les champs pertinents
export const setupGlobalInputSanitizer = () => {
    const inputsSanitized = new WeakSet(); // évite d'ajouter plusieurs listeners

    const sanitizeInputElement = (input) => {
        if (inputsSanitized.has(input)) return;

        let allowedRegex = presets.default;

        switch (input.type) {
        case 'email':
            allowedRegex = presets.email;
            break;
        case 'text':
        case 'search':
        default:
            allowedRegex = presets.default;
            break;
        }

        setupSecureInput(input, allowedRegex);
        inputsSanitized.add(input);
    };

    const sanitizeAllInputs = () => {
        const inputs = document.querySelectorAll('input, textarea');
        inputs.forEach(sanitizeInputElement);
    };

    // 👉 Exécution immédiate
    sanitizeAllInputs();

    // 🔁 MutationObserver pour gérer les ajouts dynamiques
    const observer = new MutationObserver(() => {
        sanitizeAllInputs(); // Re-scan à chaque ajout
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
};  