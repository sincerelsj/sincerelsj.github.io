"use strict";

(() => {
  const projects = window.PROJECTS || [];
  const grid = document.getElementById("project-grid");
  const tones = new Set(["sage", "sand", "blue", "rose", "lilac"]);

  function node(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function destination(value) {
    if (!value) return null;
    try {
      const url = new URL(value, window.location.href);
      return ["http:", "https:"].includes(url.protocol) ? url.href : null;
    } catch {
      return null;
    }
  }

  for (const [index, project] of projects.entries()) {
    const url = destination(project.href);
    const available = !project.placeholder && Boolean(url);
    const article = node("article", `project-card${available ? " is-available" : " is-upcoming"}`);
    const surface = node(available ? "a" : "div", "card-surface");
    if (available) {
      surface.href = url;
      surface.target = "_blank";
      surface.rel = "noopener noreferrer";
      surface.setAttribute("aria-label", `${project.title} — ${project.linkLabel || "프로젝트 보기"} (새 탭)`);
    }

    const tone = tones.has(project.tone) ? project.tone : "sand";
    const thumbnail = node("div", `thumbnail tone-${tone}`);
    const fallback = node("div", "thumbnail-placeholder");
    fallback.setAttribute("aria-hidden", "true");
    fallback.append(node("span", "placeholder-corner corner-tl"), node("span", "placeholder-corner corner-tr"), node("span", "placeholder-corner corner-bl"), node("span", "placeholder-corner corner-br"), node("span", "placeholder-plus", "+"), node("span", "placeholder-caption", "A NEW PERSPECTIVE"));
    thumbnail.append(fallback);

    if (project.thumbnail) {
      const image = node("img", "thumbnail-image");
      image.src = project.thumbnail;
      image.alt = project.thumbnailAlt || project.title;
      image.loading = index === 0 ? "eager" : "lazy";
      image.decoding = "async";
      image.width = 720;
      image.height = 450;
      image.addEventListener("load", () => fallback.hidden = true);
      image.addEventListener("error", () => image.remove(), { once: true });
      thumbnail.append(image);
    }

    const number = String(index + 1).padStart(2, "0");
    thumbnail.append(node("span", "thumbnail-number", number));
    if (available) {
      const indicator = node("span", "thumbnail-indicator");
      indicator.append(node("i", "status-dot"), document.createTextNode("INTERACTIVE"));
      thumbnail.append(indicator);
    }

    const body = node("div", "card-body");
    const meta = node("div", "card-meta");
    meta.append(node("span", "category", available ? project.category : "COMING SOON"), node("span", "project-index", `PROJECT ${number}`));
    body.append(meta, node("h3", "card-title", project.title), node("p", "card-subtitle", project.subtitle), node("p", "card-description", project.description));

    const footer = node("div", "card-footer");
    footer.append(node("span", "card-action", available ? (project.linkLabel || "프로젝트 보기") : "준비 중"));
    const arrow = node("span", "card-arrow", available ? "↗" : "—");
    arrow.setAttribute("aria-hidden", "true");
    footer.append(arrow);
    body.append(footer);
    surface.append(thumbnail, body);
    article.append(surface);
    grid.append(article);
  }

  const count = projects.filter(project => !project.placeholder && destination(project.href)).length;
  document.getElementById("project-count").textContent = String(count).padStart(2, "0");
  document.getElementById("year").textContent = new Date().getFullYear();
})();
