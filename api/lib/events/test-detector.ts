/**
 * Test file for EventDetector
 * 
 * Tests the event detection system with sample transcript data
 * from the Davide Sim session mentioned in the issue.
 */

import { EventDetector, TranscriptSegment } from './detector';

/**
 * Sample transcript segments from Davide Sim session
 * Contains TCAS events, CRM moments, and system failures
 */
const SAMPLE_TRANSCRIPT: TranscriptSegment[] = [
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
  {
    id: 'seg_003',
    speaker: 'Pilot',
    text: 'Climbing, Roger',
    timestamp: 2000,
  },
  {
    id: 'seg_004',
    speaker: 'TCAS',
    text: 'Clear of conflict',
    timestamp: 3000,
  },
  {
    id: 'seg_005',
    speaker: 'ATC',
    text: 'Moonflower 737, turn right heading 150',
    timestamp: 5000,
  },
  {
    id: 'seg_006',
    speaker: 'Pilot',
    text: 'Turn right heading 150, Moonflower 737',
    timestamp: 5500,
  },
  {
    id: 'seg_007',
    speaker: 'ATC',
    text: 'Descend and go check',
    timestamp: 6000,
  },
  {
    id: 'seg_008',
    speaker: 'ATC',
    text: 'Do you have a traffic light?',
    timestamp: 7000,
  },
  {
    id: 'seg_009',
    speaker: 'Pilot',
    text: 'Negative, no traffic in sight',
    timestamp: 7500,
  },
  {
    id: 'seg_010',
    speaker: 'System',
    text: 'Engine seems to be OK actually',
    timestamp: 10000,
  },
  {
    id: 'seg_011',
    speaker: 'System',
    text: 'EEC operates in the alternate control mode',
    timestamp: 10500,
  },
  {
    id: 'seg_012',
    speaker: 'System',
    text: 'Autothrottle, if engaged, disengage',
    timestamp: 11000,
  },
  {
    id: 'seg_013',
    speaker: 'Pilot',
    text: 'Autothrottle disengaged, running emergency checklist',
    timestamp: 11500,
  },
  {
    id: 'seg_014',
    speaker: 'ATC',
    text: 'Cleared for ILS approach runway 27',
    timestamp: 15000,
  },
  {
    id: 'seg_015',
    speaker: 'Pilot',
    text: 'Cleared ILS 27, Moonflower 737',
    timestamp: 15500,
  },
  {
    id: 'seg_016',
    speaker: 'ATC',
    text: 'Contact tower on 118.3',
    timestamp: 16000,
  },
  {
    id: 'seg_017',
    speaker: 'Pilot',
    text: 'Tower 118.3, good day',
    timestamp: 16500,
  },
  {
    id: 'seg_018',
    speaker: 'Tower',
    text: 'Wind 280 at 15, runway 27, cleared to land',
    timestamp: 18000,
  },
  {
    id: 'seg_019',
    speaker: 'Pilot',
    text: 'Cleared to land runway 27, Moonflower 737',
    timestamp: 18500,
  },
  {
    id: 'seg_020',
    speaker: 'TCAS',
    text: 'Traffic twelve o\'clock, 2 miles',
    timestamp: 20000,
  },
  {
    id: 'seg_021',
    speaker: 'Pilot',
    text: 'Traffic in sight',
    timestamp: 20500,
  },
  {
    id: 'seg_022',
    speaker: 'System',
    text: 'Master caution - hydraulic pressure low',
    timestamp: 25000,
  },
  {
    id: 'seg_023',
    speaker: 'Pilot',
    text: 'Hydraulic failure, requesting emergency landing',
    timestamp: 25500,
  },
  {
    id: 'seg_024',
    speaker: 'ATC',
    text: 'Roger, emergency declared, all traffic clear',
    timestamp: 26000,
  },
  {
    id: 'seg_025',
    speaker: 'Pilot',
    text: 'Roger, continuing approach',
    timestamp: 26500,
  },
  {
    id: 'seg_026',
    speaker: 'ATC',
    text: 'Say again your intentions',
    timestamp: 27000,
  },
  {
    id: 'seg_027',
    speaker: 'Pilot',
    text: 'Request vectors for final approach',
    timestamp: 27500,
  },
  {
    id: 'seg_028',
    speaker: 'ATC',
    text: 'Affirmative, turn left heading 090',
    timestamp: 28000,
  },
  {
    id: 'seg_029',
    speaker: 'Pilot',
    text: 'Left heading 090, wilco',
    timestamp: 28500,
  },
];

