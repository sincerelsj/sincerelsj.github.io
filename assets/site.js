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
    meta.append(node("span", "category", available ? project.category : "COMING SOON"));
    const date = calendarDate(project.date);
    const dateLabel = node("span", "project-date");
    if (date) {
      const time = node("time", "", date.text);
      time.dateTime = date.raw;
      dateLabel.append(document.createTextNode(`${project.dateLabel || "등록"} `), time);
    } else {
      dateLabel.textContent = "날짜 미정";
    }
    meta.append(dateLabel);
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
      dateBlock.append(node("span", "publication-year", "—"), node("span", "", "날짜 미정"));
    }

    const content = node("div", "publication-content");
    const meta = node("div", "publication-meta");
    meta.append(node("span", "publication-type", paper.type || "PUBLICATION"));
    if (!available) meta.append(node("span", "publication-status", "준비 중"));
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
    content.append(meta, title, node("p", "publication-authors", paper.authors), node("p", "publication-venue", paper.venue));

    const links = node("div", "publication-links");
    if (available) {
      for (const [field, label] of [["href", "논문"], ["pdf", "PDF"], ["code", "Code"], ["slides", "Slides"]]) {
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
  document.getElementById("year").textContent = new Date().getFullYear();
})();
