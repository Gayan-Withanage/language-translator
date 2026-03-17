// Get elements
const inputText = document.getElementById("inputText");
const languageSelect = document.getElementById("language");
const translateBtn = document.getElementById("btnTranslate");
const outputBox = document.getElementById("output");

// Load languages dynamically
async function loadLanguages() {
    const res = await fetch("/languages");
    const langs = await res.json();

    for (let code in langs) {
        const option = document.createElement("option");
        option.value = code;
        option.text = langs[code];
        languageSelect.appendChild(option);
    }
}

// Call this once on page load
loadLanguages();

// Translate button click
translateBtn.addEventListener("click", async () => {
    const text = inputText.value.trim();
    const target = languageSelect.value;

    if (!text) {
        outputBox.innerText = "Please enter some text!";
        return;
    }

    outputBox.innerText = "Translating...";
    outputBox.classList.add("show");

    try {
        const response = await fetch("/translate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text, target })
        });

        const data = await response.json();

        if (data.error) {
            outputBox.innerText = "Error: " + data.error;
        } else {
            outputBox.innerText = data.translated_text;
        }

        // Fade-in effect
        outputBox.classList.add("show");
        setTimeout(() => outputBox.classList.remove("show"), 500);

    } catch (err) {
        outputBox.innerText = "Error: " + err.message;
    }
});
