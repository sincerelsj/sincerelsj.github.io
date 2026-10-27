# Project Archive

썸네일 중심의 프로젝트 목록 페이지입니다. 별도 설치나 빌드 없이 GitHub Pages에서 실행됩니다.

공개 주소: https://sincerelsj.github.io/

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
  thumbnail: "assets/images/my-project.webp",
  thumbnailAlt: "썸네일 이미지의 내용을 설명하는 문장",
  href: "https://example.com/",
  linkLabel: "프로젝트 보기",
  placeholder: false,
  tone: "sage"
}
```

`tone`은 이미지가 없거나 로딩되지 않았을 때의 배경색입니다. `sage`, `sand`, `blue`, `rose`, `lilac` 중 하나를 지정합니다. 배열에 프로젝트 항목을 추가하거나 제거하면 카드 수가 자동으로 바뀝니다.

현재 실험 버튼은 `http://203.253.84.41:38002/`를 새 탭으로 엽니다. 주소가 바뀌면 `projects.js`의 첫 번째 `href`와 `index.html`의 `noscript` 링크를 바꾸세요.

## 페이지 문구 수정

사이트 이름, 상단 소개, GitHub 주소, 페이지 제목 및 검색 설명은 `index.html`에서 수정합니다.

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
