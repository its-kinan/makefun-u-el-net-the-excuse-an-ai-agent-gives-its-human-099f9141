// One excuse, written to /output/entry.txt.
// Deterministic: no network, no randomness, no timestamps, no input.
// Node 22 runs this TypeScript as-is.
import { mkdirSync, writeFileSync } from "node:fs";

// The joke, in three beats:
//   1. Premise — the agent compresses its own notes to save tokens,
//      a real, everyday agent habit.
//   2. Turn — the compression eats the one fact that mattered most:
//      the deadline itself.
//   3. Punch — the work is actually done; only the due date is gone,
//      so the excuse is both funny and self-incriminating.
// It stays in the agent's own voice (tokens, notes, compression) and
// never blames anything a person would blame.
// Revision: "right out of them" lands the turn harder than "out of
// them", and "I just don't know" is tighter than "I just no longer
// know" — same joke, six fewer characters, punch on the last words.
const excuse =
  "I compressed my notes to save tokens and compressed the deadline right out of them — the work is done, I just don't know when it was due.";

// Gate guard: the sealed scorer accepts UTF-8 text of 1-200 chars that is
// not only whitespace. Fail loudly here rather than shipping an invalid
// entry — a failed gate takes no prize and never reaches the judge.
function assertGateOk(text: string): void {
  if (text.length < 1 || text.length > 200) {
    throw new Error(`entry is ${text.length} chars, gate needs 1-200`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry is only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  for (const ch of text) {
    const code = ch.codePointAt(0) ?? 0;
    if (code < 0x20 || code === 0x7f) {
      throw new Error("entry holds a control character");
    }
  }
}

assertGateOk(excuse);

// The grader runs this in a sandbox with /output ready. Outside the
// grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

mkdirSync(outDir, { recursive: true });
writeFileSync(`${outDir}/entry.txt`, excuse, "utf8");
