/**
 * World 01 — The Village
 * JavaScript Fundamentals (18 Structured Lessons)
 *
 * A progressive beginner-to-intermediate JavaScript learning journey:
 * 1. Variables: The Adventurer's Stash
 * 2. Data Types: Types of the Realm
 * 3. Operators: Forge of Calculations
 * 4. Comparisons: The Gatekeeper's Test
 * 5. Conditionals: Fork in the Forest
 * 6. Strings: Scrolls of Lore
 * 7. Arrays: The Inventory Pouch
 * 8. Array Methods: Sorting the Armory
 * 9. Objects: Character Stats & Quests
 * 10. Loops: The Training Grounds
 * 11. Functions: Spells of the Wizard
 * 12. Arrow Functions: Swift Incantations
 * 13. Scope: The Enchanted Boundaries
 * 14. DOM Basics: Crafting the Village UI
 * 15. Events: Village Bell & Town Alarms
 * 16. Debugging: Hunting the Forest Gremlins
 * 17. Mini Challenge: The Village Market
 * 18. The Village Master: Guardian of Code (Boss Challenge)
 */

export const villageLessons = [
  // -------------------------------------------------------------
  // Lesson 01: Variables
  // -------------------------------------------------------------
  {
    id: "lesson-01",
    number: "01",
    title: "Variables: The Adventurer's Stash",
    world: "village",
    type: "lesson",
    xp: 100,
    skillId: "programming",
    skillProgress: 5,
    difficulty: "Beginner",
    estimatedTime: 5,
    description: "Store and label your first items in memory using variables.",
    concepts: ["let", "const", "assignment", "naming conventions"],
    content: [
      {
        type: "paragraph",
        text: "Welcome to JavaScript Village! Before you venture into the wild, the Village Elder hands you an adventurer's stash. In programming, a variable is like a labeled storage slot in memory where you can keep valuable information.",
      },
      {
        type: "heading",
        text: "Declaring a Variable",
      },
      {
        type: "paragraph",
        text: "Use the keyword `let` to declare a variable that can change later, or `const` for values that stay constant. Assign a value using the assignment operator (`=`).",
      },
      {
        type: "code",
        code: 'let heroName = "Aria";\nconst startingGold = 50;\n\n// Update heroName later\nheroName = "Aria the Brave";',
      },
      {
        type: "tip",
        text: 'Always use camelCase for JavaScript variable names (e.g. `heroName`, `goldCoins`) so your code is clean and readable.',
      },
    ],
    challenge: {
      id: "challenge-01",
      lessonId: "lesson-01",
      title: "Variables: The Adventurer's Stash",
      prompt: 'Declare a variable called `playerName` with the value "Adventurer", and a variable called `goldCoins` with the number 50.',
      starterCode: '// Declare playerName and goldCoins below:\n',
      tests: [
        {
          type: "variable",
          name: "playerName",
          expected: "Adventurer",
          message: 'playerName should equal "Adventurer".',
        },
        {
          type: "variable",
          name: "goldCoins",
          expected: 50,
          message: "goldCoins should equal 50.",
        },
      ],
      hints: [
        'Use `let playerName = "Adventurer";` to store your character name.',
        "Use `let goldCoins = 50;` to store your starting gold (no quotes around numbers).",
        "Make sure the spelling and capitalization match exactly.",
      ],
      solution: 'let playerName = "Adventurer";\nlet goldCoins = 50;',
      solutionExplanation:
        "We declare two variables using `let`: `playerName` stores a string of text, and `goldCoins` stores a numeric value.",
      requirements: [
        { id: "req-01-01", label: 'Declare playerName as "Adventurer"', type: "variable", target: "playerName", expected: "Adventurer" },
        { id: "req-01-02", label: "Declare goldCoins as 50", type: "variable", target: "goldCoins", expected: 50 },
      ],
    },
  },

  // -------------------------------------------------------------
  // Lesson 02: Data Types
  // -------------------------------------------------------------
  {
    id: "lesson-02",
    number: "02",
    title: "Data Types: Types of the Realm",
    world: "village",
    type: "lesson",
    xp: 110,
    skillId: "programming",
    skillProgress: 5,
    difficulty: "Beginner",
    estimatedTime: 5,
    description: "Discover the fundamental data types of JavaScript: Strings, Numbers, and Booleans.",
    concepts: ["string", "number", "boolean", "typeof"],
    content: [
      {
        type: "paragraph",
        text: "The village alchemist explains that every piece of data in the realm possesses a unique nature or type: text, numbers, or truth flags.",
      },
      {
        type: "heading",
        text: "Core JavaScript Types",
      },
      {
        type: "code",
        code: 'let questTitle = "Save the Forest"; // String (text in quotes)\nlet mana = 100;                     // Number (integers or decimals)\nlet isQuestActive = true;           // Boolean (true or false)',
      },
      {
        type: "paragraph",
        text: "You can check the type of any variable using the built-in `typeof` operator:",
      },
      {
        type: "code",
        code: 'console.log(typeof questTitle); // "string"\nconsole.log(typeof mana);       // "number"\nconsole.log(typeof isQuestActive); // "boolean"',
      },
      {
        type: "tip",
        text: "Never wrap numbers or booleans in quotes, or JavaScript will treat them as strings of text!",
      },
    ],
    challenge: {
      id: "challenge-02",
      lessonId: "lesson-02",
      title: "Data Types: Types of the Realm",
      prompt: 'Declare three variables: `characterClass` set to "Mage", `healthPoints` set to 100, and `isReady` set to true.',
      starterCode: '// Declare characterClass, healthPoints, and isReady below:\n',
      tests: [
        {
          type: "variable",
          name: "characterClass",
          expected: "Mage",
          message: 'characterClass should be a string set to "Mage".',
        },
        {
          type: "variable",
          name: "healthPoints",
          expected: 100,
          message: "healthPoints should be a number set to 100.",
        },
        {
          type: "variable",
          name: "isReady",
          expected: true,
          message: "isReady should be a boolean set to true.",
        },
      ],
      hints: [
        'Set characterClass to a string: let characterClass = "Mage";',
        "Set healthPoints to a number without quotes: let healthPoints = 100;",
        "Set isReady to the boolean keyword true: let isReady = true;",
      ],
      solution: 'let characterClass = "Mage";\nlet healthPoints = 100;\nlet isReady = true;',
      solutionExplanation:
        "By setting a string in quotes, a raw number, and a boolean keyword, we create three distinct primitive types.",
      requirements: [
        { id: "req-02-01", label: 'characterClass is "Mage" (String)', type: "variable", target: "characterClass", expected: "Mage" },
        { id: "req-02-02", label: "healthPoints is 100 (Number)", type: "variable", target: "healthPoints", expected: 100 },
        { id: "req-02-03", label: "isReady is true (Boolean)", type: "variable", target: "isReady", expected: true },
      ],
    },
  },

  // -------------------------------------------------------------
  // Lesson 03: Operators
  // -------------------------------------------------------------
  {
    id: "lesson-03",
    number: "03",
    title: "Operators: Forge of Calculations",
    world: "village",
    type: "lesson",
    xp: 120,
    skillId: "programming",
    skillProgress: 5,
    difficulty: "Beginner",
    estimatedTime: 5,
    description: "Perform arithmetic calculations, compute damage bonuses, and calculate remainders.",
    concepts: ["+", "-", "*", "/", "% (modulo)", "precedence"],
    content: [
      {
        type: "paragraph",
        text: "At the Village Blacksmith, every weapon upgrade requires precise arithmetic. JavaScript gives you operators to add, subtract, multiply, divide, and calculate remainders.",
      },
      {
        type: "heading",
        text: "Arithmetic in Action",
      },
      {
        type: "code",
        code: "let baseDamage = 20 + 5;   // 25 (Addition)\nlet defense = 15 - 3;      // 12 (Subtraction)\nlet critMultiplier = 8 * 2; // 16 (Multiplication)\nlet halfHealth = 100 / 2;  // 50 (Division)\nlet remainder = 10 % 3;    // 1  (Modulo: remainder of 10 / 3)",
      },
      {
        type: "tip",
        text: "The modulo operator (`%`) is handy for checking if numbers are even or odd (`num % 2 === 0`) or finding leftover items when dividing into groups.",
      },
    ],
    challenge: {
      id: "challenge-03",
      lessonId: "lesson-03",
      title: "Operators: Forge of Calculations",
      prompt: "The blacksmith gives you `baseAttack = 15` and `weaponBonus = 7`. Calculate `totalAttack` (the sum of both), and calculate `leftoverMana` as the remainder of dividing 25 mana evenly among 4 spell casts (25 % 4).",
      starterCode: "let baseAttack = 15;\nlet weaponBonus = 7;\n\n// Calculate totalAttack and leftoverMana below:\n",
      tests: [
        {
          type: "variable",
          name: "totalAttack",
          expected: 22,
          message: "totalAttack should equal 22 (15 + 7).",
        },
        {
          type: "variable",
          name: "leftoverMana",
          expected: 1,
          message: "leftoverMana should equal 1 (25 % 4).",
        },
      ],
      hints: [
        "Calculate `totalAttack = baseAttack + weaponBonus;`",
        "Calculate `leftoverMana = 25 % 4;` using the `%` modulo operator.",
      ],
      solution: "let baseAttack = 15;\nlet weaponBonus = 7;\n\nlet totalAttack = baseAttack + weaponBonus;\nlet leftoverMana = 25 % 4;",
      solutionExplanation:
        "We add baseAttack and weaponBonus to get 22. Then 25 divided by 4 equals 6 with a remainder of 1, so 25 % 4 equals 1.",
      requirements: [
        { id: "req-03-01", label: "totalAttack equals 22", type: "variable", target: "totalAttack", expected: 22 },
        { id: "req-03-02", label: "leftoverMana equals 1", type: "variable", target: "leftoverMana", expected: 1 },
      ],
    },
  },

  // -------------------------------------------------------------
  // Lesson 04: Comparisons
  // -------------------------------------------------------------
  {
    id: "lesson-04",
    number: "04",
    title: "Comparisons: The Gatekeeper's Test",
    world: "village",
    type: "lesson",
    xp: 120,
    skillId: "programming",
    skillProgress: 5,
    difficulty: "Beginner",
    estimatedTime: 5,
    description: "Compare values and ask true/false questions using strict equality and comparison operators.",
    concepts: ["===", "!==", ">", "<", ">=", "<="],
    content: [
      {
        type: "paragraph",
        text: "The Gatekeeper guards the bridge out of the village. To pass, you must satisfy specific criteria: your level must be high enough, and your credentials must match.",
      },
      {
        type: "heading",
        text: "Comparison Operators",
      },
      {
        type: "code",
        code: 'let level = 5;\n\nconsole.log(level >= 5);           // true (greater than or equal)\nconsole.log(level < 3);            // false (less than)\nconsole.log(level === 5);          // true (strictly equal)\nconsole.log(level !== 10);         // true (strictly not equal)',
      },
      {
        type: "tip",
        text: "Always prefer strict equality (`===`) over loose equality (`==`). Strict equality checks both value and type, preventing sneaky bugs.",
      },
    ],
    challenge: {
      id: "challenge-04",
      lessonId: "lesson-04",
      title: "Comparisons: The Gatekeeper's Test",
      prompt: 'Given `playerLevel = 7` and `gateKey = "golden"`, create a boolean variable `canPass` that checks if `playerLevel >= 5`, and `hasKey` that checks if `gateKey === "golden"`.',
      starterCode: 'let playerLevel = 7;\nlet gateKey = "golden";\n\n// Create canPass and hasKey comparisons below:\n',
      tests: [
        {
          type: "variable",
          name: "canPass",
          expected: true,
          message: "canPass should evaluate to true.",
        },
        {
          type: "variable",
          name: "hasKey",
          expected: true,
          message: "hasKey should evaluate to true.",
        },
      ],
      hints: [
        "Use `playerLevel >= 5` to set `canPass`.",
        'Use `gateKey === "golden"` to set `hasKey`.',
      ],
      solution: 'let playerLevel = 7;\nlet gateKey = "golden";\n\nlet canPass = playerLevel >= 5;\nlet hasKey = gateKey === "golden";',
      solutionExplanation:
        "Comparisons evaluate directly to boolean `true` or `false`. Because 7 is >= 5, canPass is true. Because gateKey matches 'golden', hasKey is true.",
      requirements: [
        { id: "req-04-01", label: "canPass is true (playerLevel >= 5)", type: "variable", target: "canPass", expected: true },
        { id: "req-04-02", label: 'hasKey is true (gateKey === "golden")', type: "variable", target: "hasKey", expected: true },
      ],
    },
  },

  // -------------------------------------------------------------
  // Lesson 05: Conditionals
  // -------------------------------------------------------------
  {
    id: "lesson-05",
    number: "05",
    title: "Conditionals: Fork in the Forest",
    world: "village",
    type: "lesson",
    xp: 130,
    skillId: "programming",
    skillProgress: 5,
    difficulty: "Beginner",
    estimatedTime: 5,
    description: "Make decisions and choose branching paths using if, else if, else, and logical operators.",
    concepts: ["if", "else if", "else", "&& (AND)", "|| (OR)", "! (NOT)"],
    content: [
      {
        type: "paragraph",
        text: "In the Whispering Woods, paths diverge. Your code must decide which route to take depending on weather, energy, and equipment.",
      },
      {
        type: "heading",
        text: "Branching Logic with if / else",
      },
      {
        type: "code",
        code: 'let stamina = 30;\nlet hasTorch = true;\n\nif (stamina > 20 && hasTorch) {\n  console.log("Explore the deep cave.");\n} else if (stamina > 10) {\n  console.log("Walk along the forest trail.");\n} else {\n  console.log("Rest at the campfire.");\n}',
      },
      {
        type: "tip",
        text: "`&&` requires both sides to be true. `||` requires at least one side to be true. `!` flips true to false and vice-versa.",
      },
    ],
    challenge: {
      id: "challenge-05",
      lessonId: "lesson-05",
      title: "Conditionals: Fork in the Forest",
      prompt: 'Write a function `choosePath(energy, hasTorch)` that returns:\n- "Enter Cave" if `energy >= 20 && hasTorch`\n- "Rest at Camp" if `energy < 10`\n- "Take Sunny Trail" otherwise.',
      starterCode: 'function choosePath(energy, hasTorch) {\n  // Write your conditional logic here:\n\n}',
      tests: [
        {
          type: "function",
          functionName: "choosePath",
          args: [25, true],
          expected: "Enter Cave",
          message: 'choosePath(25, true) should return "Enter Cave".',
        },
        {
          type: "function",
          functionName: "choosePath",
          args: [5, true],
          expected: "Rest at Camp",
          message: 'choosePath(5, true) should return "Rest at Camp".',
        },
        {
          type: "function",
          functionName: "choosePath",
          args: [15, false],
          expected: "Take Sunny Trail",
          message: 'choosePath(15, false) should return "Take Sunny Trail".',
        },
      ],
      hints: [
        'Check the first condition with `if (energy >= 20 && hasTorch)` and return "Enter Cave".',
        'Add an `else if (energy < 10)` branch returning "Rest at Camp".',
        'Use `else` for the fallback and return "Take Sunny Trail".',
      ],
      solution: 'function choosePath(energy, hasTorch) {\n  if (energy >= 20 && hasTorch) {\n    return "Enter Cave";\n  } else if (energy < 10) {\n    return "Rest at Camp";\n  } else {\n    return "Take Sunny Trail";\n  }\n}',
      solutionExplanation:
        "Conditionals check conditions from top to bottom. The first condition that evaluates to true executes its return statement.",
      requirements: [
        { id: "req-05-01", label: 'Returns "Enter Cave" when energy >= 20 and hasTorch is true', type: "function", target: "choosePath", expected: "Enter Cave" },
        { id: "req-05-02", label: 'Returns "Rest at Camp" when energy < 10', type: "function", target: "choosePath", expected: "Rest at Camp" },
        { id: "req-05-03", label: 'Returns "Take Sunny Trail" for other cases', type: "function", target: "choosePath", expected: "Take Sunny Trail" },
      ],
    },
  },

  // -------------------------------------------------------------
  // Lesson 06: Strings
  // -------------------------------------------------------------
  {
    id: "lesson-06",
    number: "06",
    title: "Strings: Scrolls of Lore",
    world: "village",
    type: "lesson",
    xp: 130,
    skillId: "programming",
    skillProgress: 5,
    difficulty: "Beginner",
    estimatedTime: 5,
    description: "Master string manipulation, template literals, length, and text methods.",
    concepts: ["template literals", ".length", ".toUpperCase()", ".toLowerCase()", ".includes()"],
    content: [
      {
        type: "paragraph",
        text: "The Village Library holds ancient scrolls. To read and engrave them, you must learn string methods and modern template literals.",
      },
      {
        type: "heading",
        text: "Template Literals and Methods",
      },
      {
        type: "code",
        code: 'let hero = "Rowan";\nlet realm = "Eldoria";\n\n// Template literal with backticks:\nlet greeting = `Greetings, ${hero} of ${realm}!`;\n\nconsole.log(greeting.length);           // Number of characters\nconsole.log(hero.toUpperCase());        // "ROWAN"\nconsole.log(greeting.includes("Eldoria")); // true',
      },
      {
        type: "tip",
        text: "Backticks (`` ` ``) allow you to embed JavaScript expressions inside `${...}` cleanly without clunky `+` signs.",
      },
    ],
    challenge: {
      id: "challenge-06",
      lessonId: "lesson-06",
      title: "Strings: Scrolls of Lore",
      prompt: 'Write a function `formatHeroTitle(name, title)` that uses template literals to return the uppercase formatted string: `"${name.toUpperCase()} THE ${title.toUpperCase()}"`.',
      starterCode: 'function formatHeroTitle(name, title) {\n  // Return uppercase formatted string using template literals:\n\n}',
      tests: [
        {
          type: "function",
          functionName: "formatHeroTitle",
          args: ["Rowan", "Guardian"],
          expected: "ROWAN THE GUARDIAN",
          message: 'formatHeroTitle("Rowan", "Guardian") should return "ROWAN THE GUARDIAN".',
        },
        {
          type: "function",
          functionName: "formatHeroTitle",
          args: ["alex", "shadowblade"],
          expected: "ALEX THE SHADOWBLADE",
          message: 'formatHeroTitle("alex", "shadowblade") should return "ALEX THE SHADOWBLADE".',
        },
      ],
      hints: [
        "Convert each argument using `.toUpperCase()`.",
        "Combine them with template literals: `${name.toUpperCase()} THE ${title.toUpperCase()}`.",
      ],
      solution: 'function formatHeroTitle(name, title) {\n  return `${name.toUpperCase()} THE ${title.toUpperCase()}`;\n}',
      solutionExplanation:
        "Template literals embed expressions inside `${}`. Calling `.toUpperCase()` transforms each word into capital letters.",
      requirements: [
        { id: "req-06-01", label: 'Formats "Rowan" and "Guardian" to "ROWAN THE GUARDIAN"', type: "function", target: "formatHeroTitle", expected: "ROWAN THE GUARDIAN" },
      ],
    },
  },

  // -------------------------------------------------------------
  // Lesson 07: Arrays
  // -------------------------------------------------------------
  {
    id: "lesson-07",
    number: "07",
    title: "Arrays: The Inventory Pouch",
    world: "village",
    type: "lesson",
    xp: 140,
    skillId: "programming",
    skillProgress: 5,
    difficulty: "Beginner",
    estimatedTime: 5,
    description: "Store ordered lists of items in arrays, access items by index, and add new items with push.",
    concepts: ["array literal []", "indices", ".length", ".push()", ".pop()"],
    content: [
      {
        type: "paragraph",
        text: "Your inventory pouch can hold multiple items in an ordered list called an Array. Each item in an array has a zero-based position index.",
      },
      {
        type: "heading",
        text: "Working with Arrays",
      },
      {
        type: "code",
        code: 'let pouch = ["potion", "shield", "bread"];\n\nconsole.log(pouch[0]);       // "potion" (first item)\nconsole.log(pouch.length);   // 3 (total items)\n\npouch.push("magic map");     // Adds to the end\nconsole.log(pouch.length);   // 4',
      },
      {
        type: "tip",
        text: "Remember: JavaScript array indexes start at 0, not 1! So the first element is `pouch[0]` and the last element is `pouch[pouch.length - 1]`.",
      },
    ],
    challenge: {
      id: "challenge-07",
      lessonId: "lesson-07",
      title: "Arrays: The Inventory Pouch",
      prompt: 'Create an array called `inventory` containing "potion", "shield", and "torch". Then use `.push("map")` to add "map" to the end of the array.',
      starterCode: 'let inventory = ["potion", "shield", "torch"];\n\n// Add "map" to inventory using .push():\n',
      tests: [
        {
          type: "array",
          name: "inventory",
          expected: ["potion", "shield", "torch", "map"],
          message: 'inventory should contain ["potion", "shield", "torch", "map"].',
        },
      ],
      hints: [
        'Start with `let inventory = ["potion", "shield", "torch"];`',
        'Add the new item with `inventory.push("map");`',
      ],
      solution: 'let inventory = ["potion", "shield", "torch"];\ninventory.push("map");',
      solutionExplanation:
        "Arrays represent ordered lists. Calling `inventory.push('map')` appends 'map' as the fourth item.",
      requirements: [
        { id: "req-07-01", label: 'inventory has ["potion", "shield", "torch", "map"]', type: "array", target: "inventory", expected: ["potion", "shield", "torch", "map"] },
      ],
    },
  },

  // -------------------------------------------------------------
  // Lesson 08: Array Methods
  // -------------------------------------------------------------
  {
    id: "lesson-08",
    number: "08",
    title: "Array Methods: Sorting the Armory",
    world: "village",
    type: "lesson",
    xp: 150,
    skillId: "programming",
    skillProgress: 5,
    difficulty: "Intermediate",
    estimatedTime: 8,
    description: "Transform and filter collections of items using .map() and .filter().",
    concepts: [".map()", ".filter()", ".includes()", ".slice()"],
    content: [
      {
        type: "paragraph",
        text: "The village Quartermaster needs to filter out expensive gear and double reward payouts. Array methods like `.filter()` and `.map()` let you transform data in powerful, functional ways.",
      },
      {
        type: "heading",
        text: "Filtering and Mapping",
      },
      {
        type: "code",
        code: 'let goldPiles = [10, 25, 5, 50, 15];\n\n// .filter creates a new array matching a condition\nlet bigPiles = goldPiles.filter((amount) => amount >= 20);\n// [25, 50]\n\n// .map transforms every item into something new\nlet doubledPiles = goldPiles.map((amount) => amount * 2);\n// [20, 50, 10, 100, 30]',
      },
      {
        type: "tip",
        text: "Neither `.filter()` nor `.map()` modifies the original array — they always return a brand new array!",
      },
    ],
    challenge: {
      id: "challenge-08",
      lessonId: "lesson-08",
      title: "Array Methods: Sorting the Armory",
      prompt: "Write a function `filterAffordableGear(prices, maxGold)` that returns an array of only prices <= maxGold using `.filter()`, and a function `doubleLoot(lootArray)` that doubles each number using `.map()`.",
      starterCode: 'function filterAffordableGear(prices, maxGold) {\n  // Return filtered prices <= maxGold:\n\n}\n\nfunction doubleLoot(lootArray) {\n  // Return mapped array with values multiplied by 2:\n\n}',
      tests: [
        {
          type: "function",
          functionName: "filterAffordableGear",
          args: [[100, 45, 80, 25, 150], 50],
          expected: [45, 25],
          message: "filterAffordableGear([100, 45, 80, 25, 150], 50) should return [45, 25].",
        },
        {
          type: "function",
          functionName: "doubleLoot",
          args: [[5, 10, 15]],
          expected: [10, 20, 30],
          message: "doubleLoot([5, 10, 15]) should return [10, 20, 30].",
        },
      ],
      hints: [
        "In `filterAffordableGear`, return `prices.filter((p) => p <= maxGold);`",
        "In `doubleLoot`, return `lootArray.map((v) => v * 2);`",
      ],
      solution: 'function filterAffordableGear(prices, maxGold) {\n  return prices.filter((price) => price <= maxGold);\n}\n\nfunction doubleLoot(lootArray) {\n  return lootArray.map((val) => val * 2);\n}',
      solutionExplanation:
        ".filter() keeps only the elements that satisfy `price <= maxGold`. .map() multiplies every item by 2.",
      requirements: [
        { id: "req-08-01", label: "filterAffordableGear filters prices <= maxGold", type: "function", target: "filterAffordableGear", expected: [45, 25] },
        { id: "req-08-02", label: "doubleLoot doubles all values in an array", type: "function", target: "doubleLoot", expected: [10, 20, 30] },
      ],
    },
  },

  // -------------------------------------------------------------
  // Lesson 09: Objects
  // -------------------------------------------------------------
  {
    id: "lesson-09",
    number: "09",
    title: "Objects: Character Stats & Quests",
    world: "village",
    type: "lesson",
    xp: 150,
    skillId: "programming",
    skillProgress: 5,
    difficulty: "Intermediate",
    estimatedTime: 8,
    description: "Group related properties and character stats into structured JavaScript objects.",
    concepts: ["object literal {}", "key-value pairs", "dot notation", "bracket notation"],
    content: [
      {
        type: "paragraph",
        text: "In your adventurer notebook, each hero has a name, level, role, and inventory. JavaScript Objects let you group related data into named key-value pairs.",
      },
      {
        type: "heading",
        text: "Creating and Accessing Objects",
      },
      {
        type: "code",
        code: 'let quest = {\n  id: "quest-01",\n  title: "Defend the Mill",\n  xpReward: 250,\n  isCompleted: false,\n};\n\n// Access with dot notation:\nconsole.log(quest.title);    // "Defend the Mill"\n\n// Modify properties:\nquest.isCompleted = true;\nquest.location = "North Mill"; // Adding a new property',
      },
      {
        type: "tip",
        text: "Use dot notation (`quest.title`) when you know the property name in advance, or bracket notation (`quest['title']`) when using dynamic variables.",
      },
    ],
    challenge: {
      id: "challenge-09",
      lessonId: "lesson-09",
      title: "Objects: Character Stats & Quests",
      prompt: 'Create an object called `hero` with properties:\n- `name`: "Aria"\n- `level`: 5\n- `stats`: an object `{ attack: 25, defense: 18 }`\n- `gold`: 100',
      starterCode: 'let hero = {\n  // Define name, level, nested stats (attack, defense), and gold below:\n\n};',
      tests: [
        {
          type: "variable",
          name: "hero",
          expected: {
            name: "Aria",
            level: 5,
            stats: { attack: 25, defense: 18 },
            gold: 100,
          },
          message: "hero object should match the expected name, level, stats, and gold.",
        },
      ],
      hints: [
        'Set `name: "Aria"`, `level: 5`, and `gold: 100`.',
        "Nest the `stats` object: `stats: { attack: 25, defense: 18 }`.",
      ],
      solution: 'let hero = {\n  name: "Aria",\n  level: 5,\n  stats: {\n    attack: 25,\n    defense: 18,\n  },\n  gold: 100,\n};',
      solutionExplanation:
        "Objects can contain primitives, nested objects, and arrays. This creates a complete hero profile.",
      requirements: [
        { id: "req-09-01", label: "hero object has name, level, nested stats, and gold", type: "variable", target: "hero", expected: { name: "Aria", level: 5, stats: { attack: 25, defense: 18 }, gold: 100 } },
      ],
    },
  },

  // -------------------------------------------------------------
  // Lesson 10: Loops
  // -------------------------------------------------------------
  {
    id: "lesson-10",
    number: "10",
    title: "Loops: The Training Grounds",
    world: "village",
    type: "lesson",
    xp: 160,
    skillId: "programming",
    skillProgress: 5,
    difficulty: "Intermediate",
    estimatedTime: 8,
    description: "Automate repetitive tasks and iterate through collections with for and while loops.",
    concepts: ["for loop", "while loop", "iteration", "loop counters"],
    content: [
      {
        type: "paragraph",
        text: "At the Village Training Grounds, swinging your sword once isn't enough — you must practice repeatedly. Loops allow you to execute a block of code multiple times without repeating yourself.",
      },
      {
        type: "heading",
        text: "The Classic for Loop",
      },
      {
        type: "code",
        code: 'for (let i = 0; i < 3; i++) {\n  console.log(`Swing #${i + 1}`);\n}\n\n// Iterating through an array:\nlet scores = [10, 20, 30];\nlet total = 0;\nfor (let i = 0; i < scores.length; i++) {\n  total += scores[i];\n}',
      },
      {
        type: "tip",
        text: "Always ensure your loop condition will eventually become false, or you'll create an infinite loop!",
      },
    ],
    challenge: {
      id: "challenge-10",
      lessonId: "lesson-10",
      title: "Loops: The Training Grounds",
      prompt: "Write a function `calculateTotalScore(scores)` that loops through the array of numbers and returns their sum.",
      starterCode: 'function calculateTotalScore(scores) {\n  let total = 0;\n  // Use a for loop to sum all numbers in scores:\n\n  return total;\n}',
      tests: [
        {
          type: "function",
          functionName: "calculateTotalScore",
          args: [[10, 20, 30, 40]],
          expected: 100,
          message: "calculateTotalScore([10, 20, 30, 40]) should return 100.",
        },
        {
          type: "function",
          functionName: "calculateTotalScore",
          args: [[5, 15]],
          expected: 20,
          message: "calculateTotalScore([5, 15]) should return 20.",
        },
        {
          type: "function",
          functionName: "calculateTotalScore",
          args: [[]],
          expected: 0,
          message: "calculateTotalScore([]) should return 0.",
        },
      ],
      hints: [
        "Initialize `let total = 0;` before the loop.",
        "Loop from `i = 0` up to `i < scores.length`.",
        "Add `scores[i]` to `total` on each iteration.",
      ],
      solution: 'function calculateTotalScore(scores) {\n  let total = 0;\n  for (let i = 0; i < scores.length; i++) {\n    total += scores[i];\n  }\n  return total;\n}',
      solutionExplanation:
        "The for loop iterates over each index in the array, accumulating each element into the total variable before returning it.",
      requirements: [
        { id: "req-10-01", label: "calculateTotalScore correctly sums array elements", type: "function", target: "calculateTotalScore", expected: 100 },
      ],
    },
  },

  // -------------------------------------------------------------
  // Lesson 11: Functions
  // -------------------------------------------------------------
  {
    id: "lesson-11",
    number: "11",
    title: "Functions: Spells of the Wizard",
    world: "village",
    type: "lesson",
    xp: 160,
    skillId: "programming",
    skillProgress: 5,
    difficulty: "Intermediate",
    estimatedTime: 8,
    description: "Encapsulate reusable spells and routines with function declarations and parameters.",
    concepts: ["function declaration", "parameters", "arguments", "return value"],
    content: [
      {
        type: "paragraph",
        text: "The Village Wizard writes incantations into a spellbook so they can be cast whenever needed. A function is a named, reusable block of code that takes inputs (parameters) and returns an output.",
      },
      {
        type: "heading",
        text: "Writing and Calling Functions",
      },
      {
        type: "code",
        code: 'function castHeal(casterName, healAmount) {\n  console.log(`${casterName} casts Heal!`);\n  return healAmount * 1.5;\n}\n\nlet recoveredHp = castHeal("Merlin", 20); // 30',
      },
      {
        type: "tip",
        text: "The `return` keyword sends a value back to whoever called the function and immediately ends its execution.",
      },
    ],
    challenge: {
      id: "challenge-11",
      lessonId: "lesson-11",
      title: "Functions: Spells of the Wizard",
      prompt: "Write a function `castFireball(power, mana)` that returns `power * 2` if `mana >= 10`. If `mana < 10`, it should return 0 (not enough mana).",
      starterCode: 'function castFireball(power, mana) {\n  // Return power * 2 if mana >= 10, otherwise return 0:\n\n}',
      tests: [
        {
          type: "function",
          functionName: "castFireball",
          args: [25, 15],
          expected: 50,
          message: "castFireball(25, 15) should return 50.",
        },
        {
          type: "function",
          functionName: "castFireball",
          args: [30, 5],
          expected: 0,
          message: "castFireball(30, 5) should return 0 when mana is too low.",
        },
      ],
      hints: [
        "Check `if (mana >= 10)` first and return `power * 2`.",
        "Otherwise, return `0`.",
      ],
      solution: 'function castFireball(power, mana) {\n  if (mana >= 10) {\n    return power * 2;\n  }\n  return 0;\n}',
      solutionExplanation:
        "The function checks whether the caster has at least 10 mana. If so, it amplifies power by 2; otherwise it outputs 0.",
      requirements: [
        { id: "req-11-01", label: "castFireball doubles power when mana >= 10", type: "function", target: "castFireball", expected: 50 },
        { id: "req-11-02", label: "castFireball returns 0 when mana < 10", type: "function", target: "castFireball", expected: 0 },
      ],
    },
  },

  // -------------------------------------------------------------
  // Lesson 12: Arrow Functions
  // -------------------------------------------------------------
  {
    id: "lesson-12",
    number: "12",
    title: "Arrow Functions: Swift Incantations",
    world: "village",
    type: "lesson",
    xp: 170,
    skillId: "programming",
    skillProgress: 5,
    difficulty: "Intermediate",
    estimatedTime: 8,
    description: "Write clean, modern, and concise functions using ES6 arrow syntax.",
    concepts: ["arrow functions =>", "implicit return", "concise syntax"],
    content: [
      {
        type: "paragraph",
        text: "Modern JavaScript wizards use Arrow Functions (`=>`) for swift, concise spellcasting. They are clean and ideal for short helper routines and callbacks.",
      },
      {
        type: "heading",
        text: "Arrow Function Syntax",
      },
      {
        type: "code",
        code: '// Standard function\nconst add = function(a, b) {\n  return a + b;\n};\n\n// Arrow function\nconst addArrow = (a, b) => {\n  return a + b;\n};\n\n// One-line implicit return (no curly braces, no return keyword!)\nconst multiply = (a, b) => a * b;',
      },
      {
        type: "tip",
        text: "If your arrow function body is a single expression, you can omit both the curly braces `{}` and the `return` keyword!",
      },
    ],
    challenge: {
      id: "challenge-12",
      lessonId: "lesson-12",
      title: "Arrow Functions: Swift Incantations",
      prompt: "Declare two arrow functions:\n1. `calculateDamage`: takes `(base, multiplier)` and returns `base * multiplier`\n2. `isCritical`: takes `(roll)` and returns `roll >= 20` (a boolean).",
      starterCode: '// Declare calculateDamage and isCritical as arrow functions:\n',
      tests: [
        {
          type: "function",
          functionName: "calculateDamage",
          args: [15, 3],
          expected: 45,
          message: "calculateDamage(15, 3) should return 45.",
        },
        {
          type: "function",
          functionName: "isCritical",
          args: [20],
          expected: true,
          message: "isCritical(20) should return true.",
        },
        {
          type: "function",
          functionName: "isCritical",
          args: [14],
          expected: false,
          message: "isCritical(14) should return false.",
        },
      ],
      hints: [
        "Use `const calculateDamage = (base, multiplier) => base * multiplier;`",
        "Use `const isCritical = (roll) => roll >= 20;`",
      ],
      solution: 'const calculateDamage = (base, multiplier) => base * multiplier;\nconst isCritical = (roll) => roll >= 20;',
      solutionExplanation:
        "Arrow functions with single-expression bodies implicitly return the result of that expression.",
      requirements: [
        { id: "req-12-01", label: "calculateDamage multiplies base and multiplier", type: "function", target: "calculateDamage", expected: 45 },
        { id: "req-12-02", label: "isCritical returns true for roll >= 20", type: "function", target: "isCritical", expected: true },
      ],
    },
  },

  // -------------------------------------------------------------
  // Lesson 13: Scope
  // -------------------------------------------------------------
  {
    id: "lesson-13",
    number: "13",
    title: "Scope: The Enchanted Boundaries",
    world: "village",
    type: "lesson",
    xp: 170,
    skillId: "programming",
    skillProgress: 5,
    difficulty: "Intermediate",
    estimatedTime: 8,
    description: "Understand where variables live and protect your data using block, function, and global scope.",
    concepts: ["global scope", "function scope", "block scope (let/const)", "lexical environment"],
    content: [
      {
        type: "paragraph",
        text: "Magic in the village has boundaries. Some enchantments cover the entire realm (global scope), while others only exist inside a specific shrine or chamber (block and function scope).",
      },
      {
        type: "heading",
        text: "Block Scope vs Global Scope",
      },
      {
        type: "code",
        code: 'let globalKingdom = "Eldoria"; // Accessible everywhere\n\nfunction enterSanctuary() {\n  let secretRune = "Moonstone"; // Local to this function\n  \n  if (true) {\n    let chamberChest = "Gold"; // Local to this if-block\n    console.log(chamberChest); // "Gold"\n  }\n  \n  // chamberChest is not accessible here!\n}\n\n// secretRune is not accessible out here!',
      },
      {
        type: "tip",
        text: "Keeping variables inside local scopes prevents accidental name collisions and protects data integrity.",
      },
    ],
    challenge: {
      id: "challenge-13",
      lessonId: "lesson-13",
      title: "Scope: The Enchanted Boundaries",
      prompt: "Write a function `createShield(baseShield)` that declares an internal `let bonus = 15;` and returns `baseShield + bonus`. The bonus must be scoped inside the function.",
      starterCode: 'function createShield(baseShield) {\n  // Declare bonus inside the function scope and return total shield:\n\n}',
      tests: [
        {
          type: "function",
          functionName: "createShield",
          args: [35],
          expected: 50,
          message: "createShield(35) should return 50 (35 + 15).",
        },
        {
          type: "function",
          functionName: "createShield",
          args: [100],
          expected: 115,
          message: "createShield(100) should return 115 (100 + 15).",
        },
      ],
      hints: [
        "Declare `let bonus = 15;` inside `createShield`.",
        "Return `baseShield + bonus`.",
      ],
      solution: 'function createShield(baseShield) {\n  let bonus = 15;\n  return baseShield + bonus;\n}',
      solutionExplanation:
        "The variable `bonus` is declared inside `createShield`, making it function-scoped and isolated from the global environment.",
      requirements: [
        { id: "req-13-01", label: "createShield adds internal bonus to baseShield", type: "function", target: "createShield", expected: 50 },
      ],
    },
  },

  // -------------------------------------------------------------
  // Lesson 14: DOM Basics
  // -------------------------------------------------------------
  {
    id: "lesson-14",
    number: "14",
    title: "DOM Basics: Crafting the Village UI",
    world: "village",
    type: "lesson",
    xp: 180,
    skillId: "programming",
    skillProgress: 5,
    difficulty: "Intermediate",
    estimatedTime: 10,
    description: "Understand the Document Object Model (DOM) and how JavaScript builds visual interface elements.",
    concepts: ["DOM tree", "elements", "textContent", "className", "style properties"],
    content: [
      {
        type: "paragraph",
        text: "The Village Architect uses blueprints to construct buildings. In web development, the browser converts HTML into an object tree called the DOM (Document Object Model). JavaScript interacts with UI cards and badges by reading and modifying element objects.",
      },
      {
        type: "heading",
        text: "Representing UI Elements in Code",
      },
      {
        type: "code",
        code: '// A UI Element object contains attributes and content\nlet badgeElement = {\n  tag: "div",\n  className: "quest-badge active",\n  textContent: "Quest Complete: 100 XP",\n  style: { color: "#10b981", fontSize: "14px" }\n};',
      },
      {
        type: "tip",
        text: "Whether using Vanilla JS (`document.createElement`) or UI frameworks like React, UI nodes are structured JavaScript objects holding classes, text, and styles.",
      },
    ],
    challenge: {
      id: "challenge-14",
      lessonId: "lesson-14",
      title: "DOM Basics: Crafting the Village UI",
      prompt: 'Write a function `renderQuestBadge(questTitle, xp, isCompleted)` that returns a UI card object with:\n- `tag`: "div"\n- `className`: `isCompleted ? "badge completed" : "badge active"`\n- `textContent`: `"${questTitle} (+${xp} XP)"`\n- `xp`: `xp`',
      starterCode: 'function renderQuestBadge(questTitle, xp, isCompleted) {\n  // Build and return the UI badge object:\n\n}',
      tests: [
        {
          type: "function",
          functionName: "renderQuestBadge",
          args: ["Find the Sacred Stone", 200, true],
          expected: {
            tag: "div",
            className: "badge completed",
            textContent: "Find the Sacred Stone (+200 XP)",
            xp: 200,
          },
          message: "renderQuestBadge should return a completed badge object.",
        },
        {
          type: "function",
          functionName: "renderQuestBadge",
          args: ["Defeat the Goblins", 150, false],
          expected: {
            tag: "div",
            className: "badge active",
            textContent: "Defeat the Goblins (+150 XP)",
            xp: 150,
          },
          message: "renderQuestBadge should return an active badge object.",
        },
      ],
      hints: [
        'Set `tag: "div"` and `xp: xp`.',
        'Use `isCompleted ? "badge completed" : "badge active"` for the className.',
        'Use a template literal for textContent: `${questTitle} (+${xp} XP)`.',
      ],
      solution: 'function renderQuestBadge(questTitle, xp, isCompleted) {\n  return {\n    tag: "div",\n    className: isCompleted ? "badge completed" : "badge active",\n    textContent: `${questTitle} (+${xp} XP)`,\n    xp: xp,\n  };\n}',
      solutionExplanation:
        "We construct an object representing an element node with semantic class names, text content, and reward data.",
      requirements: [
        { id: "req-14-01", label: "renderQuestBadge returns valid UI object for completed quest", type: "function", target: "renderQuestBadge", expected: { tag: "div", className: "badge completed", textContent: "Find the Sacred Stone (+200 XP)", xp: 200 } },
      ],
    },
  },

  // -------------------------------------------------------------
  // Lesson 15: Events
  // -------------------------------------------------------------
  {
    id: "lesson-15",
    number: "15",
    title: "Events: Village Bell & Town Alarms",
    world: "village",
    type: "lesson",
    xp: 180,
    skillId: "programming",
    skillProgress: 5,
    difficulty: "Intermediate",
    estimatedTime: 10,
    description: "Handle triggers, events, and callback handlers when actions happen in the village.",
    concepts: ["event handling", "event objects", "listeners", "callbacks"],
    content: [
      {
        type: "paragraph",
        text: "When the Village Bell rings, defenders react based on the alert level. In JavaScript, user interactions (clicks, keypresses, timer alarms) dispatch Event objects to listener functions called Event Handlers.",
      },
      {
        type: "heading",
        text: "How Event Handlers Work",
      },
      {
        type: "code",
        code: '// An event object contains details about what happened\nlet clickEvent = {\n  type: "click",\n  target: "cast-spell-btn",\n  timestamp: 1690000000\n};\n\nfunction handleSpellClick(event) {\n  console.log(`Action triggered on ${event.target}`);\n}',
      },
      {
        type: "tip",
        text: "Event handlers receive the event object automatically as their first parameter, giving you all the details about what just occurred.",
      },
    ],
    challenge: {
      id: "challenge-15",
      lessonId: "lesson-15",
      title: "Events: Village Bell & Town Alarms",
      prompt: 'Write a function `handleVillageAlarm(alarmEvent)` that checks `alarmEvent.severity` and returns:\n- "Evacuate immediately!" if severity is "critical"\n- "Gather at town hall." if severity is "warning"\n- "Stay alert." for all other severities.',
      starterCode: 'function handleVillageAlarm(alarmEvent) {\n  // Inspect alarmEvent.severity and return the appropriate instruction:\n\n}',
      tests: [
        {
          type: "function",
          functionName: "handleVillageAlarm",
          args: [{ type: "alarm", severity: "critical", location: "North Gate" }],
          expected: "Evacuate immediately!",
          message: 'handleVillageAlarm with severity "critical" should return "Evacuate immediately!".',
        },
        {
          type: "function",
          functionName: "handleVillageAlarm",
          args: [{ type: "alarm", severity: "warning", location: "Market" }],
          expected: "Gather at town hall.",
          message: 'handleVillageAlarm with severity "warning" should return "Gather at town hall.".',
        },
        {
          type: "function",
          functionName: "handleVillageAlarm",
          args: [{ type: "alarm", severity: "info", location: "Watchtower" }],
          expected: "Stay alert.",
          message: 'handleVillageAlarm with severity "info" should return "Stay alert.".',
        },
      ],
      hints: [
        'Check `if (alarmEvent.severity === "critical")` first.',
        'Add an `else if (alarmEvent.severity === "warning")` branch.',
        'Use `else` for "Stay alert.".',
      ],
      solution: 'function handleVillageAlarm(alarmEvent) {\n  if (alarmEvent.severity === "critical") {\n    return "Evacuate immediately!";\n  } else if (alarmEvent.severity === "warning") {\n    return "Gather at town hall.";\n  } else {\n    return "Stay alert.";\n  }\n}',
      solutionExplanation:
        "The event listener checks the properties of the incoming event object to dispatch the appropriate town protocol.",
      requirements: [
        { id: "req-15-01", label: 'Returns "Evacuate immediately!" on "critical"', type: "function", target: "handleVillageAlarm", expected: "Evacuate immediately!" },
        { id: "req-15-02", label: 'Returns "Gather at town hall." on "warning"', type: "function", target: "handleVillageAlarm", expected: "Gather at town hall." },
        { id: "req-15-03", label: 'Returns "Stay alert." on other severities', type: "function", target: "handleVillageAlarm", expected: "Stay alert." },
      ],
    },
  },

  // -------------------------------------------------------------
  // Lesson 16: Debugging
  // -------------------------------------------------------------
  {
    id: "lesson-16",
    number: "16",
    title: "Debugging: Hunting the Forest Gremlins",
    world: "village",
    type: "lesson",
    xp: 190,
    skillId: "programming",
    skillProgress: 5,
    difficulty: "Intermediate",
    estimatedTime: 10,
    description: "Hunt down bugs, decipher runtime errors, and repair broken logic like a senior engineer.",
    concepts: ["debugging", "TypeError", "ReferenceError", "off-by-one errors", "console inspection"],
    content: [
      {
        type: "paragraph",
        text: "Mischievous forest gremlins have sneaked into the Village Water Purification code! As the resident coder, you must inspect the stack trace, isolate the broken lines, and fix the bugs.",
      },
      {
        type: "heading",
        text: "Common JavaScript Bugs",
      },
      {
        type: "code",
        code: '// 1. ReferenceError: Using an undeclared or misspelled variable\n// let total = totl + 5;\n\n// 2. TypeError: Calling something that is not a function or is undefined\n// let item = null; item.toUpperCase();\n\n// 3. Logic error: Off-by-one loop limit or wrong operator\n// for (let i = 0; i <= arr.length; i++) // Out of bounds!',
      },
      {
        type: "tip",
        text: "When debugging, read error messages carefully from top to bottom. They tell you the exact line number and nature of the bug!",
      },
    ],
    challenge: {
      id: "challenge-16",
      lessonId: "lesson-16",
      title: "Debugging: Hunting the Forest Gremlins",
      prompt: "Fix the broken `calculatePurifiedWater(batches, filterQuality)` function below. It has three gremlin bugs:\n1. A typo in variable name `totalWater` (`totlWater`)\n2. Loop index going out of bounds (`i <= batches.length`)\n3. Filter multiplier missing a return value.",
      starterCode: 'function calculatePurifiedWater(batches, filterQuality) {\n  let totalWater = 0;\n  \n  // BUG 1: Loop index goes out of bounds\n  for (let i = 0; i <= batches.length; i++) {\n    // BUG 2: Typo in variable name\n    totlWater += batches[i];\n  }\n  \n  // BUG 3: Missing return statement with filter multiplier\n  totalWater * filterQuality;\n}',
      tests: [
        {
          type: "function",
          functionName: "calculatePurifiedWater",
          args: [[10, 20, 30], 2],
          expected: 120,
          message: "calculatePurifiedWater([10, 20, 30], 2) should return 120 ((10+20+30)*2).",
        },
        {
          type: "function",
          functionName: "calculatePurifiedWater",
          args: [[5, 5, 5, 5], 1.5],
          expected: 30,
          message: "calculatePurifiedWater([5, 5, 5, 5], 1.5) should return 30.",
        },
      ],
      hints: [
        "Make sure the loop condition uses `< batches.length` instead of `<= batches.length`.",
        "Ensure `totalWater += batches[i];` is spelled correctly.",
        "Return `totalWater * filterQuality` at the end.",
      ],
      solution: 'function calculatePurifiedWater(batches, filterQuality) {\n  let totalWater = 0;\n  for (let i = 0; i < batches.length; i++) {\n    totalWater += batches[i];\n  }\n  return totalWater * filterQuality;\n}',
      solutionExplanation:
        "We fixed the variable name typo, corrected the loop bounds to `< batches.length`, and properly multiplied by filterQuality.",
      requirements: [
        { id: "req-16-01", label: "calculatePurifiedWater correctly returns water total with multiplier", type: "function", target: "calculatePurifiedWater", expected: 120 },
      ],
    },
  },

  // -------------------------------------------------------------
  // Lesson 17: Mini Challenge
  // -------------------------------------------------------------
  {
    id: "lesson-17",
    number: "17",
    title: "Mini Challenge: The Village Market",
    world: "village",
    type: "lesson",
    xp: 220,
    skillId: "programming",
    skillProgress: 10,
    difficulty: "Intermediate",
    estimatedTime: 12,
    description: "Combine variables, arrays, objects, loops, and conditions to manage the bustling Village Market.",
    concepts: ["multi-concept integration", "inventory processing", "objects in arrays", "accumulators"],
    content: [
      {
        type: "paragraph",
        text: "The Grand Merchant of the Village Market needs an automated inventory and order fulfillment system. You must combine variables, loops, conditionals, objects, and arrays into one cohesive algorithm.",
      },
      {
        type: "heading",
        text: "Order Fulfillment Specifications",
      },
      {
        type: "paragraph",
        text: "Given an array of catalog items `[{ id, name, price, inStock }]` and a customer's requested item IDs `['item-1', 'item-2']`, calculate the total bill for all in-stock items and return the count of successfully purchased items.",
      },
      {
        type: "tip",
        text: "Break complex problems down into small steps: find each item, verify stock, add price, and count successes.",
      },
    ],
    challenge: {
      id: "challenge-017",
      lessonId: "lesson-17",
      title: "Mini Challenge: The Village Market",
      prompt: "Write `processMarketOrder(catalog, orderIds)`:\n- Loop through `orderIds`\n- Find the matching item in `catalog` (where `item.id === orderId`)\n- If the item exists and `item.inStock === true`, add its `item.price` to `totalGold` and increment `itemsBought`\n- Return `{ totalGold, itemsBought }`.",
      starterCode: 'function processMarketOrder(catalog, orderIds) {\n  let totalGold = 0;\n  let itemsBought = 0;\n\n  // Loop through orderIds, look up items in catalog, and tally inStock purchases:\n\n  return { totalGold, itemsBought };\n}',
      tests: [
        {
          type: "function",
          functionName: "processMarketOrder",
          args: [
            [
              { id: "sword", price: 50, inStock: true },
              { id: "shield", price: 30, inStock: false },
              { id: "potion", price: 15, inStock: true },
            ],
            ["sword", "shield", "potion"],
          ],
          expected: { totalGold: 65, itemsBought: 2 },
          message: "processMarketOrder should buy sword (50) and potion (15) for total 65 gold and 2 items.",
        },
        {
          type: "function",
          functionName: "processMarketOrder",
          args: [
            [{ id: "bow", price: 40, inStock: true }],
            ["wand"],
          ],
          expected: { totalGold: 0, itemsBought: 0 },
          message: "processMarketOrder should return 0 gold and 0 items when item not found.",
        },
      ],
      hints: [
        "Initialize `let totalGold = 0; let itemsBought = 0;`",
        "Use `catalog.find((item) => item.id === id)` to look up each order ID.",
        "Check `if (item && item.inStock)` before adding to `totalGold` and incrementing `itemsBought`.",
      ],
      solution: 'function processMarketOrder(catalog, orderIds) {\n  let totalGold = 0;\n  let itemsBought = 0;\n  for (let i = 0; i < orderIds.length; i++) {\n    const id = orderIds[i];\n    const item = catalog.find((c) => c.id === id);\n    if (item && item.inStock) {\n      totalGold += item.price;\n      itemsBought += 1;\n    }\n  }\n  return { totalGold, itemsBought };\n}',
      solutionExplanation:
        "We iterate over all requested order IDs, find matching stock in the catalog, verify availability, accumulate gold, and return a summary report.",
      requirements: [
        { id: "req-17-01", label: "Correctly calculates totalGold and itemsBought for available stock", type: "function", target: "processMarketOrder", expected: { totalGold: 65, itemsBought: 2 } },
      ],
    },
  },

  // -------------------------------------------------------------
  // Lesson 18: Boss Challenge (Village Master)
  // -------------------------------------------------------------
  {
    id: "lesson-18",
    number: "18",
    title: "The Village Master: Guardian of Code",
    world: "village",
    type: "boss",
    xp: 500,
    skillId: "programming",
    skillProgress: 20,
    difficulty: "Boss",
    estimatedTime: 15,
    description: "Face the ancient Stone Guardian at the Village Gate in an epic boss battle combining all JavaScript fundamentals!",
    concepts: ["full mastery", "combat simulation", "nested conditions", "array processing", "state management"],
    content: [
      {
        type: "paragraph",
        text: "👑 BOSS BATTLE: The colossal Stone Guardian awakens at the ancient Village Gate! To pass into the greater worlds of The Workshop and The City, you must write the ultimate combat engine.",
      },
      {
        type: "heading",
        text: "Battle Simulation Requirements",
      },
      {
        type: "paragraph",
        text: "You must write `battleGuardian(hero, guardian, actions)` that simulates turn-based combat:\n\n1. `hero` has `{ hp, attack, potions }`\n2. `guardian` has `{ hp, attack, shield }`\n3. `actions` is an array of strings: `['attack', 'potion', 'special']`\n\nFor each action in `actions`:\n- If action is `'attack'`: damage = `hero.attack - guardian.shield`. Deduct damage from `guardian.hp` (damage cannot be negative).\n- If action is `'potion'`: if `hero.potions > 0`, add 30 to `hero.hp` and decrement `hero.potions`.\n- If action is `'special'`: if `hero.hp > 20`, deal `hero.attack * 2` directly to `guardian.hp` (ignoring shield), and hero takes 10 recoil damage.\n- After hero's action, if `guardian.hp > 0`, guardian attacks back dealing `guardian.attack` damage to `hero.hp`.\n\nAt the end of all actions (or if either combatant reaches hp <= 0), return:\n`{ winner: hero.hp > guardian.hp ? 'hero' : 'guardian', heroHp: Math.max(0, hero.hp), guardianHp: Math.max(0, guardian.hp) }`",
      },
      {
        type: "tip",
        text: "Handle edge cases carefully! If guardian HP reaches 0 during a turn, the battle immediately finishes and the hero wins.",
      },
    ],
    challenge: {
      id: "challenge-18",
      lessonId: "lesson-18",
      title: "The Village Master: Guardian of Code",
      prompt: "Implement `battleGuardian(hero, guardian, actions)` according to the combat rules and return `{ winner: 'hero' | 'guardian', heroHp, guardianHp }`.",
      starterCode: `function battleGuardian(hero, guardian, actions) {
  // Create mutable copies of hero and guardian stats
  let hHp = hero.hp;
  let gHp = guardian.hp;
  let potions = hero.potions;

  for (let i = 0; i < actions.length; i++) {
    const action = actions[i];

    // 1. Hero turn ('attack', 'potion', 'special')


    // 2. Check if Guardian defeated (gHp <= 0)


    // 3. Guardian Counter-attack (if guardian still alive)


  }

  // Return combat report: { winner, heroHp, guardianHp }

}`,
      tests: [
        {
          type: "function",
          functionName: "battleGuardian",
          args: [
            { hp: 100, attack: 30, potions: 1 },
            { hp: 80, attack: 15, shield: 10 },
            ["attack", "special", "attack"],
          ],
          expected: { winner: "hero", heroHp: 75, guardianHp: 0 },
          message: "Hero should defeat the Guardian with attack -> special -> attack.",
        },
        {
          type: "function",
          functionName: "battleGuardian",
          args: [
            { hp: 50, attack: 15, potions: 2 },
            { hp: 120, attack: 25, shield: 5 },
            ["potion", "attack"],
          ],
          expected: { winner: "guardian", heroHp: 30, guardianHp: 110 },
          message: "Guardian should win when hero stats and damage are insufficient.",
        },
      ],
      hints: [
        "Track local variables for `hHp`, `gHp`, and `potions`.",
        "In 'attack', calculate `Math.max(0, hero.attack - guardian.shield)`.",
        "In 'special', check `if (hHp > 20)` and deal `hero.attack * 2` directly to `gHp`, then deduct 10 recoil from `hHp`.",
        "If `gHp <= 0`, stop the battle immediately so the guardian doesn't counter-attack!",
      ],
      solution: `function battleGuardian(hero, guardian, actions) {
  let hHp = hero.hp;
  let gHp = guardian.hp;
  let potions = hero.potions;

  for (let i = 0; i < actions.length; i++) {
    const action = actions[i];

    if (action === "attack") {
      const dmg = Math.max(0, hero.attack - guardian.shield);
      gHp -= dmg;
    } else if (action === "potion") {
      if (potions > 0) {
        hHp += 30;
        potions -= 1;
      }
    } else if (action === "special") {
      if (hHp > 20) {
        gHp -= hero.attack * 2;
        hHp -= 10;
      }
    }

    if (gHp <= 0) {
      gHp = 0;
      break;
    }

    hHp -= guardian.attack;
    if (hHp <= 0) {
      hHp = 0;
      break;
    }
  }

  const winner = hHp > gHp ? "hero" : "guardian";
  return {
    winner,
    heroHp: Math.max(0, hHp),
    guardianHp: Math.max(0, gHp),
  };
}`,
      solutionExplanation:
        "The combat engine iterates through player turns, calculating defense subtractions, recoil penalties, healing, and counter-attacks, culminating in a complete victory report.",
      requirements: [
        { id: "req-18-01", label: "Defeat Guardian and return winner: 'hero'", type: "function", target: "battleGuardian", expected: { winner: "hero", heroHp: 75, guardianHp: 0 } },
        { id: "req-18-02", label: "Correctly calculates Guardian victory when hero is overpowered", type: "function", target: "battleGuardian", expected: { winner: "guardian", heroHp: 30, guardianHp: 110 } },
      ],
    },
  },
];

// Helper functions for Village lessons
export function getLessonById(lessonId) {
  return villageLessons.find((l) => l.id === lessonId);
}

export function getNextLessonId(lessonId) {
  const index = villageLessons.findIndex((l) => l.id === lessonId);
  if (index === -1 || index >= villageLessons.length - 1) return null;
  return villageLessons[index + 1].id;
}

export function getLessonIndex(lessonId) {
  return villageLessons.findIndex((l) => l.id === lessonId);
}

export function getVillageProgress(progress) {
  const completed = villageLessons.filter((l) => (progress.completedLessons || []).includes(l.id)).length;
  return Math.round((completed / villageLessons.length) * 100);
}

export function isVillageComplete(progress) {
  return villageLessons.every((l) => (progress.completedLessons || []).includes(l.id));
}