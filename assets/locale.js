"use strict";
(() => {
  const url = new URL(window.location.href);
  let saved;
  try { saved = localStorage.getItem("portfolio-language"); } catch {}
  const requested = url.searchParams.get("lang");
  const language = ["ko", "en"].includes(requested) ? requested : saved === "en" ? "en" : "ko";
  document.documentElement.lang = language;
  function text(value) {
    if (language !== "en" || typeof value !== "string") return value;
    if (Object.hasOwn(window.ENGLISH, value)) return window.ENGLISH[value];
    return value.replaceAll("과제 기관 · ", "Project institution · ")
      .replaceAll(" (새 탭)", " (opens in a new tab)")
      .replaceAll(" 데모 영상", " demonstration video")
      .replaceAll(" 홈", " home").replaceAll(" 브리핑", " briefing");
  }
  function translateData(value) {
    if (Array.isArray(value)) return value.map(translateData);
    if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, translateData(item)]));
    return text(value);
  }
  for (const key of ["PROFILE", "PROJECTS", "PUBLICATIONS", "BACKGROUND", "CONFERENCE_EXPERIMENT"]) window[key] = translateData(window[key]);
  if (language === "en") window.PROFILE.givenName = "Seungju";
  function translatePage() {
    if (language !== "en") return;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let item = walker.nextNode(); item; item = walker.nextNode()) {
      if (item.parentElement.closest("script, style, [data-language-switch]")) continue;
      const trimmed = item.textContent.trim();
      if (trimmed) item.textContent = item.textContent.replace(trimmed, text(trimmed));
    }
    document.querySelectorAll("[aria-label], [title], img[alt], meta[content]").forEach(element => {
      for (const attribute of ["aria-label", "title", "alt", "content"]) {
        if (element.hasAttribute(attribute)) element.setAttribute(attribute, text(element.getAttribute(attribute)));
      }
    });
  }
  window.LOCALE = { language, text, translateData, translatePage };
  document.addEventListener("DOMContentLoaded", () => {
    translatePage();
    document.querySelectorAll("[data-language]").forEach(button => {
      button.setAttribute("aria-pressed", String(button.dataset.language === language));
      button.addEventListener("click", () => {
        const next = button.dataset.language;
        try { localStorage.setItem("portfolio-language", next); } catch {}
        if (next === language) return;
        const nextUrl = new URL(window.location.href);
        nextUrl.searchParams.set("lang", next);
        window.location.assign(nextUrl.href);
      });
    });
  });
})();
