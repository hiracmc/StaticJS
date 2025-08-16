/* made by ponzu */

/**
 * JOCS (JavaScript Object Class Styling)
 * A utility to style and manage elements declaratively using CSS classes.
 */
const Jocs = {
    /**
     * Rules define how to process a property class.
     * Each key corresponds to a class prefix (e.g., 'text' for '-text-...').
     * The value is a function that applies the style/behavior to the element.
     * @param {HTMLElement} el - The target element.
     * @param {string} value - The value extracted from the class name.
     */
    rules: {
        // Text content
        'text': (el, value) => {
            // Replace underscores with spaces and decode URI components
            el.innerText = decodeURIComponent(value.replace(/_/g, ' '));
        },
        // Link behavior
        'link': (el, value) => {
            const decodedUrl = decodeURIComponent(value);
            el.addEventListener('click', () => {
                // Consider security: noopener and noreferrer are recommended
                window.open(decodedUrl, '_blank', 'noopener,noreferrer');
            });
            // Add a visual cue that the element is clickable
        },

        // --- CSS Style Rules ---
        'bg': (el, value) => el.style.backgroundColor = value,
        'color': (el, value) => el.style.color = value,
        'p': (el, value) => el.style.padding = `${value}px`,
        'pt': (el, value) => el.style.paddingTop = `${value}px`,
        'pr': (el, value) => el.style.paddingRight = `${value}px`,
        'pb': (el, value) => el.style.paddingBottom = `${value}px`,
        'pl': (el, value) => el.style.paddingLeft = `${value}px`,
        'm': (el, value) => el.style.margin = `${value}px`,
        'mt': (el, value) => el.style.marginTop = `${value}px`,
        'mr': (el, value) => el.style.marginRight = `${value}px`,
        'mb': (el, value) => el.style.marginBottom = `${value}px`,
        'ml': (el, value) => el.style.marginLeft = `${value}px`,
        'w': (el, value) => el.style.width = `${value}px`,
        'h': (el, value) => el.style.height = `${value}px`,
        'br': (el, value) => el.style.borderRadius = `${value}px`,
        'textal': (el, value) => el.style.textAlign = value,
        'size': (el, value) => el.style.fontSize = `${value}px`,
    },

    /**
     * Parses the class list of an element and applies the corresponding rules.
     * @param {HTMLElement} el - The element to process.
     */
    processElement(el) {
        // Reset element's original text content if it's meant to be replaced.
        // This is a simple way to handle class changes. A more robust solution
        // might store original state.
        if (el.dataset.jocsOriginalText === undefined) {
             el.dataset.jocsOriginalText = el.innerText;
        }
        if (![...el.classList].some(c => c.startsWith('-text-'))) {
            el.innerText = el.dataset.jocsOriginalText;
        }

        el.classList.forEach(className => {
            // We are looking for classes starting with a dash, but not '--jocs'
            if (!className.startsWith('-') || className.startsWith('--')) {
                return;
            }

            // Remove the leading dash and find the first dash separator
            const classBody = className.substring(1);
            const separatorIndex = classBody.indexOf('-');

            if (separatorIndex === -1) return; // Not a key-value pair

            const key = classBody.substring(0, separatorIndex);
            const value = classBody.substring(separatorIndex + 1);

            // If a rule exists for this key, apply it
            if (this.rules[key]) {
                this.rules[key](el, value);
            }
        });
    },

    /**
     * Scans the entire document for elements with the '--jocs' class and processes them.
     */
    scan() {
        const elements = document.querySelectorAll('.--jocs');
        elements.forEach(el => this.processElement(el));
    },

    /**
     * Initializes JOCS and sets up a MutationObserver to watch for DOM changes.
     */
    init() {
        // Initial scan on DOMContentLoaded
        document.addEventListener('DOMContentLoaded', () => this.scan());

        // Use MutationObserver to detect future changes (e.g., dynamic elements, class changes)
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                // If new nodes are added
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) { // Element node
                            // Check if the added node itself is a jocs element
                            if (node.matches && node.matches('.--jocs')) {
                                this.processElement(node);
                            }
                            // Check for jocs elements within the added node
                            node.querySelectorAll('.--jocs').forEach(el => this.processElement(el));
                        }
                    });
                }
                // If attributes changed (specifically the 'class' attribute)
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const target = mutation.target;
                    if (target.matches('.--jocs')) {
                        this.processElement(target);
                    }
                }
            });
        });

        // Start observing the document body for changes
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class']
        });
    }
};

// Initialize the JOCS system
Jocs.init();
