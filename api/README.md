# Event Detection System

Advanced event detection engine for aviation transcripts, designed to identify TCAS alerts, CRM moments, system failures, and other critical events in pilot/ATC communications.

## Features

- **Multi-Strategy Detection**: Combines keyword matching, regex patterns, and fuzzy matching
- **Aviation-Specific**: Tailored for pilot/ATC communications with domain-specific terminology
- **Confidence Scoring**: Each event includes a confidence score (0.0 to 1.0)
- **Priority-Based**: Safety-critical events (TCAS, system failures) take precedence
- **Context-Aware**: Uses surrounding segments for better accuracy
- **Configurable**: Extensive options for tuning detection behavior
- **Debuggable**: Built-in logging for troubleshooting

## Quick Start

### Installation

```bash
npm install
```

### Basic Usage

```typescript
import { EventDetector, TranscriptSegment } from './lib/events/detector';

// Create transcript segments
const segments: TranscriptSegment[] = [
  {
    id: 'seg_001',
    speaker: 'TCAS',
    text: 'Traffic, traffic',
    timestamp: 1000,
  },
  {
    id: 'seg_002',
    speaker: 'TCAS',
    text: 'Climb now. Maintain vertical speed',
    timestamp: 1500,
  },
  // ... more segments
];

// Detect events
const detector = new EventDetector({
  enableFuzzyMatching: true,
  minConfidence: 0.6,
  debug: false,
});

const events = detector.detectEvents(segments);

// Use the results
console.log(`Detected ${events.length} events`);
events.forEach(event => {
  console.log(`${event.type.name}: ${event.text}`);
  console.log(`Confidence: ${(event.confidence * 100).toFixed(1)}%`);
});
```

### Running Tests

```bash
npm test
```

## Event Types

### TCAS Events (Safety)
Detects Traffic Collision Avoidance System alerts and resolution advisories:
- "Traffic, traffic"
- "Climb now"
- "Clear of conflict"
- "Traffic twelve o'clock"
- "Traffic in sight"

**Min Confidence**: 0.5 (lower threshold for safety-critical events)

### CRM Events (Communication)
Detects Crew Resource Management and communication moments:
- ATC instructions: "Turn left heading 090"
- Clearances: "Cleared for ILS approach"
- Readbacks: "Roger", "Wilco", "Affirmative"
- Frequency changes: "Contact tower on 118.3"
- Emergency declarations: "Declaring emergency"

**Min Confidence**: 0.65

### System Failure Events (Emergency)
Detects engine failures, system malfunctions, and emergency procedures:
- Engine issues: "Engine failure", "Thrust loss"
- System modes: "Alternate control mode", "EEC operates"
- Warnings: "Master caution", "Hydraulic pressure low"
- Procedures: "Emergency checklist", "Running QRH"

**Min Confidence**: 0.75

### Weather Events (Operations)
Detects weather-related communications:
- "Wind shear"
- "Severe turbulence"
- "Visibility reduced"

**Min Confidence**: 0.65

### Navigation Events (Operations)
Detects navigation and routing changes:
- "Cleared ILS approach"
- "Proceed direct"
- "Radar vectors"

**Min Confidence**: 0.6

## Configuration Options

### DetectorOptions

```typescript
interface DetectorOptions {
  enableFuzzyMatching?: boolean;  // Enable fuzzy string matching (default: true)
  fuzzyThreshold?: number;         // Similarity threshold 0-1 (default: 0.8)
  contextWindowSize?: number;      // Segments before/after for context (default: 2)
  minConfidence?: number;          // Minimum confidence to accept (default: 0.6)
  caseSensitive?: boolean;         // Case-sensitive matching (default: false)
  debug?: boolean;                 // Enable verbose logging (default: false)
}
```

### Example: High-Precision Mode

```typescript
const detector = new EventDetector({
  enableFuzzyMatching: false,  // Exact matching only
  minConfidence: 0.8,          // Higher threshold
  contextWindowSize: 1,        // Less context bleeding
  debug: false,
});
```

### Example: Debug Mode

```typescript
const detector = new EventDetector({
  debug: true,  // Detailed logging
  minConfidence: 0.5,
});
```

## API Reference

### EventDetector

#### `constructor(options?: Partial<DetectorOptions>)`
Creates a new event detector instance with optional configuration.

#### `detectEvents(segments: TranscriptSegment[]): DetectedEvent[]`
Analyzes transcript segments and returns detected events.

**Parameters:**
- `segments`: Array of transcript segments with text, speaker, and timestamp

**Returns:**
- Array of detected events with type, confidence, matched keywords, and context

#### `getEventsByType(typeId: string): DetectedEvent[]`
Filters detected events by type ID.

**Parameters:**
- `typeId`: Event type ID ('tcas', 'crm', 'system_failure', 'weather', 'navigation')

