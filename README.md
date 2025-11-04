# Aviation Event Detection System

> Advanced event detection for pilot/ATC transcripts - identifying TCAS alerts, CRM moments, and system failures in real-time.

## 🎯 Overview

This project provides a sophisticated event detection system designed for aviation transcripts. It uses multi-strategy detection (keyword matching, regex patterns, fuzzy matching) to identify critical events with high accuracy and confidence scoring.

## ✅ Status

**MAD-21 - Fix Event Detection Keywords**: ✅ **COMPLETE**

All acceptance criteria met:
- ✓ TCAS Events: 7 detected (target: 5+)
- ✓ CRM Moments: 14 detected (target: 10+)
- ✓ System Failures: 10 detected (target: 1+)

## 🚀 Quick Start

```bash
cd api
npm install
npm test
```

## 📁 Project Structure

```
/workspace/
├── api/                    # Event detection system
│   ├── lib/events/
│   │   ├── event-taxonomy.ts    # Event definitions (60+ keywords)
│   │   ├── detector.ts          # Detection engine (460 lines)
│   │   └── test-detector.ts     # Test suite (245 lines)
│   ├── package.json
│   └── README.md          # Full API documentation
├── workflow.md            # Development log
├── overview.md            # Project architecture
└── README.md              # This file
```

## 🎓 Event Types Detected

1. **TCAS Alerts** (Safety) - Traffic warnings, resolution advisories
2. **CRM Moments** (Communication) - ATC instructions, readbacks, coordination
3. **System Failures** (Emergency) - Engine failures, system malfunctions
4. **Weather Events** (Operations) - Turbulence, visibility changes
5. **Navigation Events** (Operations) - Waypoint changes, approaches

## 🔧 Features

- ✨ Multi-strategy detection (keywords + regex + fuzzy matching)
- 🎯 Confidence scoring (0.0 to 1.0)
- 🔐 Priority-based (safety events take precedence)
- 🧠 Context-aware analysis
- 📊 Detailed logging and debugging
- ⚙️ Highly configurable
- 🧪 Comprehensive test coverage

## 📖 Documentation

- **API Documentation**: [api/README.md](api/README.md)
- **Architecture**: [overview.md](overview.md)
- **Development Log**: [workflow.md](workflow.md)

## 🧪 Testing

Run the test suite:
```bash
cd api && npm test
```

Expected output:
```
✅ All acceptance criteria PASSED!
[✓] TCAS Events: 7 (target: 5+)
[✓] CRM Moments: 14 (target: 10+)
[✓] System Failures: 10 (target: 1+)
```

## 📊 Example Usage

```typescript
import { EventDetector } from './api/lib/events/detector';

const segments = [
  { id: '1', speaker: 'TCAS', text: 'Traffic, traffic', timestamp: 1000 },
  { id: '2', speaker: 'TCAS', text: 'Climb now', timestamp: 1500 },
];

const detector = new EventDetector();
const events = detector.detectEvents(segments);

console.log(`Detected ${events.length} events`);
// Output: Detected 2 events
```

## 🛠️ Technology Stack

- **Language**: TypeScript
- **Runtime**: Node.js v22
- **Package Manager**: npm
- **Testing**: Custom test runner

## 📝 License

MIT

## 🙏 Acknowledgments

Developed to solve Linear issue MAD-21: "Fix Event Detection Keywords - Zero Events Detected in Text Transcripts"
