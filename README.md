# T2S — Three Friends. One Journey.

A futuristic 3D group study app built with **React Native (Expo)** for 3 college friends pursuing Diploma CSE at BTEUP, Semester 3.

---

## Features

| Feature | Description |
|---------|-------------|
| **Home** | Animated T2S core logo, subject cards with progress, exam prep & video quick actions |
| **Study** | Semester 3 + Back Papers subjects, 6 quick actions (Quiz, Lab, Notes, Timer, Exam, Videos) |
| **Group** | Study groups, active challenges, shared space (notes, tasks, resources, leaderboard) |
| **AI Chat** | Smart AI assistant with pre-built responses for OS, SQL, Networking, C, CSS |
| **Profile** | 4 themes, study goals with progress bars, app settings |
| **Quiz** | 8 MCQ questions with difficulty badges, answer feedback, results screen |
| **C Lab** | Terminal UI, 4 code examples with output, 5 practice problems |
| **Notes** | CRUD, search, subject filters, importance/shared tags |
| **Focus Timer** | Pomodoro modes (25/5/15 min), pulsating animation, session stats |
| **Exam Prep** | 20 expected questions with answers, 8 question papers |
| **Video Lectures** | Best YouTube tutorials for all 9 subjects |
| **4 Themes** | Cyber Night, Obsidian, Midnight Aurora, Minimal Dark |

## Subjects

### Semester 3
- Operating System
- Database Management System
- Computer Networking
- Computer Programming Using C
- Web Technology

### Back Papers
- Applied Mathematics
- Applied Physics
- Applied Chemistry
- Communication Skills

## Tech Stack

- **Framework:** React Native with Expo SDK 57
- **Routing:** expo-router (file-based)
- **Animations:** React Native Animated API
- **Icons:** @expo/vector-icons (Ionicons)
- **Gradients:** expo-linear-gradient
- **Language:** TypeScript

## Getting Started

```bash
# Clone the repo
git clone https://github.com/Tauseef666-ctrl/T2S.git
cd T2S/T2SApp

# Install dependencies
npm install

# Start dev server
npx expo start --web

# Build for web
npx expo export --platform web
```

## Project Structure

```
T2SApp/
├── app/                    # File-based routing
│   ├── (tabs)/             # Tab navigation (Home, Study, Group, AI, Profile)
│   ├── subject/            # Subject detail & unit detail
│   ├── study/              # Focus Timer
│   ├── exam.tsx            # Exam Prep
│   ├── notes.tsx           # Notes
│   ├── quiz.tsx            # Quiz
│   ├── lab.tsx             # C Programming Lab
│   └── videos.tsx          # Video Lectures
├── src/
│   ├── data/               # Subjects, quizzes, notes, videos, exam data
│   ├── hooks/              # App context & state management
│   └── theme/              # 4 theme definitions
└── dist/                   # Production build output
```

## Author

**Tauseef** — Diploma CSE, BTEUP, Semester 3

## License

MIT
