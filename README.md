# seungju Lee — Projects & Publications

프로필, 썸네일 중심의 프로젝트 목록, 논문 목록을 갖춘 개인 페이지입니다. 별도 설치나 빌드 없이 GitHub Pages에서 실행됩니다.

공개 주소: https://sincerelsj.github.io/

## 프로필과 사진

`profile.js`에서 이름, 소개, 마지막 수정일을 바꿉니다. 프로필 사진을 `assets/images/`에 넣고 `photo`에 `assets/images/profile.webp` 같은 경로를 입력하면 준비 중인 사진 자리에 실제 사진이 표시됩니다. 권장 사진 비율은 4:5이며 JPG, PNG, WebP를 사용할 수 있습니다. 경로가 비어 있거나 이미지 로딩이 실패하면 사진 자리 표시를 유지합니다.

`updated`는 페이지를 실제로 수정한 날짜를 `YYYY-MM-DD`로 입력합니다. 방문할 때마다 날짜가 바뀌지는 않습니다.

`motto`는 큰 프로필과 스크롤 후 축약되는 상단 이름 바에 함께 표시됩니다. 페이지를 아래로 스크롤하면 상단 바가 줄어들고, 이름을 누르면 다시 맨 위의 큰 프로필로 돌아갑니다. `affiliation`과 `interests`로 소속 및 연구 분야를 수정합니다.

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

현재 실험 버튼은 `http://203.253.84.41:38002/`를 새 탭으로 엽니다. 주소가 바뀌면 `projects.js`의 첫 번째 `href`와 `index.html`의 `noscript` 링크를 바꾸세요.

## 논문 추가

`publications.js`에서 논문을 수정하거나 항목을 추가합니다. 현재는 제공된 2026-10-26 이력서를 바탕으로 게재 논문 2편, HAI 2026 포스터 1편, 투고 원고 1편을 등록했습니다. 포스터는 채택·발표 예정, 원고는 투고 완료 상태로 구분합니다. 이력서에 없는 투고 원고의 저자 목록과 투고일은 비워 두었습니다.

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
