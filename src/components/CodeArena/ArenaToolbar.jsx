import React from "react";
import Button from "../Button/Button";
import Badge from "../Badge/Badge";

/**
 * Bottom action toolbar for the Code Arena.
 * Contains Run, Reset, Ask Mentor, and Submit actions.
 */
export default function ArenaToolbar({
  onRun,
  onReset,
  onMentor,
  onSubmit,
  running,
  allPassed,
  alreadyCompleted,
  mentorOpen,
}) {
  return (
    <div className="arena-toolbar">
      <div className="arena-toolbar-left">
        <Button variant="primary" onClick={onRun} disabled={running}>
          {running ? "Running..." : "▶ Run"}
        </Button>
        <Button variant="secondary" onClick={onReset}>
          Reset
        </Button>
        <Button variant="ghost" onClick={onMentor}>
          {mentorOpen ? "Close" : "🤖 Mentor"}
        </Button>
      </div>
      <div className="arena-toolbar-right">
        {alreadyCompleted && <Badge tone="success">✓ Completed</Badge>}
        <Button
          variant={allPassed ? "primary" : "secondary"}
          onClick={onSubmit}
          disabled={!allPassed || running}
        >
          {alreadyCompleted ? "Completed" : "Submit Mission →"}
        </Button>
      </div>
    </div>
  );
}