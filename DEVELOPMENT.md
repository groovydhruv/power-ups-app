# Power-ups App - Development Documentation

## Overview
This is a React Native/Expo app built with TypeScript that helps users level up their mindset through curated content organized into topics. Users engage with resources through AI-powered voice conversations.

## Tech Stack
- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: Expo Router (file-based routing)
- **State Management**: Zustand (via ProgressContext)
- **Storage**: AsyncStorage (to be replaced with Supabase)
- **Fonts**: Fustat (400Regular, 600SemiBold, 700Bold, 800ExtraBold)

---

## Core Logic Systems

### 1. Level & XP System

#### Leveling Logic
- **Each topic = 1 level**
- Topics unlock sequentially (must complete all resources in Topic 1 to unlock Topic 2, etc.)
- Level is calculated based on **completed topics**, NOT total XP
- User starts at Level 1

**Example:**
- Level 1: Working on "Stay hungry, stay foolish."
- Level 2: Completed Topic 1, working on "The unexamined life is not worth living."
- Level 3: Completed Topics 1-2, working on "Changing the default settings."

#### XP Logic
- **Each resource = 150 XP (fixed)**
- XP per level = Number of resources in that topic × 150
- XP display is dynamic based on current topic size

**Examples:**
- Topic with 2 resources: "Level 1, 0/300 XP"
- Topic with 4 resources: "Level 2, 0/600 XP"
- Topic with 6 resources: "Level 4, 0/900 XP"

**XP Calculation per Topic:**
```
Topic 1: 2 resources × 150 = 300 XP needed
Topic 2: 4 resources × 150 = 600 XP needed
Topic 3: 5 resources × 150 = 750 XP needed
Topic 4: 6 resources × 150 = 900 XP needed
```

When a user completes a topic, they level up and XP resets to 0 for the next topic.

**Implementation:**
- Located in: `contexts/ProgressContext.tsx`
- Function `calculateLevel()` counts completed topics sequentially
- Function `getCurrentLevelXp()` calculates XP within current level
- Function `getXpPerLevel()` returns total XP needed for current level

---

### 2. Resource Completion Flow

#### Resource States
1. **Locked**: User hasn't completed previous resources
2. **In Progress**: User has started but not completed the conversation
3. **Completed**: User reached 100% understanding

#### Conversation System
- Each resource has a voice conversation interface
- Progress increments by 25% per exchange (4 exchanges = 100%)
- Progress and messages are saved to AsyncStorage (key: `validation_{resourceId}_progress` and `validation_{resourceId}_messages`)
- When progress reaches 100%, resource is marked complete (key: `resource_{resourceId}_completed`)

#### Button States
- **New resource**: "Start Conversation" (green button)
- **In-progress resource**: "Continue Conversation" (green button)
- **Completed resource**: No button (can view content but not restart conversation)

---

### 3. Playback Speed (Rabbit & Turtle)

Voice messages have playback speed controls using emojis:
- **🐢 Turtle**: 1x speed (normal playback)
- **🐰 Rabbit**: 1.5x speed (faster playback)

#### Implementation Details
- Each message has its own `playbackSpeed` property (1 or 1.5)
- Clicking the emoji toggles between speeds for that specific message only
- Playback speeds are saved per message in AsyncStorage
- Located in: `app/validation/[id].tsx`

**Storage:**
```typescript
interface Message {
  id: string;
  duration: number;
  isUser: boolean;
  timestamp: number;
  playbackSpeed: 1 | 1.5;
}
```

---

### 4. Progress Persistence

All progress is stored in AsyncStorage (to be migrated to Supabase):

#### Keys Used
- `user_progress`: Global user data (xp, level, streak, lastCompletionDate)
- `resource_{id}_completed`: Boolean flag for completed resources
- `validation_{id}_progress`: Conversation progress (0-100)
- `validation_{id}_messages`: Array of message objects with playback speeds

#### Data to Migrate to Supabase

