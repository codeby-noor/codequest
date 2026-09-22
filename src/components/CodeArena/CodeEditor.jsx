import React, { useRef, useEffect, useCallback } from "react";

/**
 * Code editor with line numbers, Tab handling, and keyboard shortcuts.
 * Uses a textarea overlay for editing with a highlighted pre behind it.
 */
export default function CodeEditor({ code, onChange, onRun, onSave, ariaLabel = "Code editor" }) {
  const textareaRef = useRef(null);
  const preRef = useRef(null);

  // Sync scroll between textarea and highlighted pre
  const handleScroll = useCallback(() => {
    if (preRef.current && textareaRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  }, []);

  // Handle Tab key for indentation
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const el = e.target;
        const start = el.selectionStart;
        const end = el.selectionEnd;
        const next = code.slice(0, start) + "  " + code.slice(end);
        onChange(next);
        requestAnimationFrame(() => {
          el.selectionStart = el.selectionEnd = start + 2;
        });
      }

      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        onRun?.();
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        onSave?.();
      }
    },
    [code, onChange, onRun, onSave]
  );

  // Highlight code with simple syntax coloring
  const highlighted = highlightCode(code);

  const lineCount = code.split("\n").length;

  return (
    <div className="code-editor">
      <div className="code-editor-gutter" aria-hidden="true">
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i} className="code-editor-line-number">
            {i + 1}
          </div>
        ))}
      </div>
      <div className="code-editor-body">
        <pre ref={preRef} className="code-editor-highlight" aria-hidden="true">
          <code dangerouslySetInnerHTML={{ __html: highlighted }} />
        </pre>
        <textarea
          ref={textareaRef}
          className="code-editor-input"
          value={code}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          wrap="off"
          aria-label={ariaLabel}
          aria-describedby="editor-shortcuts"
        />
      </div>
      <div id="editor-shortcuts" className="editor-shortcuts" aria-hidden="true">
        Ctrl+Enter to run · Tab to indent
      </div>
    </div>
  );
}

/** Simple syntax highlighting for JavaScript. */
function highlightCode(code) {
  const escaped = escapeHtml(code);

  // Order matters: strings first, then comments, then keywords
  let result = escaped;

  // Strings (double and single quoted)
  result = result.replace(
    /(".*?"|&#x27;.*?&#x27;)/g,
    '<span class="tok-string">$1</span>'
  );

  // Comments
  result = result.replace(
    /(\/\/[^\n]*)/g,
    '<span class="tok-comment">$1</span>'
  );

  // Keywords
  const keywords = [
    "let", "const", "var", "function", "return", "if", "else",
    "for", "while", "true", "false", "new", "typeof", "console",
  ];
  keywords.forEach((kw) => {
    const re = new RegExp(`\\b${kw}\\b`, "g");
    result = result.replace(re, `<span class="tok-keyword">${kw}</span>`);
  });

  // Numbers
  result = result.replace(/\b(\d+)\b/g, '<span class="tok-number">$1</span>');

  return result;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "\u0026amp;")
    .replace(/</g, "\u0026lt;")
    .replace(/>/g, "\u0026gt;")
    .replace(/"/g, "\u0026quot;")
    .replace(/'/g, "\u0026#x27;");
}
