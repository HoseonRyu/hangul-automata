# Hangul Automata

유한 오토마타(Finite Automata)로 이해하는 한글 입력 원리를 시각적으로 탐구하는 인터랙티브 웹 프로젝트.

DFA에서 Mealy Machine, 그리고 영한 변환기까지 — 오토마타 이론이 한글 입력기에 어떻게 적용되는지 스텝별 애니메이션으로 보여줍니다.

## Features

- **DFA 시각화**: 3-state DFA의 상태 전이를 인터랙티브하게 탐색
- **Mealy Machine 시각화**: 전이 시 출력을 생성하는 Mealy Machine 데모
- **영한 변환기**: 10-state Mealy Machine 기반 영문→한글 변환 (도깨비불 현상 포함)
- **도깨비불 현상 설명**: 종성이 다음 음절 초성으로 이동하는 과정을 스텝별로 시각화
- **한/영 언어 전환**: 모든 UI 텍스트를 한국어/영어로 전환 가능
- **다크모드**: 기본 다크 테마

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Graph | React Flow (@xyflow/react) |
| Animation | Motion (Framer Motion) |
| Styling | Tailwind CSS 4 |
| UI | shadcn/ui |
| i18n | next-intl |
| Test | Vitest |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Testing

```bash
npm test
```

## Deploy

Vercel에 배포:

```bash
npx vercel
```

## Original

Python 구현: [En-Kor_Converter](../En-Kor_Converter)
