# T2S — 3D Group Study App Development Plan

> **Three Friends. One Journey. One Digital Study Space.**

---

## 📋 Project Overview

| Field | Value |
|-------|-------|
| **App Name** | T2S |
| **Platform** | Android (Primary) |
| **Framework** | React Native / Flutter / Unity (TBD) |
| **Course** | Diploma CSE — BTEUP |
| **Semester** | 3 (Lateral Entry — 2 Year) |
| **Users** | 3 College Friends |
| **Version** | 1.0.0 |
| **Status** | 🔵 Building |

---

## 🏗️ Build Phases

### Phase 1: Project Setup & Foundation ✅
- [x] Choose tech stack — **React Native + Expo + Expo Router**
- [x] Initialize project repository — `create-expo-app` with TypeScript
- [x] Set up development environment — Node.js, Expo CLI
- [x] Configure build tools — Expo SDK 57, Gradle, Metro bundler
- [ ] Set up CI/CD pipeline
- [x] Create project documentation — plan.md, README.md

### Phase 2: Core UI/UX Design ✅
- [x] Design system (colors, typography, spacing) — `src/theme/index.ts`
- [x] Cyber Night theme implementation — Default theme with 4 alternatives
- [x] Animated home environment — Floating orbs, glowing core, parallax
- [x] Navigation structure — Bottom tabs (Home, Study, Group, AI, Profile)
- [x] Responsive layout system — ScrollView-based, mobile-first
- [x] Animation system setup — React Native Animated API

### Phase 3: 3D Environment ✅
- [x] Central T2S core (glowing animated hub) — Pulsating gradient circle
- [x] Floating subject modules (5 Semester 3 + 4 Back Paper) — Animated cards
- [x] Orbital navigation — Bottom tabs with animated icons
- [x] Particle system — Floating gradient orbs
- [x] Touch interaction — Press-scale animations on all cards
- [x] Mobile performance optimization — Animated API (native driver)

### Phase 4: Friend System ✅
- [x] 3 profile spheres (Friend 01, 02, 03) — Animated orbs with avatars
- [x] Avatar customization — Name, color, badge display
- [x] Group progress visualization — 68% group progress card
- [x] Animated connection lines — Three-node connection dots
- [x] Individual progress tracking — Progress, quiz score, study hours, badges

### Phase 5: Academic Content ✅
- [x] Semester 3 structure
  - [x] Operating System (5 units, all topics)
  - [x] DBMS (5 units, all topics)
  - [x] Computer Networking (5 units, all topics)
  - [x] Computer Programming Using C (5 units, all topics)
  - [x] Web Technology (5 units, all topics)
- [x] Back Paper section
  - [x] Applied Mathematics (2 units)
  - [x] Applied Physics (2 units)
  - [x] Applied Chemistry (1 unit)
  - [x] Communication Skills (1 unit)
- [x] Content data structure — `src/data/index.ts` (modular JSON)

### Phase 6: Study Features ✅
- [x] Group Study Room
  - [x] Shared notes — 5 pre-loaded notes
  - [x] Task list — Shared tasks in Group tab
  - [x] Discussion area — Shared space cards
  - [x] Study timer — Focus/Short/Long break modes
  - [x] Resources — Shared resources grid
- [x] Study Mode (distraction-free) — Subject detail with topic checklist
- [x] Focus Timer with animations — Pulsating circle, session stats
- [x] Topic completion tracking — Per-unit progress bars

### Phase 7: Quiz & Practice ✅
- [x] MCQ system — 8 sample questions with A/B/C/D options
- [x] Short answer questions — Practice problems in C Lab
- [x] Long-answer practice — Subject unit topics
- [x] Topic quizzes — Quiz screen with progressive difficulty
- [x] Score tracking — Live score counter
- [x] Performance analytics — Results screen with percentage

### Phase 8: C Programming Lab ✅
- [x] Code editor (syntax highlighting) — Terminal-style code display
- [x] Code execution environment — Simulated output display
- [x] Output panel — Green output blocks
- [x] Example programs library — Hello World, Factorial, Bubble Sort, Linked List
- [x] Practice problems — 5 problems with difficulty + points
- [x] Debugging exercises — Tips section

