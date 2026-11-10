"use strict";
(() => {
  const url = new URL(window.location.href);
  const positionKey = "portfolio-language-position";
  let pendingPosition;
  try {
    const stored = JSON.parse(sessionStorage.getItem(positionKey) || "null");
    sessionStorage.removeItem(positionKey);
    if (stored?.url === url.href) pendingPosition = stored;
  } catch {}
  if (pendingPosition) history.scrollRestoration = "manual";

  function saveReadingPosition(nextUrl) {
    const sections = [...document.querySelectorAll(".personal-hero, main > section")];
    const section = sections.filter(element => element.getBoundingClientRect().top <= 120).pop();
    const hash = nextUrl.hash;
    nextUrl.hash = "";
    try {
      sessionStorage.setItem(positionKey, JSON.stringify({
        url: nextUrl.href,
        hash,
        section: section?.id || "top",
        offset: section?.id ? window.scrollY - (section.getBoundingClientRect().top + window.scrollY) : window.scrollY
      }));
    } catch {}
  }

  function restoreReadingPosition() {
    if (!pendingPosition) return;
    const section = document.getElementById(pendingPosition.section);
    const top = pendingPosition.section === "top" ? 0 : section.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: Math.max(0, top + pendingPosition.offset), behavior: "instant" });
  }

  function finishPositionRestore() {
    pendingPosition = null;
    history.scrollRestoration = "auto";
  }

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
    if (pendingPosition) {
      // Restore without fragment navigation, which otherwise jumps to an old section.
      history.replaceState(history.state, "", url.href + pendingPosition.hash);
      restoreReadingPosition();
      window.addEventListener("load", restoreReadingPosition, { once: true });
      window.addEventListener("portfolio-news-ready", restoreReadingPosition, { once: true });
      for (const event of ["wheel", "touchstart", "pointerdown", "keydown"]) {
        window.addEventListener(event, finishPositionRestore, { once: true, passive: true });
      }
    }
    document.querySelectorAll("[data-language]").forEach(button => {
      button.setAttribute("aria-pressed", String(button.dataset.language === language));
      button.addEventListener("click", () => {
        const next = button.dataset.language;
        try { localStorage.setItem("portfolio-language", next); } catch {}
        if (next === language) return;
        const nextUrl = new URL(window.location.href);
        nextUrl.searchParams.set("lang", next);
        saveReadingPosition(nextUrl);
        window.location.assign(nextUrl.href);
      });
    });
  });
})();
