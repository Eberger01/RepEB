/**
 * Event Detector - Advanced event detection in aviation transcripts
 * 
 * This module provides robust event detection using:
 * - Case-insensitive keyword matching
 * - Fuzzy string matching for variations
 * - Regex pattern matching
 * - Context-aware detection
 * - Confidence scoring
 */

import { ALL_EVENT_TYPES, EventType } from './event-taxonomy';

/**
 * Represents a transcript segment
 */
export interface TranscriptSegment {
  id: string;
  speaker: string;
  text: string;
  timestamp?: number;
  startTime?: number;
  endTime?: number;
}

/**
 * Represents a detected event
 */
export interface DetectedEvent {
  id: string;
  type: EventType;
  segmentId: string;
  text: string;
  matchedKeywords: string[];
  matchedPatterns: string[];
  confidence: number;
  context: string;
  timestamp?: number;
}

/**
 * Detector configuration options
 */
export interface DetectorOptions {
  enableFuzzyMatching?: boolean;
  fuzzyThreshold?: number;
  contextWindowSize?: number;
  minConfidence?: number;
  caseSensitive?: boolean;
  debug?: boolean;
}

/**
 * Default detector options
 */
const DEFAULT_OPTIONS: DetectorOptions = {
  enableFuzzyMatching: true,
  fuzzyThreshold: 0.8,
  contextWindowSize: 2,
  minConfidence: 0.6,
  caseSensitive: false,
  debug: false,
};

/**
 * EventDetector class - Main event detection engine
 */
export class EventDetector {
  private options: DetectorOptions;
  private eventTypes: EventType[];
  private detectedEvents: DetectedEvent[] = [];

  constructor(options: Partial<DetectorOptions> = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.eventTypes = ALL_EVENT_TYPES;
  }

  /**
   * Detect events in a transcript
   * 
   * Args:
   *     segments: Array of transcript segments
   * 
   * Returns:
   *     Array of detected events
   */
  public detectEvents(segments: TranscriptSegment[]): DetectedEvent[] {
    this.detectedEvents = [];

    if (this.options.debug) {
      console.log(`\n🔍 Starting event detection on ${segments.length} segments`);
    }

    // Process events in priority order (safety-critical first)
    // This prevents lower-priority events from overshadowing critical ones
    const priorityOrder = ['tcas', 'system_failure', 'weather', 'navigation', 'crm'];
    const orderedEventTypes = this.eventTypes.sort((a, b) => {
      const aIndex = priorityOrder.indexOf(a.id);
      const bIndex = priorityOrder.indexOf(b.id);
      return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
    });

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      const context = this.buildContext(segments, i);
      const segmentEvents: DetectedEvent[] = [];

      // Check each event type
      for (const eventType of orderedEventTypes) {
        const event = this.detectEventInSegment(segment, eventType, context);
        if (event) {
          segmentEvents.push(event);
        }
      }

      // For safety-critical events (TCAS, system failures), prefer them over CRM
      if (segmentEvents.length > 0) {
        const hasSafetyCritical = segmentEvents.some(e => 
          e.type.id === 'tcas' || e.type.id === 'system_failure'
        );
        
        if (hasSafetyCritical) {
          // Keep only safety-critical events
          const safetyCritical = segmentEvents.filter(e => 
            e.type.id === 'tcas' || e.type.id === 'system_failure'
          );
          this.detectedEvents.push(...safetyCritical);
        } else {
          // Keep all events for this segment
          this.detectedEvents.push(...segmentEvents);
        }
      }
    }

    if (this.options.debug) {
      console.log(`\n✅ Detection complete: ${this.detectedEvents.length} events found`);
      this.logEventSummary();
    }

