# seungju Lee — Projects & Publications

프로필, 썸네일 중심의 프로젝트 목록, 논문 목록을 갖춘 개인 페이지입니다. 별도 설치나 빌드 없이 GitHub Pages에서 실행됩니다.

공개 주소: https://sincerelsj.github.io/

## 프로필과 사진

`profile.js`에서 이름, 소개, 마지막 수정일을 바꿉니다. 프로필 사진을 `assets/images/`에 넣고 `photo`에 `assets/images/profile.webp` 같은 경로를 입력하면 준비 중인 사진 자리에 실제 사진이 표시됩니다. 권장 사진 비율은 4:5이며 JPG, PNG, WebP를 사용할 수 있습니다. 경로가 비어 있거나 이미지 로딩이 실패하면 사진 자리 표시를 유지합니다.

`updated`는 페이지를 실제로 수정한 날짜를 `YYYY-MM-DD`로 입력합니다. 방문할 때마다 날짜가 바뀌지는 않습니다.

`motto`는 큰 프로필과 스크롤 후 축약되는 상단 이름 바에 함께 표시됩니다. 페이지를 아래로 스크롤하면 상단 바가 줄어들고, 이름을 누르면 다시 맨 위의 큰 프로필로 돌아갑니다. `affiliation`과 `interests`로 소속 및 연구 분야를 수정합니다.

## AI 연구 뉴스

홈페이지의 `AI Research News`는 `news.json`에서 최신 브리핑을 읽습니다. `edition`은 한국시간 기준 브리핑 날짜이며 `items`의 각 항목에는 `source`, `published`, `title`, `summary`, `url`을 넣습니다. `published`는 원문 발행일이고, `url`은 HTTPS 원문 주소입니다. 브리핑을 교체할 때는 `news.json`을 갱신해 `main`에 반영합니다.

## 프로젝트 추가

1. 썸네일 파일을 `assets/images/`에 넣습니다. 권장 비율은 16:10이며 JPG, PNG, WebP, SVG를 사용할 수 있습니다.
2. `projects.js`에서 빈 프로젝트 한 칸의 내용을 바꿉니다.
3. `placeholder`를 `false`로 바꿉니다.

```js
{
  id: "my-project",
  title: "프로젝트 제목",
  subtitle: "English project name",
  description: "프로젝트를 소개하는 짧은 설명입니다.",
  category: "RESEARCH",
  date: "2026-10-27",
  dateLabel: "등록",
  thumbnail: "assets/images/my-project.webp",
  thumbnailAlt: "썸네일 이미지의 내용을 설명하는 문장",
  href: "https://example.com/",
  linkLabel: "프로젝트 보기",
  placeholder: false,
  tone: "sage"
}
```

`tone`은 이미지가 없거나 로딩되지 않았을 때의 배경색입니다. `sage`, `sand`, `blue`, `rose`, `lilac` 중 하나를 지정합니다. 배열에 프로젝트 항목을 추가하거나 제거하면 카드 수가 자동으로 바뀝니다.

`date`는 카드에 표시할 날짜이며 `dateLabel`로 등록, 완료 등의 의미를 지정합니다. 현재 실험 카드의 날짜는 실험 수행일이 아니라 아카이브 등록일입니다. 아직 날짜를 모르면 빈 문자열로 두세요.

기간을 표시하려면 `dateEnd`를 추가합니다. 연구 과제 카드에는 이력서의 **과제 기간**을 사용했으며, 개인의 참여 시작일을 뜻하지 않습니다. 링크가 없는 연구 과제도 제목과 참여 내용을 표시할 수 있습니다. `organization`은 과제 기관, `status`는 카드 하단 문구입니다.

AI 에이전트 기반 사용성 평가 카드에서 Task Complexity 실험을 열 수 있습니다. 주소가 바뀌면 `projects.js`의 `CONFERENCE_EXPERIMENT.href`와 `index.html`의 `noscript` 링크를 바꾸세요. 한국시간 2026-11-16 00:00부터 2026-11-20 00:00 전까지는 실험 소개가 프로필 위에도 표시됩니다.

신문산업실태조사의 연도별 내역은 `press-industry-surveys` 항목의 `editions`에 있습니다. 2026 잡지 조사를 같은 카드에 추가할 경우 여기에 `{ title, detail }` 항목을 한 줄 더 넣으면 됩니다.

### 프로젝트 PDF 추가 및 교체

AI 에이전트 기반 사용성 평가 카드에는 GitHub 링크와 별도로 **포스터 PDF** 버튼이 있습니다. 버튼은 `assets/papers/agent-usability-poster.pdf`를 새 탭으로 엽니다.

나중에 문서를 교체하는 방법:

1. 새 문서를 PDF로 저장합니다.
2. `assets/papers/agent-usability-poster.pdf`를 같은 이름의 새 PDF로 덮어쓰고 커밋·푸시합니다. GitHub 웹에서도 해당 폴더의 **Add file → Upload files**에서 같은 파일명으로 업로드해 교체할 수 있습니다.
3. GitHub Pages 배포가 끝나면 기존 버튼에서 새 문서가 열립니다.

다른 파일명이나 외부 PDF 주소를 쓰려면 `projects.js`의 해당 카드에서 다음 두 값만 바꾸세요. `pdf`를 빈 문자열로 두면 PDF 버튼을 숨깁니다.

```js
pdf: "assets/papers/agent-usability-poster.pdf",
pdfLabel: "포스터 PDF",
```

