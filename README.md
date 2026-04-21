# 🤝 Coworkers (코워커스)

> **팀원 모두와 같은 방향, 같은 속도로 나아가는 가장 쉬운 방법** <br/>
> 칸반 보드 기반의 팀 협업 및 일정 관리 플랫폼입니다.

[서비스 보러가기](https://coworkers-rf.vercel.app/)

<br/>

## ✨ Key Features

* **직관적인 칸반 보드:** `dnd-kit`을 활용한 부드러운 Drag & Drop 상태 변경
* **빠른 사용자 경험 (UX):** React Query의 낙관적 업데이트(Optimistic Update)를 적용한 대기 시간 없는 UI 반응
* **유연한 팀 관리:** 워크스페이스(팀) 생성, 초대 링크를 통한 멤버 관리 및 권한 분리
* **안전한 인증 시스템:** 카카오 소셜 로그인, 이메일 인증 및 안전한 세션/쿠키 관리
* **반응형 웹:** PC, 태블릿, 모바일에 최적화된 화면 및 사이드바 레이아웃

<br/>

## 🛠 Tech Stack

* **Framework:** Next.js (Pages Router), React 18
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **State Management:** TanStack Query (React Query)
* **Form & Validation:** React Hook Form
* **Drag & Drop:** @dnd-kit/core
* **Architecture:** FSD (Feature-Sliced Design)

<br/>

## 🚀 Quick Start

### Prerequisites
* Node.js (v18.x 이상 권장)
* npm, yarn 또는 pnpm

### 1. Repository Clone
```bash
git clone https://github.com/본인계정/coworkers.git
cd coworkers
```

### 2. Install Dependencies
```bash
npm install
# or yarn install
```

### 3. Run Development Server
```bash
npm run dev
# or yarn dev
```
브라우저에서 [http://localhost:3000](http://localhost:3000) 에 접속하여 프로젝트를 확인할 수 있습니다.

<br/>

## 📁 Architecture

유지보수성과 확장성을 위해 **FSD (Feature-Sliced Design)** 아키텍처를 도입했습니다.

```text
src/
├── pages/       # 라우팅 및 페이지 진입점 (Next.js Pages Router)
├── widgets/     # 페이지를 구성하는 독립적인 UI 블록 (Header, Sidebar, Layout 등)
├── features/    # 비즈니스 가치를 가지는 도메인 로직 (auth, boards, task, user 등)
│   ├── [domain]/
│   │   ├── api/       # API 호출 함수
│   │   ├── components/# 도메인 특화 컴포넌트
│   │   ├── hooks/     # 커스텀 훅 (React Query, 비즈니스 로직 등)
│   │   └── model/     # 타입(DTO, Entity) 및 상수
└── shared/      # 프로젝트 전역에서 재사용되는 공통 코드 (ui, lib, hooks, api)
```
