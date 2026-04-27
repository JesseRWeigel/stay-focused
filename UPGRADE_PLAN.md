# Stay Focused - Upgrade Plan

## Vision
Transform Stay Focused from a single-headset BCI demo into the **first universal browser-based BCI framework** — an open-source abstraction layer that works across all major consumer EEG headsets, with a polished focus-tracking app built on top.

## Current State
- Expo/React Native app using `@neurosity/notion` SDK
- Only supports Neurosity Crown (~$999)
- Basic focus tracking UI
- Deployed to GitHub Pages (web only)
- Dependencies are outdated (Expo 36, React 16.9)

---

## Phase 1: Modernize the Stack (Week 1)

### 1.1 Update Core Dependencies
- [ ] Upgrade to Expo SDK 52+ / React 18+
- [ ] Upgrade TypeScript to 5.x
- [ ] Migrate from `react-native-web` to a modern web-first approach (Next.js or Vite + React)
- [ ] Decide: keep React Native cross-platform or go web-only for faster iteration
- **Recommendation:** Go **Vite + React** (web-first). The BCI ecosystem is browser-centric (Web Bluetooth). Mobile can come later via Capacitor/PWA.

### 1.2 Project Structure Refactor
```
stay-focused/
├── src/
│   ├── core/              # Universal BCI abstraction layer
│   │   ├── types.ts       # EEGDevice interface, EEGSample, BandPower, etc.
│   │   ├── DeviceManager.ts
│   │   └── drivers/
│   │       ├── neurosity.ts
│   │       ├── muse.ts
│   │       ├── brainbit.ts
│   │       ├── emotiv.ts
│   │       └── openBCIGanglion.ts
│   ├── processing/        # Signal processing (bcijs wrapper)
│   │   ├── bandPower.ts
│   │   ├── focusScore.ts
│   │   └── calmScore.ts
│   ├── app/               # The Stay Focused application
│   │   ├── components/
│   │   ├── hooks/
│   │   └── pages/
│   └── index.ts
├── package.json
└── vite.config.ts
```

---

## Phase 2: Universal BCI Abstraction Layer (Weeks 2-3)

### 2.1 Define the Universal Interface
```typescript
interface EEGDevice {
  readonly id: string;
  readonly name: string;
  readonly type: 'neurosity' | 'muse' | 'brainbit' | 'emotiv' | 'ganglion';

  connect(): Promise<void>;
  disconnect(): Promise<void>;
  status(): Observable<ConnectionStatus>;

  // Raw data streams
  eeg(): Observable<EEGSample>;
  bandPower(): Observable<BandPower>;  // delta, theta, alpha, beta, gamma

  // Computed metrics (normalized 0-1)
  focus(): Observable<number>;
  calm(): Observable<number>;

  // Device info
  signalQuality(): Observable<SignalQuality>;
  deviceInfo(): DeviceInfo;
}
```

### 2.2 Implement Drivers (Priority Order)

| Priority | Headset | npm Package | Transport | Price | Why |
|----------|---------|-------------|-----------|-------|-----|
| 1 | **Muse 2/S** | `muse-js` or `web-muse` | Web Bluetooth | $250 | Most accessible, largest hobbyist market |
| 2 | **Neurosity Crown** | `@neurosity/notion` | Cloud/Firebase | $999 | Already supported, upgrade existing code |
| 3 | **BrainBit** | `web-neurosdk-brainbit` | Web Bluetooth | $499 | Good Web BLE SDK, fills mid-tier |
| 4 | **Emotiv EPOC X** | Custom WebSocket client | Local WSS | $849 | Enterprise/research market |
| 5 | **OpenBCI Ganglion** | `ganglion-ble` | Web Bluetooth | $200 | Cheapest, open-source hardware |

### 2.3 Signal Processing Layer
- Use `bcijs` for in-browser signal processing
- For headsets with native metrics (Neurosity `focus()`/`calm()`): pass through directly
- For raw-data headsets (Muse, OpenBCI, BrainBit): compute focus from theta/beta ratio, calm from alpha power
- Normalize all metrics to 0-1 scale regardless of source

