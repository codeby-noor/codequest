/**
 * World 02 — The Workshop
 * HTML + CSS Fundamentals
 *
 * Each lesson follows the SAME architecture as Village lessons,
 * plus world-aware fields:
 *  - world: "workshop"
 *  - skillId: "html" | "css" | "web-foundations"
 *  - skillProgress: percent added to that skill on completion
 *  - challengeType: "html" | "css" | "html-css"
 *
 * HTML/CSS challenges are evaluated in a sandboxed iframe preview
 * (see engine/htmlCssValidator.js) — never through the JS worker.
 */

export const workshopLessons = [
  {
    id: "workshop-01",
    number: "01",
    title: "Meet HTML",
    world: "workshop",
    type: "lesson",
    xp: 100,
    skillId: "html",
    skillProgress: 10,
    challengeType: "html",
    difficulty: "Beginner",
    estimatedTime: 5,
    description: "Learn the structure of HTML — elements, tags, headings, and paragraphs.",
    concepts: ["HTML document structure", "elements", "tags", "opening/closing tags", "headings", "paragraphs"],
    content: [
      {
        type: "paragraph",
        text: "Every website you've ever visited is built on HTML — HyperText Markup Language. HTML is the skeleton of the web: it defines the structure and content of a page.",
      },
      {
        type: "heading",
        text: "Elements and tags",
      },
      {
        type: "paragraph",
        text: "An HTML element is a building block of a page. Elements are written using tags — keywords wrapped in angle brackets. Most elements have an opening tag and a closing tag.",
      },
      {
        type: "code",
        code: "<h1>Hello, Workshop!</h1>",
      },
      {
        type: "paragraph",
        text: "<h1> is the opening tag, </h1> is the closing tag (note the forward slash), and the text between them is the element's content.",
      },
      {
        type: "heading",
        text: "The document structure",
      },
      {
        type: "paragraph",
        text: "Every HTML page follows the same basic skeleton. The <!DOCTYPE html> declaration tells the browser this is an HTML5 document. The <html> element wraps everything. Inside it, <head> holds metadata (like the page title) and <body> holds the visible content.",
      },
      {
        type: "code",
        code: "<!DOCTYPE html>\n<html>\n  <head>\n    <title>My Page</title>\n  </head>\n  <body>\n    <h1>Welcome!</h1>\n    <p>This is my first page.</p>\n  </body>\n</html>",
      },
      {
        type: "heading",
        text: "Headings and paragraphs",
      },
      {
        type: "paragraph",
        text: "Headings go from <h1> (most important) down to <h6> (least important). Paragraphs use the <p> tag. Together they give your page structure and meaning.",
      },
      {
        type: "tip",
        text: "Always close your tags! A missing closing tag is the #1 beginner HTML mistake.",
      },
    ],
    challenge: {
      id: "challenge-w01",
      prompt:
        "Create a simple webpage structure. Your page must have a <h1> heading that says 'My Workshop' and a <p> paragraph that says 'I am learning HTML.'",
      starterCode: "<!DOCTYPE html>\n<html>\n  <head>\n    <title>My Page</title>\n  </head>\n  <body>\n    <!-- Add your h1 and p here -->\n  </body>\n</html>",
      tests: [
        {
          type: "element",
          selector: "h1",
          message: "Your page needs an <h1> heading.",
        },
        {
          type: "element",
          selector: "p",
          message: "Your page needs a <p> paragraph.",
        },
        {
          type: "text",
          selector: "h1",
          contains: "My Workshop",
          message: "The <h1> should say 'My Workshop'.",
        },
        {
          type: "text",
          selector: "p",
          contains: "I am learning HTML",
          message: "The <p> should say 'I am learning HTML.'",
        },
      ],
      hints: [
        "Add an <h1> tag inside the <body>.",
        "Add a <p> tag below the <h1>.",
        "Make sure both tags are closed: <h1>...</h1> and <p>...</p>",
      ],
      solution:
        "<!DOCTYPE html>\n<html>\n  <head>\n    <title>My Page</title>\n  </head>\n  <body>\n    <h1>My Workshop</h1>\n    <p>I am learning HTML.</p>\n  </body>\n</html>",
      solutionExplanation:
        "The <h1> tag creates a top-level heading and the <p> tag creates a paragraph. Both live inside the <body>, which is where all visible content goes.",
      requirements: [
        { id: "req-w01-01", label: "Include an <h1> heading", type: "element", selector: "h1" },
        { id: "req-w01-02", label: "Include a <p> paragraph", type: "element", selector: "p" },
        { id: "req-w01-03", label: "The <h1> says 'My Workshop'", type: "text", selector: "h1", contains: "My Workshop" },
        { id: "req-w01-04", label: "The <p> says 'I am learning HTML.'", type: "text", selector: "p", contains: "I am learning HTML" },
      ],
    },
  },
  {
    id: "workshop-02",
    number: "02",
    title: "Links & Images",
    world: "workshop",
    type: "lesson",
    xp: 120,
    skillId: "html",
    skillProgress: 10,
    challengeType: "html",
    difficulty: "Beginner",
    estimatedTime: 6,
    description: "Connect the web with <a> links and <img> images.",
    concepts: ["<a>", "href", "<img>", "src", "alt"],
    content: [
      {
        type: "paragraph",
        text: "The web is called the web because everything is connected. Links (<a>) and images (<img>) are how you connect pages and add visual content.",
      },
      {
        type: "heading",
        text: "Links with <a>",
      },
      {
        type: "paragraph",
        text: "The <a> tag creates a link. The href attribute tells the browser where the link goes.",
      },
      {
        type: "code",
        code: '<a href="https://example.com">Visit Example</a>',
      },
      {
        type: "heading",
        text: "Images with <img>",
      },
      {
        type: "paragraph",
        text: "The <img> tag displays an image. It has two important attributes: src (the image source/URL) and alt (alternative text shown if the image can't load, and read by screen readers).",
      },
      {
        type: "code",
        code: '<img src="profile.jpg" alt="A photo of me">',
      },
      {
        type: "paragraph",
        text: "Unlike most tags, <img> is self-closing — it has no closing tag.",
      },
      {
        type: "tip",
        text: "Always add alt text to images. It's essential for accessibility and helps search engines understand your page.",
      },
    ],
    challenge: {
      id: "challenge-w02",
      prompt:
        "Build a profile card containing an image and a link. Add an <img> with src='avatar.png' and alt='My avatar', plus an <a> link with href='https://example.com' that says 'Visit my profile'.",
      starterCode: "<!DOCTYPE html>\n<html>\n  <body>\n    <!-- Add your img and a here -->\n  </body>\n</html>",
      tests: [
        {
          type: "element",
          selector: "img",
          message: "Your page needs an <img> element.",
        },
        {
          type: "attribute",
          selector: "img",
          attribute: "src",
          value: "avatar.png",
          message: "The <img> needs src='avatar.png'.",
        },
        {
          type: "attribute",
          selector: "img",
          attribute: "alt",
          message: "The <img> needs an alt attribute.",
        },
        {
          type: "element",
          selector: "a",
          message: "Your page needs an <a> link.",
        },
        {
          type: "attribute",
          selector: "a",
          attribute: "href",
          value: "https://example.com",
          message: "The <a> needs href='https://example.com'.",
        },
        {
          type: "text",
          selector: "a",
          contains: "Visit my profile",
          message: "The link text should say 'Visit my profile'.",
        },
      ],
      hints: [
        "Use <img src=\"avatar.png\" alt=\"My avatar\"> for the image.",
        "Use <a href=\"https://example.com\">Visit my profile</a> for the link.",
        "Both elements go inside the <body>.",
      ],
      solution:
        '<!DOCTYPE html>\n<html>\n  <body>\n    <img src="avatar.png" alt="My avatar">\n    <a href="https://example.com">Visit my profile</a>\n  </body>\n</html>',
      solutionExplanation:
        "The <img> tag displays an image using src for the source and alt for accessible text. The <a> tag creates a link using href for the destination and the text between the tags as the clickable label.",
      requirements: [
        { id: "req-w02-01", label: "Include an <img> element", type: "element", selector: "img" },
        { id: "req-w02-02", label: "The <img> has src='avatar.png'", type: "attribute", selector: "img", attribute: "src", value: "avatar.png" },
        { id: "req-w02-03", label: "The <img> has an alt attribute", type: "attribute", selector: "img", attribute: "alt" },
        { id: "req-w02-04", label: "Include an <a> link", type: "element", selector: "a" },
        { id: "req-w02-05", label: "The <a> has href='https://example.com'", type: "attribute", selector: "a", attribute: "href", value: "https://example.com" },
        { id: "req-w02-06", label: "The link says 'Visit my profile'", type: "text", selector: "a", contains: "Visit my profile" },
      ],
    },
  },
  {
    id: "workshop-03",
    number: "03",
    title: "Lists & Semantic HTML",
    world: "workshop",
    type: "lesson",
    xp: 120,
    skillId: "html",
    skillProgress: 10,
    challengeType: "html",
    difficulty: "Beginner",
    estimatedTime: 6,
    description: "Organize content with lists and meaningful semantic tags.",
    concepts: ["ul", "ol", "li", "header", "main", "section", "footer"],
    content: [
      {
        type: "paragraph",
        text: "Lists organize information. Semantic HTML gives meaning to your page structure — not just <div> everywhere, but tags that describe what each part IS.",
      },
      {
        type: "heading",
        text: "Unordered and ordered lists",
      },
      {
        type: "paragraph",
        text: "Use <ul> (unordered list) for bullet points and <ol> (ordered list) for numbered items. Each item goes inside an <li> (list item).",
      },
      {
        type: "code",
        code: "<ul>\n  <li>HTML</li>\n  <li>CSS</li>\n</ul>\n\n<ol>\n  <li>Learn HTML</li>\n  <li>Learn CSS</li>\n</ol>",
      },
      {
        type: "heading",
        text: "Semantic structure",
      },
      {
        type: "paragraph",
        text: "Semantic tags describe the meaning of content. <header> is the top of a page, <main> is the main content, <section> groups related content, and <footer> is the bottom.",
      },
      {
        type: "code",
        code: "<header>\n  <h1>My Site</h1>\n</header>\n<main>\n  <section>\n    <h2>About</h2>\n    <p>I build websites.</p>\n  </section>\n</main>\n<footer>\n  <p>© 2026</p>\n</footer>",
      },
      {
        type: "tip",
        text: "Semantic HTML improves accessibility and SEO. Screen readers use these tags to help users navigate your page.",
      },
    ],
    challenge: {
      id: "challenge-w03",
      prompt:
        "Build a semantic page structure. Create a <header> with an <h1>, a <main> with a <section> containing a <ul> with at least two <li> items, and a <footer>.",
      starterCode: "<!DOCTYPE html>\n<html>\n  <body>\n    <!-- Build your semantic structure here -->\n  </body>\n</html>",
      tests: [
        { type: "element", selector: "header", message: "Your page needs a <header>." },
        { type: "element", selector: "header h1", message: "The <header> needs an <h1>." },
        { type: "element", selector: "main", message: "Your page needs a <main>." },
        { type: "element", selector: "main section", message: "The <main> needs a <section>." },
        { type: "element", selector: "ul", message: "Your page needs a <ul> list." },
        { type: "count", selector: "ul li", min: 2, message: "The <ul> needs at least 2 <li> items." },
        { type: "element", selector: "footer", message: "Your page needs a <footer>." },
      ],
      hints: [
        "Start with <header> and put an <h1> inside it.",
        "Add <main> with a <section> inside.",
        "Inside the section, add a <ul> with two <li> items, then close with <footer>.",
      ],
      solution:
        "<!DOCTYPE html>\n<html>\n  <body>\n    <header>\n      <h1>My Site</h1>\n    </header>\n    <main>\n      <section>\n        <ul>\n          <li>HTML</li>\n          <li>CSS</li>\n        </ul>\n      </section>\n    </main>\n    <footer>\n      <p>© 2026</p>\n    </footer>\n  </body>\n</html>",
      solutionExplanation:
        "Semantic tags describe the role of each part of the page. <header> holds the top content, <main> holds the primary content, <section> groups related content, and <footer> holds the bottom content. The <ul> with <li> items creates a bulleted list.",
      requirements: [
        { id: "req-w03-01", label: "Include a <header>", type: "element", selector: "header" },
        { id: "req-w03-02", label: "The <header> has an <h1>", type: "element", selector: "header h1" },
        { id: "req-w03-03", label: "Include a <main>", type: "element", selector: "main" },
        { id: "req-w03-04", label: "The <main> has a <section>", type: "element", selector: "main section" },
        { id: "req-w03-05", label: "Include a <ul> list", type: "element", selector: "ul" },
        { id: "req-w03-06", label: "The <ul> has at least 2 items", type: "count", selector: "ul li", min: 2 },
        { id: "req-w03-07", label: "Include a <footer>", type: "element", selector: "footer" },
      ],
    },
  },
  {
    id: "workshop-04",
    number: "04",
    title: "Forms",
    world: "workshop",
    type: "lesson",
    xp: 150,
    skillId: "html",
    skillProgress: 10,
    challengeType: "html",
    difficulty: "Beginner",
    estimatedTime: 7,
    description: "Collect user input with forms, inputs, labels, and buttons.",
    concepts: ["form", "input", "label", "button", "placeholder", "type"],
    content: [
      {
        type: "paragraph",
        text: "Forms are how users send information to a website — logging in, signing up, searching, and more.",
      },
      {
        type: "heading",
        text: "The form element",
      },
      {
        type: "paragraph",
        text: "The <form> element wraps all the inputs. Inside it, <label> tags describe each input, and <input> tags collect the data.",
      },
      {
        type: "code",
        code: '<form>\n  <label for="username">Username</label>\n  <input id="username" type="text" placeholder="Enter your username">\n  <button type="submit">Log In</button>\n</form>',
      },
      {
        type: "heading",
        text: "Input types and placeholders",
      },
      {
        type: "paragraph",
        text: "The type attribute tells the browser what kind of data the input expects — text, email, password, and more. The placeholder attribute shows a hint inside the input before the user types.",
      },
      {
        type: "code",
        code: '<input type="email" placeholder="you@example.com">\n<input type="password" placeholder="Your password">',
      },
      {
        type: "heading",
        text: "Labels and buttons",
      },
      {
        type: "paragraph",
        text: "A <label> with a for attribute connects to an input with a matching id — clicking the label focuses the input. A <button> submits the form.",
      },
      {
        type: "tip",
        text: "Always pair every input with a label. It's one of the most important accessibility practices on the web.",
      },
    ],
    challenge: {
      id: "challenge-w04",
      prompt:
        "Create a login form. Build a <form> with a <label> for 'username', an <input> with type='text' and placeholder='Enter your username', and a <button> that says 'Log In'.",
      starterCode: "<!DOCTYPE html>\n<html>\n  <body>\n    <!-- Build your login form here -->\n  </body>\n</html>",
      tests: [
        { type: "element", selector: "form", message: "Your page needs a <form>." },
        { type: "element", selector: "form label", message: "The form needs a <label>." },
        { type: "element", selector: "form input", message: "The form needs an <input>." },
        { type: "attribute", selector: "form input", attribute: "type", value: "text", message: "The <input> needs type='text'." },
        { type: "attribute", selector: "form input", attribute: "placeholder", message: "The <input> needs a placeholder attribute." },
        { type: "element", selector: "form button", message: "The form needs a <button>." },
        { type: "text", selector: "form button", contains: "Log In", message: "The button should say 'Log In'." },
      ],
      hints: [
        "Wrap everything in a <form> element.",
        "Add a <label> and an <input type=\"text\" placeholder=\"Enter your username\">.",
        "Finish with a <button> that says 'Log In'.",
      ],
      solution:
        '<!DOCTYPE html>\n<html>\n  <body>\n    <form>\n      <label for="username">Username</label>\n      <input id="username" type="text" placeholder="Enter your username">\n      <button type="submit">Log In</button>\n    </form>\n  </body>\n</html>',
      solutionExplanation:
        "The <form> wraps the whole input group. The <label> describes the input, the <input> collects the text with a placeholder hint, and the <button> submits the form.",
      requirements: [
        { id: "req-w04-01", label: "Include a <form>", type: "element", selector: "form" },
        { id: "req-w04-02", label: "The form has a <label>", type: "element", selector: "form label" },
        { id: "req-w04-03", label: "The form has an <input>", type: "element", selector: "form input" },
        { id: "req-w04-04", label: "The <input> has type='text'", type: "attribute", selector: "form input", attribute: "type", value: "text" },
        { id: "req-w04-05", label: "The <input> has a placeholder", type: "attribute", selector: "form input", attribute: "placeholder" },
        { id: "req-w04-06", label: "The form has a <button>", type: "element", selector: "form button" },
        { id: "req-w04-07", label: "The button says 'Log In'", type: "text", selector: "form button", contains: "Log In" },
      ],
    },
  },
  {
    id: "workshop-05",
    number: "05",
    title: "CSS Awakens",
    world: "workshop",
    type: "lesson",
    xp: 150,
    skillId: "css",
    skillProgress: 10,
    challengeType: "css",
    difficulty: "Beginner",
    estimatedTime: 7,
    description: "Bring pages to life with CSS — selectors, classes, IDs, and colors.",
    concepts: ["CSS", "selectors", "classes", "IDs", "color", "background"],
    content: [
      {
        type: "paragraph",
        text: "HTML is the skeleton. CSS — Cascading Style Sheets — is the skin and clothing. It controls colors, sizes, spacing, and layout.",
      },
      {
        type: "heading",
        text: "Selectors",
      },
      {
        type: "paragraph",
        text: "A CSS rule has a selector (what to style) and a declaration block (how to style it).",
      },
      {
        type: "code",
        code: "h1 {\n  color: #ff5c8a;\n}",
      },
      {
        type: "heading",
        text: "Classes and IDs",
      },
      {
        type: "paragraph",
        text: "Classes (.) style many elements. IDs (#) style one unique element. In HTML you add class=\"name\" or id=\"name\"; in CSS you target them with .name or #name.",
      },
      {
        type: "code",
        code: "/* HTML: <div class=\"card\" id=\"main-card\"> */\n\n.card {\n  background: #fff;\n}\n\n#main-card {\n  border: 2px solid #ff5c8a;\n}",
      },
      {
        type: "heading",
        text: "Color and background",
      },
      {
        type: "paragraph",
        text: "The color property sets text color. The background property sets the background color (or image).",
      },
      {
        type: "code",
        code: ".card {\n  color: #20202a;\n  background: #fffdf8;\n}",
      },
      {
        type: "tip",
        text: "Use classes for reusable styles and IDs for one-off unique elements.",
      },
    ],
    challenge: {
      id: "challenge-w05",
      prompt:
        "Style a basic HTML card. The HTML already has a <div class='card'>. Write CSS that gives .card a background of #fffdf8 and a color of #20202a.",
      starterCode: "<style>\n  /* Style the .card here */\n</style>\n\n<div class=\"card\">\n  <h1>My Card</h1>\n  <p>This is a styled card.</p>\n</div>",
      tests: [
        { type: "css", selector: ".card", property: "background", message: ".card needs a background property." },
        { type: "css", selector: ".card", property: "color", message: ".card needs a color property." },
      ],
      hints: [
        "Target the card with the class selector: .card { }",
        "Add background: #fffdf8; inside the braces.",
        "Add color: #20202a; on the next line.",
      ],
      solution:
        "<style>\n  .card {\n    background: #fffdf8;\n    color: #20202a;\n  }\n</style>\n\n<div class=\"card\">\n  <h1>My Card</h1>\n  <p>This is a styled card.</p>\n</div>",
      solutionExplanation:
        "The .card selector targets every element with class=\"card\". Inside the declaration block, background sets the background color and color sets the text color.",
      requirements: [
        { id: "req-w05-01", label: ".card has a background property", type: "css", selector: ".card", property: "background" },
        { id: "req-w05-02", label: ".card has a color property", type: "css", selector: ".card", property: "color" },
      ],
    },
  },
  {
    id: "workshop-06",
    number: "06",
    title: "The Box Model",
    world: "workshop",
    type: "lesson",
    xp: 160,
    skillId: "css",
    skillProgress: 10,
    challengeType: "css",
    difficulty: "Beginner",
    estimatedTime: 8,
    description: "Master width, height, padding, margin, and border.",
    concepts: ["width", "height", "padding", "margin", "border"],
    content: [
      {
        type: "paragraph",
        text: "Every element on a page is a box. The box model describes that box: content, padding (space inside the border), border, and margin (space outside the border).",
      },
      {
        type: "heading",
        text: "Width and height",
      },
      {
        type: "paragraph",
        text: "width and height set the size of the content area.",
      },
      {
        type: "code",
        code: ".card {\n  width: 300px;\n  height: 200px;\n}",
      },
      {
        type: "heading",
        text: "Padding and margin",
      },
      {
        type: "paragraph",
        text: "padding adds space INSIDE the element (between content and border). margin adds space OUTSIDE the element (between it and neighbors).",
      },
      {
        type: "code",
        code: ".card {\n  padding: 20px;   /* space inside */\n  margin: 16px;    /* space outside */\n}",
      },
      {
        type: "heading",
        text: "Border",
      },
      {
        type: "paragraph",
        text: "border draws a line around the element. It needs a width, a style, and a color.",
      },
      {
        type: "code",
        code: ".card {\n  border: 2px solid #ff5c8a;\n}",
      },
      {
        type: "tip",
        text: "Think of padding as the cushion inside the box and margin as the distance between boxes.",
      },
    ],
    challenge: {
      id: "challenge-w06",
      prompt:
        "Fix the spacing and sizing of a card. The HTML has a <div class='card'>. Write CSS that gives .card a width of 300px, padding of 20px, margin of 16px, and a border of 2px solid #ff5c8a.",
      starterCode: "<style>\n  /* Fix the .card box model here */\n</style>\n\n<div class=\"card\">\n  <h1>My Card</h1>\n  <p>This card needs proper spacing.</p>\n</div>",
      tests: [
        { type: "css", selector: ".card", property: "width", message: ".card needs a width property." },
        { type: "css", selector: ".card", property: "padding", message: ".card needs a padding property." },
        { type: "css", selector: ".card", property: "margin", message: ".card needs a margin property." },
        { type: "css", selector: ".card", property: "border", message: ".card needs a border property." },
      ],
      hints: [
        "Target .card and add width: 300px;",
        "Add padding: 20px; for inside spacing.",
        "Add margin: 16px; and border: 2px solid #ff5c8a;",
      ],
      solution:
        "<style>\n  .card {\n    width: 300px;\n    padding: 20px;\n    margin: 16px;\n    border: 2px solid #ff5c8a;\n  }\n</style>\n\n<div class=\"card\">\n  <h1>My Card</h1>\n  <p>This card needs proper spacing.</p>\n</div>",
      solutionExplanation:
        "width sets the content width, padding adds space inside the border, margin adds space outside the element, and border draws the outline. Together they form the box model.",
      requirements: [
        { id: "req-w06-01", label: ".card has a width property", type: "css", selector: ".card", property: "width" },
        { id: "req-w06-02", label: ".card has a padding property", type: "css", selector: ".card", property: "padding" },
        { id: "req-w06-03", label: ".card has a margin property", type: "css", selector: ".card", property: "margin" },
        { id: "req-w06-04", label: ".card has a border property", type: "css", selector: ".card", property: "border" },
      ],
    },
  },
  {
    id: "workshop-07",
    number: "07",
    title: "Typography & Colors",
    world: "workshop",
    type: "lesson",
    xp: 160,
    skillId: "css",
    skillProgress: 10,
    challengeType: "css",
    difficulty: "Beginner",
    estimatedTime: 8,
    description: "Shape text with fonts, sizes, weights, and alignment.",
    concepts: ["font-family", "font-size", "font-weight", "line-height", "color", "text-align"],
    content: [
      {
        type: "paragraph",
        text: "Typography is the art of making text readable and beautiful. CSS gives you full control over how text looks.",
      },
      {
        type: "heading",
        text: "Font family and size",
      },
      {
        type: "paragraph",
        text: "font-family sets the typeface. font-size sets how big the text is.",
      },
      {
        type: "code",
        code: "h1 {\n  font-family: Georgia, serif;\n  font-size: 48px;\n}",
      },
      {
        type: "heading",
        text: "Weight and line height",
      },
      {
        type: "paragraph",
        text: "font-weight controls boldness (400 normal, 700 bold). line-height controls the vertical space between lines of text.",
      },
      {
        type: "code",
        code: "p {\n  font-weight: 400;\n  line-height: 1.7;\n}",
      },
      {
        type: "heading",
        text: "Color and alignment",
      },
      {
        type: "paragraph",
        text: "color sets text color. text-align aligns text left, right, center, or justified.",
      },
      {
        type: "code",
        code: ".hero {\n  color: #20202a;\n  text-align: center;\n}",
      },
      {
        type: "tip",
        text: "A line-height of 1.5–1.7 makes paragraphs much easier to read.",
      },
    ],
    challenge: {
      id: "challenge-w07",
      prompt:
        "Create an editorial hero section. The HTML has a <div class='hero'> with an <h1> and a <p>. Write CSS that gives .hero a color of #20202a and text-align of center, and gives .hero h1 a font-size of 48px and font-weight of 700.",
      starterCode: "<style>\n  /* Style the hero section here */\n</style>\n\n<div class=\"hero\">\n  <h1>The Workshop Times</h1>\n  <p>Stories from the world of web development.</p>\n</div>",
      tests: [
        { type: "css", selector: ".hero", property: "color", message: ".hero needs a color property." },
        { type: "css", selector: ".hero", property: "text-align", message: ".hero needs a text-align property." },
        { type: "css", selector: ".hero h1", property: "font-size", message: ".hero h1 needs a font-size property." },
        { type: "css", selector: ".hero h1", property: "font-weight", message: ".hero h1 needs a font-weight property." },
      ],
      hints: [
        "Style .hero with color and text-align.",
        "Style .hero h1 with font-size and font-weight.",
        "Use descendant selectors: .hero h1 targets h1 inside .hero.",
      ],
      solution:
        "<style>\n  .hero {\n    color: #20202a;\n    text-align: center;\n  }\n\n  .hero h1 {\n    font-size: 48px;\n    font-weight: 700;\n  }\n</style>\n\n<div class=\"hero\">\n  <h1>The Workshop Times</h1>\n  <p>Stories from the world of web development.</p>\n</div>",
      solutionExplanation:
        "The .hero selector styles the container with color and text alignment. The .hero h1 descendant selector targets only the h1 inside .hero, giving it a large font size and bold weight.",
      requirements: [
        { id: "req-w07-01", label: ".hero has a color property", type: "css", selector: ".hero", property: "color" },
        { id: "req-w07-02", label: ".hero has a text-align property", type: "css", selector: ".hero", property: "text-align" },
        { id: "req-w07-03", label: ".hero h1 has a font-size property", type: "css", selector: ".hero h1", property: "font-size" },
        { id: "req-w07-04", label: ".hero h1 has a font-weight property", type: "css", selector: ".hero h1", property: "font-weight" },
      ],
    },
  },
  {
    id: "workshop-08",
    number: "08",
    title: "Flexbox",
    world: "workshop",
    type: "lesson",
    xp: 200,
    skillId: "css",
    skillProgress: 10,
    challengeType: "css",
    difficulty: "Intermediate",
    estimatedTime: 9,
    description: "Build flexible layouts with display: flex and friends.",
    concepts: ["display:flex", "flex-direction", "justify-content", "align-items", "gap"],
    content: [
      {
        type: "paragraph",
        text: "Flexbox is a layout system that arranges items in a row or column. It's the modern way to build navigation bars, button groups, and card rows.",
      },
      {
        type: "heading",
        text: "Turning on flex",
      },
      {
        type: "paragraph",
        text: "Add display: flex to a container and its children line up horizontally.",
      },
      {
        type: "code",
        code: ".nav {\n  display: flex;\n}",
      },
      {
        type: "heading",
        text: "Direction and alignment",
      },
      {
        type: "paragraph",
        text: "flex-direction sets the main axis (row or column). justify-content aligns items along the main axis. align-items aligns items along the cross axis.",
      },
      {
        type: "code",
        code: ".nav {\n  display: flex;\n  flex-direction: row;\n  justify-content: space-between;\n  align-items: center;\n  gap: 16px;\n}",
      },
      {
        type: "paragraph",
        text: "gap adds space between flex items — no more margin hacks!",
      },
      {
        type: "tip",
        text: "justify-content: space-between pushes items to the edges with equal space between them — perfect for nav bars.",
      },
    ],
    challenge: {
      id: "challenge-w08",
      prompt:
        "Build a navigation bar. The HTML has a <nav class='nav'> with three <a> links. Write CSS that gives .nav display: flex, justify-content: space-between, align-items: center, and gap: 16px.",
      starterCode: "<style>\n  /* Make .nav a flex container */\n</style>\n\n<nav class=\"nav\">\n  <a href=\"#\">Home</a>\n  <a href=\"#\">About</a>\n  <a href=\"#\">Contact</a>\n</nav>",
      tests: [
        { type: "css", selector: ".nav", property: "display", value: "flex", message: ".nav needs display: flex." },
        { type: "css", selector: ".nav", property: "justify-content", message: ".nav needs a justify-content property." },
        { type: "css", selector: ".nav", property: "align-items", message: ".nav needs an align-items property." },
        { type: "css", selector: ".nav", property: "gap", message: ".nav needs a gap property." },
      ],
      hints: [
        "Add display: flex; to .nav.",
        "Add justify-content: space-between; to spread the links.",
        "Add align-items: center; and gap: 16px;",
      ],
      solution:
        "<style>\n  .nav {\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n    gap: 16px;\n  }\n</style>\n\n<nav class=\"nav\">\n  <a href=\"#\">Home</a>\n  <a href=\"#\">About</a>\n  <a href=\"#\">Contact</a>\n</nav>",
      solutionExplanation:
        "display: flex turns .nav into a flex container. justify-content: space-between spreads the links across the full width. align-items: center vertically centers them, and gap adds spacing between each link.",
      requirements: [
        { id: "req-w08-01", label: ".nav has display: flex", type: "css", selector: ".nav", property: "display", value: "flex" },
        { id: "req-w08-02", label: ".nav has justify-content", type: "css", selector: ".nav", property: "justify-content" },
        { id: "req-w08-03", label: ".nav has align-items", type: "css", selector: ".nav", property: "align-items" },
        { id: "req-w08-04", label: ".nav has a gap", type: "css", selector: ".nav", property: "gap" },
      ],
    },
  },
  {
    id: "workshop-09",
    number: "09",
    title: "CSS Grid",
    world: "workshop",
    type: "lesson",
    xp: 200,
    skillId: "css",
    skillProgress: 10,
    challengeType: "css",
    difficulty: "Intermediate",
    estimatedTime: 9,
    description: "Create powerful two-dimensional layouts with CSS Grid.",
    concepts: ["grid", "columns", "rows", "gap", "responsive layouts"],
    content: [
      {
        type: "paragraph",
        text: "Flexbox handles one dimension at a time. CSS Grid handles both rows AND columns at once — perfect for card grids and page layouts.",
      },
      {
        type: "heading",
        text: "Creating a grid",
      },
      {
        type: "paragraph",
        text: "Add display: grid to a container, then define columns with grid-template-columns.",
      },
      {
        type: "code",
        code: ".grid {\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr;\n  gap: 16px;\n}",
      },
      {
        type: "paragraph",
        text: "1fr means one fraction of the available space. Three 1fr columns split the width into three equal parts.",
      },
      {
        type: "heading",
        text: "Rows and responsive columns",
      },
      {
        type: "paragraph",
        text: "grid-template-rows defines row heights. For responsive layouts, use repeat() and auto-fit with minmax() so columns automatically wrap on smaller screens.",
      },
      {
        type: "code",
        code: ".grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n  gap: 16px;\n}",
      },
      {
        type: "tip",
        text: "repeat(auto-fit, minmax(200px, 1fr)) creates as many 200px+ columns as fit — a responsive grid with no media queries needed.",
      },
    ],
    challenge: {
      id: "challenge-w09",
      prompt:
        "Build a responsive card grid. The HTML has a <div class='grid'> with four <div class='card'> children. Write CSS that gives .grid display: grid, grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)), and gap: 16px.",
      starterCode: "<style>\n  /* Make .grid a responsive grid */\n</style>\n\n<div class=\"grid\">\n  <div class=\"card\">Card 1</div>\n  <div class=\"card\">Card 2</div>\n  <div class=\"card\">Card 3</div>\n  <div class=\"card\">Card 4</div>\n</div>",
      tests: [
        { type: "css", selector: ".grid", property: "display", value: "grid", message: ".grid needs display: grid." },
        { type: "css", selector: ".grid", property: "grid-template-columns", message: ".grid needs a grid-template-columns property." },
        { type: "css", selector: ".grid", property: "gap", message: ".grid needs a gap property." },
      ],
      hints: [
        "Add display: grid; to .grid.",
        "Use grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));",
        "Add gap: 16px; for spacing between cards.",
      ],
      solution:
        "<style>\n  .grid {\n    display: grid;\n    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n    gap: 16px;\n  }\n</style>\n\n<div class=\"grid\">\n  <div class=\"card\">Card 1</div>\n  <div class=\"card\">Card 2</div>\n  <div class=\"card\">Card 3</div>\n  <div class=\"card\">Card 4</div>\n</div>",
      solutionExplanation:
        "display: grid turns .grid into a grid container. grid-template-columns with repeat(auto-fit, minmax(200px, 1fr)) creates responsive columns that automatically wrap. gap adds spacing between all cards.",
      requirements: [
        { id: "req-w09-01", label: ".grid has display: grid", type: "css", selector: ".grid", property: "display", value: "grid" },
        { id: "req-w09-02", label: ".grid has grid-template-columns", type: "css", selector: ".grid", property: "grid-template-columns" },
        { id: "req-w09-03", label: ".grid has a gap", type: "css", selector: ".grid", property: "gap" },
      ],
    },
  },
  {
    id: "workshop-10",
    number: "10",
    title: "Responsive Design",
    world: "workshop",
    type: "lesson",
    xp: 220,
    skillId: "css",
    skillProgress: 10,
    challengeType: "css",
    difficulty: "Intermediate",
    estimatedTime: 10,
    description: "Make layouts adapt to any screen with media queries.",
    concepts: ["media queries", "mobile-first thinking", "responsive units", "max-width"],
    content: [
      {
        type: "paragraph",
        text: "People browse on phones, tablets, laptops, and huge monitors. Responsive design makes your page look great at every size.",
      },
      {
        type: "heading",
        text: "Media queries",
      },
      {
        type: "paragraph",
        text: "A media query applies CSS only when a condition is true — like the screen being narrower than 768px.",
      },
      {
        type: "code",
        code: "@media (max-width: 768px) {\n  .layout {\n    grid-template-columns: 1fr;\n  }\n}",
      },
      {
        type: "heading",
        text: "Mobile-first thinking",
      },
      {
        type: "paragraph",
        text: "Start with the mobile layout as the default, then use min-width media queries to enhance for larger screens. This is called mobile-first.",
      },
      {
        type: "code",
        code: ".layout {\n  display: grid;\n  grid-template-columns: 1fr;  /* mobile default */\n}\n\n@media (min-width: 768px) {\n  .layout {\n    grid-template-columns: 1fr 1fr;  /* tablet+ */\n  }\n}",
      },
      {
        type: "heading",
        text: "Responsive units and max-width",
      },
      {
        type: "paragraph",
        text: "Use % or vw for fluid widths, and max-width to prevent content from stretching too wide on huge screens.",
      },
      {
        type: "code",
        code: ".container {\n  width: 100%;\n  max-width: 1200px;\n  margin: 0 auto;\n}",
      },
      {
        type: "tip",
        text: "max-width: 1200px with margin: 0 auto centers content and keeps lines readable on large monitors.",
      },
    ],
    challenge: {
      id: "challenge-w10",
      prompt:
        "Make a desktop layout responsive. The HTML has a <div class='layout'> with two <div class='panel'> children. Write CSS that gives .layout display: grid with grid-template-columns: 1fr by default, then a media query at min-width: 768px that switches it to 1fr 1fr.",
      starterCode: "<style>\n  /* Mobile-first layout, then enhance at 768px */\n</style>\n\n<div class=\"layout\">\n  <div class=\"panel\">Panel 1</div>\n  <div class=\"panel\">Panel 2</div>\n</div>",
      tests: [
        { type: "css", selector: ".layout", property: "display", value: "grid", message: ".layout needs display: grid." },
        { type: "css", selector: ".layout", property: "grid-template-columns", message: ".layout needs a grid-template-columns property." },
        { type: "media", minWidth: 768, selector: ".layout", property: "grid-template-columns", message: "Add a @media (min-width: 768px) rule that sets .layout to 1fr 1fr." },
      ],
      hints: [
        "Give .layout display: grid and grid-template-columns: 1fr.",
        "Add @media (min-width: 768px) { ... }.",
        "Inside the media query, set .layout to grid-template-columns: 1fr 1fr.",
      ],
      solution:
        "<style>\n  .layout {\n    display: grid;\n    grid-template-columns: 1fr;\n  }\n\n  @media (min-width: 768px) {\n    .layout {\n      grid-template-columns: 1fr 1fr;\n    }\n  }\n</style>\n\n<div class=\"layout\">\n  <div class=\"panel\">Panel 1</div>\n  <div class=\"panel\">Panel 2</div>\n</div>",
      solutionExplanation:
        "The default rule stacks panels in one column for mobile. The @media (min-width: 768px) query kicks in on screens 768px and wider, switching to two equal columns.",
      requirements: [
        { id: "req-w10-01", label: ".layout has display: grid", type: "css", selector: ".layout", property: "display", value: "grid" },
        { id: "req-w10-02", label: ".layout has grid-template-columns", type: "css", selector: ".layout", property: "grid-template-columns" },
        { id: "req-w10-03", label: "A 768px media query switches to 2 columns", type: "media", minWidth: 768, selector: ".layout", property: "grid-template-columns" },
      ],
    },
  },
  {
    id: "workshop-11",
    number: "11",
    title: "Hover & Transitions",
    world: "workshop",
    type: "lesson",
    xp: 180,
    skillId: "css",
    skillProgress: 10,
    challengeType: "css",
    difficulty: "Intermediate",
    estimatedTime: 8,
    description: "Make interfaces feel alive with hover effects and transitions.",
    concepts: [":hover", "transition", "transform", "box-shadow"],
    content: [
      {
        type: "paragraph",
        text: "Great interfaces respond to the user. Hover effects and transitions make buttons and cards feel alive and interactive.",
      },
      {
        type: "heading",
        text: "The :hover pseudo-class",
      },
      {
        type: "paragraph",
        text: ":hover applies styles when the mouse is over an element.",
      },
      {
        type: "code",
        code: ".card:hover {\n  transform: translateY(-4px);\n}",
      },
      {
        type: "heading",
        text: "Transitions",
      },
      {
        type: "paragraph",
        text: "transition makes style changes smooth instead of instant. You specify which property to animate and how long it takes.",
      },
      {
        type: "code",
        code: ".card {\n  transition: transform 0.3s ease;\n}\n\n.card:hover {\n  transform: translateY(-4px);\n}",
      },
      {
        type: "heading",
        text: "Transform and box-shadow",
      },
      {
        type: "paragraph",
        text: "transform moves, scales, or rotates an element. box-shadow adds a shadow — great for the 'lifted card' effect.",
      },
      {
        type: "code",
        code: ".card {\n  transition: transform 0.3s ease, box-shadow 0.3s ease;\n}\n\n.card:hover {\n  transform: translateY(-4px);\n  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);\n}",
      },
      {
        type: "tip",
        text: "Always add a transition on the base state, not the hover state, so the animation plays in both directions.",
      },
    ],
    challenge: {
      id: "challenge-w11",
      prompt:
        "Create an interactive product card. The HTML has a <div class='product-card'>. Write CSS that gives .product-card a transition for transform and box-shadow, and a :hover rule that applies transform: translateY(-4px) and box-shadow.",
      starterCode: "<style>\n  /* Make the product card interactive */\n</style>\n\n<div class=\"product-card\">\n  <h3>CodeQuest Mug</h3>\n  <p>Hover over me!</p>\n</div>",
      tests: [
        { type: "css", selector: ".product-card", property: "transition", message: ".product-card needs a transition property." },
        { type: "css", selector: ".product-card:hover", property: "transform", message: ".product-card:hover needs a transform property." },
        { type: "css", selector: ".product-card:hover", property: "box-shadow", message: ".product-card:hover needs a box-shadow property." },
      ],
      hints: [
        "Add transition: transform 0.3s ease, box-shadow 0.3s ease; to .product-card.",
        "Add a .product-card:hover rule.",
        "Inside hover, add transform: translateY(-4px); and box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);",
      ],
      solution:
        "<style>\n  .product-card {\n    transition: transform 0.3s ease, box-shadow 0.3s ease;\n  }\n\n  .product-card:hover {\n    transform: translateY(-4px);\n    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);\n  }\n</style>\n\n<div class=\"product-card\">\n  <h3>CodeQuest Mug</h3>\n  <p>Hover over me!</p>\n</div>",
      solutionExplanation:
        "The transition on the base state makes changes smooth. The :hover rule lifts the card with transform and adds a shadow with box-shadow, creating the classic interactive card effect.",
      requirements: [
        { id: "req-w11-01", label: ".product-card has a transition", type: "css", selector: ".product-card", property: "transition" },
        { id: "req-w11-02", label: ".product-card:hover has transform", type: "css", selector: ".product-card:hover", property: "transform" },
        { id: "req-w11-03", label: ".product-card:hover has box-shadow", type: "css", selector: ".product-card:hover", property: "box-shadow" },
      ],
    },
  },
  {
    id: "workshop-12",
    number: "12",
    title: "BOSS: Build Your First Website",
    world: "workshop",
    type: "boss",
    xp: 500,
    skillId: "web-foundations",
    skillProgress: 100,
    challengeType: "html-css",
    difficulty: "Boss",
    estimatedTime: 20,
    description: "Combine everything you've learned to build a small responsive landing page!",
    concepts: ["HTML", "semantic structure", "CSS", "typography", "Flexbox", "Grid", "responsive design", "hover states"],
    content: [
      {
        type: "paragraph",
        text: "This is the final trial of The Workshop. You must combine everything you've learned — HTML structure, semantic tags, CSS styling, typography, Flexbox, Grid, responsive design, and hover effects — into one complete landing page.",
      },
      {
        type: "heading",
        text: "Your mission",
      },
      {
        type: "paragraph",
        text: "Build a small responsive landing page for a fictional product called 'CodeQuest'. Your page must include:",
      },
      {
        type: "paragraph",
        text: "1. A <header> with a <nav> containing at least two links.\n2. A <main> with a <section class='hero'> containing an <h1> and a <p>.\n3. A <section class='features'> with a <div class='grid'> containing at least three <div class='card'> elements.\n4. A <footer>.\n5. CSS that styles .hero with text-align: center, .grid with display: grid and grid-template-columns, and .card with a transition and a :hover transform.",
      },
      {
        type: "code",
        code: "/* Example structure to aim for */\n<header>\n  <nav>...</nav>\n</header>\n<main>\n  <section class=\"hero\">...</section>\n  <section class=\"features\">\n    <div class=\"grid\">\n      <div class=\"card\">...</div>\n      <div class=\"card\">...</div>\n      <div class=\"card\">...</div>\n    </div>\n  </section>\n</main>\n<footer>...</footer>",
      },
      {
        type: "tip",
        text: "This challenge combines HTML and CSS. Use the preview to see your page come to life, then check the requirements to make sure everything is in place.",
      },
    ],
    challenge: {
      id: "challenge-w12",
      prompt:
        "Build a small responsive landing page. Combine HTML structure, semantic tags, CSS styling, Flexbox/Grid, and hover effects. See the requirements for the full checklist.",
      starterCode:
        "<!DOCTYPE html>\n<html>\n  <head>\n    <title>CodeQuest</title>\n    <style>\n      /* Your CSS here */\n    </style>\n  </head>\n  <body>\n    <!-- Your landing page here -->\n  </body>\n</html>",
      tests: [
        { type: "element", selector: "header", message: "Your page needs a <header>." },
        { type: "element", selector: "header nav", message: "The <header> needs a <nav>." },
        { type: "count", selector: "header nav a", min: 2, message: "The <nav> needs at least 2 links." },
        { type: "element", selector: "main", message: "Your page needs a <main>." },
        { type: "element", selector: ".hero", message: "Your page needs a <section class='hero'>." },
        { type: "element", selector: ".hero h1", message: "The hero needs an <h1>." },
        { type: "element", selector: ".hero p", message: "The hero needs a <p>." },
        { type: "element", selector: ".features", message: "Your page needs a <section class='features'>." },
        { type: "element", selector: ".features .grid", message: "The features section needs a <div class='grid'>." },
        { type: "count", selector: ".features .grid .card", min: 3, message: "The grid needs at least 3 cards." },
        { type: "element", selector: "footer", message: "Your page needs a <footer>." },
        { type: "css", selector: ".hero", property: "text-align", message: ".hero needs a text-align property." },
        { type: "css", selector: ".grid", property: "display", value: "grid", message: ".grid needs display: grid." },
        { type: "css", selector: ".grid", property: "grid-template-columns", message: ".grid needs a grid-template-columns property." },
        { type: "css", selector: ".card", property: "transition", message: ".card needs a transition property." },
        { type: "css", selector: ".card:hover", property: "transform", message: ".card:hover needs a transform property." },
      ],
      hints: [
        "Start with the HTML skeleton: header, main, footer.",
        "Add a nav with two links inside the header.",
        "Build the hero section with an h1 and p.",
        "Create a features section with a grid of three cards.",
        "Style .hero, .grid, and .card with the required CSS properties.",
      ],
      solution:
        "<!DOCTYPE html>\n<html>\n  <head>\n    <title>CodeQuest</title>\n    <style>\n      .hero {\n        text-align: center;\n        padding: 40px;\n      }\n\n      .grid {\n        display: grid;\n        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n        gap: 16px;\n      }\n\n      .card {\n        padding: 20px;\n        border: 1px solid #eae6e0;\n        border-radius: 12px;\n        transition: transform 0.3s ease, box-shadow 0.3s ease;\n      }\n\n      .card:hover {\n        transform: translateY(-4px);\n        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);\n      }\n    </style>\n  </head>\n  <body>\n    <header>\n      <nav>\n        <a href=\"#\">Home</a>\n        <a href=\"#\">Features</a>\n      </nav>\n    </header>\n    <main>\n      <section class=\"hero\">\n        <h1>CodeQuest</h1>\n        <p>Learn to code by playing.</p>\n      </section>\n      <section class=\"features\">\n        <div class=\"grid\">\n          <div class=\"card\">Learn HTML</div>\n          <div class=\"card\">Master CSS</div>\n          <div class=\"card\">Build Websites</div>\n        </div>\n      </section>\n    </main>\n    <footer>\n      <p>© 2026 CodeQuest</p>\n    </footer>\n  </body>\n</html>",
      solutionExplanation:
        "This landing page combines everything from The Workshop: semantic HTML structure (header, nav, main, section, footer), a hero section with typography, a responsive grid of cards, and interactive hover effects with transitions.",
      requirements: [
        { id: "req-w12-01", label: "Include a <header>", type: "element", selector: "header" },
        { id: "req-w12-02", label: "The <header> has a <nav>", type: "element", selector: "header nav" },
        { id: "req-w12-03", label: "The <nav> has at least 2 links", type: "count", selector: "header nav a", min: 2 },
        { id: "req-w12-04", label: "Include a <main>", type: "element", selector: "main" },
        { id: "req-w12-05", label: "Include a hero section", type: "element", selector: ".hero" },
        { id: "req-w12-06", label: "The hero has an <h1>", type: "element", selector: ".hero h1" },
        { id: "req-w12-07", label: "The hero has a <p>", type: "element", selector: ".hero p" },
        { id: "req-w12-08", label: "Include a features section", type: "element", selector: ".features" },
        { id: "req-w12-09", label: "The features have a grid", type: "element", selector: ".features .grid" },
        { id: "req-w12-10", label: "The grid has at least 3 cards", type: "count", selector: ".features .grid .card", min: 3 },
        { id: "req-w12-11", label: "Include a <footer>", type: "element", selector: "footer" },
        { id: "req-w12-12", label: ".hero has text-align", type: "css", selector: ".hero", property: "text-align" },
        { id: "req-w12-13", label: ".grid has display: grid", type: "css", selector: ".grid", property: "display", value: "grid" },
        { id: "req-w12-14", label: ".grid has grid-template-columns", type: "css", selector: ".grid", property: "grid-template-columns" },
        { id: "req-w12-15", label: ".card has a transition", type: "css", selector: ".card", property: "transition" },
        { id: "req-w12-16", label: ".card:hover has transform", type: "css", selector: ".card:hover", property: "transform" },
      ],
    },
  },
];

export function getWorkshopLessonById(lessonId) {
  return workshopLessons.find((l) => l.id === lessonId);
}

export function getWorkshopNextLessonId(lessonId) {
  const index = workshopLessons.findIndex((l) => l.id === lessonId);
  if (index === -1 || index >= workshopLessons.length - 1) return null;
  return workshopLessons[index + 1].id;
}

export function getWorkshopLessonIndex(lessonId) {
  return workshopLessons.findIndex((l) => l.id === lessonId);
}

export function getWorkshopProgress(progress) {
  const completed = workshopLessons.filter((l) => (progress.completedLessons || []).includes(l.id)).length;
  return Math.round((completed / workshopLessons.length) * 100);
}

export function isWorkshopComplete(progress) {
  return workshopLessons.every((l) => (progress.completedLessons || []).includes(l.id));
}