**Returns:**
- Array of events matching the specified type

#### `getEvents(): DetectedEvent[]`
Returns all detected events.

### Types

#### TranscriptSegment
```typescript
interface TranscriptSegment {
  id: string;           // Unique segment identifier
  speaker: string;      // Speaker name (Pilot, ATC, TCAS, etc.)
  text: string;         // Segment text content
  timestamp?: number;   // Optional timestamp in milliseconds
  startTime?: number;   // Optional start time
  endTime?: number;     // Optional end time
}
```

#### DetectedEvent
```typescript
interface DetectedEvent {
  id: string;                // Unique event identifier
  type: EventType;           // Event type with metadata
  segmentId: string;         // Source segment ID
  text: string;              // Matched text
  matchedKeywords: string[]; // Keywords that matched
  matchedPatterns: string[]; // Pattern sources that matched
  confidence: number;        // Confidence score (0.0-1.0)
  context: string;           // Surrounding context
  timestamp?: number;        // Event timestamp
}
```

## Performance Considerations

- **Context Window**: Larger windows increase accuracy but may cause keyword bleeding. Recommended: 1-2
- **Fuzzy Matching**: Increases recall but adds computational cost. Disable for very large datasets
- **Confidence Threshold**: Higher thresholds reduce false positives but may miss valid events

## Troubleshooting

### Events Not Being Detected

1. **Enable debug mode**:
   ```typescript
   const detector = new EventDetector({ debug: true });
   ```

2. **Lower confidence threshold**:
   ```typescript
   const detector = new EventDetector({ minConfidence: 0.4 });
   ```

3. **Check keyword matching**:
   - Verify text isn't case-sensitive when it shouldn't be
   - Check for unusual punctuation or formatting
   - Try adding specific keywords to event-taxonomy.ts

### False Positives

1. **Increase confidence threshold**:
   ```typescript
   const detector = new EventDetector({ minConfidence: 0.75 });
   ```

2. **Reduce context window**:
   ```typescript
   const detector = new EventDetector({ contextWindowSize: 1 });
   ```

3. **Disable fuzzy matching**:
   ```typescript
   const detector = new EventDetector({ enableFuzzyMatching: false });
   ```

### Adding Custom Keywords

Edit `api/lib/events/event-taxonomy.ts`:

```typescript
export const TCAS_EVENTS: EventType = {
  id: 'tcas',
  name: 'TCAS Alert',
  keywords: [
    'traffic',
    'your custom keyword',  // Add here
    // ...
  ],
  patterns: [
    /traffic[,\s]+traffic/i,
    /your custom pattern/i,  // Add here
  ],
  // ...
};
```

## Testing

The test suite (`lib/events/test-detector.ts`) validates detection against realistic aviation transcripts.

### Test Coverage
- 29 transcript segments
- 7 TCAS events
- 14 CRM moments  
- 10 system failures
- 3 navigation events

### Running Tests
```bash
npm test
```

### Expected Output
```
✅ All acceptance criteria PASSED!
[✓] TCAS Events: 7 (target: 5+)
[✓] CRM Moments: 14 (target: 10+)
[✓] System Failures: 10 (target: 1+)
```

## Architecture

```
api/lib/events/
├── event-taxonomy.ts    # Event definitions and keywords
├── detector.ts          # Main detection engine
└── test-detector.ts     # Test suite
```

### Event Detection Flow

1. **Preprocessing**: Normalize text (remove punctuation, lowercase)
2. **Keyword Matching**: Check each keyword against segment text
3. **Pattern Matching**: Apply regex patterns
4. **Fuzzy Matching**: Optional similarity-based matching
5. **Context Analysis**: Check surrounding segments if required
6. **Confidence Calculation**: Score based on matches
7. **Priority Filtering**: Safety events override communication events
8. **Results**: Return detected events with metadata

## Confidence Scoring Algorithm

```
Base confidence: 0.5 (if any match)
+ Keyword bonus: min(count * 0.1, 0.3)
+ Pattern bonus: min(count * 0.15, 0.2)
= Final confidence (0.0 to 1.0)
```

**Examples:**
- 1 keyword + 1 pattern = 0.5 + 0.1 + 0.15 = **0.75 confidence**
- 2 keywords + 1 pattern = 0.5 + 0.2 + 0.15 = **0.85 confidence**
- 3 keywords + 2 patterns = 0.5 + 0.3 + 0.2 = **1.00 confidence**

## Contributing

When adding new event types or keywords:

1. Add keywords to `event-taxonomy.ts`
2. Add test cases to `test-detector.ts`
3. Run tests to validate: `npm test`
4. Update this README with new event types

## License

MIT

## Support

For issues or questions:
- Check the troubleshooting section
- Enable debug mode for detailed logs
- Review test cases for examples
- See `workflow.md` for development history
