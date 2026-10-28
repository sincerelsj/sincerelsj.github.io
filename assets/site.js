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

  // Keep configured calendar dates intact, regardless of the visitor's time zone.
  function calendarDate(value) {
    const raw = String(value || "");
    const match = /^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?$/.exec(raw);
    if (!match) return null;
    const year = Number(match[1]);
    const month = Number(match[2] || 1);
    const day = Number(match[3] || 1);
    if (year < 1000 || month < 1 || month > 12 || day < 1 || day > new Date(Date.UTC(year, month, 0)).getUTCDate()) return null;
    return { raw, year: match[1], text: raw.replaceAll("-", ".") };
  }

  const profile = window.PROFILE || {};
  const fullName = [profile.givenName, profile.familyName].filter(Boolean).join(" ");
  if (fullName) {
    document.querySelectorAll("[data-profile-name]").forEach(element => element.textContent = fullName);
    document.getElementById("given-name").textContent = profile.givenName || "";
    document.getElementById("family-name").textContent = profile.familyName || "";
    document.querySelector(".brand").setAttribute("aria-label", `${fullName} 홈`);
    document.title = `${fullName} — Projects & Publications`;
    document.querySelector('meta[property="og:title"]').content = document.title;
    document.querySelector('meta[name="description"]').content = `${fullName}의 프로젝트와 실험, 논문을 모아두는 개인 아카이브입니다.`;
  }
  if (profile.bio) document.getElementById("profile-bio").textContent = profile.bio;
  if (profile.affiliation) document.getElementById("profile-affiliation").textContent = profile.affiliation;
  const motto = profile.motto || "Projects, papers & experiments.";
  document.querySelectorAll("[data-profile-motto]").forEach(element => {
    element.textContent = motto;
    element.title = motto;
  });
  for (const interest of profile.interests || []) {
    document.getElementById("research-interests").append(node("li", "", interest));
  }
  const updated = calendarDate(profile.updated);
  if (updated) {
    const time = document.getElementById("profile-updated");
    time.dateTime = updated.raw;
    time.textContent = updated.text;
  }
  if (profile.photo) {
    const photo = node("img", "profile-photo");
    photo.alt = profile.photoAlt || `${fullName}의 프로필 사진`;
    photo.width = 400;
    photo.height = 500;
    photo.decoding = "async";
    photo.addEventListener("load", () => document.getElementById("portrait-placeholder").hidden = true);
    photo.addEventListener("error", () => photo.remove(), { once: true });
    photo.src = profile.photo;
    document.getElementById("portrait-frame").append(photo);
  }

  for (const [index, project] of projects.entries()) {
    const url = destination(project.href);
    const available = !project.placeholder;
    const clickable = available && Boolean(url);
    const article = node("article", `project-card${clickable ? " is-available" : available ? " is-published" : " is-upcoming"}`);
    const surface = node(clickable ? "a" : "div", "card-surface");
    if (clickable) {
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
    if (clickable) {
      const indicator = node("span", "thumbnail-indicator");
      const destinationLabel = new URL(url).hostname === "github.com" ? "GITHUB" : "INTERACTIVE";
      indicator.append(node("i", "status-dot"), document.createTextNode(destinationLabel));
      thumbnail.append(indicator);
    }

    const body = node("div", "card-body");
    const meta = node("div", "card-meta");
    meta.append(node("span", "category", available ? project.category : "COMING SOON"));
    const date = calendarDate(project.date);
    const dateLabel = node("span", "project-date");
    if (date) {
      const time = node("time", "", date.text);
      time.dateTime = date.raw;
      dateLabel.append(document.createTextNode(`${project.dateLabel || "등록"} `), time);
      const end = calendarDate(project.dateEnd);
      if (end) {
        const endTime = node("time", "", end.text);
        endTime.dateTime = end.raw;
        dateLabel.append(document.createTextNode(" – "), endTime);
      }
    } else {
      dateLabel.textContent = "날짜 미정";
    }
    meta.append(dateLabel);
    body.append(meta, node("h3", "card-title", project.title), node("p", "card-subtitle", project.subtitle), node("p", "card-description", project.description));
    if (project.organization) body.append(node("p", "project-organization", `과제 기관 · ${project.organization}`));

    const footer = node("div", "card-footer");
    footer.append(node("span", "card-action", clickable ? (project.linkLabel || "프로젝트 보기") : available ? (project.status || "연구 참여") : "준비 중"));
    const arrow = node("span", "card-arrow", clickable ? "↗" : "—");
    arrow.setAttribute("aria-hidden", "true");
    footer.append(arrow);
    body.append(footer);
    surface.append(thumbnail, body);
    article.append(surface);
    const pdfUrl = available ? destination(project.pdf) : null;
    if (pdfUrl) {
      article.classList.add("has-pdf");
      // Sibling links keep the PDF independent of the whole-card GitHub link.
      const pdfLink = node("a", "project-pdf-link", `${project.pdfLabel || "PDF"} ↗`);
      pdfLink.href = pdfUrl;
      pdfLink.target = "_blank";
      pdfLink.rel = "noopener noreferrer";
      pdfLink.setAttribute("aria-label", `${project.title} — ${project.pdfLabel || "PDF"} (새 탭)`);
      article.append(pdfLink);
    }
    grid.append(article);
  }

  const count = projects.filter(project => !project.placeholder).length;
  document.getElementById("project-count").textContent = String(count).padStart(2, "0");

  const publications = window.PUBLICATIONS || [];
  const publicationList = document.getElementById("publication-list");
  for (const paper of publications) {
    const available = !paper.placeholder;
    const row = node("article", `publication-row${available ? "" : " is-placeholder"}`);
    const date = calendarDate(paper.date);
    const dateBlock = node("div", "publication-date");
    if (date) {
      const time = node("time", "", date.year);
      time.dateTime = date.raw;
      dateBlock.append(time);
      if (date.raw.length > 4) dateBlock.append(node("span", "", date.text.slice(5)));
    } else {
      dateBlock.append(node("span", "publication-year", "—"));
      if (!available) dateBlock.append(node("span", "", "날짜 미정"));
    }

    const content = node("div", "publication-content");
    const meta = node("div", "publication-meta");
    meta.append(node("span", "publication-type", paper.type || "PUBLICATION"));
    if (!available) meta.append(node("span", "publication-status", "준비 중"));
    else if (paper.status) {
      const tone = ["published", "accepted", "submitted"].includes(paper.statusTone) ? paper.statusTone : "published";
      meta.append(node("span", `publication-status status-${tone}`, paper.status));
    }
    const title = node("h3", "publication-title");
    const mainUrl = available ? destination(paper.href) : null;
    if (mainUrl) {
      const link = node("a", "", paper.title);
      link.href = mainUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.setAttribute("aria-label", `${paper.title} (새 탭)`);
      title.append(link);
    } else {
      title.textContent = paper.title;
    }
    content.append(meta, title);
    if (paper.authors) {
      const authors = node("p", "publication-authors");
      for (const part of paper.authors.split(/(Seungju Lee|이승주)/gi)) {
        authors.append(/^(Seungju Lee|이승주)$/i.test(part) ? node("strong", "", part) : document.createTextNode(part));
      }
      content.append(authors);
    }
    content.append(node("p", "publication-venue", paper.venue));
    if (paper.note) content.append(node("p", "publication-note", paper.note));

    const links = node("div", "publication-links");
    if (available) {
      for (const [field, label] of [["href", paper.linkLabel || "논문"], ["pdf", "PDF"], ["code", "Code"], ["slides", "Slides"]]) {
        const url = destination(paper[field]);
        if (!url) continue;
        const link = node("a", "publication-link", `${label} ↗`);
        link.href = url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.setAttribute("aria-label", `${paper.title} — ${label} (새 탭)`);
        links.append(link);
      }
    }
    row.append(dateBlock, content, links);
    publicationList.append(row);
  }
  document.getElementById("publication-count").textContent = String(publications.filter(paper => !paper.placeholder).length).padStart(2, "0");
  document.getElementById("publication-count").setAttribute("aria-label", "논문·발표 항목 수");

  const background = window.BACKGROUND || {};
  for (const [field, target] of [["education", "education-list"], ["experience", "experience-list"], ["awards", "awards-list"]]) {
    for (const entry of background[field] || []) {
      const item = node("article", "background-item");
      item.append(node("p", "background-period", entry.period), node("h4", "background-title", entry.title), node("p", "background-detail", entry.detail));
      if (entry.note) item.append(node("p", "background-note", entry.note));
      document.getElementById(target).append(item);
    }
  }

  // Keep the expanded profile in normal flow; only the bar changes height.
  // This avoids moving the page underneath the reader while scrolling.
  const root = document.documentElement;
  const bar = document.getElementById("header-bar");
  const title = document.getElementById("page-title");
  const compactMotto = bar.querySelector(".header-motto");
  let expandedHeight = 108;
  let compactHeight = 66;
  let collapseStart = 80;
  let collapseEnd = 280;
  let framePending = false;
  let needsMeasure = true;

  function updateHeader() {
    framePending = false;
    if (needsMeasure) {
      const styles = getComputedStyle(root);
      expandedHeight = parseFloat(styles.getPropertyValue("--header-expanded-size")) || 108;
      compactHeight = parseFloat(styles.getPropertyValue("--header-compact-size")) || 66;
      const bounds = title.getBoundingClientRect();
      collapseStart = Math.max(24, bounds.top + window.scrollY - expandedHeight - 30);
      collapseEnd = Math.max(collapseStart + 100, bounds.bottom + window.scrollY - compactHeight);
      needsMeasure = false;
    }
    const progress = Math.max(0, Math.min(1, (window.scrollY - collapseStart) / (collapseEnd - collapseStart)));
    const height = expandedHeight + (compactHeight - expandedHeight) * progress;
    const mottoOpacity = Math.max(0, Math.min(1, (progress - 0.4) / 0.6));
    root.style.setProperty("--header-current-size", `${height.toFixed(2)}px`);
    bar.style.setProperty("--motto-opacity", mottoOpacity.toFixed(3));
    bar.classList.toggle("is-condensed", progress >= 0.8);
    bar.classList.toggle("is-scrolled", window.scrollY > 8);
    compactMotto.setAttribute("aria-hidden", String(progress < 0.8));
  }

  function scheduleHeader(measure = false) {
    needsMeasure ||= measure;
    if (framePending) return;
    framePending = true;
    requestAnimationFrame(updateHeader);
  }

  window.addEventListener("scroll", () => scheduleHeader(), { passive: true });
  window.addEventListener("resize", () => scheduleHeader(true));
  window.addEventListener("pageshow", () => scheduleHeader(true));
  window.addEventListener("load", () => scheduleHeader(true), { once: true });
  updateHeader();
  document.getElementById("year").textContent = new Date().getFullYear();
})();
