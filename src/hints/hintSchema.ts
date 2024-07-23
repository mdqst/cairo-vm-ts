import { z } from 'zod';

import { allocSegmentParser } from './allocSegment';
import { testLessThanParser } from './math/testLessThan';
import { allocFelt252DictParser } from './dict/allocFelt252Dict';
import { getSegmentArenaIndexParser } from './dict/getSegmentArenaIndex';
import { felt252DictEntryInitParser } from './dict/felt252DictEntryInit';
import { felt252DictEntryUpdateParser } from './dict/felt252DictEntryUpdate';
import { initSquashDataParser } from './dict/initSquashData';
import { getCurrentAccessIndexParser } from './dict/getCurrentAccessIndex';
import { shouldSkipSquashLoopParser } from './dict/shouldSkipSquashLoop';
import { getCurrentAccessDeltaParser } from './dict/getCurrentAccessDelta';
import { shouldContinueSquashLoopParser } from './dict/shouldContinueSquashLoop';
import { getNextDictKeyParser } from './dict/getNextDictKey';
import { assertLeIsFirstArcExcludedParser } from './assertLeIsFirstArcExcluded';
import { assertLeFindSmallArcsParser } from './assertLeFindSmallArc';
import { assertLeIsSecondArcExcludedParser } from './assertLeIsSecondArcExcluded';

/** Zod object to parse any implemented hints */
const hint = z.union([
  allocSegmentParser,
  testLessThanParser,
  allocFelt252DictParser,
  getSegmentArenaIndexParser,
  felt252DictEntryInitParser,
  felt252DictEntryUpdateParser,
  initSquashDataParser,
  getCurrentAccessIndexParser,
  shouldSkipSquashLoopParser,
  getCurrentAccessDeltaParser,
  shouldContinueSquashLoopParser,
  getNextDictKeyParser,
  assertLeFindSmallArcsParser,
  assertLeIsFirstArcExcludedParser,
  assertLeIsSecondArcExcludedParser,
]);

/** Zod object to parse an array of hints grouped on a given PC */
export const hintsGroup = z.tuple([z.number(), z.array(hint)]);

/** Zod object to parse an array of grouped hints */
export const hints = z
  .array(hintsGroup)
  .transform((hints) => new Map<number, Hint[]>(hints));

/** Union of all the implemented hints */
export type Hint = z.infer<typeof hint>;

/**
 * Tuple representing hints grouped at a PC offset
 *
 * - Format: `[PC.offset, Hint[]]`
 * - Example: `[5, [AllocSegment, TestLessThan]]`
 */
export type HintsGroup = z.infer<typeof hintsGroup>;

/** Array of HintsGroup
 *
 * Example: `[[2, TestLessThan], [5, AllocSegment, TestLessTha]]`
 */
export type Hints = z.infer<typeof hints>;
