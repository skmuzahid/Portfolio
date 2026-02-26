/* ================================================================
   VIEWPORT GUARD — data://muzahid
   Blocks non-maximized / mobile / tablet viewports.
   On resize to valid size → reloads page for full animation experience.
   ================================================================ */

(function () {

  /* ── Config ───────────────────────────────────────────────────── */
  const MIN_WIDTH  = 1200; // px — minimum valid viewport width
  const OVERLAY_ID = 'vp-guard-overlay';

  /* ── Helpers ──────────────────────────────────────────────────── */
  function isSmall() {
    return window.innerWidth < MIN_WIDTH;
  }

  /* ── Inject CSS (self-contained, no external deps) ────────────── */
  function injectStyles() {
    if (document.getElementById('vp-guard-style')) return;
    const style = document.createElement('style');
    style.id = 'vp-guard-style';
    style.textContent = `
      /* ── Overlay wrapper ────────────────────────────── */
      #vp-guard-overlay {
        position: fixed;
        inset: 0;
        z-index: 999999;
        background: #080708;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-family: 'JetBrains Mono', 'Courier New', monospace;
        overflow: hidden;
        opacity: 0;
        transition: opacity 0.4s ease;
      }
      #vp-guard-overlay.vp-visible {
        opacity: 1;
      }

      /* ── Floating ambient particles ─────────────────── */
      .vp-particle {
        position: absolute;
        border-radius: 50%;
        background: rgba(255,170,0,0.55);
        pointer-events: none;
        animation: vp-float linear infinite;
      }
      @keyframes vp-float {
        0%   { transform: translateY(0px) scale(1);   opacity: 0; }
        10%  { opacity: 1; }
        90%  { opacity: 0.6; }
        100% { transform: translateY(-110vh) scale(0.6); opacity: 0; }
      }

      /* ── Card ───────────────────────────────────────── */
      .vp-card {
        position: relative;
        z-index: 2;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0;
        text-align: center;
        padding: 0 24px;
        max-width: 560px;
        width: 100%;
      }

      /* ── Logo ───────────────────────────────────────── */
      .vp-logo {
        font-size: clamp(18px, 4vw, 26px);
        color: #ffaa00;
        letter-spacing: 0.18em;
        margin-bottom: 40px;
        animation: vp-pulse 2.4s ease-in-out infinite;
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .vp-logo-dots {
        display: flex;
        gap: 5px;
      }
      .vp-logo-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #ffaa00;
        animation: vp-dot-pulse 2.4s ease-in-out infinite;
      }
      .vp-logo-dot:nth-child(2) { animation-delay: 0.3s; }
      .vp-logo-dot:nth-child(3) { animation-delay: 0.6s; }

      @keyframes vp-dot-pulse {
        0%, 100% { opacity: 0.3; transform: scale(0.8); }
        50%       { opacity: 1;   transform: scale(1.2); }
      }
      @keyframes vp-pulse {
        0%, 100% { text-shadow: 0 0 8px rgba(255,170,0,0.3); }
        50%       { text-shadow: 0 0 22px rgba(255,170,0,0.85), 0 0 40px rgba(255,170,0,0.3); }
      }

      /* ── Divider ────────────────────────────────────── */
      .vp-divider {
        width: 100%;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(255,170,0,0.5), transparent);
        margin: 0 0 28px 0;
      }

      /* ── Error block ────────────────────────────────── */
      .vp-error-tag {
        font-size: clamp(9px, 2vw, 11px);
        color: rgba(255,170,0,0.5);
        letter-spacing: 0.25em;
        margin-bottom: 10px;
        text-transform: uppercase;
      }
      .vp-error-title {
        font-size: clamp(18px, 4vw, 28px);
        color: #f5f0e8;
        letter-spacing: 0.12em;
        margin-bottom: 6px;
        font-weight: 600;
      }
      .vp-error-title span {
        color: #ffaa00;
      }
      .vp-separator {
        color: rgba(255,170,0,0.35);
        font-size: clamp(10px, 2vw, 13px);
        letter-spacing: 0.1em;
        margin-bottom: 28px;
        user-select: none;
      }

      /* ── Terminal lines ──────────────────────────────── */
      .vp-terminal {
        width: 100%;
        background: rgba(255,170,0,0.04);
        border: 1px solid rgba(255,170,0,0.12);
        border-radius: 4px;
        padding: 20px 24px;
        text-align: left;
        margin-bottom: 36px;
      }
      .vp-line {
        font-size: clamp(11px, 2.5vw, 13px);
        line-height: 2;
        letter-spacing: 0.06em;
        white-space: nowrap;
      }
      .vp-line-label  { color: rgba(255,170,0,0.55); }
      .vp-line-ok     { color: #4ade80; }
      .vp-line-fail   { color: #ff6b6b; }
      .vp-line-info   { color: #f5f0e8; opacity: 0.7; }
      .vp-line-blink::after {
        content: '▋';
        color: #ffaa00;
        animation: vp-blink 1s step-end infinite;
      }
      @keyframes vp-blink {
        0%, 100% { opacity: 1; }
        50%       { opacity: 0; }
      }

      /* ── Message ────────────────────────────────────── */
      .vp-message {
        font-size: clamp(11px, 2.5vw, 14px);
        color: rgba(245,240,232,0.6);
        letter-spacing: 0.08em;
        line-height: 1.8;
        margin-bottom: 36px;
        text-align: center;
      }
      .vp-message strong {
        color: #ffaa00;
        font-weight: 500;
      }

      /* ── Expanding arrows ────────────────────────────── */
      .vp-arrows {
        display: flex;
        align-items: center;
        gap: 12px;
        color: rgba(255,170,0,0.7);
        font-size: clamp(12px, 2.5vw, 15px);
        letter-spacing: 0.15em;
      }
      .vp-arrow-h {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .vp-arr-left, .vp-arr-right {
        font-size: 1.3em;
        animation: vp-expand-h 1.8s ease-in-out infinite;
      }
      .vp-arr-right { animation-direction: reverse; }
      .vp-arr-up, .vp-arr-down {
        display: block;
        font-size: 1.3em;
        line-height: 1;
        animation: vp-expand-v 1.8s ease-in-out infinite;
      }
      .vp-arr-down { animation-direction: reverse; }
      .vp-arrows-vert {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
      }
      .vp-arrows-label {
        font-size: clamp(9px, 2vw, 11px);
        color: rgba(255,170,0,0.4);
        letter-spacing: 0.2em;
        text-transform: uppercase;
      }
      @keyframes vp-expand-h {
        0%, 100% { transform: translateX(0);    opacity: 0.5; }
        50%       { transform: translateX(6px);  opacity: 1;   }
      }
      @keyframes vp-expand-v {
        0%, 100% { transform: translateY(0);    opacity: 0.5; }
        50%       { transform: translateY(5px);  opacity: 1;   }
      }

      /* ── Keep custom cursor above overlay ───────────── */
      #cursor-dot, #cursor-ring {
        z-index: 9999999 !important;
      }

      /* ── Scanline effect ─────────────────────────────── */
      #vp-guard-overlay::after {
        content: '';
        position: absolute;
        inset: 0;
        background: repeating-linear-gradient(
          0deg,
          transparent,
          transparent 3px,
          rgba(0,0,0,0.07) 3px,
          rgba(0,0,0,0.07) 4px
        );
        pointer-events: none;
        z-index: 1;
      }
    `;
    document.head.appendChild(style);
  }

  /* ── Build overlay HTML ───────────────────────────────────────── */
  function buildOverlay() {
    const overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;

    /* Floating particles */
    for (let i = 0; i < 18; i++) {
      const p = document.createElement('div');
      p.className = 'vp-particle';
      const size = Math.random() * 3 + 1.5;
      p.style.cssText = `
        width:${size}px; height:${size}px;
        left:${Math.random() * 100}%;
        bottom:${Math.random() * -20}%;
        animation-duration:${6 + Math.random() * 10}s;
        animation-delay:${Math.random() * 8}s;
        opacity:0;
      `;
      overlay.appendChild(p);
    }

    /* Card */
    overlay.innerHTML += `
      <div class="vp-card">

        <!-- Logo -->
        <div class="vp-logo">
          <div class="vp-logo-dots">
            <div class="vp-logo-dot"></div>
            <div class="vp-logo-dot"></div>
            <div class="vp-logo-dot"></div>
          </div>
          data://muzahid
        </div>

        <!-- Divider -->
        <div class="vp-divider"></div>

        <!-- Error heading -->
        <div class="vp-error-tag">system check</div>
        <div class="vp-error-title">ERROR: <span>VIEWPORT_INSUFFICIENT</span></div>
        <div class="vp-separator">────────────────────────────────────────</div>

        <!-- Terminal block -->
        <div class="vp-terminal">
          <div class="vp-line">
            <span class="vp-line-label">›  Initializing portfolio&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <span class="vp-line-ok">OK</span>
          </div>
          <div class="vp-line">
            <span class="vp-line-label">›  Loading assets&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <span class="vp-line-ok">OK</span>
          </div>
          <div class="vp-line">
            <span class="vp-line-label">›  Resolution check&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <span class="vp-line-fail">FAILED</span>
          </div>
          <div class="vp-line" style="margin-top:8px">
            <span class="vp-line-info">Minimum required: 1200px</span>
          </div>
          <div class="vp-line vp-line-blink">
            <span class="vp-line-info">Awaiting full viewport&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          </div>
        </div>

        <!-- Human message -->
        <div class="vp-message">
          Please <strong>maximize your browser window</strong><br>
          or switch to a <strong>desktop device</strong> to continue.
        </div>

        <!-- Expanding arrows -->
        <div class="vp-arrows">
          <span class="vp-arr-left">←</span>
          <div class="vp-arrows-vert">
            <span class="vp-arr-up">↑</span>
            <div class="vp-arrows-label">expand</div>
            <span class="vp-arr-down">↓</span>
          </div>
          <span class="vp-arr-right">→</span>
        </div>

      </div>
    `;

    return overlay;
  }

  /* ── Show / Hide logic ────────────────────────────────────────── */
  let overlay      = null;
  let wasSmall     = false;
  let reloadQueued = false;

  function showOverlay() {
    if (document.getElementById(OVERLAY_ID)) return;
    injectStyles();
    overlay = buildOverlay();
    document.body.appendChild(overlay);
    /* slight delay so opacity transition fires */
    requestAnimationFrame(() => {
      requestAnimationFrame(() => overlay.classList.add('vp-visible'));
    });
    wasSmall = true;
  }

  function removeOverlay() {
    const el = document.getElementById(OVERLAY_ID);
    if (el) {
      el.style.opacity = '0';
      setTimeout(() => el.remove(), 400);
    }
  }

  function onResize() {
    if (isSmall()) {
      if (!document.getElementById(OVERLAY_ID)) showOverlay();
    } else {
      /* Viewport is now valid */
      if (wasSmall && !reloadQueued) {
        reloadQueued = true;
        removeOverlay();
        /* Short delay so user sees the overlay fade, then full reload */
        setTimeout(() => { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; window.scrollTo(0, 0); window.location.replace(window.location.pathname + window.location.search); }, 450);
      }
    }
  }

  /* ── Init ─────────────────────────────────────────────────────── */
  function init() {
    if (isSmall()) {
      showOverlay();
      /* Freeze body scroll while blocked */
      document.body.style.overflow = 'hidden';
    }

    window.addEventListener('resize', () => {
      if (!isSmall()) {
        document.body.style.overflow = '';
      } else {
        document.body.style.overflow = 'hidden';
      }
      onResize();
    });
  }

  /* Run as early as possible */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
