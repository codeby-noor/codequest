/**
 * World 02 — The Logic Forest
 * Problem-Solving & Algorithmic Thinking in JavaScript (15 Missions)
 *
 * A progressive computational thinking journey:
 * 01. The Forest Gate: Algorithmic Thinking & Decomposition
 * 02. The Watcher's Eyes: Boolean Logic & Conditions
 * 03. The Hidden Number: Number Reasoning & Divisibility
 * 04. The Path Split: Guard Clauses & Branch Selection
 * 05. The Forest Counter: Accumulators & Count Patterns
 * 06. The Treasure Search: Linear Search & Early Exit
 * 07. The Duplicate Goblins: Sets & Duplicate Detection
 * 08. The Sorting Grounds: Custom Comparators & Ordering
 * 09. The Filtered Trail: Collection Filtering & Predicates
 * 10. The Transformation Grove: Array Mapping & Mutation-Free Projection
 * 11. The Score Keeper: Aggregation & Reduce
 * 12. The Nested Maze: Deep Traversal in Hierarchical Data
 * 13. The Efficiency Trial: Fast Lookups & Big-O Intuition
 * 14. The Algorithm Forge: Multi-step Data Pipeline
 * 15. The Forest Guardian: Final Boss Battle
 */

export const logicForestLessons = [
  // -------------------------------------------------------------
  // Mission 01: The Forest Gate
  // -------------------------------------------------------------
  {
    id: "forest-01",
    number: "01",
    title: "The Forest Gate: Algorithmic Thinking",
    world: "logic-forest",
    type: "lesson",
    xp: 150,
    skillId: "algorithmic-thinking",
    skillProgress: 7,
    difficulty: "Beginner",
    estimatedTime: 6,
    description: "Decompose a computational problem into inputs, processing steps, and validated outputs.",
    concepts: ["problem decomposition", "inputs and outputs", "step-by-step logic", "algorithmic thinking"],
    content: [
      {
        type: "paragraph",
        text: "🌲 Before you stands the towering Forest Gate of Eldoria. Ancient glyphs demand a precise energy calculation before granting entry. In computer science, an algorithm is a clear, step-by-step sequence of instructions designed to solve a specific problem.",
      },
      {
        type: "heading",
        text: "The Three Pillars of an Algorithm",
      },
      {
        type: "paragraph",
        text: "1. **Inputs**: What raw data does the algorithm receive?\n2. **Processing**: What mathematical or logical operations transform that data?\n3. **Outputs**: What clean result is returned to the caller?",
      },
      {
        type: "code",
        code: `function calculateTravelTime(distance, speed) {
  // Input validation
  if (distance <= 0 || speed <= 0) return 0;
  // Processing
  const time = distance / speed;
  // Output
  return Math.round(time);
}`,
      },
      {
        type: "tip",
        text: "Always validate incoming arguments early before executing mathematical operations.",
      },
    ],
    challenge: {
      id: "challenge-f01",
      lessonId: "forest-01",
      title: "The Forest Gate: Algorithmic Thinking",
      prompt:
        "Write a function `calculateGateEnergy(partySize, baseCost, weatherMultiplier)` that calculates `partySize * baseCost * weatherMultiplier`. If `partySize <= 0` or `baseCost <= 0` or `weatherMultiplier <= 0`, return `0`.",
      starterCode: `function calculateGateEnergy(partySize, baseCost, weatherMultiplier) {
  // Validate inputs and calculate required gate energy:

}`,
      tests: [
        {
          type: "function",
          functionName: "calculateGateEnergy",
          args: [4, 25, 1.5],
          expected: 150,
          message: "calculateGateEnergy(4, 25, 1.5) should return 150.",
        },
        {
          type: "function",
          functionName: "calculateGateEnergy",
          args: [2, 50, 1.0],
          expected: 100,
          message: "calculateGateEnergy(2, 50, 1.0) should return 100.",
        },
        {
          type: "function",
          functionName: "calculateGateEnergy",
          args: [0, 25, 1.5],
          expected: 0,
          message: "calculateGateEnergy(0, 25, 1.5) with 0 party size should return 0.",
        },
        {
          type: "function",
          functionName: "calculateGateEnergy",
          args: [3, -10, 1.2],
          expected: 0,
          message: "calculateGateEnergy(3, -10, 1.2) with negative cost should return 0.",
        },
      ],
      hints: [
        "Check if `partySize <= 0 || baseCost <= 0 || weatherMultiplier <= 0` first and return 0.",
        "Otherwise, return `partySize * baseCost * weatherMultiplier`.",
      ],
      solution: `function calculateGateEnergy(partySize, baseCost, weatherMultiplier) {
  if (partySize <= 0 || baseCost <= 0 || weatherMultiplier <= 0) {
    return 0;
  }
  return partySize * baseCost * weatherMultiplier;
}`,
      solutionExplanation:
        "First we validate that all dimensions are positive numbers. If valid, we multiply the three factors to produce the exact energy requirement.",
      requirements: [
        { id: "req-f01-01", label: "Validates positive inputs", type: "function", target: "calculateGateEnergy", expected: 0 },
        { id: "req-f01-02", label: "Computes partySize * baseCost * weatherMultiplier", type: "function", target: "calculateGateEnergy", expected: 150 },
      ],
    },
  },

  // -------------------------------------------------------------
  // Mission 02: The Watcher's Eyes
  // -------------------------------------------------------------
  {
    id: "forest-02",
    number: "02",
    title: "The Watcher's Eyes: Boolean Logic",
    world: "logic-forest",
    type: "lesson",
    xp: 160,
    skillId: "boolean-logic",
    skillProgress: 7,
    difficulty: "Beginner",
    estimatedTime: 6,
    description: "Master multi-condition truth reasoning using logical operators &&, ||, and !.",
    concepts: ["&& (AND)", "|| (OR)", "! (NOT)", "truth tables", "multi-condition logic"],
    content: [
      {
        type: "paragraph",
        text: "🦉 Golden Watchers roost in the glowing branches. They evaluate complex security conditions to determine who may enter restricted forest zones.",
      },
      {
        type: "heading",
        text: "Combining Logical Conditions",
      },
      {
        type: "paragraph",
        text: "Logical operators can be grouped with parentheses `(...)` to enforce precedence: `&&` takes precedence over `||`, but parentheses make the evaluation order explicit and readable.",
      },
      {
        type: "code",
        code: `const canPassBridge = isKing || (hasTicket && !isBanned);`,
      },
      {
        type: "tip",
        text: "Group related conditions inside parentheses so your logic is bulletproof and unambiguous.",
      },
    ],
    challenge: {
      id: "challenge-f02",
      lessonId: "forest-02",
      title: "The Watcher's Eyes: Boolean Logic",
      prompt:
        "Write a function `canEnterZone(hasPass, isNight, isVIP, stealthLevel)` that returns `true` if:\n1. `isVIP` is true, OR\n2. The adventurer has `hasPass` AND (`isNight` is false OR `stealthLevel >= 75`).\nOtherwise, return `false`.",
      starterCode: `function canEnterZone(hasPass, isNight, isVIP, stealthLevel) {
  // Return boolean determining entry permission:

}`,
      tests: [
        {
          type: "function",
          functionName: "canEnterZone",
          args: [false, true, true, 10],
          expected: true,
          message: "VIPs should always be granted entry.",
        },
        {
          type: "function",
          functionName: "canEnterZone",
          args: [true, false, false, 20],
          expected: true,
          message: "Adventurer with pass during daylight should enter.",
        },
        {
          type: "function",
          functionName: "canEnterZone",
          args: [true, true, false, 80],
          expected: true,
          message: "Adventurer with pass at night with high stealth (>= 75) should enter.",
        },
        {
          type: "function",
          functionName: "canEnterZone",
          args: [true, true, false, 50],
          expected: false,
          message: "Adventurer with pass at night with low stealth (< 75) should be rejected.",
        },
        {
          type: "function",
          functionName: "canEnterZone",
          args: [false, false, false, 99],
          expected: false,
          message: "Adventurer without pass or VIP status should be rejected.",
        },
      ],
      hints: [
        "If `isVIP` is true, immediately return `true`.",
        "Check if `hasPass` is true and either `!isNight` or `stealthLevel >= 75`.",
        "Combine: `return isVIP || (hasPass && (!isNight || stealthLevel >= 75));`",
      ],
      solution: `function canEnterZone(hasPass, isNight, isVIP, stealthLevel) {
  if (isVIP) return true;
  return Boolean(hasPass && (!isNight || stealthLevel >= 75));
}`,
      solutionExplanation:
        "The expression checks if the traveler is a VIP first. If not, they must possess a pass and either enter by daylight or possess at least 75 stealth points.",
      requirements: [
        { id: "req-f02-01", label: "Grants entry to VIPs", type: "function", target: "canEnterZone", expected: true },
        { id: "req-f02-02", label: "Evaluates day/night and stealth conditions accurately", type: "function", target: "canEnterZone", expected: true },
      ],
    },
  },

  // -------------------------------------------------------------
  // Mission 03: The Hidden Number
  // -------------------------------------------------------------
  {
    id: "forest-03",
    number: "03",
    title: "The Hidden Number: Number Reasoning",
    world: "logic-forest",
    type: "lesson",
    xp: 170,
    skillId: "algorithmic-thinking",
    skillProgress: 7,
    difficulty: "Beginner",
    estimatedTime: 6,
    description: "Classify numbers by divisibility, parity, and mathematical boundaries.",
    concepts: ["even/odd", "modulo arithmetic", "divisibility", "classification"],
    content: [
      {
        type: "paragraph",
        text: "✨ Mystic runes inscribed on mossy boulders glow when energized by specific numeric frequencies. To read them, you must test numbers for divisibility using the modulo operator `%`.",
      },
      {
        type: "heading",
        text: "Checking Divisibility",
      },
      {
        type: "paragraph",
        text: "`number % divisor === 0` evaluates to true whenever `number` is evenly divisible by `divisor` with zero remainder.",
      },
      {
        type: "code",
        code: `const isEven = num % 2 === 0;
const isDivisibleByThree = num % 3 === 0;
const isDivisibleByBoth = num % 3 === 0 && num % 5 === 0;`,
      },
      {
        type: "tip",
        text: "Always check the most specific condition (e.g. divisible by BOTH 3 and 5) before checking individual divisors.",
      },
    ],
    challenge: {
      id: "challenge-f03",
      lessonId: "forest-03",
      title: "The Hidden Number: Number Reasoning",
      prompt:
        'Write a function `classifyRune(num)` that classifies a positive integer `num`:\n- Return `"Invalid"` if `num <= 0` or not a number\n- Return `"Ancient Prime"` if `num` is divisible by both 3 and 5\n- Return `"Sun Rune"` if `num` is divisible by 3 (and not 5)\n- Return `"Moon Rune"` if `num` is divisible by 5 (and not 3)\n- Return `"Faded Stone"` if divisible by neither.',
      starterCode: `function classifyRune(num) {
  // Classify num based on divisibility:

}`,
      tests: [
        {
          type: "function",
          functionName: "classifyRune",
          args: [15],
          expected: "Ancient Prime",
          message: 'classifyRune(15) should return "Ancient Prime".',
        },
        {
          type: "function",
          functionName: "classifyRune",
          args: [9],
          expected: "Sun Rune",
          message: 'classifyRune(9) should return "Sun Rune".',
        },
        {
          type: "function",
          functionName: "classifyRune",
          args: [20],
          expected: "Moon Rune",
          message: 'classifyRune(20) should return "Moon Rune".',
        },
        {
          type: "function",
          functionName: "classifyRune",
          args: [7],
          expected: "Faded Stone",
          message: 'classifyRune(7) should return "Faded Stone".',
        },
        {
          type: "function",
          functionName: "classifyRune",
          args: [0],
          expected: "Invalid",
          message: 'classifyRune(0) should return "Invalid".',
        },
        {
          type: "function",
          functionName: "classifyRune",
          args: [-5],
          expected: "Invalid",
          message: 'classifyRune(-5) should return "Invalid".',
        },
      ],
      hints: [
        'Check `if (typeof num !== "number" || num <= 0) return "Invalid";`',
        'Check `if (num % 3 === 0 && num % 5 === 0) return "Ancient Prime";` first.',
        'Then check `num % 3 === 0` and `num % 5 === 0` sequentially.',
      ],
      solution: `function classifyRune(num) {
  if (typeof num !== "number" || num <= 0) {
    return "Invalid";
  }
  if (num % 3 === 0 && num % 5 === 0) {
    return "Ancient Prime";
  }
  if (num % 3 === 0) {
    return "Sun Rune";
  }
  if (num % 5 === 0) {
    return "Moon Rune";
  }
  return "Faded Stone";
}`,
      solutionExplanation:
        "By placing the compound check `num % 15 === 0` first, we ensure that numbers divisible by both 3 and 5 are identified before single-divisor branches execute.",
      requirements: [
        { id: "req-f03-01", label: 'Identifies "Ancient Prime" (divisible by 3 and 5)', type: "function", target: "classifyRune", expected: "Ancient Prime" },
        { id: "req-f03-02", label: 'Returns "Invalid" for non-positive inputs', type: "function", target: "classifyRune", expected: "Invalid" },
      ],
    },
  },

  // -------------------------------------------------------------
  // Mission 04: The Path Split
  // -------------------------------------------------------------
  {
    id: "forest-04",
    number: "04",
    title: "The Path Split: Guard Clauses & Branching",
    world: "logic-forest",
    type: "lesson",
    xp: 170,
    skillId: "algorithmic-thinking",
    skillProgress: 7,
    difficulty: "Intermediate",
    estimatedTime: 7,
    description: "Structure complex decision trees cleanly using guard clauses and early returns.",
    concepts: ["guard clauses", "decision trees", "early return", "boundary checking"],
    content: [
      {
        type: "paragraph",
        text: "🌫️ At the Crossroads of Mist, multiple routes wind through the terrain. Professional software engineers use **guard clauses** (early returns) to exit immediately when edge conditions fail, avoiding deeply nested code.",
      },
      {
        type: "heading",
        text: "The Power of Guard Clauses",
      },
      {
        type: "code",
        code: `function processOrder(user, balance) {
  // Guard clauses handle error cases first
  if (!user) return "No user found";
  if (balance <= 0) return "Insufficient funds";

  // Core business logic stays clean and un-nested
  return "Order approved";
}`,
      },
      {
        type: "tip",
        text: "Guard clauses flatten nested `if/else` ladders into readable linear code.",
      },
    ],
    challenge: {
      id: "challenge-f04",
      lessonId: "forest-04",
      title: "The Path Split: Guard Clauses & Branching",
      prompt:
        'Write a function `selectRoute(elevation, stamina, hasClimbingGear)`:\n- If `stamina <= 0`, return `"Exhausted - Cannot Proceed"` immediately.\n- If `elevation >= 2000`: return `"High Peak Route"` if `hasClimbingGear && stamina >= 50`, else return `"Mountain Base Route"`.\n- If `elevation >= 1000`: return `"Forest Canopy Route"` if `stamina >= 30`, else return `"Valley Path Route"`.\n- If `elevation < 1000`: return `"River Bank Route"`.',
      starterCode: `function selectRoute(elevation, stamina, hasClimbingGear) {
  // Apply guard clause and select route:

}`,
      tests: [
        {
          type: "function",
          functionName: "selectRoute",
          args: [2500, 0, true],
          expected: "Exhausted - Cannot Proceed",
          message: 'Zero stamina should trigger "Exhausted - Cannot Proceed".',
        },
        {
          type: "function",
          functionName: "selectRoute",
          args: [2200, 60, true],
          expected: "High Peak Route",
          message: 'Elevation >= 2000 with gear and high stamina should return "High Peak Route".',
        },
        {
          type: "function",
          functionName: "selectRoute",
          args: [2200, 60, false],
          expected: "Mountain Base Route",
          message: 'Elevation >= 2000 without gear should fallback to "Mountain Base Route".',
        },
        {
          type: "function",
          functionName: "selectRoute",
          args: [1500, 40, false],
          expected: "Forest Canopy Route",
          message: 'Elevation >= 1000 with stamina >= 30 should return "Forest Canopy Route".',
        },
        {
          type: "function",
          functionName: "selectRoute",
          args: [1500, 20, false],
          expected: "Valley Path Route",
          message: 'Elevation >= 1000 with low stamina should return "Valley Path Route".',
        },
        {
          type: "function",
          functionName: "selectRoute",
          args: [500, 100, true],
          expected: "River Bank Route",
          message: 'Elevation < 1000 should return "River Bank Route".',
        },
      ],
      hints: [
        'Check `if (stamina <= 0) return "Exhausted - Cannot Proceed";` at the top.',
        'Use `if (elevation >= 2000)` and return either "High Peak Route" or "Mountain Base Route".',
        'Handle `elevation >= 1000` and finish with `return "River Bank Route";`.',
      ],
      solution: `function selectRoute(elevation, stamina, hasClimbingGear) {
  if (stamina <= 0) {
    return "Exhausted - Cannot Proceed";
  }
  if (elevation >= 2000) {
    return hasClimbingGear && stamina >= 50 ? "High Peak Route" : "Mountain Base Route";
  }
  if (elevation >= 1000) {
    return stamina >= 30 ? "Forest Canopy Route" : "Valley Path Route";
  }
  return "River Bank Route";
}`,
      solutionExplanation:
        "The initial guard clause checks stamina. Subsequent branches evaluate descending elevation bands to pick the best route.",
      requirements: [
        { id: "req-f04-01", label: 'Handles exhaustion guard clause', type: "function", target: "selectRoute", expected: "Exhausted - Cannot Proceed" },
        { id: "req-f04-02", label: 'Resolves all elevation and stamina branches', type: "function", target: "selectRoute", expected: "High Peak Route" },
      ],
    },
  },

  // -------------------------------------------------------------
  // Mission 05: The Forest Counter
  // -------------------------------------------------------------
  {
    id: "forest-05",
    number: "05",
    title: "The Forest Counter: Counting & Accumulators",
    world: "logic-forest",
    type: "lesson",
    xp: 180,
    skillId: "algorithmic-thinking",
    skillProgress: 7,
    difficulty: "Intermediate",
    estimatedTime: 7,
    description: "Iterate over collections and accumulate matching occurrences.",
    concepts: ["counters", "accumulators", "threshold counting", "array iteration"],
    content: [
      {
        type: "paragraph",
        text: "🌿 The Forest Ranger needs to survey native species across vast groves. Counting specific targets inside an array is one of the most foundational algorithmic patterns in programming.",
      },
      {
        type: "heading",
        text: "The Accumulator Pattern",
      },
      {
        type: "code",
        code: `function countTarget(array, target) {
  let counter = 0;
  for (const item of array) {
    if (item === target) {
      counter++;
    }
  }
  return counter;
}`,
      },
      {
        type: "tip",
        text: "Always initialize your accumulator variable (e.g. `let count = 0;`) before entering the loop.",
      },
    ],
    challenge: {
      id: "challenge-f05",
      lessonId: "forest-05",
      title: "The Forest Counter: Counting & Accumulators",
      prompt:
        "Write a function `countOccurrences(items, targetItem)` that returns the total count of times `targetItem` appears in `items`. If `items` is empty or not an array, return `0`.",
      starterCode: `function countOccurrences(items, targetItem) {
  // Count matches in the items array:

}`,
      tests: [
        {
          type: "function",
          functionName: "countOccurrences",
          args: [["fern", "oak", "fern", "pine", "fern"], "fern"],
          expected: 3,
          message: "Should count 3 occurrences of 'fern'.",
        },
        {
          type: "function",
          functionName: "countOccurrences",
          args: [[10, 20, 30, 20, 20], 20],
          expected: 3,
          message: "Should count 3 occurrences of number 20.",
        },
        {
          type: "function",
          functionName: "countOccurrences",
          args: [["ruby", "emerald"], "diamond"],
          expected: 0,
          message: "Should return 0 when target is not present.",
        },
        {
          type: "function",
          functionName: "countOccurrences",
          args: [[], "gold"],
          expected: 0,
          message: "Should return 0 for empty array.",
        },
      ],
      hints: [
        "Check `if (!Array.isArray(items)) return 0;`",
        "Use a `for (let i = 0; i < items.length; i++)` or `for (const item of items)` loop.",
        "Increment a `count` variable whenever `item === targetItem`.",
      ],
      solution: `function countOccurrences(items, targetItem) {
  if (!Array.isArray(items)) return 0;
  let count = 0;
  for (const item of items) {
    if (item === targetItem) {
      count++;
    }
  }
  return count;
}`,
      solutionExplanation:
        "We iterate over each element in the array and increment our counter whenever the element matches targetItem.",
      requirements: [
        { id: "req-f05-01", label: "Counts matching occurrences in array", type: "function", target: "countOccurrences", expected: 3 },
      ],
    },
  },

  // -------------------------------------------------------------
  // Mission 06: The Treasure Search
  // -------------------------------------------------------------
  {
    id: "forest-06",
    number: "06",
    title: "The Treasure Search: Linear Search & Early Exit",
    world: "logic-forest",
    type: "lesson",
    xp: 180,
    skillId: "searching",
    skillProgress: 7,
    difficulty: "Intermediate",
    estimatedTime: 7,
    description: "Scan lists sequentially, track indexes, and exit immediately upon finding targets.",
    concepts: ["linear search", "early exit", "indexOf logic", "position tracking"],
    content: [
      {
        type: "paragraph",
        text: "🗝️ Hidden among the ancient tree roots are numbered chests. When performing a Linear Search, checking items one-by-one and returning immediately on discovery is an essential algorithmic optimization called **Early Exit**.",
      },
      {
        type: "heading",
        text: "Linear Search with Early Exit",
      },
      {
        type: "code",
        code: `function findItemIndex(list, target) {
  for (let i = 0; i < list.length; i++) {
    if (list[i] === target) {
      return i; // Early exit as soon as found!
    }
  }
  return -1; // Exhausted entire list without finding
}`,
      },
      {
        type: "tip",
        text: "Returning immediately on match saves unnecessary iterations through the rest of the array.",
      },
    ],
    challenge: {
      id: "challenge-f06",
      lessonId: "forest-06",
      title: "The Treasure Search: Linear Search & Early Exit",
      prompt:
        "Write a function `findTreasureIndex(chests, targetRelic)` that iterates through `chests` and returns the 0-based index of `targetRelic`. If found, return its index immediately. If not found, return `-1`.",
      starterCode: `function findTreasureIndex(chests, targetRelic) {
  // Search chests for targetRelic:

}`,
      tests: [
        {
          type: "function",
          functionName: "findTreasureIndex",
          args: [["iron key", "wood staff", "emerald orb", "shield"], "emerald orb"],
          expected: 2,
          message: "Should find 'emerald orb' at index 2.",
        },
        {
          type: "function",
          functionName: "findTreasureIndex",
          args: [["ruby crown", "potion"], "ruby crown"],
          expected: 0,
          message: "Should find first item at index 0.",
        },
        {
          type: "function",
          functionName: "findTreasureIndex",
          args: [["potion", "bandage", "rope"], "dragon egg"],
          expected: -1,
          message: "Should return -1 when item is missing.",
        },
        {
          type: "function",
          functionName: "findTreasureIndex",
          args: [[], "relic"],
          expected: -1,
          message: "Should return -1 for empty list.",
        },
      ],
      hints: [
        "Loop from `i = 0` to `i < chests.length`.",
        "Check `if (chests[i] === targetRelic) return i;`",
        "After the loop ends, return `-1`.",
      ],
      solution: `function findTreasureIndex(chests, targetRelic) {
  if (!Array.isArray(chests)) return -1;
  for (let i = 0; i < chests.length; i++) {
    if (chests[i] === targetRelic) {
      return i;
    }
  }
  return -1;
}`,
      solutionExplanation:
        "We inspect each index in sequence. When chests[i] matches targetRelic, we return the index immediately. If no element matches after inspecting every chest, we return -1.",
      requirements: [
        { id: "req-f06-01", label: "Returns correct index of target", type: "function", target: "findTreasureIndex", expected: 2 },
        { id: "req-f06-02", label: "Returns -1 when target not found", type: "function", target: "findTreasureIndex", expected: -1 },
      ],
    },
  },

  // -------------------------------------------------------------
  // Mission 07: The Duplicate Goblins
  // -------------------------------------------------------------
  {
    id: "forest-07",
    number: "07",
    title: "The Duplicate Goblins: Sets & Uniqueness",
    world: "logic-forest",
    type: "lesson",
    xp: 190,
    skillId: "uniqueness-sets",
    skillProgress: 7,
    difficulty: "Intermediate",
    estimatedTime: 8,
    description: "Detect duplicate values and manage unique item collections using Sets.",
    concepts: ["Set", "uniqueness", "lookup sets", "duplicate filtering"],
    content: [
      {
        type: "paragraph",
        text: "👺 Forest goblins cast mirror illusions to replicate supplies. To identify fake clones, you need to track which values have already been seen using JavaScript's built-in `Set` data structure.",
      },
      {
        type: "heading",
        text: "Working with Sets",
      },
      {
        type: "paragraph",
        text: "A `Set` is a collection of unique values. Checking `set.has(item)` and adding with `set.add(item)` is lightning fast.",
      },
      {
        type: "code",
        code: `const seen = new Set();
seen.add("sword");
console.log(seen.has("sword")); // true
console.log(seen.has("bow"));   // false`,
      },
      {
        type: "tip",
        text: "Sets only store each unique item once. Converting `new Set([1, 1, 2])` automatically strips duplicates.",
      },
    ],
    challenge: {
      id: "challenge-f07",
      lessonId: "forest-07",
      title: "The Duplicate Goblins: Sets & Uniqueness",
      prompt:
        "Write a function `findDuplicates(items)` that takes an array of items and returns an array containing only the items that appear more than once (each duplicate item should appear in the returned array only once).",
      starterCode: `function findDuplicates(items) {
  // Return array of duplicated items:

}`,
      tests: [
        {
          type: "function",
          functionName: "findDuplicates",
          args: [[1, 2, 2, 3, 4, 4, 5]],
          expected: [2, 4],
          message: "Should detect duplicate numbers [2, 4].",
        },
        {
          type: "function",
          functionName: "findDuplicates",
          args: [["axe", "bow", "axe", "shield", "bow"]],
          expected: ["axe", "bow"],
          message: "Should detect duplicate strings ['axe', 'bow'].",
        },
        {
          type: "function",
          functionName: "findDuplicates",
          args: [["a", "b", "c"]],
          expected: [],
          message: "Should return empty array when no duplicates exist.",
        },
        {
          type: "function",
          functionName: "findDuplicates",
          args: [[]],
          expected: [],
          message: "Should handle empty array gracefully.",
        },
      ],
      hints: [
        "Create two Sets: `const seen = new Set();` and `const duplicates = new Set();`",
        "Iterate through `items`. If `seen.has(item)`, add it to `duplicates`. Otherwise, add it to `seen`.",
        "Return `Array.from(duplicates)` or `[...duplicates]`.",
      ],
      solution: `function findDuplicates(items) {
  if (!Array.isArray(items)) return [];
  const seen = new Set();
  const duplicates = new Set();

  for (const item of items) {
    if (seen.has(item)) {
      duplicates.add(item);
    } else {
      seen.add(item);
    }
  }

  return Array.from(duplicates);
}`,
      solutionExplanation:
        "As we loop through the array, if an item is already present in our `seen` set, it's a duplicate and added to the `duplicates` set. Converting the `duplicates` set to an array yields the distinct duplicated elements.",
      requirements: [
        { id: "req-f07-01", label: "Identifies duplicate elements without repetition", type: "function", target: "findDuplicates", expected: [2, 4] },
      ],
    },
  },

  // -------------------------------------------------------------
  // Mission 08: The Sorting Grounds
  // -------------------------------------------------------------
  {
    id: "forest-08",
    number: "08",
    title: "The Sorting Grounds: Comparators & Ordering",
    world: "logic-forest",
    type: "lesson",
    xp: 200,
    skillId: "algorithmic-thinking",
    skillProgress: 7,
    difficulty: "Intermediate",
    estimatedTime: 8,
    description: "Sort numeric and object collections using custom comparator functions without mutating source data.",
    concepts: [".sort()", "custom comparators", "ascending vs descending", "numeric sorting"],
    content: [
      {
        type: "paragraph",
        text: "⚔️ In the Forest Arena, champions are ranked by score. By default, JavaScript's `.sort()` converts elements to strings, meaning `100` is placed before `25` alphabetically! To sort numbers correctly, you must supply a comparator function.",
      },
      {
        type: "heading",
        text: "Custom Comparator Functions",
      },
      {
        type: "code",
        code: `// Ascending order (lowest to highest)
numbers.sort((a, b) => a - b);

// Descending order (highest to lowest)
numbers.sort((a, b) => b - a);`,
      },
      {
        type: "tip",
        text: "Always copy the array with `[...array]` or `array.slice()` before sorting so you don't accidentally mutate the original data!",
      },
    ],
    challenge: {
      id: "challenge-f08",
      lessonId: "forest-08",
      title: "The Sorting Grounds: Comparators & Ordering",
      prompt:
        'Write a function `sortChampions(champions, order)` where `champions` is an array of objects `{ name, score }`:\n- If `order === "asc"`, return a new array sorted by `score` in ascending order.\n- If `order === "desc"`, return a new array sorted by `score` in descending order.\n- Do NOT mutate the original input array.',
      starterCode: `function sortChampions(champions, order) {
  // Return non-mutated sorted array of champions:

}`,
      tests: [
        {
          type: "function",
          functionName: "sortChampions",
          args: [
            [
              { name: "Aria", score: 85 },
              { name: "Rowan", score: 95 },
              { name: "Kael", score: 70 },
            ],
            "desc",
          ],
          expected: [
            { name: "Rowan", score: 95 },
            { name: "Aria", score: 85 },
            { name: "Kael", score: 70 },
          ],
          message: "Should sort descending by score.",
        },
        {
          type: "function",
          functionName: "sortChampions",
          args: [
            [
              { name: "Aria", score: 85 },
              { name: "Rowan", score: 95 },
              { name: "Kael", score: 70 },
            ],
            "asc",
          ],
          expected: [
            { name: "Kael", score: 70 },
            { name: "Aria", score: 85 },
            { name: "Rowan", score: 95 },
          ],
          message: "Should sort ascending by score.",
        },
      ],
      hints: [
        "Create a shallow clone first: `const copy = [...champions];`",
        'If `order === "desc"`, sort with `copy.sort((a, b) => b.score - a.score);`',
        'Otherwise, sort with `copy.sort((a, b) => a.score - b.score);`',
      ],
      solution: `function sortChampions(champions, order) {
  if (!Array.isArray(champions)) return [];
  const copy = [...champions];
  return copy.sort((a, b) => {
    return order === "desc" ? b.score - a.score : a.score - b.score;
  });
}`,
      solutionExplanation:
        "Cloning with `[...champions]` preserves data immutability. The comparator evaluates `b.score - a.score` for descending sort and `a.score - b.score` for ascending sort.",
      requirements: [
        { id: "req-f08-01", label: "Sorts objects ascending and descending by numeric score", type: "function", target: "sortChampions", expected: [{ name: "Rowan", score: 95 }, { name: "Aria", score: 85 }, { name: "Kael", score: 70 }] },
      ],
    },
  },

  // -------------------------------------------------------------
  // Mission 09: The Filtered Trail
  // -------------------------------------------------------------
  {
    id: "forest-09",
    number: "09",
    title: "The Filtered Trail: Collection Filtering",
    world: "logic-forest",
    type: "lesson",
    xp: 200,
    skillId: "array-manipulation",
    skillProgress: 7,
    difficulty: "Intermediate",
    estimatedTime: 8,
    description: "Filter complex data collections using multi-property predicate logic.",
    concepts: [".filter()", "predicates", "multi-attribute filtering", "data cleansing"],
    content: [
      {
        type: "paragraph",
        text: "🎒 Preparing for the inner thicket requires careful gear selection. In modern software engineering, filtering arrays using declarative predicates is the gold standard for data sanitation.",
      },
      {
        type: "heading",
        text: "Multi-Property Filtering",
      },
      {
        type: "code",
        code: `const validUsers = users.filter((u) => {
  return u.isActive && u.age >= 18 && u.role !== "banned";
});`,
      },
      {
        type: "tip",
        text: "The callback passed to `.filter()` should return `true` to keep the item, or `false` to exclude it.",
      },
    ],
    challenge: {
      id: "challenge-f09",
      lessonId: "forest-09",
      title: "The Filtered Trail: Collection Filtering",
      prompt:
        "Write a function `filterSupplies(supplies, minQuantity, maxWeight)` where each supply is `{ name, quantity, weight, usable }`. Return an array containing only the supplies where `usable === true`, `quantity >= minQuantity`, and `weight <= maxWeight`.",
      starterCode: `function filterSupplies(supplies, minQuantity, maxWeight) {
  // Filter supplies matching criteria:

}`,
      tests: [
        {
          type: "function",
          functionName: "filterSupplies",
          args: [
            [
              { name: "Rations", quantity: 10, weight: 5, usable: true },
              { name: "Heavy Shield", quantity: 1, weight: 25, usable: true },
              { name: "Broken Bow", quantity: 2, weight: 3, usable: false },
              { name: "Healing Potion", quantity: 5, weight: 2, usable: true },
            ],
            3,
            10,
          ],
          expected: [
            { name: "Rations", quantity: 10, weight: 5, usable: true },
            { name: "Healing Potion", quantity: 5, weight: 2, usable: true },
          ],
          message: "Should return only usable supplies with quantity >= 3 and weight <= 10.",
        },
      ],
      hints: [
        "Use `supplies.filter((item) => ...)`",
        "Check `item.usable === true && item.quantity >= minQuantity && item.weight <= maxWeight`.",
      ],
      solution: `function filterSupplies(supplies, minQuantity, maxWeight) {
  if (!Array.isArray(supplies)) return [];
  return supplies.filter(
    (item) => item.usable === true && item.quantity >= minQuantity && item.weight <= maxWeight
  );
}`,
      solutionExplanation:
        ".filter() loops over each supply item and returns a new array with items that fulfill all three requirements.",
      requirements: [
        { id: "req-f09-01", label: "Filters supplies by usability, quantity, and weight limits", type: "function", target: "filterSupplies", expected: [{ name: "Rations", quantity: 10, weight: 5, usable: true }, { name: "Healing Potion", quantity: 5, weight: 2, usable: true }] },
      ],
    },
  },

  // -------------------------------------------------------------
  // Mission 10: The Transformation Grove
  // -------------------------------------------------------------
  {
    id: "forest-10",
    number: "10",
    title: "The Transformation Grove: Data Mapping",
    world: "logic-forest",
    type: "lesson",
    xp: 210,
    skillId: "data-transformation",
    skillProgress: 7,
    difficulty: "Intermediate",
    estimatedTime: 8,
    description: "Map input datasets into new transformed structures without mutating original records.",
    concepts: [".map()", "data mapping", "projection", "immutability"],
    content: [
      {
        type: "paragraph",
        text: "🔮 At the Transformation Grove, magical springs enhance the combat properties of spells and equipment. Array `.map()` transforms each record into a brand new object while leaving the original dataset untouched.",
      },
      {
        type: "heading",
        text: "Mapping with Object Spread",
      },
      {
        type: "code",
        code: `const updatedItems = items.map((item) => ({
  ...item,
  price: item.price * 1.1, // 10% markup
  isDiscounted: false,
}));`,
      },
      {
        type: "tip",
        text: "Use object spread `{ ...item, newProp: value }` to copy existing properties while adding or updating specific fields.",
      },
    ],
    challenge: {
      id: "challenge-f10",
      lessonId: "forest-10",
      title: "The Transformation Grove: Data Mapping",
      prompt:
        "Write a function `enhanceSpells(spells, bonusPercent)` where each spell is `{ name, damage, manaCost }`. Return a new array of objects where each spell has:\n- `name`: original name\n- `damage`: `Math.round(damage * (1 + bonusPercent / 100))`\n- `manaCost`: original manaCost\n- `isEnhanced`: `true`",
      starterCode: `function enhanceSpells(spells, bonusPercent) {
  // Map and enhance spell objects:

}`,
      tests: [
        {
          type: "function",
          functionName: "enhanceSpells",
          args: [
            [
              { name: "Firebolt", damage: 40, manaCost: 10 },
              { name: "Frost Nova", damage: 60, manaCost: 25 },
            ],
            20,
          ],
          expected: [
            { name: "Firebolt", damage: 48, manaCost: 10, isEnhanced: true },
            { name: "Frost Nova", damage: 72, manaCost: 25, isEnhanced: true },
          ],
          message: "Should enhance damage by 20% and add isEnhanced flag.",
        },
      ],
      hints: [
        "Use `spells.map((spell) => { ... })`",
        "Calculate `const enhancedDamage = Math.round(spell.damage * (1 + bonusPercent / 100));`",
        "Return `{ name: spell.name, damage: enhancedDamage, manaCost: spell.manaCost, isEnhanced: true }`.",
      ],
      solution: `function enhanceSpells(spells, bonusPercent) {
  if (!Array.isArray(spells)) return [];
  return spells.map((spell) => ({
    name: spell.name,
    damage: Math.round(spell.damage * (1 + bonusPercent / 100)),
    manaCost: spell.manaCost,
    isEnhanced: true,
  }));
}`,
      solutionExplanation:
        ".map() iterates over each spell and projects a newly constructed object with updated damage and the isEnhanced property.",
      requirements: [
        { id: "req-f10-01", label: "Transforms spell damages and appends isEnhanced flag", type: "function", target: "enhanceSpells", expected: [{ name: "Firebolt", damage: 48, manaCost: 10, isEnhanced: true }, { name: "Frost Nova", damage: 72, manaCost: 25, isEnhanced: true }] },
      ],
    },
  },

  // -------------------------------------------------------------
  // Mission 11: The Score Keeper
  // -------------------------------------------------------------
  {
    id: "forest-11",
    number: "11",
    title: "The Score Keeper: Aggregation & Reduce",
    world: "logic-forest",
    type: "lesson",
    xp: 220,
    skillId: "aggregation-reduce",
    skillProgress: 7,
    difficulty: "Intermediate",
    estimatedTime: 8,
    description: "Aggregate datasets into summary statistics including totals, averages, minimums, and maximums.",
    concepts: [".reduce()", "running total", "min/max tracking", "aggregation"],
    content: [
      {
        type: "paragraph",
        text: "📊 The Forest Guild Accountant tracks expedition resources. Array `.reduce()` is the ultimate aggregation powerhouse, collapsing entire collections into single computed values.",
      },
      {
        type: "heading",
        text: "The Structure of .reduce()",
      },
      {
        type: "code",
        code: `const numbers = [10, 20, 30];
const total = numbers.reduce((accumulator, current) => {
  return accumulator + current;
}, 0); // 0 is initial accumulator value`,
      },
      {
        type: "tip",
        text: "Always provide an initial value (like `0` or `{}`) as the second argument to `.reduce()` to avoid errors on empty arrays.",
      },
    ],
    challenge: {
      id: "challenge-f11",
      lessonId: "forest-11",
      title: "The Score Keeper: Aggregation & Reduce",
      prompt:
        "Write a function `calculateLootStats(lootValues)` that takes an array of numbers and returns an object:\n- `total`: sum of all numbers (0 if empty)\n- `average`: average rounded to 2 decimal places (0 if empty)\n- `max`: highest value (null if empty)\n- `min`: lowest value (null if empty)",
      starterCode: `function calculateLootStats(lootValues) {
  // Aggregate stats from lootValues array:

}`,
      tests: [
        {
          type: "function",
          functionName: "calculateLootStats",
          args: [[100, 250, 75, 400]],
          expected: {
            total: 825,
            average: 206.25,
            max: 400,
            min: 75,
          },
          message: "Should accurately compute total, average, max, and min.",
        },
        {
          type: "function",
          functionName: "calculateLootStats",
          args: [[]],
          expected: {
            total: 0,
            average: 0,
            max: null,
            min: null,
          },
          message: "Should handle empty array gracefully.",
        },
      ],
      hints: [
        "If `!lootValues || lootValues.length === 0`, return `{ total: 0, average: 0, max: null, min: null }`.",
        "Calculate total using `lootValues.reduce((sum, n) => sum + n, 0)`.",
        "Calculate average with `Number((total / lootValues.length).toFixed(2))`.",
        "Use `Math.max(...lootValues)` and `Math.min(...lootValues)`.",
      ],
      solution: `function calculateLootStats(lootValues) {
  if (!Array.isArray(lootValues) || lootValues.length === 0) {
    return { total: 0, average: 0, max: null, min: null };
  }
  const total = lootValues.reduce((sum, val) => sum + val, 0);
  const average = Number((total / lootValues.length).toFixed(2));
  const max = Math.max(...lootValues);
  const min = Math.min(...lootValues);

  return { total, average, max, min };
}`,
      solutionExplanation:
        "We sum all elements using .reduce(). We then calculate the average to 2 decimal places and determine extremes using Math.max and Math.min.",
      requirements: [
        { id: "req-f11-01", label: "Calculates total, average, max, and min summary object", type: "function", target: "calculateLootStats", expected: { total: 825, average: 206.25, max: 400, min: 75 } },
      ],
    },
  },

  // -------------------------------------------------------------
  // Mission 12: The Nested Maze
  // -------------------------------------------------------------
  {
    id: "forest-12",
    number: "12",
    title: "The Nested Maze: Deep Data Traversal",
    world: "logic-forest",
    type: "lesson",
    xp: 220,
    skillId: "algorithmic-thinking",
    skillProgress: 7,
    difficulty: "Intermediate",
    estimatedTime: 8,
    description: "Traverse hierarchical and nested data structures to aggregate deeply embedded values.",
    concepts: ["nested arrays", "nested objects", "deep traversal", "hierarchy"],
    content: [
      {
        type: "paragraph",
        text: "🗺️ In the deep undergrowth lies a maze of chambers, each holding chests packed with relics. In production applications, real-world data is almost always nested.",
      },
      {
        type: "heading",
        text: "Traversing Nested Collections",
      },
      {
        type: "code",
        code: `let total = 0;
for (const room of dungeon) {
  for (const chest of room.chests) {
    for (const item of chest.items) {
      total += item.value;
    }
  }
}`,
      },
      {
        type: "tip",
        text: "Always safeguard nested property access with optional chaining `room?.chests || []` to prevent runtime crashes.",
      },
    ],
    challenge: {
      id: "challenge-f12",
      lessonId: "forest-12",
      title: "The Nested Maze: Deep Data Traversal",
      prompt:
        "Write a function `collectAllLoot(dungeonRooms)` where `dungeonRooms` is an array of rooms: `[{ name, chests: [{ id, items: [{ name, value }] }] }]`. Return the total sum of `value` for all items across every chest in all rooms.",
      starterCode: `function collectAllLoot(dungeonRooms) {
  // Sum value of all nested items:

}`,
      tests: [
        {
          type: "function",
          functionName: "collectAllLoot",
          args: [
            [
              {
                name: "Entry Chamber",
                chests: [
                  { id: "c1", items: [{ name: "Coin", value: 10 }, { name: "Gem", value: 50 }] },
                ],
              },
              {
                name: "Throne Room",
                chests: [
                  { id: "c2", items: [{ name: "Chalice", value: 100 }] },
                  { id: "c3", items: [{ name: "Crown", value: 200 }] },
                ],
              },
            ],
          ],
          expected: 360,
          message: "Should calculate sum of all nested items (10 + 50 + 100 + 200 = 360).",
        },
        {
          type: "function",
          functionName: "collectAllLoot",
          args: [[]],
          expected: 0,
          message: "Should return 0 for empty rooms.",
        },
      ],
      hints: [
        "Initialize `let totalGold = 0;`",
        "Use nested loops over `dungeonRooms`, `room.chests`, and `chest.items`.",
        "Add `item.value` to `totalGold` on each innermost iteration.",
      ],
      solution: `function collectAllLoot(dungeonRooms) {
  if (!Array.isArray(dungeonRooms)) return 0;
  let totalGold = 0;

  for (const room of dungeonRooms) {
    const chests = room.chests || [];
    for (const chest of chests) {
      const items = chest.items || [];
      for (const item of items) {
        if (typeof item.value === "number") {
          totalGold += item.value;
        }
      }
    }
  }

  return totalGold;
}`,
      solutionExplanation:
        "We traverse three nested levels (Rooms -> Chests -> Items) and accumulate the value of each relic into totalGold.",
      requirements: [
        { id: "req-f12-01", label: "Traverses 3-level deep nested structure and sums values", type: "function", target: "collectAllLoot", expected: 360 },
      ],
    },
  },

  // -------------------------------------------------------------
  // Mission 13: The Efficiency Trial
  // -------------------------------------------------------------
  {
    id: "forest-13",
    number: "13",
    title: "The Efficiency Trial: Fast Lookups & Big-O",
    world: "logic-forest",
    type: "lesson",
    xp: 230,
    skillId: "algorithm-efficiency",
    skillProgress: 7,
    difficulty: "Intermediate",
    estimatedTime: 9,
    description: "Replace slow O(n²) nested loops with fast O(n) hash lookups using Sets.",
    concepts: ["O(1) vs O(n) vs O(n^2)", "hash map lookups", "avoiding nested loops", "frequency counting"],
    content: [
      {
        type: "paragraph",
        text: "⚡ The Forest Sphinx challenges you to solve problems quickly. Running a loop inside another loop takes $O(n^2)$ time — if an array has 10,000 items, that's 100,000,000 comparisons! Using a `Set` allows $O(1)$ constant time lookups, solving the problem in a single $O(n)$ pass.",
      },
      {
        type: "heading",
        text: "The Complement Lookup Pattern (Two-Sum)",
      },
      {
        type: "code",
        code: `// Slow O(n^2): Nested loops
for (let i = 0; i < arr.length; i++) {
  for (let j = i + 1; j < arr.length; j++) {
    if (arr[i] + arr[j] === target) return true;
  }
}

// Fast O(n): Single pass with Set
const seen = new Set();
for (const num of arr) {
  const complement = target - num;
  if (seen.has(complement)) return true;
  seen.add(num);
}`,
      },
      {
        type: "tip",
        text: "Storing visited items in a `Set` or Object enables instant $O(1)$ presence checks.",
      },
    ],
    challenge: {
      id: "challenge-f13",
      lessonId: "forest-13",
      title: "The Efficiency Trial: Fast Lookups & Big-O",
      prompt:
        "Write a function `hasTwoSum(numbers, targetSum)` that returns `true` if any two distinct elements in `numbers` add up to `targetSum`, otherwise `false`. Solve this efficiently in $O(n)$ time using a `Set`.",
      starterCode: `function hasTwoSum(numbers, targetSum) {
  // Find if two numbers add up to targetSum in O(n) time:

}`,
      tests: [
        {
          type: "function",
          functionName: "hasTwoSum",
          args: [[2, 7, 11, 15], 9],
          expected: true,
          message: "2 + 7 = 9 should return true.",
        },
        {
          type: "function",
          functionName: "hasTwoSum",
          args: [[3, 2, 4], 6],
          expected: true,
          message: "2 + 4 = 6 should return true.",
        },
        {
          type: "function",
          functionName: "hasTwoSum",
          args: [[1, 2, 3, 9], 8],
          expected: false,
          message: "No pairs add to 8, should return false.",
        },
        {
          type: "function",
          functionName: "hasTwoSum",
          args: [[5], 10],
          expected: false,
          message: "A single number cannot pair with itself.",
        },
      ],
      hints: [
        "Initialize `const seen = new Set();`",
        "Iterate through `num` in `numbers`.",
        "Calculate `const complement = targetSum - num;`",
        "If `seen.has(complement)` return `true`. Else `seen.add(num)`.",
      ],
      solution: `function hasTwoSum(numbers, targetSum) {
  if (!Array.isArray(numbers) || numbers.length < 2) return false;
  const seen = new Set();

  for (const num of numbers) {
    const complement = targetSum - num;
    if (seen.has(complement)) {
      return true;
    }
    seen.add(num);
  }

  return false;
}`,
      solutionExplanation:
        "For each number, we compute the complement needed to reach targetSum. If the complement is already in our seen set, we have found our pair in O(n) time.",
      requirements: [
        { id: "req-f13-01", label: "Detects two-sum pairs in O(n) time using Set", type: "function", target: "hasTwoSum", expected: true },
      ],
    },
  },

  // -------------------------------------------------------------
  // Mission 14: The Algorithm Forge
  // -------------------------------------------------------------
  {
    id: "forest-14",
    number: "14",
    title: "The Algorithm Forge: Multi-Step Pipeline",
    world: "logic-forest",
    type: "lesson",
    xp: 250,
    skillId: "algorithmic-thinking",
    skillProgress: 7,
    difficulty: "Advanced",
    estimatedTime: 10,
    description: "Combine filter, map, sort, and reduce into a unified data processing pipeline.",
    concepts: ["filter + map + sort + reduce pipeline", "data processing", "algorithmic composition"],
    content: [
      {
        type: "paragraph",
        text: "🔥 At the Algorithm Forge, you combine all your algorithmic skills into a complete data pipeline: filtering invalid records, transforming candidate fields, sorting by priority, and computing aggregate totals.",
      },
      {
        type: "heading",
        text: "Composing Pipeline Stages",
      },
      {
        type: "paragraph",
        text: "Clean pipelines process data in clear, sequential stages: Cleanse -> Enrich -> Order -> Summarize.",
      },
      {
        type: "tip",
        text: "Break the problem down into distinct, testable steps rather than writing one massive complicated line.",
      },
    ],
    challenge: {
      id: "challenge-f14",
      lessonId: "forest-14",
      title: "The Algorithm Forge: Multi-Step Pipeline",
      prompt:
        "Write a function `generateExpeditionReport(members)` where each member is `{ name, role, stamina, loot: [numbers], isReady }`.\n1. Filter to members where `isReady === true` and `stamina >= 20`.\n2. For each eligible member, compute `totalLoot` (sum of their loot array).\n3. Sort the eligible members in descending order of `totalLoot`.\n4. Return an object:\n   `{ count, topMember, totalExpeditionGold }` where:\n   - `count`: total eligible members\n   - `topMember`: member object with highest totalLoot (or null if count is 0)\n   - `totalExpeditionGold`: sum of totalLoot across all eligible members.",
      starterCode: `function generateExpeditionReport(members) {
  // Build multi-step expedition pipeline:

}`,
      tests: [
        {
          type: "function",
          functionName: "generateExpeditionReport",
          args: [
            [
              { name: "Aria", role: "Ranger", stamina: 50, loot: [100, 50], isReady: true },
              { name: "Rowan", role: "Knight", stamina: 10, loot: [500], isReady: true },
              { name: "Lyra", role: "Mage", stamina: 30, loot: [200, 300], isReady: true },
              { name: "Kael", role: "Rogue", stamina: 40, loot: [50], isReady: false },
            ],
          ],
          expected: {
            count: 2,
            topMember: { name: "Lyra", role: "Mage", stamina: 30, loot: [200, 300], isReady: true, totalLoot: 500 },
            totalExpeditionGold: 650,
          },
          message: "Should filter, enrich, sort, and aggregate expedition report.",
        },
        {
          type: "function",
          functionName: "generateExpeditionReport",
          args: [[]],
          expected: {
            count: 0,
            topMember: null,
            totalExpeditionGold: 0,
          },
          message: "Should handle empty array gracefully.",
        },
      ],
      hints: [
        "Filter members: `members.filter(m => m.isReady && m.stamina >= 20)`.",
        "Map each member to add `totalLoot`: `m.loot.reduce((sum, val) => sum + val, 0)`.",
        "Sort members descending by `totalLoot`.",
        "Compute `totalExpeditionGold` by summing all eligible `totalLoot`s.",
      ],
      solution: `function generateExpeditionReport(members) {
  if (!Array.isArray(members) || members.length === 0) {
    return { count: 0, topMember: null, totalExpeditionGold: 0 };
  }

  const eligible = members
    .filter((m) => m.isReady === true && m.stamina >= 20)
    .map((m) => {
      const lootArr = Array.isArray(m.loot) ? m.loot : [];
      const totalLoot = lootArr.reduce((sum, val) => sum + val, 0);
      return { ...m, totalLoot };
    })
    .sort((a, b) => b.totalLoot - a.totalLoot);

  if (eligible.length === 0) {
    return { count: 0, topMember: null, totalExpeditionGold: 0 };
  }

  const totalExpeditionGold = eligible.reduce((sum, m) => sum + m.totalLoot, 0);

  return {
    count: eligible.length,
    topMember: eligible[0],
    totalExpeditionGold,
  };
}`,
      solutionExplanation:
        "The pipeline filters ready adventurers with stamina >= 20, calculates each member's totalLoot, sorts highest earner first, and computes overall gold aggregate.",
      requirements: [
        { id: "req-f14-01", label: "Generates structured expedition report with counts and totals", type: "function", target: "generateExpeditionReport", expected: 2 },
      ],
    },
  },

  // -------------------------------------------------------------
  // Mission 15: THE FOREST GUARDIAN (Boss Battle)
  // -------------------------------------------------------------
  {
    id: "forest-15",
    number: "15",
    title: "The Forest Guardian: Master of the Canopy",
    world: "logic-forest",
    type: "boss",
    xp: 600,
    skillId: "algorithmic-thinking",
    skillProgress: 10,
    difficulty: "Boss",
    estimatedTime: 15,
    description: "Defeat the ancient Forest Guardian by building an expedition squad deployment engine.",
    concepts: ["multi-criteria sorting", "greedy squad selection", "complex validation", "system architecture"],
    content: [
      {
        type: "paragraph",
        text: "👑 The colossal Forest Guardian awakens! Roots tremble and ancient spirits watch in silence. To prove yourself a true Logic Ranger, you must engineer the Royal Vanguard deployment system.",
      },
      {
        type: "heading",
        text: "The Guardian's Trial",
      },
      {
        type: "paragraph",
        text: "You must process raw candidate profiles, filter out corrupted anomalies, calculate composite combat ratings, sort candidates by value and stamina, and greedily assemble the minimum squad capable of repelling the threat.",
      },
      {
        type: "tip",
        text: "Structure your solution into distinct helper functions or clean sequential steps.",
      },
    ],
    challenge: {
      id: "challenge-f15",
      lessonId: "forest-15",
      title: "The Forest Guardian: Master of the Canopy",
      prompt:
        "Write the master squad deployment engine `dispatchForestVanguard(candidates, threatLevel, requiredGold)`:\n\n1. **Sanitize & Filter:** Exclude any candidate where `corrupted === true` or `stamina < 30`.\n2. **Valuation:** Calculate `netValue = power * 2 + total inventory item values` for each valid candidate.\n3. **Ranking:** Sort valid candidates by `netValue` descending. If `netValue` is equal, sort by `stamina` descending.\n4. **Squad Selection:** Select candidates in ranked order until BOTH `totalSquadPower >= threatLevel` AND `totalSquadGold >= requiredGold`. If all valid candidates are selected and the thresholds are still not met, `success` is `false`.\n5. **Return Result:**\n   ```js\n   {\n     success: boolean,\n     squad: [candidateIds],\n     squadPower: number,\n     squadGold: number,\n     remainingCandidates: number\n   }\n   ```",
      starterCode: `function dispatchForestVanguard(candidates, threatLevel, requiredGold) {
  // Build the master squad selection engine:

}`,
      tests: [
        {
          type: "function",
          functionName: "dispatchForestVanguard",
          args: [
            [
              { id: "c1", name: "Aria", power: 50, stamina: 40, inventory: [{ item: "gem", value: 100 }], corrupted: false },
              { id: "c2", name: "Gloom", power: 90, stamina: 50, inventory: [{ item: "skull", value: 200 }], corrupted: true }, // corrupted
              { id: "c3", name: "Rowan", power: 40, stamina: 50, inventory: [{ item: "ore", value: 50 }], corrupted: false },
              { id: "c4", name: "Breeze", power: 20, stamina: 20, inventory: [], corrupted: false }, // low stamina (< 30)
              { id: "c5", name: "Lyra", power: 30, stamina: 35, inventory: [{ item: "gold", value: 80 }], corrupted: false },
            ],
            70,
            120,
          ],
          expected: {
            success: true,
            squad: ["c1", "c5"],
            squadPower: 80,
            squadGold: 180,
            remainingCandidates: 1,
          },
          message: "Should filter corrupted/exhausted units and select Aria & Lyra to meet power 70 and gold 120.",
        },
        {
          type: "function",
          functionName: "dispatchForestVanguard",
          args: [
            [
              { id: "c1", name: "Aria", power: 30, stamina: 40, inventory: [{ item: "coin", value: 20 }], corrupted: false },
            ],
            100,
            50,
          ],
          expected: {
            success: false,
            squad: ["c1"],
            squadPower: 30,
            squadGold: 20,
            remainingCandidates: 0,
          },
          message: "Should return success: false when requirements cannot be met.",
        },
      ],
      hints: [
        "Filter out `c.corrupted === true` and `c.stamina < 30`.",
        "Calculate `gold = c.inventory.reduce((sum, i) => sum + i.value, 0)` and `netValue = c.power * 2 + gold`.",
        "Sort valid units with `(b.netValue !== a.netValue) ? b.netValue - a.netValue : b.stamina - a.stamina`.",
        "Iterate through sorted units: accumulate into squad until `squadPower >= threatLevel && squadGold >= requiredGold`.",
      ],
      solution: `function dispatchForestVanguard(candidates, threatLevel, requiredGold) {
  if (!Array.isArray(candidates) || candidates.length === 0) {
    return { success: false, squad: [], squadPower: 0, squadGold: 0, remainingCandidates: 0 };
  }

  // 1. Sanitize & Valuation
  const valid = candidates
    .filter((c) => !c.corrupted && c.stamina >= 30)
    .map((c) => {
      const inv = Array.isArray(c.inventory) ? c.inventory : [];
      const gold = inv.reduce((sum, item) => sum + (item.value || 0), 0);
      const netValue = c.power * 2 + gold;
      return { ...c, gold, netValue };
    });

  // 2. Ranking
  valid.sort((a, b) => {
    if (b.netValue !== a.netValue) {
      return b.netValue - a.netValue;
    }
    return b.stamina - a.stamina;
  });

  // 3. Selection
  const squad = [];
  let squadPower = 0;
  let squadGold = 0;

  for (const c of valid) {
    squad.push(c.id);
    squadPower += c.power;
    squadGold += c.gold;

    if (squadPower >= threatLevel && squadGold >= requiredGold) {
      break;
    }
  }

  const success = squadPower >= threatLevel && squadGold >= requiredGold;
  const remainingCandidates = valid.length - squad.length;

  return {
    success,
    squad,
    squadPower,
    squadGold,
    remainingCandidates,
  };
}`,
      solutionExplanation:
        "The master engine sanitizes invalid candidates, computes netValue ratings, sorts by netValue and stamina, greedily accumulates candidates until requirements are satisfied, and reports final squad readiness.",
      requirements: [
        { id: "req-f15-01", label: "Executes complete vanguard selection algorithm and defeats Forest Guardian", type: "function", target: "dispatchForestVanguard", expected: true },
      ],
    },
  },
];

/** Get Logic Forest lesson by ID */
export function getLogicForestLessonById(lessonId) {
  return logicForestLessons.find((l) => l.id === lessonId);
}

/** Get next Logic Forest lesson ID */
export function getNextLogicForestLessonId(lessonId) {
  const index = logicForestLessons.findIndex((l) => l.id === lessonId);
  if (index === -1 || index >= logicForestLessons.length - 1) return null;
  return logicForestLessons[index + 1].id;
}

/** Get progress percentage for Logic Forest */
export function getLogicForestProgress(progress = {}) {
  const completed = logicForestLessons.filter((l) => (progress.completedLessons || []).includes(l.id)).length;
  return Math.min(100, Math.round((completed / logicForestLessons.length) * 100));
}

/** Check if Logic Forest is fully complete */
export function isLogicForestComplete(progress = {}) {
  return (
    logicForestLessons.length > 0 &&
    logicForestLessons.every((l) => (progress.completedLessons || []).includes(l.id))
  );
}
