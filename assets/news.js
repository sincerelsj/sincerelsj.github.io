(() => {
  const list = document.querySelector('#news-list');
  const edition = document.querySelector('#news-edition');
  const status = document.querySelector('#news-status');
  const dateFormat = new Intl.DateTimeFormat('ko-KR', { dateStyle: 'medium', timeZone: 'Asia/Seoul' });
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;

  function element(tag, className, text) {
    const node = document.createElement(tag);
    node.className = className;
    node.textContent = text;
    return node;
  }

  function dateLabel(value) {
    if (typeof value !== 'string' || !datePattern.test(value)) throw new Error('Invalid date');
    const date = new Date(`${value}T00:00:00+09:00`);
    return dateFormat.format(date);
  }

  function newsCard(item) {
    const sourceUrl = new URL(item.url);
    if (sourceUrl.protocol !== 'https:') throw new Error('Invalid source URL');
    for (const key of ['source', 'title', 'summary']) {
      if (typeof item[key] !== 'string' || !item[key].trim()) throw new Error('Missing news field');
    }

    const article = element('article', 'news-card', '');
    const meta = element('p', 'news-meta', '');
    const published = element('time', '', dateLabel(item.published));
    published.dateTime = item.published;
    meta.append(element('span', 'news-source', item.source), published);
    const heading = document.createElement('h3');
    const link = element('a', '', item.title);
    link.href = sourceUrl.href;
    heading.append(link);
    article.append(meta, heading, element('p', 'news-summary', item.summary));
    return article;
  }

  async function renderNews() {
    try {
      const response = await fetch('./news.json', { cache: 'no-cache' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const label = dateLabel(data.edition);
      const cards = data.items.map(newsCard);
      list.replaceChildren(...cards);
      edition.dateTime = data.edition;
      edition.textContent = `${label} 브리핑`;
      edition.hidden = false;
      status.hidden = cards.length > 0;
      status.textContent = cards.length ? '' : '이번 브리핑에는 게시할 새 소식이 없습니다.';
    } catch {
      status.textContent = '브리핑을 불러오지 못했습니다. 잠시 후 다시 확인해 주세요.';
    }
  }

  renderNews();
})();