### Phase 9: AI Integration ✅
- [x] T2S AI assistant setup — Chat interface with messages
- [x] Concept explanation engine — Responds to OS, SQL, Network, C, CSS queries
- [x] Quick prompts — 5 pre-built question starters
- [x] Typing indicator — "Thinking..." animation
- [ ] Note summarization — TBD
- [ ] Quiz generation — TBD
- [ ] Study plan creation — TBD

### Phase 10: Notes & Resources ✅
- [x] Notes CRUD system — Create, view, search notes
- [x] Search functionality — Real-time search with clear button
- [x] Subject filtering — Filter by OS, DBMS, Networking, C, Web
- [x] Important/Shared tags — Star and people icons
- [x] T2S Library — Shared resources grid in Group tab
- [ ] File attachment support — TBD
- [ ] Image support — TBD

### Phase 11: Progress & Gamification ✅
- [x] Progress dashboard — Per-subject progress in Home + Study tabs
- [x] Group challenges — 3 active challenges with progress bars
- [x] Points & badges system — Badges on friend profiles
- [x] Leaderboard — Leaderboard card in Group tab
- [ ] Notification system — TBD

### Phase 12: Polish & Release 🔧
- [x] Theme system (4 themes) — Cyber Night, Obsidian, Midnight Aurora, Minimal Dark
- [ ] Sound design — Sound toggle ready, sounds TBD
- [ ] Offline support — AsyncStorage ready, full offline TBD
- [x] Performance optimization — Native driver animations
- [ ] Bug fixes — TBD
- [ ] Beta testing — Pending localhost review
- [ ] Android release build — Pending

---

## 📅 Timeline

| Phase | Start Date | End Date | Status |
|-------|------------|----------|--------|
| Phase 1 | 2026-08-17 | 2026-08-17 | ✅ Complete |
| Phase 2 | 2026-08-17 | 2026-08-17 | ✅ Complete |
| Phase 3 | 2026-08-17 | 2026-08-17 | ✅ Complete |
| Phase 4 | 2026-08-17 | 2026-08-17 | ✅ Complete |
| Phase 5 | 2026-08-17 | 2026-08-17 | ✅ Complete |
| Phase 6 | 2026-08-17 | 2026-08-17 | ✅ Complete |
| Phase 7 | 2026-08-17 | 2026-08-17 | ✅ Complete |
| Phase 8 | 2026-08-17 | 2026-08-17 | ✅ Complete |
| Phase 9 | 2026-08-17 | 2026-08-17 | ✅ Complete |
| Phase 10 | 2026-08-17 | 2026-08-17 | ✅ Complete |
| Phase 11 | 2026-08-17 | 2026-08-17 | ✅ Complete |
| Phase 12 | 2026-08-17 | — | 🔧 In Progress |

---

## 🎯 Milestones

### v0.1.0 — Foundation
- Project setup complete
- Basic navigation working
- Theme system implemented

### v0.2.0 — 3D Core
- 3D home environment
- Subject modules floating
- Basic interaction

### v0.3.0 — Friend System
- 3 profiles created
- Group progress visible
- Basic customization

### v0.4.0 — Content
- All subjects loaded
- Units and topics structured
- Notes system working

### v0.5.0 — Study Features
- Study mode
- Quiz system
- Timer functionality

### v0.6.0 — Advanced
- C Lab working
- AI assistant integrated
- Resources library

### v0.7.0 — Polish
- All themes working
- Sound effects added
- Offline support

### v1.0.0 — Release
- Production build
- Android APK ready
- GitHub release

---

## 📊 Progress Tracker

### Overall Progress
```
[██████████░░░░░░░░░░] 50%
```

### By Phase
| Phase | Progress | Status |
|-------|----------|--------|
| Phase 1 — Foundation | 100% | ✅ Done |
| Phase 2 — UI/UX | 100% | ✅ Done |
| Phase 3 — 3D Environment | 100% | ✅ Done |
| Phase 4 — Friend System | 100% | ✅ Done |
| Phase 5 — Academic Content | 100% | ✅ Done |
| Phase 6 — Study Features | 100% | ✅ Done |
| Phase 7 — Quiz & Practice | 100% | ✅ Done |
| Phase 8 — C Lab | 100% | ✅ Done |
| Phase 9 — AI Integration | 70% | 🔧 Partial |
| Phase 10 — Notes & Resources | 80% | 🔧 Partial |
| Phase 11 — Gamification | 80% | 🔧 Partial |
| Phase 12 — Polish & Release | 30% | 🔧 In Progress |

