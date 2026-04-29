document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const input = document.querySelector("input[name='youtube_url']");
  const button = document.querySelector("button[type='submit']");

  if (!form || !input || !button) {
    return;
  }

  form.addEventListener("submit", () => {
    button.textContent = "Summarizing...";
    button.disabled = true;
    button.style.cursor = "wait";
  });

  input.addEventListener("input", () => {
    input.classList.toggle("active-input", input.value.length > 0);
  });

  const summarySection = document.querySelector(".output");
  if (summarySection) {
    const copyBtn = document.createElement("button");
    copyBtn.textContent = "Copy Summary";
    copyBtn.type = "button";
    copyBtn.className = "copy-button";
    copyBtn.style.marginTop = "16px";
    copyBtn.style.background = "rgba(255, 255, 255, 0.08)";
    copyBtn.style.color = "white";
    copyBtn.style.border = "1px solid rgba(255,255,255,0.12)";
    copyBtn.style.borderRadius = "12px";
    copyBtn.style.padding = "12px 16px";
    copyBtn.style.cursor = "pointer";

    copyBtn.addEventListener("click", async () => {
      const summaryText = summarySection.querySelector("pre")?.innerText;
      if (!summaryText) return;
      try {
        await navigator.clipboard.writeText(summaryText);
        copyBtn.textContent = "Copied!";
        setTimeout(() => {
          copyBtn.textContent = "Copy Summary";
        }, 1800);
      } catch (err) {
        copyBtn.textContent = "Copy Failed";
      }
    });

    summarySection.appendChild(copyBtn);
  }
});