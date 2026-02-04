// Basic enhancements: theme toggle w/ persistence, form UX, and one-place "Last updated" control.

(() => {
  const LAST_UPDATED = "February 2026"; // <-- Update this in ONE place.

  // Apply "Last updated" text
  const updatedEl = document.querySelector("[data-last-updated]");
  if (updatedEl) updatedEl.textContent = LAST_UPDATED;

  // Theme handling (respects OS preference, persists selection)
  const root = document.documentElement;
  const btn = document.querySelector("[data-theme-toggle]");
  const stored = localStorage.getItem("st_theme");

  const prefersDark = () => window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

  const setTheme = (theme) => {
    if (theme === "dark") root.setAttribute("data-theme", "dark");
    else root.setAttribute("data-theme", "light");
    localStorage.setItem("st_theme", theme);
  };

  if (stored === "dark" || stored === "light") {
    setTheme(stored);
  } else {
    setTheme(prefersDark() ? "dark" : "light");
  }

  if (btn) {
    btn.addEventListener("click", () => {
      const isDark = root.getAttribute("data-theme") === "dark";
      setTheme(isDark ? "light" : "dark");
    });
  }

  // Contact form UX + fetch submit
  const form = document.getElementById("contactForm");
  if (!form) return;

  const statusEl = form.querySelector("[data-status]");
  const submitBtn = form.querySelector("[data-submit]");

  const setStatus = (msg) => {
    if (statusEl) statusEl.textContent = msg || "";
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    setStatus("");

    // Native-ish validation
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";
    setStatus("Sending your message…");

    const fd = new FormData(form);
    const payload = Object.fromEntries(fd.entries());

    try {
      const res = await fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.error || "Something went wrong. Please try again.");
      }

      form.reset();
      setStatus("Sent. You’ll hear back soon.");
    } catch (err) {
      setStatus(err?.message || "Failed to send. You can also email sequoia@westpeek.ventures.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send message";
    }
  });
})();
