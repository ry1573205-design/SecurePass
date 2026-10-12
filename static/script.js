
const $ = (id) => document.getElementById(id);

async function postJSON(url, data) {
    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.error || result.message || "Request failed.");
    }

    return result;
}

function setMessage(id, message, type = "") {
    const element = $(id);
    element.textContent = message;
    element.className = `message ${type}`.trim();
}

function setBusy(button, busy, text = "Please wait...") {
    if (busy) {
        button.dataset.originalText = button.textContent;
        button.textContent = text;
        button.disabled = true;
    } else {
        button.textContent = button.dataset.originalText || button.textContent;
        button.disabled = false;
    }
}

function showSuggestions(items) {
    const list = $("suggestions-list");
    list.replaceChildren();

    if (!items || items.length === 0) {
        const item = document.createElement("li");
        item.textContent = "No additional suggestions.";
        list.appendChild(item);
        return;
    }

    items.forEach((suggestion) => {
        const item = document.createElement("li");
        item.textContent = suggestion;
        list.appendChild(item);
    });
}

function resetAnalysis() {
    $("strength-label").textContent = "Not checked";
    $("strength-fill").style.width = "0%";
    $("score").textContent = "—";
    $("length").textContent = "—";
    $("entropy").textContent = "—";
    $("crack-time").textContent = "—";
    showSuggestions(["Enter a password to begin analysis."]);
    setMessage("analyze-message", "");
}

function renderAnalysis(data) {
    $("strength-label").textContent = data.strength;
    $("strength-fill").style.width = `${data.score}%`;
    $("score").textContent = `${data.score}/100`;
    $("length").textContent = data.length;
    $("entropy").textContent = `${data.entropy_bits} bits`;
    $("crack-time").textContent = data.crack_time;
    showSuggestions(data.suggestions);

    const fill = $("strength-fill");
    if (data.score <= 25) {
        fill.style.background = "#f05c66";
    } else if (data.score <= 50) {
        fill.style.background = "#ffad42";
    } else if (data.score <= 75) {
        fill.style.background = "#e9d34a";
    } else {
        fill.style.background = "#00d6a0";
    }
}

let analysisTimer;

$("analyze-password").addEventListener("input", () => {
    clearTimeout(analysisTimer);

    const password = $("analyze-password").value;
    if (!password) {
        resetAnalysis();
        return;
    }

    setMessage("analyze-message", "Analyzing...");
    analysisTimer = setTimeout(async () => {
        try {
            const result = await postJSON("/api/analyze", { password });
            renderAnalysis(result);
            setMessage("analyze-message", "Analysis complete.", "success");
        } catch (error) {
            setMessage("analyze-message", error.message, "error");
        }
    }, 350);
});

$("analyze-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    clearTimeout(analysisTimer);

    const password = $("analyze-password").value;
    if (!password) {
        setMessage("analyze-message", "Enter a password first.", "error");
        return;
    }

    const button = event.currentTarget.querySelector("button[type='submit']");
    setBusy(button, true, "Analyzing...");

    try {
        const result = await postJSON("/api/analyze", { password });
        renderAnalysis(result);
        setMessage("analyze-message", "Analysis complete.", "success");
    } catch (error) {
        setMessage("analyze-message", error.message, "error");
    } finally {
        setBusy(button, false);
    }
});

$("breach-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const password = $("breach-password").value;
    if (!password) {
        setMessage("breach-message", "Enter a password first.", "error");
        return;
    }

    const button = event.currentTarget.querySelector("button[type='submit']");
    setBusy(button, true, "Checking...");

    $("breach-status").textContent = "Checking...";
    $("breach-found").textContent = "—";
    $("breach-count").textContent = "—";
    setMessage("breach-message", "");

    try {
        const result = await postJSON("/api/breach", { password });

        if (!result.checked) {
            $("breach-status").textContent = "Unavailable";
            setMessage("breach-message", result.message, "error");
            return;
        }

        $("breach-status").textContent = result.breached ? "Found" : "No match";
        $("breach-found").textContent = result.breached ? "Yes" : "No";
        $("breach-count").textContent = result.count.toLocaleString();

        setMessage(
            "breach-message",
            result.message,
            result.breached ? "error" : "success"
        );
    } catch (error) {
        $("breach-status").textContent = "Error";
        setMessage("breach-message", error.message, "error");
    } finally {
        setBusy(button, false);
    }
});

let generatorMode = "password";

document.querySelectorAll(".mode-button").forEach((button) => {
    button.addEventListener("click", () => {
        generatorMode = button.dataset.mode;

        document.querySelectorAll(".mode-button").forEach((item) => {
            item.classList.toggle("selected", item === button);
        });

        $("password-options").hidden = generatorMode !== "password";
        $("phrase-options").hidden = generatorMode !== "passphrase";

        $("generate-button").textContent =
            generatorMode === "password"
                ? "✧ Generate Secure Password"
                : "✧ Generate Memorable Passphrase";

        $("generated-password").value = "";
        $("generated-password").type = "password";
        $("show-generated").textContent = "◉";
        setMessage("generator-message", "Choose your settings and generate.");
    });
});

$("password-length").addEventListener("input", (event) => {
    $("length-value").textContent = event.target.value;
});

$("word-count").addEventListener("input", (event) => {
    $("word-count-value").textContent = event.target.value;
});

$("generate-button").addEventListener("click", async () => {
    const button = $("generate-button");
    setBusy(button, true, "Generating...");

    const data = { mode: generatorMode };

    if (generatorMode === "password") {
        data.length = Number($("password-length").value);
    } else {
        data.word_count = Number($("word-count").value);
    }

    try {
        const result = await postJSON("/api/generate", data);

        $("generated-password").value = result.password;
        $("generated-password").type = "password";
        $("show-generated").textContent = "◉";

        setMessage(
            "generator-message",
            "Generated successfully. Copy it and store it securely.",
            "success"
        );
    } catch (error) {
        setMessage("generator-message", error.message, "error");
    } finally {
        setBusy(button, false);
    }
});

$("show-generated").addEventListener("click", () => {
    const input = $("generated-password");
    const visible = input.type === "text";

    input.type = visible ? "password" : "text";
    $("show-generated").textContent = visible ? "◉" : "◎";
});

$("copy-generated").addEventListener("click", async () => {
    const value = $("generated-password").value;

    if (!value) {
        setMessage("generator-message", "Generate a password first.", "error");
        return;
    }

    try {
        await navigator.clipboard.writeText(value);
        setMessage("generator-message", "Copied to clipboard.", "success");
    } catch {
        const input = $("generated-password");
        input.type = "text";
        input.select();

        const copied = document.execCommand("copy");
        input.setSelectionRange(0, 0);
        input.type = "password";

        setMessage(
            "generator-message",
            copied ? "Copied to clipboard." : "Copy failed. Please select and copy manually.",
            copied ? "success" : "error"
        );
    }
});

document.querySelectorAll("[data-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
        const input = $(button.dataset.toggle);
        const visible = input.type === "text";

        input.type = visible ? "password" : "text";
        button.textContent = visible ? "◉" : "◎";
        button.setAttribute(
            "aria-label",
            visible ? "Show password" : "Hide password"
        );
    });
});

document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
        document.querySelectorAll(".nav-link").forEach((item) => {
            item.classList.toggle("active", item === link);
        });
    });
});