PDF 버튼은 카드의 GitHub 링크와 독립적으로 동작합니다. PowerPoint를 교체할 때는 먼저 PDF로 내보낸 파일을 업로드하세요.

## 논문 추가

`publications.js`에서 논문을 수정하거나 항목을 추가합니다. 현재는 제공된 2026-10-26 이력서를 바탕으로 게재 논문 2편과 HAI 2026 포스터 1편을 등록했습니다. 포스터는 채택·발표 예정 상태로 표시합니다.

```js
{
  id: "paper-id",
  title: "실제 논문 제목",
  authors: "저자명",
  venue: "실제 학회 또는 저널명",
  type: "CONFERENCE",
  status: "게재",
  statusTone: "published",
  date: "2026-10-27",
  href: "https://doi.org/실제-DOI",
  pdf: "assets/papers/paper.pdf",
  code: "",
  slides: "",
  placeholder: false
}
```

논문 원문, PDF, 코드, 발표 자료 링크는 입력한 항목만 표시됩니다. PDF를 이 저장소에 올리는 경우 실제 파일도 해당 경로에 추가하세요. 링크가 없어도 논문의 서지 정보를 표시할 수 있습니다.

`statusTone`은 `published`, `accepted`, `submitted`를 지원합니다. HAI 2026 포스터의 DOI는 이력서에 기재된 값을 사용했습니다. `note`에 공동저자, 제1저자, 온라인 게재일 등의 부가 정보를 입력할 수 있습니다.

프로젝트와 논문 날짜는 `2026`, `2026-10`, `2026-10-27` 형식을 지원합니다. 알고 있는 날짜의 정확도에 맞게 입력하면 연도, 연월, 연월일로 표시됩니다. 날짜가 비어 있거나 유효하지 않으면 `날짜 미정`으로 표시합니다.

## 페이지 문구 수정

프로필 이름과 소개는 `profile.js`, 나머지 상단 문구와 GitHub 주소는 `index.html`에서 수정합니다.

학력, 연구실 경력, 장학금은 `background.js`에서 수정합니다. 현재 공개 내용은 제공된 이력서의 전문 경력 정보를 정리한 것입니다. 이력서 원본은 이 저장소에 포함하지 않습니다.

## 로컬 미리보기

이 폴더에서 다음 명령을 실행합니다.

```sh
python -m http.server 4173 --bind 127.0.0.1
```

브라우저에서 `http://127.0.0.1:4173/`를 엽니다.

## GitHub Pages

저장소의 **Settings → Pages → Build and deployment**에서 다음을 선택합니다.

- Source: **Deploy from a branch**
- Branch: **main**, 폴더: **/(root)**

저장하면 `main` 브랜치에 올린 수정 사항이 GitHub Pages로 배포됩니다. 공개 페이지에는 이 폴더의 파일만 올립니다. 실험 기록과 서버 설정은 포함하지 않습니다.

## 대표 이미지와 논문 PDF 교체

- 프로젝트: `assets/images/`에 이미지를 넣고 `projects.js`의 해당 항목 `thumbnail`, `thumbnailAlt`를 수정합니다. `thumbnailFit: "contain"`은 그림 전체를 표시하며, `"cover"`는 사진을 카드에 꽉 채웁니다. 빈 경로에는 이미지 자리 표시가 남습니다.
- 논문: `assets/papers/`에 파일을 넣고 `publications.js`의 해당 항목 `pdf`에 경로를 적습니다. 비어 있으면 `PDF 미등록`, 경로가 있으면 `논문 PDF` 버튼이 표시됩니다.
- 포스터는 `poster`, 발표 자료는 `slides`로 별도 등록합니다. HAI 자료는 현재 포스터 PDF이며 논문 원문 PDF와 구분했습니다.
- 파일 교체 후 커밋·푸시하면 GitHub Pages에 반영됩니다. 브라우저에서 직접 업로드하는 관리자 화면은 없습니다.

대표 이미지 출처 (2026-11-10 저장소 README 기준):
- `task-complexity-overview.png`: https://github.com/sincerelsj/Task-Complexity/blob/main/assets/experiment-overview-handdrawn.png
- `presspatrol-banner.svg`: https://github.com/sincerelsj/presspatrol/blob/main/assets/banner.svg

기관 로고는 각 기관 공식 홈페이지의 원본을 사용합니다.
- 한국연구재단: https://www.nrf.re.kr/resources/img/common/header/logo.svg
- 문화체육관광부: https://www.mcst.go.kr/site/images/common/mcst_logo.svg
- 한국콘텐츠진흥원: https://www.kocca.kr/images/homepage/www/kocca/common/logo_new.svg

## 한국어 / English

상단 버튼으로 언어를 전환합니다. URL의 `?lang=en` 또는 `?lang=ko`가 저장된 언어보다 우선하며, 버튼 선택은 브라우저에 저장됩니다. 한국어 내용을 수정하거나 추가하면 `assets/translations.js`의 대응 영어 문장도 수정하세요. 뉴스의 영어 제목·요약은 `news.json` 각 항목의 `en`에 입력합니다. 영어 번역이 없는 새 뉴스는 원문으로 표시합니다. 한국어 논문 제목의 영어판은 포트폴리오용 번역으로 표시하며 저자명은 원문 표기를 따릅니다.

한국언론진흥재단 로고 원본: https://www.kpf.or.kr/images/front/logo.png