### 2.4 Device Discovery & Selection UI
- Web Bluetooth scanning for BLE devices
- Neurosity account login flow
- Emotiv Cortex desktop app detection
- "No headset? Use demo mode" with simulated data

---

## Phase 3: Polished Focus App (Weeks 3-4)

### 3.1 Dashboard
- [ ] Real-time focus score gauge (large, animated)
- [ ] Focus history chart (line graph over time)
- [ ] Session timer with start/stop
- [ ] Daily/weekly focus streaks
- [ ] Best focus time-of-day analytics

### 3.2 Focus Modes
- [ ] **Pomodoro Integration** — 25min focus + 5min break, auto-detected via EEG
- [ ] **Deep Work Mode** — alerts when focus drops below threshold
- [ ] **Meditation Mode** — tracks calm score, guides breathing
- [ ] **Flow State Detector** — identifies when you enter flow (high focus + high calm)

### 3.3 Gamification
- [ ] Focus score streaks (consecutive days of hitting focus goals)
- [ ] Achievements/badges ("First Flow State", "1 Hour Deep Focus", "7-Day Streak")
- [ ] Weekly focus leaderboard (opt-in, compare with friends)
- [ ] Shareable focus cards ("I hit 45min of deep focus today!")

### 3.4 Integrations
- [ ] Browser extension — overlay focus score while working
- [ ] VS Code extension — show focus in status bar
- [ ] Spotify integration — auto-pause music when focus drops
- [ ] Notion/Obsidian — export focus session logs

---

## Phase 4: Community & Distribution (Week 5+)

### 4.1 Documentation
- [ ] Interactive "Getting Started" guide for each headset
- [ ] API reference for the abstraction layer (so others can build on it)
- [ ] Contributing guide
- [ ] Demo videos/GIFs for README

### 4.2 npm Package
- [ ] Publish the BCI abstraction layer as a standalone npm package (e.g., `universal-bci` or `web-eeg`)
- [ ] Separate from the Stay Focused app — the library is the open-source contribution, the app is the showcase

### 4.3 Content & Visibility
- [ ] Blog post: "Building a Universal BCI Framework for the Web"
- [ ] Demo video: "I built an app that reads your brainwaves with a $250 headset"
- [ ] Post to Hacker News, r/neuroscience, r/BCI, r/webdev
- [ ] Submit talk proposals to JSConf, React Conf, neuroscience conferences

### 4.4 Monetization Path (Future)
- **Free tier:** Basic focus tracking, single session history
- **Pro tier ($5/mo):** Unlimited history, analytics, integrations, team features
- **Enterprise:** Team dashboards, API access, custom metrics
- **Consulting:** "I built the universal BCI framework" → BCI/neuroscience consulting

---

## Technical Notes

### Browser Compatibility
- Web Bluetooth works in: Chrome, Edge, Opera (desktop + Android)
- Does NOT work in: Safari, iOS (any browser), Firefox
- Neurosity (cloud-based) and Emotiv (WebSocket) work everywhere
- Fallback: "demo mode" with simulated data for unsupported browsers

### Key npm Packages
- `muse-js` — Muse Web Bluetooth (by Uri Shaked)
- `web-muse` — Muse with React hooks (maintained fork)
- `@neurosity/notion` — Neurosity Crown SDK
- `web-neurosdk-brainbit` — BrainBit Web BLE
- `ganglion-ble` — OpenBCI Ganglion BLE (by Neurosity team)
- `bcijs` — In-browser EEG signal processing
- Emotiv: Custom WebSocket client to Cortex API (`wss://localhost:6868`)

### Risks & Mitigations
| Risk | Mitigation |
|------|-----------|
| Web Bluetooth API instability | Test across Chrome versions, implement reconnection logic |
| Headset SDK breaking changes | Pin versions, integration test suite per driver |
| Safari/iOS never supports Web BLE | Ensure Neurosity + Emotiv paths work, consider React Native companion app |
| Low initial user base | Start with Muse (cheapest) to maximize accessibility |
