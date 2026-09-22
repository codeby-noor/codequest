/**
 * World 03 — The Web Kingdom
 * Modern Web UI, HTML5, CSS3, DOM & Browser Architecture (16 Missions)
 *
 * A progressive hands-on web development journey:
 * 01. The Kingdom Gate: HTML Document Structure & Elements
 * 02. The Semantic Hall: Semantic HTML5 Structure
 * 03. The Form Tavern: Forms, Inputs, Controls & Attributes
 * 04. The Style Forge: CSS Selectors, Colors & Typography
 * 05. The Box Model Chamber: Spacing, Borders, Padding & Sizing
 * 06. The Flexbox Bridge: 1D Layouts, Alignment & Gaps
 * 07. The Grid Citadel: 2D Grid Systems & Responsive Templates
 * 08. The Responsive Realm: Media Queries & Mobile-First Breakpoints
 * 09. The DOM Library: Querying, Modifying Text & Class Manipulation
 * 10. The Event Square: Event Listeners, Callbacks & UI Responses
 * 11. The Form Guardian: Form Submission, preventDefault & Validation
 * 12. The Dynamic Marketplace: createElement, append & Array Rendering
 * 13. The Browser Vault: localStorage, JSON Serialization & State
 * 14. The Kingdom Debugger: Diagnostics, Broken Selectors & Event Bugs
 * 15. The Kingdom Builder: Mini Project — Adventurer Dashboard
 * 16. The Web Kingdom Guardian: Final Boss — Repairing the Broken Kingdom
 */

