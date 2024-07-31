// Function to fetch markdown content from a file
async function fetchMarkdownContent(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.text();
    } catch (error) {
        console.error("Could not fetch the markdown file:", error);
        return "# Error\n\nFailed to load the markdown content.";
    }
}

// Function to render Markdown and equations
function renderContent(markdownContent, elementId) {
    const contentDiv = document.getElementById(elementId);
    contentDiv.innerHTML = marked.parse(markdownContent);
    renderMathInElement(contentDiv, {
        delimiters: [
            {left: "$$", right: "$$", display: true},
            {left: "$", right: "$", display: false}
        ],
        throwOnError: false
    });
}

// Function to load a script and wait for it to be fully loaded
function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Function to load a stylesheet
function loadStylesheet(href) {
    return new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.onload = resolve;
        link.onerror = reject;
        document.head.appendChild(link);
    });
}

// Main function to load and render content
async function loadAndRenderContent(markdownUrl, elementId) {
    const markdownContent = await fetchMarkdownContent(markdownUrl);
    renderContent(markdownContent, elementId);
}

// Function to initialize the Markdown and equation rendering
async function initMarkdownEquations(markdownUrl, elementId) {
    try {
        // Load required libraries
        await Promise.all([
            loadScript('https://cdnjs.cloudflare.com/ajax/libs/marked/4.0.2/marked.min.js'),
            loadScript('https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.13.24/katex.min.js'),
            loadStylesheet('https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.13.24/katex.min.css')
        ]);

        // Load auto-render.min.js after KaTeX is loaded
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.13.24/contrib/auto-render.min.js');

        // Now that all scripts are loaded, render the content
        await loadAndRenderContent(markdownUrl, elementId);
    } catch (error) {
        console.error('Failed to load required libraries or render content:', error);
    }
}

// Export the initialization function
window.initMarkdownEquations = initMarkdownEquations;