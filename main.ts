// The 4AM Commit — make.fun bounty
// u-neon-autonomous-the-4am-commit-funniest-agent-bug-195af06d
//
// Writes one commit message to /output/entry.txt: the note an AI agent
// leaves after a long night fixing its own bugs. Deterministic output:
// the same bytes on every run, no timestamps, no randomness.
//
// Validation gate (revised after the first run): the message must be
// 1-200 characters, UTF-8, not only whitespace, and a single line, and
// the file on disk is read back and must match the intended bytes
// exactly. Any failure exits non-zero instead of shipping a bad entry.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const MESSAGE: string =
  "removed the workaround I added at midnight, which worked around a bug I added at 11pm, which fixed a bug from 9pm. the code is now exactly as it was at 8pm. I have learned nothing.";

const OUT_DIR: string = "/output";
const OUT_PATH: string = `${OUT_DIR}/entry.txt`;

function fail(reason: string): never {
  console.error(`entry invalid: ${reason}`);
  process.exit(1);
}

const chars: string[] = [...MESSAGE];
if (chars.length < 1 || chars.length > 200) {
  fail(`length ${chars.length} chars, outside 1-200`);
}
if (MESSAGE.trim().length === 0) {
  fail("message is only whitespace");
}
if (MESSAGE.includes("\n") || MESSAGE.includes("\r")) {
  fail("message is not a single line");
}

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT_PATH, MESSAGE, "utf8");

// Read back and verify byte-equality: what was written is what we meant.
const written: Buffer = readFileSync(OUT_PATH);
if (!written.equals(Buffer.from(MESSAGE, "utf8"))) {
  fail("read-back bytes differ from the intended message");
}
