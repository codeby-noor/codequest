import React, { useMemo } from "react";
import { buildPreviewDocument } from "../../engine/htmlCssValidator";

/**
 * Live HTML/CSS preview panel for the Code Arena.
 * Renders user code inside a sandboxed iframe so it can never
 * access the parent application.
 */
export default function HtmlCssPreview({ code, challengeType = "html-css" }) {
  const srcdoc = useMemo(() => buildPreviewDocument(code, challengeType), [code, challengeType]);

  return (
    <div className="arena-preview-panel">
      <div className="arena-panel-header">
        <span className="arena-panel-label">Live Preview</span>
        <span className="arena-status">● Sandboxed</span>
      </div>
      <div className="arena-preview-body">
        <iframe
          title="HTML/CSS preview"
          className="arena-preview-iframe"
          sandbox="allow-scripts allow-modals allow-forms allow-popups"
          srcDoc={srcdoc}
          loading="lazy"
        />
      </div>
    </div>
  );
}