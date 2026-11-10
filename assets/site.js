"use strict";

(() => {
  const t = window.LOCALE.text;
  const projects = window.PROJECTS || [];
  const grid = document.getElementById("project-grid");
  const tones = new Set(["sage", "sand", "blue", "rose", "lilac"]);

  function node(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = t(text);
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
    document.querySelector('meta[name="description"]').content = t("seungju Lee의 프로젝트와 실험, 논문을 모아두는 개인 아카이브입니다.");
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

  function renderActivity(activity) {
    const publication = (window.PUBLICATIONS || []).find(paper => paper.id === activity.publicationId);
    const entry = { ...publication, ...activity };
    const card = node("details", "activity-card");
    const summary = node("summary", "activity-toggle");
    summary.append(node("span", "publication-type", entry.type), node("span", "activity-title", entry.title));
    const panel = node("div", "activity-panel");
    const content = node("div", "activity-content");
    panel.append(content);
    card.append(summary, panel);
    let pinned = false;
    let hovering = false;
    let dismissed = false;
    let animation;
    let expanded = false;
    function update() {
      const next = pinned || (hovering && !dismissed);
      if (next === expanded) return;
      expanded = next;
      const from = card.open ? panel.getBoundingClientRect().height : 0;
      if (animation) animation.cancel();
      card.dataset.expanded = String(expanded);
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        card.open = expanded;
        return;
      }
      card.open = true;
      animation = panel.animate([
        { height: `${from}px`, opacity: from ? 1 : 0 },
        { height: expanded ? `${panel.scrollHeight}px` : "0px", opacity: expanded ? 1 : 0 }
      ], { duration: 260, easing: "cubic-bezier(.22, 1, .36, 1)" });
      animation.onfinish = () => {
        card.open = expanded;
        animation = null;
      };
    }
    card.addEventListener("pointerenter", event => {
      if (event.pointerType !== "mouse") return;
      hovering = true;
      dismissed = false;
      update();
    });
    card.addEventListener("pointerleave", () => {
      hovering = false;
      dismissed = false;
      update();
    });
    summary.addEventListener("click", event => {
      event.preventDefault();
      pinned = !pinned;
      dismissed = !pinned;
      update();
    });
    const meta = node("div", "publication-meta");
    meta.append(node("span", "publication-type", entry.type));
    if (entry.status) meta.append(node("span", "publication-status", entry.status));
    const date = calendarDate(entry.date);
    if (date) {
      const time = node("time", "activity-date", date.text);
      time.dateTime = date.raw;
      meta.append(time);
    }
    content.append(meta, node("h5", "activity-full-title", entry.title));
    if (entry.authors) {
      const authors = node("p", "publication-authors");
      for (const part of entry.authors.split(/(Seungju Lee|이승주)/gi)) {
        authors.append(/^(Seungju Lee|이승주)$/i.test(part) ? node("strong", "", part) : document.createTextNode(part));
      }
      content.append(authors);
    }
    if (entry.venue) content.append(node("p", "publication-venue", entry.venue));
    if (entry.summary) content.append(node("p", "activity-summary", entry.summary));
    const links = node("div", "activity-links");
    for (const [field, label] of [["href", entry.linkLabel || "논문"], ["pdf", "논문 PDF"], ["poster", "포스터 PDF"], ["code", "GitHub 코드"]]) {
      const url = destination(entry[field]);
      if (!url) continue;
      const link = node("a", "publication-link", `${t(label)} ↗`);
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.setAttribute("aria-label", `${entry.title} — ${t(label)} ${t("(새 탭)")}`);
      links.append(link);
    }
    content.append(links);
    return card;
  }

  function renderProjectCard(project, index = 0) {
    const url = destination(project.href);
    const available = !project.placeholder;
    const clickable = available && Boolean(url);
    const article = node("article", `project-card${clickable ? " is-available" : available ? " is-published" : " is-upcoming"}`);
    const surface = node(clickable ? "a" : "div", "card-surface");
    if (clickable) {
      surface.href = url;
      surface.target = "_blank";
      surface.rel = "noopener noreferrer";
      surface.setAttribute("aria-label", `${project.title} — ${project.linkLabel || "프로젝트 보기"} ${t("(새 탭)")}`);
    }

    const tone = tones.has(project.tone) ? project.tone : "sand";
    const thumbnail = node("div", `thumbnail tone-${tone}`);
    const videoUrl = available ? destination(project.videoEmbed) : null;
    if (videoUrl) {
      const player = node("iframe", "thumbnail-video");
      player.title = `${project.title} 데모 영상`;
      player.loading = "lazy";
      player.allow = "encrypted-media; picture-in-picture";
      player.allowFullscreen = true;
      player.referrerPolicy = "strict-origin-when-cross-origin";
      player.src = videoUrl;
      thumbnail.append(player);
      article.classList.add("has-video");
      article.append(thumbnail);
    } else {
      const fallback = node("div", "thumbnail-placeholder");
      fallback.setAttribute("aria-hidden", "true");
      fallback.append(node("span", "placeholder-corner corner-tl"), node("span", "placeholder-corner corner-tr"), node("span", "placeholder-corner corner-bl"), node("span", "placeholder-corner corner-br"), node("span", "placeholder-plus", "+"), node("span", "placeholder-caption", available ? "PROJECT IMAGE" : "COMING SOON"));
      thumbnail.append(fallback);

      if (project.thumbnail) {
        const image = node("img", "thumbnail-image");
        image.style.objectFit = project.thumbnailFit === "contain" ? "contain" : "cover";
        image.src = project.thumbnail;
        image.alt = project.thumbnailAlt || project.title;
        image.loading = index <= 1 ? "eager" : "lazy";
        image.decoding = "async";
        image.width = 720;
        image.height = 450;
        image.addEventListener("load", () => fallback.hidden = true);
        image.addEventListener("error", () => image.remove(), { once: true });
        thumbnail.append(image);
      }

      const number = String(index).padStart(2, "0");
      if (index > 0) thumbnail.append(node("span", "thumbnail-number", number));
      if (clickable) {
        const indicator = node("span", "thumbnail-indicator");
        const destinationLabel = new URL(url).hostname === "github.com" ? "GITHUB" : "INTERACTIVE";
        indicator.append(node("i", "status-dot"), document.createTextNode(destinationLabel));
        thumbnail.append(indicator);
      }
      surface.append(thumbnail);
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
    if (project.sponsors?.length) {
      const sponsors = node("div", "project-sponsors");
      sponsors.append(node("p", "sponsor-label", "연구 지원 기관"));
      for (const sponsor of project.sponsors) {
        const sponsorRow = node("div", "sponsor-row");
        const logo = node("img", "sponsor-logo");
        logo.src = sponsor.logo;
        logo.alt = "";
        logo.loading = "lazy";
        logo.addEventListener("error", () => logo.remove(), { once: true });
        sponsorRow.append(logo, node("span", "sponsor-name", sponsor.name));
        sponsors.append(sponsorRow);
      }
      body.append(sponsors);
    }
    if (project.organization) body.append(node("p", "project-organization", `과제 기관 · ${project.organization}`));

    const footer = node("div", "card-footer");
    footer.append(node("span", "card-action", clickable ? (project.linkLabel || "프로젝트 보기") : available ? (project.status || "연구 참여") : "준비 중"));
    const arrow = node("span", "card-arrow", clickable ? "↗" : "—");
    arrow.setAttribute("aria-hidden", "true");
    footer.append(arrow);
    body.append(footer);
    surface.append(body);
    article.append(surface);
    if (project.activities?.length) {
      const activities = node("section", "project-activities");
      activities.setAttribute("aria-label", t("활동"));
      activities.append(node("h4", "activities-heading", "활동"));
      for (const activity of project.activities) activities.append(renderActivity(activity));
      article.classList.add("has-activities");
      article.append(activities);
    }
    const actions = node("div", "project-links");
    if (available) {
      for (const [value, label] of [
        [project.experiment, "Task Complexity 실험"],
        [project.pdf, project.pdfLabel || "PDF"],
        [project.code, "GitHub 코드"]
      ]) {
        const actionUrl = destination(value);
        if (!actionUrl) continue;
        const link = node("a", "project-resource-link", `${t(label)} ↗`);
        link.href = actionUrl;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.setAttribute("aria-label", `${project.title} — ${t(label)} ${t("(새 탭)")}`);
        actions.append(link);
      }
    }
    if (actions.childElementCount) {
      article.classList.add("has-resources");
      article.append(actions);
    }
    return article;
  }

  for (const [index, project] of projects.entries()) {
    grid.append(renderProjectCard(project, index + 1));
  }

  const count = projects.filter(project => !project.placeholder).length;
  document.getElementById("project-count").textContent = String(count).padStart(2, "0");

  const experiment = window.CONFERENCE_EXPERIMENT;
  if (experiment) {
    const feature = document.getElementById("conference-feature");
    const jump = document.getElementById("conference-jump");
    // HAI 2026: show the experiment during November 16–19, Korea time.
    const startsAt = Date.parse("2026-11-16T00:00:00+09:00");
    const endsAt = Date.parse("2026-11-20T00:00:00+09:00");

    function updateConferenceFeature() {
      const now = Date.now();
      const featured = now >= startsAt && now < endsAt;
      if (featured && feature.hidden) feature.append(renderProjectCard(experiment));
      feature.hidden = !featured;
      jump.hidden = !featured;

      const nextChange = now < startsAt ? startsAt : endsAt;
      if (now < nextChange) {
        setTimeout(() => {
          updateConferenceFeature();
          scheduleHeader(true);
        }, Math.min(nextChange - now, 2_147_483_647));
      }
    }

    updateConferenceFeature();
  }

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
      link.setAttribute("aria-label", `${paper.title} ${t("(새 탭)")}`);
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
      for (const [field, label] of [["href", paper.linkLabel || "논문"], ["pdf", "논문 PDF"], ["poster", "포스터 PDF"], ["code", "Code"], ["slides", "Slides"]]) {
        const url = destination(paper[field]);
        if (!url) continue;
        const link = node("a", "publication-link", `${t(label)} ↗`);
        link.href = url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.setAttribute("aria-label", `${paper.title} — ${t(label)} ${t("(새 탭)")}`);
        links.append(link);
      }
    }
    if (available && !destination(paper.pdf)) {
      const pending = node("span", "publication-pdf-pending", "PDF 미등록");
      pending.title = "논문 PDF가 등록되면 이 자리에 링크가 표시됩니다.";
      links.append(pending);
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
