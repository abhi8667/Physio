Build a production-ready, multi-page web application called **“RehabAI”**, an AI-powered physiotherapy and rehabilitation tracking platform that uses computer vision to analyze user posture in real-time and provides personalized recovery plans.

---

# 🎯 CORE OBJECTIVE

The platform helps post-surgery or injury patients:

* Track physiotherapy exercises
* Get real-time posture correction using camera (pose detection)
* Log pain areas and upload medical scans
* Receive AI-generated recovery plans
* Monitor progress through analytics
* Generate reports for doctors

---

# 🧠 UX & DESIGN PRINCIPLES

Design style:

* Clean, minimal, premium SaaS UI
* White/light background with soft shadows
* Glassmorphism sidebar (blur + transparency)
* Rounded cards (16–24px radius)
* Subtle gradients (blue → purple)
* Accent colors:

  * Primary: Blue (#2563EB)
  * Secondary: Teal (#14B8A6)

Typography:

* Modern sans-serif (Inter or similar)
* Clear hierarchy (large headings, soft subtext)

Feel:

* Apple-like minimalism + slight AI/futuristic glow + subtle fitness energy

---

# 🧱 TECH STACK

Frontend:

* React (with Vite)
* TypeScript
* Tailwind CSS
* Framer Motion (animations)
* Recharts (charts/graphs)

Computer Vision:

* MediaPipe Pose OR TensorFlow.js pose detection

State:

* Zustand or Context API

---

# 📁 PROJECT STRUCTURE

src/
├── components/
│   ├── layout/
│   ├── ui/
│   ├── cards/
│   ├── charts/
│   ├── camera/
│   └── forms/
│
├── pages/
│   ├── Landing.tsx
│   ├── Dashboard.tsx
│   ├── RecoverySetup.tsx
│   ├── Session.tsx
│   ├── Progress.tsx
│   ├── Exercises.tsx
│   └── Reports.tsx
│
├── services/
│   └── poseDetection.ts
│
├── hooks/
├── utils/
└── App.tsx

---

# 🌐 PAGE 1: LANDING PAGE

## Hero Section

* Left:

  * Headline:
    “Recover smarter with AI-powered physiotherapy”
  * Subtext explaining real-time posture correction
  * CTA buttons:

    * Start Session
    * View Demo

* Right:

  * Mock camera UI showing:

    * Human performing exercise
    * Pose skeleton overlay (nodes + lines)
    * Angle label (e.g., Knee: 92°)
    * Status badge (Correct / Incorrect)

## Sections:

* Features (3–4 cards)

  * Real-time pose detection
  * AI feedback
  * Progress tracking
  * Doctor reports
* Demo preview section
* CTA footer

---

# 📊 PAGE 2: DASHBOARD

Layout:

* Left glass sidebar
* Main content grid

Sections:

* Top stats cards:

  * Sessions completed
  * Accuracy %
  * Recovery score
  * Streak

* Weekly activity heatmap

* Recent sessions list

* AI suggestions panel

---

# 🧠 PAGE 3: RECOVERY SETUP (NEW FEATURE)

Multi-step form UI:

## Step 1: Upload Medical Scans

* Drag & drop upload (PDF/images)
* File preview cards
* Tags (knee, shoulder, etc.)
* Optional AI summary (mocked)

## Step 2: Pain Mapping

* Interactive human body diagram (front/back toggle)
* Clickable joints:

  * Knee, shoulder, back, neck
* Pain intensity sliders (1–10)

## Step 3: Doctor Input

* Select doctor dropdown
* Input notes
* Multi-select prescribed exercises

## Step 4: Exercise Selection

* Exercise library cards
* Filters (injury, difficulty)
* Add/remove exercises

## Step 5: Generate Plan

* Button: “Generate My Rehab Plan”

---

# 📅 PLAN OUTPUT UI

* Weekly schedule table (Mon–Sun)
* Exercises per day
* Sets, reps, duration
* Insight cards:

  * “Focus on knee stability”
* CTA:

  * Save Plan
  * Start Session

---

# 🎥 PAGE 4: EXERCISE SESSION (CORE FEATURE)

Layout:

* Sidebar
* Center: camera feed
* Right: metrics panel

Camera Features:

* Webcam feed
* Pose skeleton overlay
* Highlight incorrect joints
* Angle labels (e.g., Knee: 92°)

Live UI:

* Rep counter
* Timer
* Status badge:

  * Correct
  * Adjust posture

Right Panel:

* Exercise instructions
* Target angles
* Live feedback messages

---

# 📈 PAGE 5: PROGRESS / ANALYTICS

Components:

* Accuracy trend graph
* Recovery score radial chart
* Daily activity heatmap
* Streak tracking
* Muscle focus distribution

---

# 🧘 PAGE 6: EXERCISE SUGGESTIONS

* Card-based layout
* Each card:

  * Image
  * Name
  * Target muscle
  * Difficulty
* CTA: Start Session

---

# 📄 PAGE 7: REPORTS

* Generate downloadable report (PDF-style UI)
* Sections:

  * Summary
  * Accuracy trends
  * Session logs
* Share with doctor:

  * Email input
  * Share button

---

# 🎥 COMPUTER VISION INTEGRATION

Create a mock or basic implementation:

poseDetection.ts:

* Accept pose landmarks
* Compute joint angles
* Return:
  {
  angle: number,
  correct: boolean,
  feedback: string
  }

Overlay skeleton using canvas or SVG.

---

# 🎨 COMPONENT REQUIREMENTS

* Reusable Card component
* Sidebar with icons + active state
* CameraFeed component
* PoseOverlay component
* Chart components
* Upload component
* BodyPainSelector component

---

# ✨ ANIMATIONS

* Smooth page transitions
* Card hover effects
* Subtle gradient highlights
* Live updating stats

---

# 🚀 DEPLOYMENT

* Must be deployable on Vercel
* Optimized build
* Clean code structure
* No unnecessary dependencies

---

# ⚠️ IMPORTANT

* Focus on UI/UX quality first
* Mock backend if needed
* Ensure responsive design
* Keep code modular and scalable

---

# 🎯 OUTPUT EXPECTATION

Generate:

* Complete React + Tailwind project
* All pages implemented
* Reusable components
* Clean architecture
* Ready to run with `npm install && npm run dev`