    return this.detectedEvents;
  }

  /**
   * Detect a specific event type in a segment
   * 
   * Args:
   *     segment: The transcript segment to analyze
   *     eventType: The event type to detect
   *     context: Surrounding text context
   * 
   * Returns:
   *     Detected event or null
   */
  private detectEventInSegment(
    segment: TranscriptSegment,
    eventType: EventType,
    context: string
  ): DetectedEvent | null {
    const text = this.options.caseSensitive ? segment.text : segment.text.toLowerCase();
    const searchContext = this.options.caseSensitive ? context : context.toLowerCase();

    const matchedKeywords: string[] = [];
    const matchedPatterns: string[] = [];

    // Check keywords
    for (const keyword of eventType.keywords) {
      const searchKeyword = this.options.caseSensitive ? keyword : keyword.toLowerCase();
      
      if (this.matchesKeyword(segment.text, keyword)) {
        matchedKeywords.push(keyword);
      } else if (eventType.contextRequired && this.matchesKeyword(context, keyword)) {
        matchedKeywords.push(keyword);
      } else if (this.options.enableFuzzyMatching) {
        // Try fuzzy matching
        const fuzzyMatch = this.fuzzyMatchKeyword(text, searchKeyword);
        if (fuzzyMatch) {
          matchedKeywords.push(keyword);
        }
      }
    }

    // Check regex patterns
    for (const pattern of eventType.patterns) {
      if (pattern.test(segment.text)) {
        matchedPatterns.push(pattern.source);
      } else if (eventType.contextRequired && pattern.test(context)) {
        matchedPatterns.push(pattern.source);
      }
    }

    // Calculate confidence
    const confidence = this.calculateConfidence(
      matchedKeywords.length,
      matchedPatterns.length,
      eventType
    );

    // Check if we have enough matches
    const hasMatches = matchedKeywords.length > 0 || matchedPatterns.length > 0;
    const meetsThreshold = confidence >= (eventType.minConfidence || this.options.minConfidence || 0.6);

    // Debug logging
    if (this.options.debug && (hasMatches || eventType.id === 'tcas')) {
      console.log(`\n${hasMatches && meetsThreshold ? '✓' : '✗'} Checking ${eventType.name} for: "${segment.text}"`);
      console.log(`  Keywords matched: ${matchedKeywords.length} - [${matchedKeywords.slice(0, 3).join(', ')}${matchedKeywords.length > 3 ? '...' : ''}]`);
      console.log(`  Patterns matched: ${matchedPatterns.length}`);
      console.log(`  Confidence: ${confidence.toFixed(2)} (threshold: ${eventType.minConfidence || this.options.minConfidence || 0.6})`);
      console.log(`  Meets threshold: ${meetsThreshold}, Has matches: ${hasMatches}`);
    }

    if (hasMatches && meetsThreshold) {
      return {
        id: this.generateEventId(),
        type: eventType,
        segmentId: segment.id,
        text: segment.text,
        matchedKeywords,
        matchedPatterns,
        confidence,
        context: context,
        timestamp: segment.timestamp || segment.startTime,
      };
    }

    return null;
  }

  /**
   * Check if text matches a keyword
   * Uses word boundary detection for accurate matching
   * 
   * Args:
   *     text: The text to search in
   *     keyword: The keyword to search for
   * 
   * Returns:
   *     True if keyword is found
   */
  private matchesKeyword(text: string, keyword: string): boolean {
    // Normalize text and keyword by removing extra punctuation for better matching
    const normalizedText = text.replace(/[,;.!?]/g, ' ').replace(/\s+/g, ' ').trim();
    const normalizedKeyword = keyword.replace(/[,;.!?]/g, ' ').replace(/\s+/g, ' ').trim();
    
    // For multi-word keywords, check exact match (case-insensitive)
    if (normalizedKeyword.includes(' ')) {
      return normalizedText.toLowerCase().includes(normalizedKeyword.toLowerCase());
    }

    // For single words, use word boundary matching
    const wordBoundaryPattern = new RegExp(`\\b${this.escapeRegex(normalizedKeyword)}\\b`, 'i');
    return wordBoundaryPattern.test(normalizedText);
  }

  /**
   * Fuzzy match a keyword using Levenshtein distance
   * 
   * Args:
   *     text: The text to search in
   *     keyword: The keyword to search for
   * 
   * Returns:
   *     True if fuzzy match found above threshold
   */
  private fuzzyMatchKeyword(text: string, keyword: string): boolean {
    const words = text.split(/\s+/);
    
    for (const word of words) {
      const similarity = this.calculateSimilarity(word, keyword);
      if (similarity >= (this.options.fuzzyThreshold || 0.8)) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Calculate string similarity using Levenshtein distance
   * 
   * Args:
   *     str1: First string
   *     str2: Second string
   * 
   * Returns:
   *     Similarity score between 0 and 1
   */
  private calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) {
      return 1.0;
    }
    
    const distance = this.levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  }

  /**
   * Calculate Levenshtein distance between two strings
   * 
   * Args:
   *     str1: First string
   *     str2: Second string
   * 
   * Returns:
   *     Edit distance
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  /**
   * Build context window around a segment
   * 
   * Args:
   *     segments: All segments
   *     index: Current segment index
   * 
   * Returns:
   *     Context string with surrounding segments
   */
  private buildContext(segments: TranscriptSegment[], index: number): string {
    const windowSize = this.options.contextWindowSize || 2;
    const start = Math.max(0, index - windowSize);
    const end = Math.min(segments.length, index + windowSize + 1);
    
    const contextSegments = segments.slice(start, end);
    return contextSegments.map(s => s.text).join(' ');
  }

  /**
   * Calculate confidence score for a match
   * 
   * Args:
   *     keywordCount: Number of matched keywords
   *     patternCount: Number of matched patterns
   *     eventType: The event type being detected
   * 
   * Returns:
   *     Confidence score between 0 and 1
   */
  private calculateConfidence(
    keywordCount: number,
    patternCount: number,
    eventType: EventType
  ): number {
    // If we have any matches, give a reasonable baseline confidence
    if (keywordCount === 0 && patternCount === 0) {
      return 0.0;
    }
    
    // Base confidence starts at 0.5 if we have at least one match
    let confidence = 0.5;
    
    // Add points for keyword matches (up to +0.3 total)
    const keywordBonus = Math.min(keywordCount * 0.1, 0.3);
    
    // Add points for pattern matches (up to +0.2 total) 
    // Patterns are more specific so they're weighted lower per match but are valuable
    const patternBonus = Math.min(patternCount * 0.15, 0.2);
    
    confidence += keywordBonus + patternBonus;
    
    return Math.min(confidence, 1.0);
  }

  /**
   * Generate a unique event ID
   * 
   * Returns:
   *     Unique event identifier
   */
  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Escape special regex characters in a string
   * 
   * Args:
   *     str: String to escape
   * 
   * Returns:
   *     Escaped string
   */
  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Log event detection summary
   */
  private logEventSummary(): void {
    const summary = this.detectedEvents.reduce((acc, event) => {
      const typeName = event.type.name;
      acc[typeName] = (acc[typeName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log('\n📊 Event Summary:');
    for (const [type, count] of Object.entries(summary)) {
      console.log(`  ${type}: ${count}`);
    }
  }

  /**
   * Get events by type
   * 
   * Args:
   *     typeId: Event type ID
   * 
   * Returns:
   *     Array of events matching the type
   */
  public getEventsByType(typeId: string): DetectedEvent[] {
    return this.detectedEvents.filter(event => event.type.id === typeId);
  }

  /**
   * Get all detected events
   * 
   * Returns:
   *     Array of all detected events
   */
  public getEvents(): DetectedEvent[] {
    return this.detectedEvents;
  }
}

/**
 * Convenience function to detect events with default options
 * 
 * Args:
 *     segments: Array of transcript segments
 *     options: Optional detector configuration
 * 
 * Returns:
 *     Array of detected events
 */
export function detectEvents(
  segments: TranscriptSegment[],
  options: Partial<DetectorOptions> = {}
): DetectedEvent[] {
  const detector = new EventDetector(options);
  return detector.detectEvents(segments);
}

export default EventDetector;