**Users Table:**
```sql
- id (UUID)
- xp (INTEGER)
- level (INTEGER)
- streak (INTEGER)
- last_completion_date (TIMESTAMP)
- created_at (TIMESTAMP)
```

**User_Resources Table:**
```sql
- id (UUID)
- user_id (UUID, foreign key)
- resource_id (STRING)
- is_completed (BOOLEAN)
- progress (INTEGER, 0-100)
- messages (JSONB)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

---

### 5. Topic & Resource Structure

Topics are defined in: `constants/powerups.ts`

#### Current Topics (in order):
1. **Stay hungry, stay foolish.** (2 resources)
2. **The unexamined life is not worth living.** (4 resources)
3. **Changing the default settings.** (5 resources)
4. **Get shit done.** (6 resources)

#### Resource Properties
```typescript
interface Resource {
  id: string;              // Unique identifier
  title: string;           // Display name
  description: string;     // Format: "watch/read/listen, X min"
  isCompleted: boolean;    // Completion status
  thumbnail?: string;      // Image URL
  content: {
    type: 'video' | 'text';
    title: string;
    summary: string;       // Shown on detail page
  };
}
```

---

### 6. Navigation Structure

```
app/
├── (tabs)/              # Main tab navigation
│   ├── index.tsx        # Home screen (resource path)
│   ├── achievements.tsx # Coming soon
│   └── profile.tsx      # User profile
├── content/[id].tsx     # Resource detail page
└── validation/[id].tsx  # Conversation interface
```

**Routing:**
- `/` → Home screen
- `/content/1` → Detail page for resource ID 1
- `/validation/1` → Conversation page for resource ID 1

---

### 7. UI/UX Details

#### Color Scheme
- Primary: `#00D9FF` (cyan)
- Success: `#00FF94` (green)
- Accent: `#FF6B35` (orange)
- Background: `#0A0A0F` (dark)
- Surface: `#1A1A24` (dark gray)

#### Key Features
- Bottom navigation bar (adjusted for web with 70px height)
- Topic headers with subtle borders (lowercase text)
- Progress bar with uppercase label and glow effect
- Large mic button (110px) with light green color
- Voice message bubbles with waveform visualization

---

### 8. Streak System

- Increments by 1 if user completes a resource on consecutive days
- Resets to 1 if more than 1 day gap
- Stored in `user_progress` object
- Displayed on home screen with flame icon

---

## Integration TODO for Backend Team

### Supabase Setup Required

1. **Authentication**
   - Implement user sign-up/login
   - Replace AsyncStorage with Supabase user auth

2. **Database Schema**
   - Create `users` table (xp, level, streak)
   - Create `user_resources` table (completion status, progress, messages)
   - Create `resources` table (metadata for each resource)

3. **API Integration**
   - Replace local `THEMES` data with database queries
   - Sync progress in real-time with Supabase
   - Implement proper error handling and loading states

4. **AI/Voice Integration**
   - Connect to AI service for conversation responses
   - Implement actual voice recording/playback
   - Replace simulated voice messages with real transcription

5. **Environment Variables**
   ```
   SUPABASE_URL=
   SUPABASE_ANON_KEY=
   AI_SERVICE_API_KEY=
   ```

---

## File Structure Overview

```
power-ups-app/
├── app/                      # Screens (Expo Router)
├── constants/                # Static data & colors
├── contexts/                 # Global state (Progress)
├── assets/                   # Images & icons
├── package.json              # Dependencies
└── DEVELOPMENT.md           # This file
```

---

## Current Limitations (MVP)

1. Voice messages are simulated (not real audio)
2. AI responses are placeholder text
3. No actual authentication
4. Data stored locally (AsyncStorage)
5. No server-side validation
6. Thumbnails are placeholder URLs

---

## Testing Notes

- Server runs on `http://localhost:8081` (Expo web)
- Use browser DevTools to inspect AsyncStorage
- Clear storage to reset progress: `AsyncStorage.clear()`

---

## Contact

For questions or issues during integration, refer to this documentation or the inline code comments.