/**
 * Run event detection tests
 */
function runTests(): void {
  console.log('🧪 Testing EventDetector with sample transcript data\n');
  console.log('=' .repeat(70));
  
  // Test with debug enabled
  const detector = new EventDetector({
    debug: false,  // Disable verbose debug for cleaner output
    enableFuzzyMatching: true,
    contextWindowSize: 1,  // Reduce context window to prevent keyword bleeding
    minConfidence: 0.6,
  });

  console.log(`\n📝 Processing ${SAMPLE_TRANSCRIPT.length} transcript segments...\n`);
  
  const events = detector.detectEvents(SAMPLE_TRANSCRIPT);

  console.log('\n' + '='.repeat(70));
  console.log('\n📊 RESULTS SUMMARY\n');
  console.log('='.repeat(70));
  
  // Count events by type
  const tcasEvents = detector.getEventsByType('tcas');
  const crmEvents = detector.getEventsByType('crm');
  const systemFailureEvents = detector.getEventsByType('system_failure');
  const weatherEvents = detector.getEventsByType('weather');
  const navEvents = detector.getEventsByType('navigation');

  console.log(`\n✓ Total Events Detected: ${events.length}`);
  console.log(`  - TCAS Events: ${tcasEvents.length}`);
  console.log(`  - CRM Moments: ${crmEvents.length}`);
  console.log(`  - System Failures: ${systemFailureEvents.length}`);
  console.log(`  - Weather Events: ${weatherEvents.length}`);
  console.log(`  - Navigation Events: ${navEvents.length}`);

  // Detailed event listing
  console.log('\n' + '='.repeat(70));
  console.log('\n📋 DETAILED EVENT LIST\n');
  console.log('='.repeat(70));

  events.forEach((event, index) => {
    console.log(`\n${index + 1}. ${event.type.name} (${event.type.category})`);
    console.log(`   Segment: ${event.segmentId}`);
    console.log(`   Text: "${event.text}"`);
    console.log(`   Confidence: ${(event.confidence * 100).toFixed(1)}%`);
    console.log(`   Keywords: ${event.matchedKeywords.join(', ') || 'none'}`);
    console.log(`   Patterns: ${event.matchedPatterns.length} matched`);
  });

  // Validation against acceptance criteria
  console.log('\n' + '='.repeat(70));
  console.log('\n✅ ACCEPTANCE CRITERIA VALIDATION\n');
  console.log('='.repeat(70));

  const tcasTarget = 5;
  const crmTarget = 10;
  const systemTarget = 1;

  console.log(`\n[${tcasEvents.length >= tcasTarget ? '✓' : '✗'}] TCAS Events: ${tcasEvents.length} (target: ${tcasTarget}+)`);
  console.log(`[${crmEvents.length >= crmTarget ? '✓' : '✗'}] CRM Moments: ${crmEvents.length} (target: ${crmTarget}+)`);
  console.log(`[${systemFailureEvents.length >= systemTarget ? '✓' : '✗'}] System Failures: ${systemFailureEvents.length} (target: ${systemTarget}+)`);

  const allPassed = tcasEvents.length >= tcasTarget && 
                    crmEvents.length >= crmTarget && 
                    systemFailureEvents.length >= systemTarget;

  if (allPassed) {
    console.log('\n🎉 All acceptance criteria PASSED!');
  } else {
    console.log('\n⚠️  Some acceptance criteria not met.');
  }

  console.log('\n' + '='.repeat(70));
}

// Run tests if executed directly
if (require.main === module) {
  runTests();
}

export { runTests, SAMPLE_TRANSCRIPT };
