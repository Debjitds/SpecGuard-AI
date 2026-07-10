# SpecGuard AI

> A Neo-Brutalist **PRD review workspace** that helps teams catch requirement gaps, reduce ambiguity, and export structured engineering-review findings _before_ a single line of code is written.

---

## 1. Project Overview
- **Project Name:** SpecGuard AI
- **What it is:** A specialized software requirements review workspace.
- **The Problem it solves:** Teams often start building with incomplete or ambiguous product requirements, leading to missed edge cases, rework, and wasted engineering time. SpecGuard AI solves this by turning requirement review into a repeatable, guided workflow.
- **Target Users:** Founders, Product Managers, Software Engineers, UI/UX Designers, Technical Writers, and QA Engineers.
- **Key Features:** AI-assisted PRD analysis, interactive engineering review queue, structured issue categorization, and comprehensive report exports.

## 2. Live Demo
Live Demo:  
[https://spec-guard-ai-one.vercel.app/](https://spec-guard-ai-one.vercel.app/)

## 3. GitHub Repository
GitHub Repository:  
[https://github.com/Debjitds/SpecGuard-AI](https://github.com/Debjitds/SpecGuard-AI)

## 4. Tech Stack
- Vite
- React
- TypeScript
- Tailwind CSS
- Supabase
- Gemini AI
- Vercel
- TestSprite CLI

## 5. Features
- **PRD Upload:** Upload your product requirements directly into the workspace.
- **Demo Project Loader:** Load pre-configured demo PRDs (e.g., Meeting Room Booking, SaaS CRM) to test the platform immediately.
- **AI Requirement Analysis:** Powered by Gemini AI to identify ambiguity, missing acceptance criteria, inconsistent flows, and weak edge cases.
- **Engineering Review Dashboard:** The central hub for your analysis surface containing all interactions and panels.
- **Issue Breakdown:** Categorizes findings logically by severity and type.
- **Version Timeline:** Tracks review history versions (e.g., `v1.0` → `v1.1`).
- **Export Reports:** Export the finalized review audit in PDF, Markdown, or JSON formats.
- **Neo Brutalism UI:** Warm cream background, thick black borders, hard shadows, and bold accent colors matching the core design assets.

## 6. TestSprite Verification
TestSprite CLI was used for comprehensive frontend verification of this project. 
- Multiple frontend test plans were created in the repository.
- Core user flows including the landing page, authentication, dashboard interactions, demo loading, engineering review actions, and export functionality were verified.
- The project actively follows the TestSprite verification workflow to ensure frontend reliability and quality.

## 7. Verification Loop (LOOP.md)
The repository includes a detailed record documenting the TestSprite verification process.
[LOOP.md](./LOOP.md)

## 8. Project Structure
```text
src/
├── components/
│   ├── dashboard/      # Sidebar, AnalysisWorkspace, panels, dialogs
│   └── ui/             # Reusable UI primitives (buttons, cards, inputs)
├── context/            # AuthContext, DashboardContext for global state
├── data/               # 5 demo PRDs for the Demo Project Loader
├── lib/
│   ├── analyzer/       # Gemini AI integration + local fallback analyzer
│   ├── config.ts       # Environment-based feature flags
│   ├── store.ts        # Supabase and localStorage data persistence
│   ├── supabase.ts     # Supabase client initialization
│   └── export.ts       # PDF / Markdown / JSON report generation logic
├── pages/              # Core pages: LandingPage, AuthPage, DashboardPage
└── types/              # Shared TypeScript domain types
```

## 9. Local Setup
```bash
# Install dependencies
npm install

# Start the development server
npm run dev
# The app will be running at http://localhost:5173
```
*Note: The app runs out of the box using a local (browser) backend and a built-in deterministic analyzer, so every flow works for a demo without needing immediate API keys.*

## 10. Environment Variables
To enable cloud persistence and real AI analysis, copy `.env.example` to `.env` and provide your keys. 

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```
*(Ensure you do not expose or commit your actual secrets to version control).*

## 11. License
MIT License

Copyright (c) 2026 SpecGuard AI

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
