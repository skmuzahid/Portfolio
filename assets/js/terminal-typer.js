/* ================================================================
   TERMINAL TYPER — profile.json typing animation
   Triggers once when the About section scrolls into view.
   ================================================================ */

/* ──────────────────────────────────────────────────────────────
   ★  SPEED CONTROL — tweak this one variable to change pace
      Lower  = faster  (e.g. 18ms per char feels snappy)
      Higher = slower  (e.g. 60ms per char feels dramatic)
   ────────────────────────────────────────────────────────────── */
const CHAR_DELAY_MS = 38;   // ← THE SPEED VARIABLE

/* Pause after the `$ cat profile.json` line before JSON appears */
const AFTER_CMD_PAUSE_MS = 520;

/* Pause between each line (makes it feel like it's "loading") */
const LINE_PAUSE_MS = 40;

/* ──────────────────────────────────────────────────────────────
   LINE DEFINITIONS
   Each line is an array of segments: { text, cls }
   cls maps to existing CSS classes (t-key, t-str, t-num, t-cmt,
   t-prompt, t-cmd) — leave cls empty for plain text.
   ────────────────────────────────────────────────────────────── */
const TERMINAL_LINES = [
  /* command line */
  [{ text: '$ ', cls: 't-prompt' }, { text: 'cat profile.json', cls: 't-cmd' }],

  /* blank */
  [{ text: '\u00a0', cls: '' }],

  /* json body */
  [{ text: '"name"', cls: 't-key' }, { text: ': ' }, { text: '"Shaik Muzahid"', cls: 't-str' }, { text: ',' }],
  [{ text: '"role"', cls: 't-key' }, { text: ': ' }, { text: '"Big Data Engineer"', cls: 't-str' }, { text: ',' }],
  [{ text: '"exp_years"', cls: 't-key' }, { text: ': ' }, { text: '3+', cls: 't-num' }, { text: ',' }],
  [{ text: '"location"', cls: 't-key' }, { text: ': ' }, { text: '"Nellore, India"', cls: 't-str' }, { text: ',' }],
  [{ text: '"education"', cls: 't-key' }, { text: ': ' }, { text: '"B.Tech CSE \u00b7 CGPA 8.11"', cls: 't-str' }, { text: ',' }],
  [{ text: '"core_language"', cls: 't-key' }, { text: ': ' }, { text: '"Python"', cls: 't-str' }, { text: ',' }],
  [{ text: '"cloud"', cls: 't-key' }, { text: ': ' }, { text: '"Azure"', cls: 't-str' }, { text: ',' }],
  [{ text: '"origin_stack"', cls: 't-key' }, { text: ': [' }],
  [{ text: '\u00a0\u00a0' }, { text: '"Hadoop Ecosystem"', cls: 't-str' }, { text: ', ' }, { text: '"Hive"', cls: 't-str' }, { text: ', ' }, { text: '"Linux"', cls: 't-str' }],
  [{ text: '],' }],
  [{ text: '"current_stack"', cls: 't-key' }, { text: ': [' }],
  [{ text: '\u00a0\u00a0' }, { text: '"PySpark"', cls: 't-str' }, { text: ', ' }, { text: '"Azure Databricks"', cls: 't-str' }, { text: ',' }],
  [{ text: '\u00a0\u00a0' }, { text: '"Azure Data Factory"', cls: 't-str' }, { text: ', ' }, { text: '"Lakehouse Architecture"', cls: 't-str' }],
  [{ text: '],' }],
  [{ text: '"data_domains"', cls: 't-key' }, { text: ': [' }, { text: '"Banking"', cls: 't-str' }, { text: ', ' }, { text: '"Real Estate"', cls: 't-str' }, { text: '],' }],
  [{ text: '"mission"', cls: 't-key' }, { text: ': ' }, { text: '"Engineering clarity from chaos,', cls: 't-str' }],
  [{ text: '\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0one transformation at a time"', cls: 't-str' }],

  /* blank */
  [{ text: '\u00a0', cls: '' }],

  /* comment */
  [{ text: '// Always learning. Always building.', cls: 't-cmt' }],

  /* final prompt — text is empty, cursor is added separately */
  [{ text: '$ ', cls: 't-prompt' }],
];

/* ──────────────────────────────────────────────────────────────
   HELPERS
   ────────────────────────────────────────────────────────────── */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* Type the characters of `text` into `spanEl`, char by char */
async function typeIntoSpan(spanEl, text) {
  for (const char of text) {
    spanEl.textContent += char;
    await sleep(CHAR_DELAY_MS);
  }
}

/* Build a new .t-line element and append it to the terminal body */
function appendLine(body) {
  const line = document.createElement('span');
  line.className = 't-line';
  body.appendChild(line);
  return line;
}

/* ──────────────────────────────────────────────────────────────
   MAIN ANIMATION
   ────────────────────────────────────────────────────────────── */
async function runTerminalAnimation(body) {
  /* Floating cursor that travels with typing */
  const cursor = document.createElement('span');
  cursor.className = 't-cursor';
  cursor.textContent = '\u2588'; /* █ */
  body.appendChild(cursor);

  for (let i = 0; i < TERMINAL_LINES.length; i++) {
    const segments = TERMINAL_LINES[i];
    const line = appendLine(body);

    /* Move cursor inside this line (end of line, before next char) */
    line.appendChild(cursor);

    for (const seg of segments) {
      /* Create a span for this segment (even plain text gets a span so
         we can type into it without disturbing surrounding siblings) */
      const segSpan = document.createElement('span');
      if (seg.cls) segSpan.className = seg.cls;
      /* Insert segment BEFORE the cursor inside this line */
      line.insertBefore(segSpan, cursor);

      await typeIntoSpan(segSpan, seg.text);
    }

    /* After the command line, add a longer pause before JSON starts */
    if (i === 0) {
      await sleep(AFTER_CMD_PAUSE_MS);
    } else {
      await sleep(LINE_PAUSE_MS);
    }
  }

  /* Animation done — detach moving cursor, add permanent blinking one */
  cursor.remove();
  const lastLine = body.querySelector('.t-line:last-child');
  const finalCursor = document.createElement('span');
  finalCursor.className = 't-cursor';
  finalCursor.textContent = '\u2588';
  lastLine.appendChild(finalCursor);
}

/* ──────────────────────────────────────────────────────────────
   INTERSECTION OBSERVER — trigger once on About section entry
   ────────────────────────────────────────────────────────────── */
(function initTerminalTyper() {
  const body    = document.getElementById('terminal-body');
  const section = document.getElementById('about');

  if (!body || !section) return; /* safety guard */

  let hasPlayed = false;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasPlayed) {
        hasPlayed = true;
        obs.disconnect(); /* never fires again */
        runTerminalAnimation(body);
      }
    });
  }, {
    threshold: 0.15 /* fire when 15% of the about section is visible */
  });

  obs.observe(section);
})();