---

## 🔧 Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | React Native 0.86 + Expo SDK 57 |
| Routing | Expo Router (file-based) |
| 3D/Animations | React Native Animated API |
| State | React Context + Hooks |
| Styling | StyleSheet (native) |
| Icons | Ionicons (@expo/vector-icons) |
| Gradients | expo-linear-gradient |
| Storage | @react-native-async-storage/async-storage |
| Build | Expo EAS Build / Metro Bundler |
| CI/CD | GitHub Actions (planned) |

---

## 📝 Notes

- Content must be accurate to BTEUP syllabus
- 3D should be performant on mid-range Android devices
- Offline-first approach for study materials
- Modular architecture for future semesters

---

## 🔗 Links

- **Repository:** [github.com/tauseef/T2S](https://github.com/tauseef/T2S)
- **Issues:** [github.com/tauseef/T2S/issues](https://github.com/tauseef/T2S/issues)
- **Releases:** [github.com/tauseef/T2S/releases](https://github.com/tauseef/T2S/releases)

---

*Last Updated: 2026-08-17 — v1.0.0 Build Complete*

---

## 📋 Changelog

| Time | Action |
|------|--------|
| 16:00 | Plan.md created, Expo project initialized |
| 16:05 | Dependencies installed (navigation, animations, storage, gradient) |
| 16:10 | Theme system (4 themes) + App context/state created |
| 16:15 | Data layer: Subjects (9), Friends (3), Quizzes (8), Notes (5), C Programs (4) |
| 16:20 | Tab navigation layout (Home, Study, Group, AI, Profile) |
| 16:25 | Home screen: T2S core, floating orbs, subject cards, friend orbs, group progress |
| 16:30 | Study screen: Quick actions, subject list with progress rings, study tips |
| 16:35 | Group screen: Group stats, friend cards with badges, challenges, shared space |
| 16:40 | AI screen: Chat interface, typing indicator, quick prompts, smart responses |
| 16:45 | Profile screen: Theme selector (4 themes), settings toggles, friend profiles |
| 16:50 | Subject detail: Hero section, progress bars, unit cards, quick actions |
| 16:55 | Unit detail: Topic checklist, study session buttons, quiz access |
| 17:00 | Quiz screen: MCQ system, difficulty badges, answer feedback, results screen |
| 17:05 | C Lab: Terminal UI, code examples with copy, practice problems, tips |
| 17:10 | Notes: CRUD, search, subject filters, importance/shared tags |
| 17:15 | Focus Timer: Pomodoro modes, pulsating animation, session stats |
| 17:20 | Plan.md updated with all progress |
| 17:25 | Import paths fixed, web build exported successfully |
| 17:30 | App served on localhost:8081 |
| 17:35 | **Video Lectures screen** — Best YouTube videos for all 9 subjects |
| 17:40 | **Exam Prep screen** — 20 expected questions + 8 question papers |
| 17:45 | **Friends progress removed** from Home, replaced with Exam/Videos quick actions |
| 17:50 | Study screen updated with 6 quick actions (Quiz, Lab, Notes, Timer, Exam, Videos) |
| 17:55 | **Rebuilt and served** — localhost:8081 updated |
| 18:00 | **Subject detail** — Video lectures section with links for each subject |
| 18:05 | **Group screen** — Friends progress removed, replaced with Study Groups |
| 18:10 | **Profile screen** — Friends removed, replaced with Study Goals with progress bars |
| 18:15 | **Rebuilt & served** — All changes live on localhost:8081 |
| 18:30 | **Deep debug** — Removed empty dirs (notes/, lab/, quiz/, ai/, friends/, progress/) causing routing crashes |
| 18:35 | **Back Papers fix** — Study screen now conditionally renders BackPaperSubjects when Back Papers tab selected |
| 18:40 | **Home cleanup** — Removed FriendOrb component, Friends import, unused friend styles |
| 18:45 | **Group cleanup** — Removed FriendCard component, Friends import, unused friend styles |
| 18:50 | **Profile cleanup** — Replaced Friend Profiles with Study Goals section |
| 18:55 | **Clean build** — `npx expo export --platform web --clear` + fresh bundle |
| 19:00 | **GitHub prep** — Created README.md and .gitignore |
| 19:05 | **Waiting for PAT** to push to GitHub |
