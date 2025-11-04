/**
 * Event Taxonomy - Comprehensive keyword and pattern definitions for aviation event detection
 * 
 * This file defines the keywords, phrases, and patterns used to detect various types
 * of events in pilot/ATC transcripts including TCAS alerts, CRM moments, and system failures.
 */

export interface EventType {
  id: string;
  name: string;
  category: string;
  keywords: string[];
  patterns: RegExp[];
  contextRequired?: boolean;
  minConfidence?: number;
}

/**
 * TCAS (Traffic Collision Avoidance System) Events
 * Detects traffic alerts, resolution advisories, and conflict warnings
 */
export const TCAS_EVENTS: EventType = {
  id: 'tcas',
  name: 'TCAS Alert',
  category: 'Safety',
  keywords: [
    // Primary TCAS alerts (high priority - should trigger immediately)
    'traffic, traffic',
    'traffic traffic',
    
    // Resolution advisories (high priority)
    'climb now',
    'descend now',
    'increase climb',
    'increase descent',
    'maintain vertical speed',
    'monitor vertical speed',
    'adjust vertical speed',
    
    // Conflict resolution (high priority)
    'clear of conflict',
    'conflict resolution',
    'resolution advisory',
    
    // Single word triggers (need pattern support)
    'tcas',
    'ra',
    
    // Traffic-related (lower priority, need context)
    'traffic alert',
    'traffic advisory',
    'traffic called',
    'traffic in sight',
    'traffic twelve',
    'traffic left',
    'traffic right',
    'do you have traffic',
    'traffic light',
    'proximate traffic',
    'nearby traffic',
    'conflicting traffic',
  ],
  patterns: [
    // High-confidence TCAS patterns
    /traffic[,\s]+traffic/i,
    /\bclimb\s+now\b/i,
    /\bdescend\s+now\b/i,
    /clear\s+of\s+conflict/i,
    /maintain\s+vertical\s+speed/i,
    /increase\s+(climb|descent)/i,
    
    // Traffic position calls
    /traffic\s+(left|right|twelve|one|two|three|four|five|six|seven|eight|nine|ten|eleven)\s*(o'clock)?/i,
    /traffic\s+\d+\s*miles?/i,
    
    // Questions about traffic
    /do\s+you\s+have\s+(a\s+)?traffic/i,
    /traffic\s+(light|in\s+sight)/i,
    
    // TCAS-specific
    /\btcas\b/i,
    /resolution\s+advisory/i,
  ],
  contextRequired: false,
  minConfidence: 0.5  // Lower threshold for safety events
};

/**
 * CRM (Crew Resource Management) Events
 * Detects communication, decision-making, and coordination moments
 */
export const CRM_EVENTS: EventType = {
  id: 'crm',
  name: 'CRM Moment',
  category: 'Communication',
  keywords: [
    // ATC instructions (complete phrases preferred)
    'turn left heading',
    'turn right heading',
    'climb and maintain',
    'descend and maintain',
    'maintain altitude',
    'maintain flight level',
    
    // Callsigns and clearances
    'cleared to',
    'cleared for',
    'cleared ils',
    'cleared approach',
    'cleared to land',
    
    // Coordination phrases
    'roger',
    'wilco',
    'affirmative',
    'unable',
    'say again',
    'correct',
    'that is correct',
    
    // Frequency changes
    'contact tower',
    'contact approach',
    'contact departure',
    'contact center',
    'frequency',
    'squawk',
    
    // Emergency declarations
    'declaring emergency',
    'request priority',
    'mayday',
    'pan pan',
    
    // Questions and verification
    'verify',
    'confirm',
    'check',
    'readback',
  ],
  patterns: [
    // Strong CRM patterns
    /turn\s+(left|right)\s+heading\s+\d+/i,
    /(climb|descend)\s+(and\s+maintain|to)/i,
    /cleared\s+(to|for|ils|approach)\s+/i,
    /maintain\s+(altitude|flight\s+level)/i,
    /contact\s+(tower|approach|departure|center|ground)/i,
    /request\s+(priority|emergency|landing)/i,
    /say\s+again/i,
    /\b(roger|wilco|affirmative)\b/i,
    /readback\s+correct/i,
  ],
  contextRequired: true,
  minConfidence: 0.65
};

/**
 * System Failure Events
 * Detects engine failures, system malfunctions, and emergency situations
 */
export const SYSTEM_FAILURE_EVENTS: EventType = {
  id: 'system_failure',
  name: 'System Failure',
  category: 'Emergency',
  keywords: [
    // Engine issues
    'engine',
    'engine failure',
    'engine fire',
    'engine out',
    'engine shutdown',
    'thrust loss',
    
    // System modes and failures
    'alternate mode',
    'alternate control mode',
    'eec',
    'fadec',
    'autothrottle',
    'autopilot',
    'engaged',
    'disengage',
    'disengaged',
    
    // Checklists and procedures
    'checklist',
    'emergency checklist',
    'memory items',
    'procedure',
    'qrh',
    
    // Warning systems
    'warning',
    'caution',
    'alert',
    'alarm',
    'master warning',
    'master caution',
    
    // Specific failures
    'hydraulic',
    'electrical',
    'fuel',
    'pressurization',
    'depressurization',
    'fire',
    'smoke',
    
    // Status checks
    'seems to be ok',
    'operating normally',
    'check status',
    'system check',
  ],
  patterns: [
    /engine\s+(failure|fire|out|shutdown)/i,
    /alternate\s+(control\s+)?mode/i,
    /eec\s+operates/i,
    /autothrottle[,\s]+(if\s+)?engaged[,\s]+disengage/i,
    /(master\s+)?(warning|caution)/i,
    /emergency\s+checklist/i,
    /(seems|appears)\s+to\s+be\s+(ok|normal)/i,
    /(hydraulic|electrical|fuel)\s+(failure|problem|issue)/i,
  ],
  contextRequired: true,
  minConfidence: 0.75
};

/**
 * Weather Events
 * Detects weather-related communications and decisions
 */
export const WEATHER_EVENTS: EventType = {
  id: 'weather',
  name: 'Weather Event',
  category: 'Operations',
  keywords: [
    'weather',
    'turbulence',
    'icing',
    'thunderstorm',
    'wind shear',
    'visibility',
    'clouds',
    'precipitation',
    'rain',
    'snow',
    'fog',
    'mist',
    'ceiling',
  ],
  patterns: [
    /wind\s+shear/i,
    /severe\s+(weather|turbulence)/i,
    /visibility\s+\d+/i,
    /(heavy|light)\s+(rain|snow|precipitation)/i,
  ],
  contextRequired: false,
  minConfidence: 0.65
};

/**
 * Navigation Events
 * Detects waypoint changes, route modifications, and navigation issues
 */
export const NAVIGATION_EVENTS: EventType = {
  id: 'navigation',
  name: 'Navigation Event',
  category: 'Operations',
  keywords: [
    'waypoint',
    'fix',
    'vor',
    'ndb',
    'ils',
    'approach',
    'departure',
    'arrival',
    'direct to',
    'proceed direct',
    'hold',
    'holding pattern',
    'vectors',
    'radar vectors',
  ],
  patterns: [
    /proceed\s+direct/i,
    /cleared\s+(ils|vor|rnav)\s+approach/i,
    /hold\s+(at|over)/i,
    /radar\s+vectors/i,
  ],
  contextRequired: false,
  minConfidence: 0.6
};

/**
 * All event types combined for easy iteration
 */
export const ALL_EVENT_TYPES: EventType[] = [
  TCAS_EVENTS,
  CRM_EVENTS,
  SYSTEM_FAILURE_EVENTS,
  WEATHER_EVENTS,
  NAVIGATION_EVENTS,
];

/**
 * Export individual event types for direct access
 */
export default {
  TCAS_EVENTS,
  CRM_EVENTS,
  SYSTEM_FAILURE_EVENTS,
  WEATHER_EVENTS,
  NAVIGATION_EVENTS,
  ALL_EVENT_TYPES,
};
