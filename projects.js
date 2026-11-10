// 프로젝트를 추가하거나 수정할 때는 이 파일만 편집하세요.
// thumbnail: "assets/images/파일명.webp"처럼 이미지 경로를 지정합니다.
// placeholder를 false로 바꾸고 title, description, href를 채우면 공개 카드가 됩니다.
window.CONFERENCE_EXPERIMENT = {
  id: "decision-experiment",
  title: "HAI 2026 · 에이전트 정보 탐색 실험",
  subtitle: "How Task Complexity Shapes Information Search Patterns",
  description: "HAI 2026 포스터 논문의 실험 구현입니다. 아파트 선택 과제의 선택지 2·4·8·12개와 정보 차원 4·8·12개를 조합한 12개 조건에서 AI 에이전트의 정보 탐색 패턴을 분석합니다.",
  category: "HAI 2026 · EXPERIMENT",
  pdf: "assets/papers/agent-usability-poster.pdf",
  pdfLabel: "HAI 포스터 PDF",
  // 실험 수행일이 아니라 이 아카이브에 처음 등록한 날짜입니다.
  date: "2026-10-27",
  dateLabel: "등록",
  thumbnail: "assets/images/task-complexity-overview.png",
  thumbnailFit: "contain",
  thumbnailAlt: "Task-Complexity 저장소의 아파트 선택 과제와 에이전트 정보 탐색 실험 개요",
  href: "http://203.253.84.41:38002/lsj/",
  linkLabel: "실험 화면 열기",
  code: "https://github.com/sincerelsj/Task-Complexity",
  placeholder: false,
  tone: "sage"
};

window.PROJECTS = [
  {
    id: "project-03",
    date: "2026-03",
    dateEnd: "2029-02",
    dateLabel: "과제",
    title: "AI 에이전트 기반 사용성 평가",
    subtitle: "AI Agents & Usability Evaluation",
    description: "시각-운동 행동 기반 페르소나와 AI 에이전트를 활용해 사용성을 평가합니다. 에이전트와 인간의 정합성을 검증하는 실험 설계·수행에 참여합니다.",
    editions: [
      { title: "Task Complexity · HAI 2026", detail: "과제 복잡도에 따른 AI 에이전트의 정보 탐색 패턴 분석" }
    ],
    organization: "한국외국어대학교 연구산학협력단",
    category: "RESEARCH",
    thumbnail: "assets/images/task-complexity-overview.png",
    thumbnailFit: "contain",
    thumbnailAlt: "Task-Complexity의 에이전트 정보 탐색 실험 개요",
    href: "https://github.com/sincerelsj/Task-Complexity",
    linkLabel: "GitHub에서 보기",
    pdf: "assets/papers/agent-usability-poster.pdf",
    pdfLabel: "HAI 포스터 PDF",
    experiment: window.CONFERENCE_EXPERIMENT.href,
    placeholder: false,
    status: "연구 참여",
    tone: "blue"
  },
  {
    id: "project-02",
    date: "2024-04",
    dateEnd: "2026-12",
    dateLabel: "과제",
    title: "멀티모달 XR 사용자 경험 평가",
    subtitle: "Multimodal XR UX Evaluation",
    description: "XR 공간 반응형 콘텐츠 최적화를 위한 멀티모달 UX 평가 플랫폼 기술 개발. 멀티모달 데이터 처리 파이프라인 구축 및 UX 평가 예측 시스템 개발에 참여합니다.",
    organization: "연세대학교 산학협력단",
    category: "RESEARCH",
    thumbnail: "",
    thumbnailFit: "contain",
    thumbnailAlt: "",
    href: "http://203.253.84.41:38002/demo",
    linkLabel: "XR 데모 체험하기",
    videoEmbed: "https://www.youtube-nocookie.com/embed/PPGVysGNckg",
    placeholder: false,
    status: "연구 참여",
    tone: "sand"
  },
  {
    id: "press-industry-surveys",
    date: "2025-07",
    dateEnd: "2026-12",
    dateLabel: "과제",
    title: "미디어 산업 실태조사",
    subtitle: "Media Industry Surveys",
    description: "2025·2026 신문산업실태조사에서 선형회귀·머신러닝 기반 무응답 추정과 AI 활용 방안 자문에 참여합니다.",
    editions: [
      { title: "2025 신문산업실태조사", detail: "생성형 AI 활용 방안 자문" },
      { title: "2026 신문산업실태조사", detail: "AI 에이전트 활용 방안 자문" }
    ],
    organization: "한국언론진흥재단",
    category: "DATA & AI",
    thumbnail: "assets/images/presspatrol-banner.svg",
    thumbnailFit: "contain",
    thumbnailAlt: "PressPatrol — A digital inspector for online news",
    href: "https://github.com/sincerelsj/presspatrol",
    linkLabel: "PressPatrol GitHub 보기",
    placeholder: false,
    tone: "rose"
  }
];