export const webKingdomLessons = [
  // -------------------------------------------------------------
  // Mission 01: The Kingdom Gate
  // -------------------------------------------------------------
  {
    id: "web-01",
    number: "01",
    title: "The Kingdom Gate: HTML Document Structure",
    world: "web-kingdom",
    type: "lesson",
    xp: 150,
    skillId: "html-css",
    skillProgress: 6,
    challengeType: "html",
    difficulty: "Beginner",
    estimatedTime: 5,
    description: "Construct the fundamental HTML skeleton: doctype, html, head, title, headings, and paragraphs.",
    concepts: ["<!DOCTYPE html>", "<html>", "<head>", "<title>", "<body>", "<h1>-<h6>", "<p>"],
    content: [
      {
        type: "paragraph",
        text: "🏰 Welcome to The Web Kingdom! Beyond these gates lie the visual architectures of the internet. Every website on Earth starts with HTML — HyperText Markup Language.",
      },
      {
        type: "heading",
        text: "The HTML Document Anatomy",
      },
      {
        type: "paragraph",
        text: "An HTML document begins with `<!DOCTYPE html>`. The `<html>` element wraps everything, containing `<head>` for document metadata and `<body>` for visible content.",
      },
      {
        type: "code",
        code: `<!DOCTYPE html>
<html>
  <head>
    <title>Eldoria Citadel</title>
  </head>
  <body>
    <h1>Welcome to the Web Kingdom</h1>
    <p>Prepare your tools to build rich web interfaces.</p>
  </body>
</html>`,
      },
      {
        type: "tip",
        text: "Always provide matching opening and closing tags (e.g. `<p>...</p>`) to maintain valid document trees.",
      },
    ],
    challenge: {
      id: "challenge-w01",
      lessonId: "web-01",
      title: "The Kingdom Gate: HTML Document Structure",
      prompt:
        "Build the welcome page for the Kingdom Gate. Include a `<title>` that contains 'Kingdom Gate', an `<h1>` heading that says 'Welcome to the Web Kingdom', and a `<p>` paragraph that says 'Enter the realm of web architecture.'",
      starterCode: `<!DOCTYPE html>
<html>
  <head>
    <!-- Add page title here -->
  </head>
  <body>
    <!-- Add your h1 heading and p paragraph here -->
  </body>
</html>`,
      tests: [
        { type: "element", selector: "title", message: "Document needs a <title> in <head>." },
        { type: "text", selector: "title", contains: "Kingdom Gate", message: "<title> should contain 'Kingdom Gate'." },
        { type: "element", selector: "h1", message: "Document needs an <h1> heading." },
        { type: "text", selector: "h1", contains: "Welcome to the Web Kingdom", message: "<h1> should say 'Welcome to the Web Kingdom'." },
        { type: "element", selector: "p", message: "Document needs a <p> paragraph." },
        { type: "text", selector: "p", contains: "Enter the realm of web architecture", message: "<p> should say 'Enter the realm of web architecture.'" },
      ],
      hints: [
        "Inside `<head>`, add `<title>Kingdom Gate</title>`.",
        "Inside `<body>`, add `<h1>Welcome to the Web Kingdom</h1>`.",
        "Below the heading, add `<p>Enter the realm of web architecture.</p>`.",
      ],
      solution: `<!DOCTYPE html>
<html>
  <head>
    <title>Kingdom Gate</title>
  </head>
  <body>
    <h1>Welcome to the Web Kingdom</h1>
    <p>Enter the realm of web architecture.</p>
  </body>
</html>`,
      solutionExplanation:
        "The standard document structure organizes metadata in <head> and renders primary headings and paragraphs inside <body>.",
      requirements: [
        { id: "req-w01-01", label: "Include <title> with 'Kingdom Gate'", type: "element", selector: "title" },
        { id: "req-w01-02", label: "Include <h1> saying 'Welcome to the Web Kingdom'", type: "element", selector: "h1" },
        { id: "req-w01-03", label: "Include <p> with realm description", type: "element", selector: "p" },
      ],
    },
  },

  // -------------------------------------------------------------
  // Mission 02: The Semantic Hall
  // -------------------------------------------------------------
  {
    id: "web-02",
    number: "02",
    title: "The Semantic Hall: Semantic HTML5 Structure",
    world: "web-kingdom",
    type: "lesson",
    xp: 160,
    skillId: "html-css",
    skillProgress: 6,
    challengeType: "html",
    difficulty: "Beginner",
    estimatedTime: 6,
    description: "Replace generic <div> containers with accessible semantic tags: header, nav, main, section, article, and footer.",
    concepts: ["<header>", "<nav>", "<main>", "<section>", "<article>", "<footer>", "accessibility (a11y)"],
    content: [
      {
        type: "paragraph",
        text: "🏛️ In the Semantic Hall of the Royal Archives, ancient scrolls were once stored in unlabeled crates (plain `<div>`s). Semantic tags give structural meaning to screen readers and search engines.",
      },
      {
        type: "heading",
        text: "Semantic HTML5 Elements",
      },
      {
        type: "paragraph",
        text: "Use `<header>` for top banners, `<nav>` for navigation links, `<main>` for primary content, `<section>` for content themes, `<article>` for standalone cards, and `<footer>` for bottom info.",
      },
      {
        type: "code",
        code: `<header>
  <h1>Royal Gazette</h1>
  <nav>
    <a href="#news">News</a>
  </nav>
</header>
<main>
  <article>
    <h2>New World Discovered</h2>
    <p>Adventurers cross into the Web Kingdom.</p>
  </article>
</main>
<footer>
  <p>&copy; 2026 CodeQuest</p>
</footer>`,
      },
      {
        type: "tip",
        text: "A page should contain exactly one `<main>` element to designate its core topic.",
      },
    ],
    challenge: {
      id: "challenge-w02",
      lessonId: "web-02",
      title: "The Semantic Hall: Semantic HTML5 Structure",
      prompt:
        "Build a semantic document layout. Create a `<header>` containing an `<h1>Royal Archives</h1>` and a `<nav>` with at least two `<a>` links. Create a `<main>` containing an `<article>` with an `<h2>` and a `<p>`. Finish with a `<footer>` containing copyright text.",
      starterCode: `<!DOCTYPE html>
<html>
  <body>
    <!-- Build semantic layout here: header (with h1 and nav), main (with article), and footer -->

  </body>
</html>`,
      tests: [
        { type: "element", selector: "header", message: "Layout needs a <header> element." },
        { type: "element", selector: "header h1", message: "<header> needs an <h1> heading." },
        { type: "element", selector: "header nav", message: "<header> needs a <nav> container." },
        { type: "count", selector: "nav a", min: 2, message: "<nav> needs at least two <a> links." },
        { type: "element", selector: "main", message: "Layout needs a <main> element." },
        { type: "element", selector: "main article", message: "<main> needs an <article> element." },
        { type: "element", selector: "main article h2", message: "<article> needs an <h2> subheading." },
        { type: "element", selector: "main article p", message: "<article> needs a <p> description." },
        { type: "element", selector: "footer", message: "Layout needs a <footer> element." },
      ],
      hints: [
        "Inside `<header>`, add `<h1>Royal Archives</h1>` and `<nav><a href=\"#\">Home</a><a href=\"#\">Lore</a></nav>`.",
        "Inside `<main>`, add `<article><h2>Kingdom Chronicles</h2><p>Stories of the realm.</p></article>`.",
        "Close with `<footer><p>&copy; 2026</p></footer>`.",
      ],
      solution: `<!DOCTYPE html>
<html>
  <body>
    <header>
      <h1>Royal Archives</h1>
      <nav>
        <a href="#chronicles">Chronicles</a>
        <a href="#codex">Codex</a>
      </nav>
    </header>
    <main>
      <article>
        <h2>The Ancient Guild</h2>
        <p>A guild of web architects founded centuries ago.</p>
      </article>
    </main>
    <footer>
      <p>&copy; 2026 CodeQuest</p>
    </footer>
  </body>
</html>`,
      solutionExplanation:
        "Semantic tags clarify the architectural hierarchy: header/nav at top, main/article in the center, and footer at the bottom.",
      requirements: [
        { id: "req-w02-01", label: "Include <header> with <h1> and <nav>", type: "element", selector: "header nav" },
        { id: "req-w02-02", label: "Include <main> with <article>", type: "element", selector: "main article" },
        { id: "req-w02-03", label: "Include <footer>", type: "element", selector: "footer" },
      ],
    },
  },

  // -------------------------------------------------------------
  // Mission 03: The Form Tavern
  // -------------------------------------------------------------
  {
    id: "web-03",
    number: "03",
    title: "The Form Tavern: Forms, Inputs & Controls",
    world: "web-kingdom",
    type: "lesson",
    xp: 170,
    skillId: "html-css",
    skillProgress: 6,
    challengeType: "html",
    difficulty: "Beginner",
    estimatedTime: 6,
    description: "Construct interactive forms with labeled text inputs, number fields, select dropdowns, and submit buttons.",
    concepts: ["<form>", "<label>", "<input>", "<select>", "<option>", "<button>", "type", "required"],
    content: [
      {
        type: "paragraph",
        text: "🍻 At the Form Tavern, guildsmen register recruits. Forms collect and submit user data through structured controls like inputs, labels, and dropdowns.",
      },
      {
        type: "heading",
        text: "Accessible Input Association",
      },
      {
        type: "paragraph",
        text: "Always link each `<label for=\"id\">` with its corresponding `<input id=\"id\">`. This allows clicking labels to focus inputs and provides crucial accessibility support.",
      },
      {
        type: "code",
        code: `<form>
  <label for="hero-name">Hero Name:</label>
  <input id="hero-name" type="text" placeholder="e.g. Aria" required>

  <label for="guild-class">Class:</label>
  <select id="guild-class">
    <option value="ranger">Ranger</option>
    <option value="mage">Mage</option>
  </select>

  <button type="submit">Join Guild</button>
</form>`,
      },
      {
        type: "tip",
        text: "Use the `required` attribute on essential input fields to leverage browser-native validation.",
      },
    ],
    challenge: {
      id: "challenge-w03",
      lessonId: "web-03",
      title: "The Form Tavern: Forms, Inputs & Controls",
      prompt:
        "Build an adventurer registration form. Create a `<form>` containing:\n1. A `<label for='hero-name'>` and an `<input id='hero-name' type='text' required>`\n2. A `<label for='hero-level'>` and an `<input id='hero-level' type='number'>`\n3. A `<select id='hero-class'>` with at least 2 `<option>`s\n4. A `<button type='submit'>` with text 'Register Adventurer'.",
      starterCode: `<!DOCTYPE html>
<html>
  <body>
    <!-- Build adventurer registration form here -->

  </body>
</html>`,
      tests: [
        { type: "element", selector: "form", message: "Document needs a <form> element." },
        { type: "element", selector: "label[for='hero-name']", message: "Needs <label for='hero-name'>." },
        { type: "element", selector: "input#hero-name[type='text']", message: "Needs text input with id='hero-name'." },
        { type: "attribute", selector: "input#hero-name", attribute: "required", message: "input#hero-name should have required attribute." },
        { type: "element", selector: "label[for='hero-level']", message: "Needs <label for='hero-level'>." },
        { type: "element", selector: "input#hero-level[type='number']", message: "Needs number input with id='hero-level'." },
        { type: "element", selector: "select#hero-class", message: "Needs <select id='hero-class'>." },
        { type: "count", selector: "select#hero-class option", min: 2, message: "<select> needs at least 2 <option> elements." },
        { type: "element", selector: "button[type='submit']", message: "Needs submit button." },
        { type: "text", selector: "button[type='submit']", contains: "Register Adventurer", message: "Button should say 'Register Adventurer'." },
      ],
      hints: [
        "Wrap all inputs in a `<form>`.",
        "Add `<label for='hero-name'>Name</label><input id='hero-name' type='text' required>`.",
        "Add `<label for='hero-level'>Level</label><input id='hero-level' type='number'>`.",
        "Add `<select id='hero-class'><option>Knight</option><option>Mage</option></select>` and submit button.",
      ],
      solution: `<!DOCTYPE html>
<html>
  <body>
    <form>
      <label for="hero-name">Adventurer Name:</label>
      <input id="hero-name" type="text" required>

      <label for="hero-level">Starting Level:</label>
      <input id="hero-level" type="number" min="1" value="1">

      <label for="hero-class">Class:</label>
      <select id="hero-class">
        <option value="knight">Knight</option>
        <option value="mage">Mage</option>
      </select>

      <button type="submit">Register Adventurer</button>
    </form>
  </body>
</html>`,
      solutionExplanation:
        "The form establishes accessible associations between labels and input controls and provides required submit mechanics.",
      requirements: [
        { id: "req-w03-01", label: "Include required text input with associated label", type: "element", selector: "input#hero-name[required]" },
        { id: "req-w03-02", label: "Include number input and select dropdown", type: "element", selector: "select#hero-class" },
        { id: "req-w03-03", label: "Include submit button saying 'Register Adventurer'", type: "element", selector: "button[type='submit']" },
      ],
    },
  },

  // -------------------------------------------------------------
  // Mission 04: The Style Forge
  // -------------------------------------------------------------
  {
    id: "web-04",
    number: "04",
    title: "The Style Forge: CSS Selectors & Colors",
    world: "web-kingdom",
    type: "lesson",
    xp: 170,
    skillId: "html-css",
    skillProgress: 6,
    challengeType: "css",
    difficulty: "Beginner",
    estimatedTime: 6,
    description: "Dress raw HTML with class selectors, hex colors, backgrounds, borders, and typography.",
    concepts: ["class selector (.class)", "id selector (#id)", "color", "background", "border", "font-family"],
    content: [
      {
        type: "paragraph",
        text: "🎨 At the Style Forge, master crafters weave CSS (Cascading Style Sheets) to give color, texture, and identity to plain HTML skeletons.",
      },
      {
        type: "heading",
        text: "CSS Selectors and Declarations",
      },
      {
        type: "code",
        code: `.guild-card {
  color: #f0f6fc;
  background: #161b22;
  border: 2px solid #58a6ff;
  border-radius: 8px;
}`,
      },
      {
        type: "tip",
        text: "Use reusable classes (`.card`) for common styles and IDs (`#hero-banner`) for unique one-off components.",
      },
    ],
    challenge: {
      id: "challenge-w04",
      lessonId: "web-04",
      title: "The Style Forge: CSS Selectors & Colors",
      prompt:
        "Style the guild badge card. In `<style>`, write CSS for `.guild-card` giving it `background: #161b22`, `color: #58a6ff`, and `border: 2px solid #58a6ff`. Style `.guild-title` with `font-size: 24px`.",
      starterCode: `<style>
  /* Style .guild-card and .guild-title below: */

</style>

<div class="guild-card">
  <h2 class="guild-title">Knights of Code</h2>
  <p>Defenders of clean software.</p>
</div>`,
      tests: [
        { type: "css", selector: ".guild-card", property: "background", message: ".guild-card needs a background property." },
        { type: "css", selector: ".guild-card", property: "color", message: ".guild-card needs a color property." },
        { type: "css", selector: ".guild-card", property: "border", message: ".guild-card needs a border property." },
        { type: "css", selector: ".guild-title", property: "font-size", message: ".guild-title needs font-size: 24px." },
      ],
      hints: [
        "Target `.guild-card { background: #161b22; color: #58a6ff; border: 2px solid #58a6ff; }`",
        "Target `.guild-title { font-size: 24px; }`",
      ],
      solution: `<style>
  .guild-card {
    background: #161b22;
    color: #58a6ff;
    border: 2px solid #58a6ff;
  }
  .guild-title {
    font-size: 24px;
  }
</style>

<div class="guild-card">
  <h2 class="guild-title">Knights of Code</h2>
  <p>Defenders of clean software.</p>
</div>`,
      solutionExplanation:
        "Class selectors apply tailored backgrounds, text colors, and font dimensions to styled elements.",
      requirements: [
        { id: "req-w04-01", label: ".guild-card styled with background, color, and border", type: "css", selector: ".guild-card", property: "background" },
        { id: "req-w04-02", label: ".guild-title has font-size: 24px", type: "css", selector: ".guild-title", property: "font-size" },
      ],
    },
  },

  // -------------------------------------------------------------
  // Mission 05: The Box Model Chamber
  // -------------------------------------------------------------
  {
    id: "web-05",
    number: "05",
    title: "The Box Model Chamber: Spacing & Sizing",
    world: "web-kingdom",
    type: "lesson",
    xp: 180,
    skillId: "html-css",
    skillProgress: 6,
    challengeType: "css",
    difficulty: "Beginner",
    estimatedTime: 7,
    description: "Master padding, margin, border, width, height, and box-sizing: border-box.",
    concepts: ["width", "height", "padding", "margin", "border", "box-sizing: border-box"],
    content: [
      {
        type: "paragraph",
        text: "📦 Every element in a web browser is a rectangular box. The CSS Box Model governs how content, inner padding, borders, and outer margins determine total rendered dimensions.",
      },
      {
        type: "heading",
        text: "The Box Model Layers",
      },
      {
        type: "code",
        code: `.box {
  box-sizing: border-box; /* Includes padding & border in width */
  width: 320px;
  padding: 24px;          /* Inner breathing room */
  border: 2px solid #30363d;
  margin: 16px auto;      /* Outer spacing */
}`,
      },
      {
        type: "tip",
        text: "Using `box-sizing: border-box` ensures padding does not expand your element beyond its specified `width`.",
      },
    ],
    challenge: {
      id: "challenge-w05",
      lessonId: "web-05",
      title: "The Box Model Chamber: Spacing & Sizing",
      prompt:
        "Fix the sizing and spacing of `.inventory-slot`. Give `.inventory-slot` `box-sizing: border-box`, `width: 280px`, `padding: 20px`, `margin: 16px`, and `border: 2px solid #238636`.",
      starterCode: `<style>
  /* Set up the box model for .inventory-slot */
  .inventory-slot {

  }
</style>

<div class="inventory-slot">
  <h3>Mythic Rune</h3>
  <p>Pulsing with ancient energy.</p>
</div>`,
      tests: [
        { type: "css", selector: ".inventory-slot", property: "box-sizing", message: ".inventory-slot needs box-sizing property." },
        { type: "css", selector: ".inventory-slot", property: "width", message: ".inventory-slot needs width: 280px." },
        { type: "css", selector: ".inventory-slot", property: "padding", message: ".inventory-slot needs padding: 20px." },
        { type: "css", selector: ".inventory-slot", property: "margin", message: ".inventory-slot needs margin: 16px." },
        { type: "css", selector: ".inventory-slot", property: "border", message: ".inventory-slot needs border: 2px solid #238636." },
      ],
      hints: [
        "Add `box-sizing: border-box;` inside `.inventory-slot { ... }`.",
        "Add `width: 280px; padding: 20px; margin: 16px; border: 2px solid #238636;`.",
      ],
      solution: `<style>
  .inventory-slot {
    box-sizing: border-box;
    width: 280px;
    padding: 20px;
    margin: 16px;
    border: 2px solid #238636;
  }
</style>

<div class="inventory-slot">
  <h3>Mythic Rune</h3>
  <p>Pulsing with ancient energy.</p>
</div>`,
      solutionExplanation:
        "Configuring padding, margins, and border-box sizing creates consistent, predictable UI card dimensions.",
      requirements: [
        { id: "req-w05-01", label: ".inventory-slot has complete box model properties", type: "css", selector: ".inventory-slot", property: "width" },
      ],
    },
  },

  // -------------------------------------------------------------
  // Mission 06: The Flexbox Bridge
  // -------------------------------------------------------------
  {
    id: "web-06",
    number: "06",
    title: "The Flexbox Bridge: 1D Layouts & Alignment",
    world: "web-kingdom",
    type: "lesson",
    xp: 180,
    skillId: "html-css",
    skillProgress: 6,
    challengeType: "css",
    difficulty: "Intermediate",
    estimatedTime: 8,
    description: "Align, distribute, and space items in rows and columns using CSS Flexbox.",
    concepts: ["display: flex", "justify-content", "align-items", "gap", "flex-wrap"],
    content: [
      {
        type: "paragraph",
        text: "🌉 The Flexbox Bridge spans the chasm between messy float hacks and modern layout engines. Flexbox simplifies 1-dimensional row and column arrangements.",
      },
      {
        type: "heading",
        text: "Flexbox Essentials",
      },
      {
        type: "code",
        code: `.navbar {
  display: flex;
  justify-content: space-between; /* Spread items to opposite ends */
  align-items: center;            /* Center vertically */
  gap: 16px;                      /* Spacing between items */
}`,
      },
      {
        type: "tip",
        text: "The modern `gap` property provides clean spacing between flex items without needing margin overrides.",
      },
    ],
    challenge: {
      id: "challenge-w06",
      lessonId: "web-06",
      title: "The Flexbox Bridge: 1D Layouts & Alignment",
      prompt:
        "Construct a flex navigation bar. Style `.kingdom-nav` with `display: flex`, `justify-content: space-between`, `align-items: center`, and `gap: 16px`.",
      starterCode: `<style>
  /* Turn .kingdom-nav into a flex container */
  .kingdom-nav {

  }
</style>

<nav class="kingdom-nav">
  <div class="logo">Web Kingdom</div>
  <div class="nav-links">
    <a href="#guilds">Guilds</a>
    <a href="#arena">Arena</a>
  </div>
</nav>`,
      tests: [
        { type: "css", selector: ".kingdom-nav", property: "display", value: "flex", message: ".kingdom-nav needs display: flex." },
        { type: "css", selector: ".kingdom-nav", property: "justify-content", message: ".kingdom-nav needs justify-content: space-between." },
        { type: "css", selector: ".kingdom-nav", property: "align-items", message: ".kingdom-nav needs align-items: center." },
        { type: "css", selector: ".kingdom-nav", property: "gap", message: ".kingdom-nav needs gap: 16px." },
      ],
      hints: [
        "Set `display: flex;` inside `.kingdom-nav`.",
        "Add `justify-content: space-between; align-items: center; gap: 16px;`.",
      ],
      solution: `<style>
  .kingdom-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
  }
</style>

<nav class="kingdom-nav">
  <div class="logo">Web Kingdom</div>
  <div class="nav-links">
    <a href="#guilds">Guilds</a>
    <a href="#arena">Arena</a>
  </div>
</nav>`,
      solutionExplanation:
        "display: flex turns .kingdom-nav into a flex container, pushing the logo and links to opposite ends while centering them vertically.",
      requirements: [
        { id: "req-w06-01", label: ".kingdom-nav has display: flex and alignment", type: "css", selector: ".kingdom-nav", property: "display" },
      ],
    },
  },

  // -------------------------------------------------------------
  // Mission 07: The Grid Citadel
  // -------------------------------------------------------------
  {
    id: "web-07",
    number: "07",
    title: "The Grid Citadel: 2D Grid Layouts",
    world: "web-kingdom",
    type: "lesson",
    xp: 190,
    skillId: "html-css",
    skillProgress: 6,
    challengeType: "css",
    difficulty: "Intermediate",
    estimatedTime: 8,
    description: "Construct 2-dimensional card grids using CSS Grid and fractional units (fr).",
    concepts: ["display: grid", "grid-template-columns", "gap", "1fr units", "repeat()"],
    content: [
      {
        type: "paragraph",
        text: "🏰 The Grid Citadel coordinates grand 2-dimensional layouts with rows and columns simultaneously.",
      },
      {
        type: "heading",
        text: "Fractional Units and repeat()",
      },
      {
        type: "code",
        code: `.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 equal columns */
  gap: 20px;
}`,
      },
      {
        type: "tip",
        text: "1fr represents one fraction of free space. `1fr 2fr` splits width into 1/3 and 2/3 columns.",
      },
    ],
    challenge: {
      id: "challenge-w07",
      lessonId: "web-07",
      title: "The Grid Citadel: 2D Grid Layouts",
      prompt:
        "Build a 3-column kingdom dashboard grid. Give `.citadel-grid` `display: grid`, `grid-template-columns: repeat(3, 1fr)` (or `1fr 1fr 1fr`), and `gap: 20px`.",
      starterCode: `<style>
  /* Style .citadel-grid with CSS Grid */
  .citadel-grid {

  }
</style>

<div class="citadel-grid">
  <div class="card">Stats</div>
  <div class="card">Inventory</div>
  <div class="card">Quests</div>
</div>`,
      tests: [
        { type: "css", selector: ".citadel-grid", property: "display", value: "grid", message: ".citadel-grid needs display: grid." },
        { type: "css", selector: ".citadel-grid", property: "grid-template-columns", message: ".citadel-grid needs grid-template-columns." },
        { type: "css", selector: ".citadel-grid", property: "gap", message: ".citadel-grid needs gap: 20px." },
      ],
      hints: [
        "Add `display: grid;` inside `.citadel-grid`.",
        "Add `grid-template-columns: repeat(3, 1fr); gap: 20px;`.",
      ],
      solution: `<style>
  .citadel-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
</style>

<div class="citadel-grid">
  <div class="card">Stats</div>
  <div class="card">Inventory</div>
  <div class="card">Quests</div>
</div>`,
      solutionExplanation:
        "CSS Grid creates a robust 3-column layout where each card automatically occupies equal fractional space.",
      requirements: [
        { id: "req-w07-01", label: ".citadel-grid configured with 3 fractional columns", type: "css", selector: ".citadel-grid", property: "display" },
      ],
    },
  },

  // -------------------------------------------------------------
  // Mission 08: The Responsive Realm
  // -------------------------------------------------------------
  {
    id: "web-08",
    number: "08",
    title: "The Responsive Realm: Media Queries",
    world: "web-kingdom",
    type: "lesson",
    xp: 190,
    skillId: "html-css",
    skillProgress: 6,
    challengeType: "css",
    difficulty: "Intermediate",
    estimatedTime: 8,
    description: "Adapt layouts for mobile, tablet, and desktop screens using CSS @media queries.",
    concepts: ["@media (min-width)", "mobile-first design", "responsive breakpoints", "fluid layouts"],
    content: [
      {
        type: "paragraph",
        text: "📱 Adventurers access guild records on handheld scrolls, tablets, and wide castle monitors. Responsive design ensures interfaces look stunning on every screen size.",
      },
      {
        type: "heading",
        text: "Mobile-First Media Queries",
      },
      {
        type: "code",
        code: `/* Mobile default (1 column) */
.hero-layout {
  display: flex;
  flex-direction: column;
}

/* Tablet & Desktop (>= 768px: 2 columns) */
@media (min-width: 768px) {
  .hero-layout {
    flex-direction: row;
  }
}`,
      },
      {
        type: "tip",
        text: "Mobile-first CSS writes default styles for small screens, then uses `@media (min-width: ...)` to enhance wider viewports.",
      },
    ],
    challenge: {
      id: "challenge-w08",
      lessonId: "web-08",
      title: "The Responsive Realm: Media Queries",
      prompt:
        "Make `.responsive-panel` adaptable. Set default `.responsive-panel` to `display: flex; flex-direction: column;`. Then add a media query `@media (min-width: 768px)` that changes `.responsive-panel` to `flex-direction: row;`.",
      starterCode: `<style>
  /* Mobile-first base styles */
  .responsive-panel {
    display: flex;
    flex-direction: column;
  }

  /* Add media query for screens >= 768px below: */

</style>

<div class="responsive-panel">
  <div class="panel-item">Map View</div>
  <div class="panel-item">Details</div>
</div>`,
      tests: [
        { type: "css", selector: ".responsive-panel", property: "display", value: "flex", message: ".responsive-panel needs display: flex." },
        { type: "css", selector: ".responsive-panel", property: "flex-direction", message: "Base .responsive-panel needs flex-direction: column." },
        { type: "media", minWidth: 768, selector: ".responsive-panel", property: "flex-direction", message: "Needs @media (min-width: 768px) changing .responsive-panel flex-direction." },
      ],
      hints: [
        "Set `.responsive-panel` default to `display: flex; flex-direction: column;`.",
        "Write `@media (min-width: 768px) { .responsive-panel { flex-direction: row; } }`.",
      ],
      solution: `<style>
  .responsive-panel {
    display: flex;
    flex-direction: column;
  }

  @media (min-width: 768px) {
    .responsive-panel {
      flex-direction: row;
    }
  }
</style>

<div class="responsive-panel">
  <div class="panel-item">Map View</div>
  <div class="panel-item">Details</div>
</div>`,
      solutionExplanation:
        "The media query switches the layout from a vertical single-column stack on mobile to a side-by-side row on viewports 768px and wider.",
      requirements: [
        { id: "req-w08-01", label: "Implements mobile-first layout with @media (min-width: 768px) enhancement", type: "media", minWidth: 768, selector: ".responsive-panel", property: "flex-direction" },
      ],
    },
  },

  // -------------------------------------------------------------
  // Mission 09: The DOM Library
  // -------------------------------------------------------------
  {
    id: "web-09",
    number: "09",
    title: "The DOM Library: Querying & Manipulation",
    world: "web-kingdom",
    type: "lesson",
    xp: 200,
    skillId: "dom-manipulation",
    skillProgress: 6,
    challengeType: "dom",
    difficulty: "Intermediate",
    estimatedTime: 8,
    description: "Connect JavaScript to live HTML nodes using querySelector, textContent, and classList.",
    concepts: ["document.querySelector", "textContent", "classList.add", "classList.remove", "DOM nodes"],
    content: [
      {
        type: "paragraph",
        text: "📜 The DOM (Document Object Model) is the live JavaScript representation of your HTML tree. JavaScript can query, read, and modify DOM nodes in real time.",
      },
      {
        type: "heading",
        text: "Selecting and Modifying Nodes",
      },
      {
        type: "code",
        code: `const title = document.querySelector("#hero-title");
title.textContent = "Aria the Grandmaster";
title.classList.add("rank-legendary");`,
      },
      {
        type: "tip",
        text: "`document.querySelector` accepts any standard CSS selector string (e.g. `#id`, `.class`, `tag`).",
      },
    ],
    challenge: {
      id: "challenge-w09",
      lessonId: "web-09",
      title: "The DOM Library: Querying & Manipulation",
      prompt:
        "Update the hero card dynamically with JavaScript. In `<script>`, select `#player-name` and set its `textContent` to 'Sir Rowan', and select `#status-badge` and set its `textContent` to 'Online' while adding class 'active'.",
      starterCode: `<div class="card">
  <h2 id="player-name">Unknown</h2>
  <span id="status-badge" class="badge">Offline</span>
</div>

<script>
  // Select and modify #player-name and #status-badge:

</script>`,
      tests: [
        { type: "text", selector: "#player-name", contains: "Sir Rowan", message: "#player-name should say 'Sir Rowan'." },
        { type: "text", selector: "#status-badge", contains: "Online", message: "#status-badge should say 'Online'." },
        { type: "attribute", selector: "#status-badge", attribute: "class", message: "#status-badge should include 'active' class." },
      ],
      hints: [
        "Use `document.querySelector('#player-name').textContent = 'Sir Rowan';`",
        "Use `const badge = document.querySelector('#status-badge'); badge.textContent = 'Online'; badge.classList.add('active');`",
      ],
      solution: `<div class="card">
  <h2 id="player-name">Unknown</h2>
  <span id="status-badge" class="badge">Offline</span>
</div>

<script>
  const playerName = document.querySelector("#player-name");
  playerName.textContent = "Sir Rowan";

  const statusBadge = document.querySelector("#status-badge");
  statusBadge.textContent = "Online";
  statusBadge.classList.add("active");
</script>`,
      solutionExplanation:
        "We retrieve references to live DOM elements with querySelector and update their text and class attributes programmatically.",
      requirements: [
        { id: "req-w09-01", label: "Sets #player-name to 'Sir Rowan'", type: "text", selector: "#player-name", contains: "Sir Rowan" },
        { id: "req-w09-02", label: "Updates #status-badge to 'Online' and adds 'active' class", type: "text", selector: "#status-badge", contains: "Online" },
      ],
    },
  },

  // -------------------------------------------------------------
  // Mission 10: The Event Square
  // -------------------------------------------------------------
  {
    id: "web-10",
    number: "10",
    title: "The Event Square: Listeners & Interactions",
    world: "web-kingdom",
    type: "lesson",
    xp: 200,
    skillId: "browser-events",
    skillProgress: 6,
    challengeType: "dom",
    difficulty: "Intermediate",
    estimatedTime: 8,
    description: "Bind interactive click events to elements using addEventListener.",
    concepts: ["addEventListener", "click events", "event handlers", "interactive UI"],
    content: [
      {
        type: "paragraph",
        text: "🔔 In the Event Square, town bells sound when touched. Event listeners allow web applications to react dynamically whenever users click, type, or interact.",
      },
      {
        type: "heading",
        text: "Attaching Event Listeners",
      },
      {
        type: "code",
        code: `const btn = document.querySelector("#magic-btn");
btn.addEventListener("click", () => {
  document.querySelector("#output").textContent = "Spell cast successfully!";
});`,
      },
      {
        type: "tip",
        text: "`addEventListener` cleanly separates JavaScript interaction logic from HTML markup.",
      },
    ],
    challenge: {
      id: "challenge-w10",
      lessonId: "web-10",
      title: "The Event Square: Listeners & Interactions",
      prompt:
        "Create an interactive toggle button. Attach a click event listener to `#cast-btn` that changes `#spell-output` text to 'Fireball Cast!' when clicked.",
      starterCode: `<button id="cast-btn">Cast Spell</button>
<p id="spell-output">Ready to cast.</p>

<script>
  // Add click listener to #cast-btn to update #spell-output:

</script>`,
      tests: [
        { type: "element", selector: "#cast-btn", message: "Needs #cast-btn element." },
        {
          type: "event",
          selector: "#cast-btn",
          action: "click",
          postCheck: { selector: "#spell-output", contains: "Fireball Cast!" },
          message: "Clicking #cast-btn should update #spell-output text to 'Fireball Cast!'.",
        },
      ],
      hints: [
        "Select `#cast-btn` and call `.addEventListener('click', () => { ... })`.",
        "Inside the callback, set `document.querySelector('#spell-output').textContent = 'Fireball Cast!';`.",
      ],
      solution: `<button id="cast-btn">Cast Spell</button>
<p id="spell-output">Ready to cast.</p>

<script>
  const castBtn = document.querySelector("#cast-btn");
  const spellOutput = document.querySelector("#spell-output");

  castBtn.addEventListener("click", () => {
    spellOutput.textContent = "Fireball Cast!";
  });
</script>`,
      solutionExplanation:
        "The event listener listens for click actions and updates the output DOM node upon invocation.",
      requirements: [
        { id: "req-w10-01", label: "Clicking #cast-btn updates #spell-output to 'Fireball Cast!'", type: "event", selector: "#cast-btn", action: "click" },
      ],
    },
  },

  // -------------------------------------------------------------
  // Mission 11: The Form Guardian
  // -------------------------------------------------------------
  {
    id: "web-11",
    number: "11",
    title: "The Form Guardian: preventDefault & Validation",
    world: "web-kingdom",
    type: "lesson",
    xp: 210,
    skillId: "form-validation",
    skillProgress: 6,
    challengeType: "dom",
    difficulty: "Intermediate",
    estimatedTime: 9,
    description: "Intercept form submissions, prevent unwanted page reloads with preventDefault, and display validation feedback.",
    concepts: ["event.preventDefault()", "submit event", "input.value", "form validation", "error feedback"],
    content: [
      {
        type: "paragraph",
        text: "🛡️ By default, HTML forms reload the entire webpage on submission. In modern single-page web applications, `event.preventDefault()` stops the browser default reload so JavaScript can validate input smoothly.",
      },
      {
        type: "heading",
        text: "Form Validation Pattern",
      },
      {
        type: "code",
        code: `form.addEventListener("submit", (e) => {
  e.preventDefault(); // Stop page reload
  const value = input.value.trim();
  if (value.length < 3) {
    errorEl.textContent = "Name must be at least 3 characters.";
  } else {
    errorEl.textContent = "Saved successfully!";
  }
});`,
      },
      {
        type: "tip",
        text: "Always call `.trim()` on user input strings to remove stray whitespace before validating.",
      },
    ],
    challenge: {
      id: "challenge-w11",
      lessonId: "web-11",
      title: "The Form Guardian: preventDefault & Validation",
      prompt:
        "Validate player registration. Intercept `#login-form` submit with `e.preventDefault()`. If `#username` input is empty, display 'Username is required' in `#form-msg`. If valid, display 'Welcome, ' followed by the username in `#form-msg`.",
      starterCode: `<form id="login-form">
  <input id="username" type="text" placeholder="Enter hero name">
  <button type="submit" id="submit-btn">Enter Kingdom</button>
</form>
<p id="form-msg"></p>

<script>
  // Intercept submit, validate, and update #form-msg:

</script>`,
      tests: [
        {
          type: "form",
          formSelector: "#login-form",
          inputs: { "#username": "" },
          submitSelector: "#submit-btn",
          postCheck: { selector: "#form-msg", contains: "Username is required" },
          message: "Empty input should display 'Username is required'.",
        },
        {
          type: "form",
          formSelector: "#login-form",
          inputs: { "#username": "Aria" },
          submitSelector: "#submit-btn",
          postCheck: { selector: "#form-msg", contains: "Welcome, Aria" },
          message: "Valid input should display 'Welcome, Aria'.",
        },
      ],
      hints: [
        "Add a submit listener to `#login-form`: `form.addEventListener('submit', (e) => { e.preventDefault(); ... })`.",
        "Check `if (!usernameInput.value.trim())` set `#form-msg` text to 'Username is required'.",
        "Else set text to `'Welcome, ' + usernameInput.value.trim()`.",
      ],
      solution: `<form id="login-form">
  <input id="username" type="text" placeholder="Enter hero name">
  <button type="submit" id="submit-btn">Enter Kingdom</button>
</form>
<p id="form-msg"></p>

<script>
  const form = document.querySelector("#login-form");
  const usernameInput = document.querySelector("#username");
  const formMsg = document.querySelector("#form-msg");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const val = usernameInput.value.trim();
    if (!val) {
      formMsg.textContent = "Username is required";
    } else {
      formMsg.textContent = "Welcome, " + val;
    }
  });
</script>`,
      solutionExplanation:
        "e.preventDefault() prevents page navigation, allowing JavaScript to inspect values and render validation feedback directly to the DOM.",
      requirements: [
        { id: "req-w11-01", label: "Validates empty input and renders error message", type: "form", formSelector: "#login-form" },
      ],
    },
  },

  // -------------------------------------------------------------
  // Mission 12: The Dynamic Marketplace
  // -------------------------------------------------------------
  {
    id: "web-12",
    number: "12",
    title: "The Dynamic Marketplace: Dynamic DOM Rendering",
    world: "web-kingdom",
    type: "lesson",
    xp: 220,
    skillId: "dom-manipulation",
    skillProgress: 6,
    challengeType: "dom",
    difficulty: "Intermediate",
    estimatedTime: 9,
    description: "Programmatically generate and append new DOM elements from JavaScript data arrays.",
    concepts: ["document.createElement", "element.append", "rendering lists", "DOM generation"],
    content: [
      {
        type: "paragraph",
        text: "🏪 In the Marketplace, merchant inventories update dynamically as new shipments arrive. Web applications dynamically create HTML nodes in memory and attach them into the live page.",
      },
      {
        type: "heading",
        text: "Creating and Appending Nodes",
      },
      {
        type: "code",
        code: `const items = ["Potion", "Elixir", "Scroll"];
const list = document.querySelector("#inventory-list");

items.forEach((item) => {
  const li = document.createElement("li");
  li.textContent = item;
  li.classList.add("item-card");
  list.append(li);
});`,
      },
      {
        type: "tip",
        text: "`document.createElement` generates a detached node in memory; calling `.append(node)` injects it into the visible page tree.",
      },
    ],
    challenge: {
      id: "challenge-w12",
      lessonId: "web-12",
      title: "The Dynamic Marketplace: Dynamic DOM Rendering",
      prompt:
        "Render the merchant supplies array into `#market-list`. For each supply in `['Elixir of Speed', 'Shadow Cloak', 'Phoenix Feather']`, create an `<li>` element with class 'market-item', set its text to the item name, and append it to `#market-list`.",
      starterCode: `<ul id="market-list"></ul>

<script>
  const supplies = ['Elixir of Speed', 'Shadow Cloak', 'Phoenix Feather'];
  // Create and append an <li> for each supply into #market-list:

</script>`,
      tests: [
        { type: "count", selector: "#market-list li", min: 3, message: "#market-list needs at least 3 <li> items." },
        { type: "text", selector: "#market-list", contains: "Elixir of Speed", message: "List should contain 'Elixir of Speed'." },
        { type: "text", selector: "#market-list", contains: "Shadow Cloak", message: "List should contain 'Shadow Cloak'." },
        { type: "text", selector: "#market-list", contains: "Phoenix Feather", message: "List should contain 'Phoenix Feather'." },
      ],
      hints: [
        "Select the list with `const list = document.querySelector('#market-list');`.",
        "Loop over `supplies.forEach((item) => { const li = document.createElement('li'); li.className = 'market-item'; li.textContent = item; list.append(li); });`.",
      ],
      solution: `<ul id="market-list"></ul>

<script>
  const supplies = ['Elixir of Speed', 'Shadow Cloak', 'Phoenix Feather'];
  const list = document.querySelector('#market-list');

  supplies.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'market-item';
    li.textContent = item;
    list.append(li);
  });
</script>`,
      solutionExplanation:
        "Iterating through the data array, creating distinct <li> nodes, and appending them populates the list dynamically.",
      requirements: [
        { id: "req-w12-01", label: "Dynamically renders all 3 supplies as <li> elements", type: "count", selector: "#market-list li", min: 3 },
      ],
    },
  },

  // -------------------------------------------------------------
  // Mission 13: The Browser Vault
  // -------------------------------------------------------------
  {
    id: "web-13",
    number: "13",
    title: "The Browser Vault: localStorage & JSON",
    world: "web-kingdom",
    type: "lesson",
    xp: 220,
    skillId: "browser-storage",
    skillProgress: 6,
    challengeType: "dom",
    difficulty: "Intermediate",
    estimatedTime: 9,
    description: "Persist player state across page refreshes using localStorage and JSON.stringify/JSON.parse.",
    concepts: ["localStorage.setItem", "localStorage.getItem", "JSON.stringify", "JSON.parse", "persistence"],
    content: [
      {
        type: "paragraph",
        text: "🔐 The Royal Vault preserves hero credentials indefinitely. `localStorage` allows web applications to save key-value strings in the browser that persist across refreshes.",
      },
      {
        type: "heading",
        text: "Storing Objects with JSON",
      },
      {
        type: "code",
        code: `const hero = { name: "Aria", gold: 150 };

// Serialize and save to localStorage
localStorage.setItem("savedHero", JSON.stringify(hero));

// Load and parse back to object
const raw = localStorage.getItem("savedHero");
const loadedHero = JSON.parse(raw);`,
      },
      {
        type: "tip",
        text: "`localStorage` only stores strings. Always convert objects to strings with `JSON.stringify` before saving!",
      },
    ],
    challenge: {
      id: "challenge-w13",
      lessonId: "web-13",
      title: "The Browser Vault: localStorage & JSON",
      prompt:
        "Save player profile to localStorage. In `<script>`, save an object `{ hero: 'Rowan', level: 10, title: 'Logic Knight' }` under key 'player_profile' using `JSON.stringify()`. Then display the saved hero name inside `#profile-display`.",
      starterCode: `<div id="profile-display"></div>

<script>
  const profile = { hero: 'Rowan', level: 10, title: 'Logic Knight' };
  // Save profile under 'player_profile' with JSON.stringify and update #profile-display:

</script>`,
      tests: [
        { type: "storage", key: "player_profile", contains: "Rowan", message: "localStorage key 'player_profile' should contain saved JSON data with 'Rowan'." },
        { type: "text", selector: "#profile-display", contains: "Rowan", message: "#profile-display should display the hero name 'Rowan'." },
      ],
      hints: [
        "Call `localStorage.setItem('player_profile', JSON.stringify(profile));`.",
        "Set `document.querySelector('#profile-display').textContent = profile.hero;`.",
      ],
      solution: `<div id="profile-display"></div>

<script>
  const profile = { hero: 'Rowan', level: 10, title: 'Logic Knight' };
  localStorage.setItem('player_profile', JSON.stringify(profile));

  const display = document.querySelector("#profile-display");
  display.textContent = profile.hero;
</script>`,
      solutionExplanation:
        "JSON.stringify encodes the profile object into a string saved to localStorage, allowing persistent data retrieval.",
      requirements: [
        { id: "req-w13-01", label: "Saves JSON profile to localStorage and updates UI", type: "storage", key: "player_profile" },
      ],
    },
  },

  // -------------------------------------------------------------
  // Mission 14: The Kingdom Debugger
  // -------------------------------------------------------------
  {
    id: "web-14",
    number: "14",
    title: "The Kingdom Debugger: Browser Diagnostics",
    world: "web-kingdom",
    type: "lesson",
    xp: 230,
    skillId: "web-debugging",
    skillProgress: 6,
    challengeType: "dom",
    difficulty: "Advanced",
    estimatedTime: 10,
    description: "Diagnose and fix broken selectors, missing event bindings, and null reference exceptions.",
    concepts: ["runtime error diagnostics", "selector typos", "null handling", "debugging browser code"],
    content: [
      {
        type: "paragraph",
        text: "🔍 A faulty spell caused chaos in the Grand Observatory: buttons throw TypeError exceptions, and broken selectors return `null`. Professional engineers debug systematically by verifying selectors and event bindings.",
      },
      {
        type: "heading",
        text: "Common Browser Bug Traps",
      },
      {
        type: "paragraph",
        text: "1. **Selector Mismatch**: Querying `.btn` when the HTML element has `id='btn'` (`#btn`).\n2. **Null Dereference**: Calling `.addEventListener` on an element that wasn't found (`null`).\n3. **Property Typo**: Setting `.text` instead of `.textContent`.",
      },
      {
        type: "tip",
        text: "Always check your selector spelling matches the HTML markup exactly.",
      },
    ],
    challenge: {
      id: "challenge-w14",
      lessonId: "web-14",
      title: "The Kingdom Debugger: Browser Diagnostics",
      prompt:
        "Fix the broken code below so that clicking `#repair-btn` changes `#system-status` text to 'Systems Operational' and adds class 'fixed'. Fix the selector typo and property errors.",
      starterCode: `<button id="repair-btn">Repair System</button>
<div id="system-status" class="status-box">Fault Detected</div>

<script>
  // BUG: The selector and property below are broken! Fix them:
  const btn = document.querySelector(".repair-btn"); // BUG: class instead of id
  btn.addEventListener("click", () => {
    const status = document.querySelector("#system-status");
    status.text = "Systems Operational"; // BUG: .text instead of .textContent
    status.className += " fixed";
  });
</script>`,
      tests: [
        {
          type: "event",
          selector: "#repair-btn",
          action: "click",
          postCheck: { selector: "#system-status", contains: "Systems Operational" },
          message: "Clicking #repair-btn should successfully update #system-status to 'Systems Operational'.",
        },
        { type: "attribute", selector: "#system-status", attribute: "class", message: "#system-status should have 'fixed' class." },
      ],
      hints: [
        "Change `document.querySelector('.repair-btn')` to `document.querySelector('#repair-btn')`.",
        "Change `status.text` to `status.textContent = 'Systems Operational'`.",
      ],
      solution: `<button id="repair-btn">Repair System</button>
<div id="system-status" class="status-box">Fault Detected</div>

<script>
  const btn = document.querySelector("#repair-btn");
  btn.addEventListener("click", () => {
    const status = document.querySelector("#system-status");
    status.textContent = "Systems Operational";
    status.classList.add("fixed");
  });
</script>`,
      solutionExplanation:
        "Fixing the ID selector `#repair-btn` and using the standard `textContent` property resolves the null reference and updates the DOM properly.",
      requirements: [
        { id: "req-w14-01", label: "Fixes selector and event handler bugs to restore functionality", type: "event", selector: "#repair-btn", action: "click" },
      ],
    },
  },

  // -------------------------------------------------------------
  // Mission 15: THE KINGDOM BUILDER (Mini Project)
  // -------------------------------------------------------------
  {
    id: "web-15",
    number: "15",
    title: "The Kingdom Builder: Adventurer Dashboard",
    world: "web-kingdom",
    type: "lesson",
    xp: 260,
    skillId: "html-css",
    skillProgress: 8,
    challengeType: "dom",
    difficulty: "Advanced",
    estimatedTime: 12,
    description: "Combine HTML structure, CSS Flexbox/Grid styling, DOM manipulation, forms, and events into a complete Adventurer Dashboard.",
    concepts: ["mini project", "full web integration", "event handling", "dynamic rendering", "form validation"],
    content: [
      {
        type: "paragraph",
        text: "🛠️ You have reached the Kingdom Builder Guild! Here you unite all your web skills — semantic markup, CSS layouts, form controls, events, and dynamic DOM rendering — into a complete, working web application.",
      },
      {
        type: "heading",
        text: "The Dashboard Architecture",
      },
      {
        type: "paragraph",
        text: "You will build the Adventurer Dashboard with real-time stats display, an item registration form, and dynamic inventory list generation.",
      },
      {
        type: "tip",
        text: "Build each feature step by step: structure the HTML, attach the form submit listener, prevent default, read input values, and append new list elements.",
      },
    ],
    challenge: {
      id: "challenge-w15",
      lessonId: "web-15",
      title: "The Kingdom Builder: Adventurer Dashboard",
      prompt:
        "Build the interactive Adventurer Dashboard:\n1. Provide a `<header>` with an `<h1>Adventurer Dashboard</h1>`\n2. Include an inventory form `#item-form` with text input `#item-input` and button `#add-btn`\n3. When `#item-form` is submitted, prevent default page reload, take the `#item-input` value, create an `<li>` element, append it to `#inventory-list`, and clear the input.\n4. Initialize `#inventory-list` with at least 1 starter item.",
      starterCode: `<header>
  <h1>Adventurer Dashboard</h1>
</header>
<main>
  <form id="item-form">
    <input id="item-input" type="text" placeholder="New item...">
    <button type="submit" id="add-btn">Add Item</button>
  </form>
  <ul id="inventory-list">
    <li>Starter Compass</li>
  </ul>
</main>

<script>
  // Implement item addition logic:

</script>`,
      tests: [
        { type: "element", selector: "header h1", message: "Needs <header> with <h1>." },
        { type: "count", selector: "#inventory-list li", min: 1, message: "#inventory-list needs starter item." },
        {
          type: "form",
          formSelector: "#item-form",
          inputs: { "#item-input": "Magic Crystal" },
          submitSelector: "#add-btn",
          postCheck: { selector: "#inventory-list", contains: "Magic Crystal" },
          message: "Submitting #item-form with 'Magic Crystal' should append it to #inventory-list.",
        },
      ],
      hints: [
        "Attach submit listener to `#item-form`: `form.addEventListener('submit', (e) => { e.preventDefault(); ... })`.",
        "Read `const val = input.value.trim();`",
        "If `val`, create `const li = document.createElement('li'); li.textContent = val; list.append(li); input.value = '';`.",
      ],
      solution: `<header>
  <h1>Adventurer Dashboard</h1>
</header>
<main>
  <form id="item-form">
    <input id="item-input" type="text" placeholder="New item...">
    <button type="submit" id="add-btn">Add Item</button>
  </form>
  <ul id="inventory-list">
    <li>Starter Compass</li>
  </ul>
</main>

<script>
  const form = document.querySelector("#item-form");
  const input = document.querySelector("#item-input");
  const list = document.querySelector("#inventory-list");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const val = input.value.trim();
    if (val) {
      const li = document.createElement("li");
      li.textContent = val;
      list.append(li);
      input.value = "";
    }
  });
</script>`,
      solutionExplanation:
        "The mini project coordinates form handling, event prevention, DOM node creation, and dynamic UI synchronization.",
      requirements: [
        { id: "req-w15-01", label: "Appends items to inventory on form submit", type: "form", formSelector: "#item-form" },
      ],
    },
  },

  // -------------------------------------------------------------
  // Mission 16: THE WEB KINGDOM GUARDIAN (Boss Battle)
  // -------------------------------------------------------------
  {
    id: "web-16",
    number: "16",
    title: "The Web Kingdom Guardian: Repairing the Citadel",
    world: "web-kingdom",
    type: "boss",
    xp: 650,
    skillId: "html-css",
    skillProgress: 10,
    challengeType: "dom",
    difficulty: "Boss",
    estimatedTime: 15,
    description: "Defeat the Web Kingdom Guardian by repairing the broken Royal Citadel Portal application.",
    concepts: ["boss battle", "debugging", "semantic markup", "DOM integration", "form validation", "storage"],
    content: [
      {
        type: "paragraph",
        text: "👑 The Web Kingdom Guardian stands atop the High Citadel! Ancient corruption has sabotaged the Kingdom Gatekeeper app. To restore harmony and unlock World 4: The API Harbor, you must repair every broken link in the system.",
      },
      {
        type: "heading",
        text: "The Guardian's Repair Checklist",
      },
      {
        type: "paragraph",
        text: "1. **Semantic Structure**: Provide semantic `<header>`, `<main>`, and `<footer>` elements.\n2. **Portal Form**: Intercept `#portal-form` submit with `e.preventDefault()`.\n3. **Validation**: If `#crystal-code` input is empty, display 'Error: Code required' in `#portal-status`. If code is 'ELDORIA', set text to 'Portal Activated', add class 'active', and save 'ACTIVE' into `localStorage` key 'portal_state'.",
      },
      {
        type: "tip",
        text: "Check selector spelling, event prevention, class additions, and localStorage operations carefully.",
      },
    ],
    challenge: {
      id: "challenge-w16",
      lessonId: "web-16",
      title: "The Web Kingdom Guardian: Repairing the Citadel",
      prompt:
        "Repair the Royal Citadel Portal application:\n\n1. Wrap page with `<header>`, `<main>`, and `<footer>`\n2. Intercept `#portal-form` submit and prevent page reload\n3. If `#crystal-code` input is empty, display 'Error: Code required' in `#portal-status`\n4. If `#crystal-code` is 'ELDORIA', display 'Portal Activated' in `#portal-status`, add class 'active' to `#portal-status`, and save 'ACTIVE' in `localStorage` under key 'portal_state'.",
      starterCode: `<header>
  <h1>Citadel Gatekeeper</h1>
</header>
<main>
  <form id="portal-form">
    <input id="crystal-code" type="text" placeholder="Enter crystal code">
    <button type="submit" id="activate-btn">Activate Portal</button>
  </form>
  <div id="portal-status">Standby</div>
</main>
<footer>
  <p>&copy; 2026 Web Kingdom</p>
</footer>

<script>
  // Repair the portal activation system below:

</script>`,
      tests: [
        { type: "element", selector: "header h1", message: "Needs <header> with <h1>." },
        { type: "element", selector: "main form#portal-form", message: "Needs <main> with #portal-form." },
        { type: "element", selector: "footer", message: "Needs <footer> element." },
        {
          type: "form",
          formSelector: "#portal-form",
          inputs: { "#crystal-code": "" },
          submitSelector: "#activate-btn",
          postCheck: { selector: "#portal-status", contains: "Error: Code required" },
          message: "Empty crystal code should display 'Error: Code required'.",
        },
        {
          type: "form",
          formSelector: "#portal-form",
          inputs: { "#crystal-code": "ELDORIA" },
          submitSelector: "#activate-btn",
          postCheck: { selector: "#portal-status", contains: "Portal Activated" },
          message: "Entering 'ELDORIA' should activate portal.",
        },
        {
          type: "storage",
          key: "portal_state",
          contains: "ACTIVE",
          message: "Activating portal should store 'ACTIVE' in localStorage under 'portal_state'.",
        },
      ],
      hints: [
        "Select `#portal-form`, `#crystal-code`, and `#portal-status`.",
        "Add submit listener: `form.addEventListener('submit', (e) => { e.preventDefault(); ... })`.",
        "If input is empty, set `#portal-status` text to 'Error: Code required'.",
        "If input === 'ELDORIA', set status text to 'Portal Activated', call `status.classList.add('active')`, and `localStorage.setItem('portal_state', 'ACTIVE')`.",
      ],
      solution: `<header>
  <h1>Citadel Gatekeeper</h1>
</header>
<main>
  <form id="portal-form">
    <input id="crystal-code" type="text" placeholder="Enter crystal code">
    <button type="submit" id="activate-btn">Activate Portal</button>
  </form>
  <div id="portal-status">Standby</div>
</main>
<footer>
  <p>&copy; 2026 Web Kingdom</p>
</footer>

<script>
  const form = document.querySelector("#portal-form");
  const input = document.querySelector("#crystal-code");
  const status = document.querySelector("#portal-status");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const code = input.value.trim();
    if (!code) {
      status.textContent = "Error: Code required";
    } else if (code === "ELDORIA") {
      status.textContent = "Portal Activated";
      status.classList.add("active");
      localStorage.setItem("portal_state", "ACTIVE");
    }
  });
</script>`,
      solutionExplanation:
        "The master portal engine coordinates semantic layout, submit interception, multi-branch input validation, class manipulation, and persistent storage synchronization to defeat the Web Kingdom Guardian.",
      requirements: [
        { id: "req-w16-01", label: "Defeats the Web Kingdom Guardian by repairing Citadel portal engine", type: "form", formSelector: "#portal-form" },
      ],
    },
  },
];

/** Get Web Kingdom lesson by ID */
export function getWebKingdomLessonById(lessonId) {
  return webKingdomLessons.find((l) => l.id === lessonId);
}

/** Get next Web Kingdom lesson ID */
export function getNextWebKingdomLessonId(lessonId) {
  const index = webKingdomLessons.findIndex((l) => l.id === lessonId);
  if (index === -1 || index >= webKingdomLessons.length - 1) return null;
  return webKingdomLessons[index + 1].id;
}

/** Get progress percentage for Web Kingdom */
export function getWebKingdomProgress(progress = {}) {
  const completed = webKingdomLessons.filter((l) => (progress.completedLessons || []).includes(l.id)).length;
  return Math.min(100, Math.round((completed / webKingdomLessons.length) * 100));
}

/** Check if Web Kingdom is fully complete */
export function isWebKingdomComplete(progress = {}) {
  return (
    webKingdomLessons.length > 0 &&
    webKingdomLessons.every((l) => (progress.completedLessons || []).includes(l.id))
  );
}
