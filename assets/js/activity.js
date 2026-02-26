/* ================================================================
   SHAIK MUZAHID PORTFOLIO — activity.js
   Particle field · Circuit board · Pipeline diagram ·
   Typewriter · Counters · Scroll reveal
   ================================================================ */

/* ──────────────────────────────────────────────────────────────
   1. CUSTOM CURSOR
   ────────────────────────────────────────────────────────────── */
const cursorDot  = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');

let mx = window.innerWidth / 2;
let my = window.innerHeight / 2;
let rx = mx, ry = my;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

(function animCursor() {
  cursorDot.style.left  = mx + 'px';
  cursorDot.style.top   = my + 'px';
  rx += (mx - rx) * 0.13;
  ry += (my - ry) * 0.13;
  cursorRing.style.left = rx + 'px';
  cursorRing.style.top  = ry + 'px';
  requestAnimationFrame(animCursor);
})();

document.querySelectorAll('a,button,[data-hover]').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

/* ──────────────────────────────────────────────────────────────
   2. SCROLL PROGRESS BAR
   ────────────────────────────────────────────────────────────── */
const progressBar = document.getElementById('progress-bar');
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
  progressBar.style.width = (scrolled * 100) + '%';
});

/* ──────────────────────────────────────────────────────────────
   3. NAV ACTIVE STATE
   ────────────────────────────────────────────────────────────── */
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');

const navObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
    }
  });
}, { rootMargin: '-45% 0px -45% 0px' });
sections.forEach(s => navObs.observe(s));

/* ──────────────────────────────────────────────────────────────
   4. SCROLL REVEAL
   ────────────────────────────────────────────────────────────── */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ──────────────────────────────────────────────────────────────
   5. AURORA / LIQUID LIGHT BACKGROUND (hero only)
   ────────────────────────────────────────────────────────────── */
/* ──────────────────────────────────────────────────────────────
   5. GLOBAL PARTICLE FIELD (mouse-reactive)
   ────────────────────────────────────────────────────────────── */
const pCanvas = document.getElementById('particle-canvas');
const pCtx    = pCanvas.getContext('2d');

function resizePC() {
  pCanvas.width  = window.innerWidth;
  pCanvas.height = window.innerHeight;
}
resizePC();
window.addEventListener('resize', resizePC);

const AMBER   = '#ffaa00';
const AMBER2  = 'rgba(255,170,0,';
const P_COUNT = 55;

class Particle {
  constructor() { this.init(); }
  init() {
    this.x  = Math.random() * pCanvas.width;
    this.y  = Math.random() * pCanvas.height;
    this.r  = Math.random() * 1.8 + 0.5;
    this.vx = (Math.random() - 0.5) * 0.6;
    this.vy = (Math.random() - 0.5) * 0.6;
    this.alpha = Math.random() * 0.5 + 0.15;
    this.pulse = Math.random() * Math.PI * 2;
    this.pSpeed = 0.012 + Math.random() * 0.015;
  }
  update(mouseX, mouseY) {
    this.pulse += this.pSpeed;
    const dx = this.x - mouseX;
    const dy = this.y - mouseY;
    const dist = Math.sqrt(dx*dx + dy*dy);
    if (dist < 120) {
      const force = (120 - dist) / 120 * 0.6;
      this.vx += (dx / dist) * force * 0.04;
      this.vy += (dy / dist) * force * 0.04;
    }
    this.vx *= 0.98;
    this.vy *= 0.98;
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0) this.x = pCanvas.width;
    if (this.x > pCanvas.width) this.x = 0;
    if (this.y < 0) this.y = pCanvas.height;
    if (this.y > pCanvas.height) this.y = 0;
  }
  // draw() {
  //   const a = this.alpha * (0.6 + 0.4 * Math.sin(this.pulse));
  //   pCtx.beginPath();
  //   pCtx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
  //   pCtx.fillStyle = AMBER2 + a + ')';
  //   pCtx.fill();
  // }
  draw() {
    const a = this.alpha * (0.6 + 0.4 * Math.sin(this.pulse));
    
    // Outer glow halo
    const grad = pCtx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r * 5);
    grad.addColorStop(0,   AMBER2 + (a * 0.8) + ')');
    grad.addColorStop(0.4, AMBER2 + (a * 0.3) + ')');
    grad.addColorStop(1,   AMBER2 + '0)');
    pCtx.beginPath();
    pCtx.arc(this.x, this.y, this.r * 8, 0, Math.PI * 2);
    pCtx.fillStyle = grad;
    pCtx.fill();

    // Bright core dot
    pCtx.beginPath();
    pCtx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    pCtx.fillStyle = AMBER2 + Math.min(a * 1.8, 1) + ')';
    pCtx.fill();
}
}

const particles = Array.from({ length: P_COUNT }, () => new Particle());
const MAX_CONN  = 130;
let pmx = -999, pmy = -999;
document.addEventListener('mousemove', e => { pmx = e.clientX; pmy = e.clientY; });

function drawParticles() {
  pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d  = Math.sqrt(dx*dx + dy*dy);
      if (d < MAX_CONN) {
        pCtx.beginPath();
        pCtx.moveTo(particles[i].x, particles[i].y);
        pCtx.lineTo(particles[j].x, particles[j].y);
        pCtx.strokeStyle = AMBER2 + ((1 - d/MAX_CONN) * 0.01) + ')';
        pCtx.lineWidth = 0.8;
        pCtx.stroke();
      }
    }
  }

  particles.forEach(p => { p.update(pmx, pmy); p.draw(); });
  requestAnimationFrame(drawParticles);
}
drawParticles();

/* ──────────────────────────────────────────────────────────────
   5b. ROTATING ICOSAHEDRON GEO OBJECT
   ────────────────────────────────────────────────────────────── */
(function initGeo() {
  const gc = document.getElementById('geo-canvas');
  if (!gc) return;
  const gCtx = gc.getContext('2d');

  function resizeGeo() {
    const wrap = gc.parentElement;
    gc.width  = wrap.offsetWidth  || 340;
    gc.height = wrap.offsetHeight || 340;
  }
  resizeGeo();
  window.addEventListener('resize', resizeGeo);

  /* Icosahedron vertices */
  const φ = (1 + Math.sqrt(5)) / 2;
  const rawVerts = [
    [ 0,  1,  φ], [ 0, -1,  φ], [ 0,  1, -φ], [ 0, -1, -φ],
    [ 1,  φ,  0], [-1,  φ,  0], [ 1, -φ,  0], [-1, -φ,  0],
    [ φ,  0,  1], [-φ,  0,  1], [ φ,  0, -1], [-φ,  0, -1],
  ];
  /* Normalise to unit sphere */
  const len = Math.sqrt(1 + φ * φ);
  const verts = rawVerts.map(([x, y, z]) => [x / len, y / len, z / len]);

  /* Icosahedron edges (pairs of vertex indices) */
  const edges = [
    [0,1],[0,4],[0,5],[0,8],[0,9],
    [1,6],[1,7],[1,8],[1,9],
    [2,3],[2,4],[2,5],[2,10],[2,11],
    [3,6],[3,7],[3,10],[3,11],
    [4,5],[4,8],[4,10],
    [5,9],[5,11],
    [6,7],[6,8],[6,10],
    [7,9],[7,11],
    [8,10],[9,11],
  ];

  /* 6 vertices to label — chosen for good spread */
  const LABELS = [
    { idx: 0,  text: 'Versatile'   },
    { idx: 2,  text: 'Innovative' },
    { idx: 4,  text: 'Precise'    },
    { idx: 7,  text: 'Pragmatic'     },
    { idx: 9,  text: 'Curious'    },
    { idx: 11, text: 'Adaptive'   },
  ];

  const AMBER_HEX   = '#ffaa00';
  const AMBER_DIM   = 'rgba(255,170,0,';
  const AMBER_LABEL = 'rgba(255,220,120,';

  let rotX = 0.4, rotY = 0;
  let geoT = 0;

  /* 3-D rotation helpers */
  function rotateX([x, y, z], a) {
    return [x, y * Math.cos(a) - z * Math.sin(a), y * Math.sin(a) + z * Math.cos(a)];
  }
  function rotateY([x, y, z], a) {
    return [x * Math.cos(a) + z * Math.sin(a), y, -x * Math.sin(a) + z * Math.cos(a)];
  }
  /* Perspective projection */
  function project([x, y, z], cx, cy, scale) {
    const fov = 3.2;
    const pz  = z + fov;
    const px  = (x / pz) * scale + cx;
    const py  = (y / pz) * scale + cy;
    return [px, py, z]; /* return z for depth */
  }

  function drawGeo() {
    geoT += 1;
    const W = gc.width, H = gc.height;
    const cx = W / 2, cy = H / 2;
    const scale = Math.min(W, H) * 0.72;

    rotY = geoT * 0.008;
    const wobble = Math.sin(geoT * 0.004) * 0.15;

    gCtx.clearRect(0, 0, W, H);

    /* Transform all vertices */
    const transformed = verts.map(v => {
      let p = rotateX(v, rotX + wobble);
      p = rotateY(p, rotY);
      return p;
    });

    const projected = transformed.map(v => project(v, cx, cy, scale));

    /* Draw edges — depth-based opacity */
    for (const [a, b] of edges) {
      const [ax, ay, az] = projected[a];
      const [bx, by, bz] = projected[b];
      const depth = ((az + bz) / 2 + 1) / 2; /* 0..1, higher = closer */
      const alpha = 0.08 + depth * 0.42;
      gCtx.beginPath();
      gCtx.moveTo(ax, ay);
      gCtx.lineTo(bx, by);
      gCtx.strokeStyle = AMBER_DIM + alpha.toFixed(3) + ')';
      gCtx.lineWidth   = 0.8 + depth * 0.7;
      gCtx.stroke();
    }

    /* Draw vertices */
    for (let i = 0; i < projected.length; i++) {
      const [px, py, pz] = projected[i];
      const depth = (pz + 1) / 2;
      const alpha = 0.2 + depth * 0.7;
      gCtx.beginPath();
      gCtx.arc(px, py, 1.8 + depth * 1.4, 0, Math.PI * 2);
      gCtx.fillStyle = AMBER_DIM + alpha.toFixed(3) + ')';
      gCtx.fill();
    }

    /* Draw labels on selected vertices (only front-facing) */
    gCtx.font = '600 11px "Space Grotesk", sans-serif';
    gCtx.letterSpacing = '0.08em';
    gCtx.textAlign = 'center';

    for (const { idx, text } of LABELS) {
      const [px, py, pz] = projected[idx];
      const depth = (pz + 1) / 2;
      if (depth < 0.38) continue; /* hide when behind */

      const alpha = Math.max(0, (depth - 0.38) / 0.62);

      /* Pill background */
      const padX = 10, padY = 5;
      const tw   = gCtx.measureText(text).width;
      gCtx.beginPath();
      gCtx.roundRect(px - tw / 2 - padX, py - 8 - padY, tw + padX * 2, 16 + padY * 2, 20);
      gCtx.fillStyle = `rgba(12,10,10,${(alpha * 0.55).toFixed(3)})`;
      gCtx.fill();
      gCtx.strokeStyle = AMBER_DIM + (alpha * 0.35).toFixed(3) + ')';
      gCtx.lineWidth = 0.8;
      gCtx.stroke();

      /* Text */
      gCtx.fillStyle = AMBER_LABEL + alpha.toFixed(3) + ')';
      gCtx.fillText(text, px, py + 4);
    }

    requestAnimationFrame(drawGeo);
  }

  drawGeo();
})();

/* ──────────────────────────────────────────────────────────────
   6. HERO TYPEWRITER
   ────────────────────────────────────────────────────────────── */
const roles = [
  'Data Engineering',
  'ETL Optimization',
  'Cloud Migration',
  'Process Automation',
  'Data Modeling',
  'Pipeline Architecture'
];
let ri = 0, ci = 0, deleting = false;
const twEl = document.getElementById('hero-typewriter');

function typewrite() {
  const word = roles[ri];
  if (!deleting) {
    twEl.textContent = word.slice(0, ++ci);
    if (ci === word.length) { deleting = true; return setTimeout(typewrite, 2200); }
  } else {
    twEl.textContent = word.slice(0, --ci);
    if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; return setTimeout(typewrite, 400); }
  }
  setTimeout(typewrite, deleting ? 45 : 75);
}
setTimeout(typewrite, 1600);

/* ──────────────────────────────────────────────────────────────
   7. ANIMATED COUNTERS
   ────────────────────────────────────────────────────────────── */
function counter(el) {
  const target   = parseFloat(el.dataset.target);
  const suffix   = el.dataset.suffix || '';
  const decimals = el.dataset.decimals ? 1 : 0;
  const dur      = 2200;
  const t0       = performance.now();

  const tick = now => {
    const p = Math.min((now - t0) / dur, 1);
    const e = 1 - Math.pow(1 - p, 4);
    el.textContent = (e * target).toFixed(decimals) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

const ctrObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { counter(e.target); ctrObs.unobserve(e.target); }
  });
}, { threshold: 0.6 });
document.querySelectorAll('[data-target]').forEach(el => ctrObs.observe(el));

/* Orb counters in hero fire after load */
setTimeout(() => {
  document.querySelectorAll('.orb-value[data-target]').forEach(el => counter(el));
}, 1800);

/* ──────────────────────────────────────────────────────────────
   8. CIRCUIT BOARD SKILL VISUALISATION
   ────────────────────────────────────────────────────────────── */
const cc  = document.getElementById('circuit-canvas');
if (cc) {
  const cx  = cc.getContext('2d');
  const DPR = window.devicePixelRatio || 1;

  function resizeCC() {
    const r = cc.getBoundingClientRect();
    cc.width  = r.width  * DPR;
    cc.height = r.height * DPR;
    cx.scale(DPR, DPR);
  }
  resizeCC();
  window.addEventListener('resize', () => { resizeCC(); drawCircuit(); });

  /* ═══════════════════════════════════════════════════════════════
     COMPLETE CIRCUIT — CLEAN LAYOUT (Based on Hand-Drawn Diagram)
     ═══════════════════════════════════════════════════════════════ */

  const skillGroups = [

  /* RBI ERA */
  {
    name: 'RBI ERA',
    color: '#ffaa00',
    skills: [
      { name:'Linux', x:0.05, y:0.12, desc:'Secure execution environment hosting Hadoop clusters and PySpark jobs within an isolated banking infrastructure.' },
      { name:'Hadoop / HDFS', x:0.25, y:0.12, desc:'Distributed storage backbone enabling scalable processing of regulatory datasets.' },
      { name:'Hive / Impala', x:0.25, y:0.25, desc:'Structured data layer storing both raw and transformed financial datasets for analytical access.' },
      { name:'PySpark', x:0.25, y:0.45, desc:'Metadata-driven ETL engine executing distributed transformations on large banking data volumes.' },
      { name:'Python', x:0.40, y:0.45, desc:'Primary orchestration language powering ETL automation and workflow execution.' },
      { name:'Scala', x:0.05, y:0.55, desc:'Performance-oriented Spark language used selectively for advanced transformation logic.' },
      { name:'MySQL', x:0.05, y:0.75, desc:'Configuration database storing mapping logic and ETL tracking tables controlling transformation behaviour.' },
      { name:'PowerBI', x:0.10, y:0.35, desc:'Visualization layer consuming Hive datasets to generate regulatory reporting insights.' },
    ]
  },

  /* BRIDGE */
  {
    name:'BRIDGE',
    color:'#ffcc44',
    skills:[
      /*{ name:'Python Bridge', x:0.42, y:0.34, desc:'Transition layer representing evolution of Python-driven pipelines from on-prem Hadoop to Azure cloud.' },*/
      { name:'Git', x:0.53, y:0.45, desc:'Source control backbone coordinating code, mapping definitions, and automated pipeline releases across hybrid data platforms.' }
    ]
  },

  /* RESO */
  {
    name:'RESO',
    color:'#ffaa00',
    skills:[
      { name:'Azure Blob Storage', x:0.90, y:0.25, desc:'Cloud landing zone where raw MLS datasets arrive before entering distributed ETL pipelines.' },
      { name:'Azure Databricks', x:0.65, y:0.25, desc:'Lakehouse compute environment executing distributed PySpark ETL pipelines, hosting transformation logic, and structuring datasets through medallion architecture.' },
      /*{ name:'PySpark (Cloud)', x:0.65, y:0.30, desc:'High-scale transformation engine enabling parallel processing of real-estate datasets.' },*/
      { name:'Delta Tables', x:0.63, y:0.55, desc:'Delta Lake storage foundation structuring medallion-layer datasets with ACID reliability and optimized lakehouse performance.' },
    ]
  },

  /* RETS */
  {
    name:'RETS',
    color:'#cc8800',
    skills:[
      { name:'Azure VM', x:0.60, y:0.80, desc:'Execution environment hosting Python-driven XML pipelines, running legacy VBScript transformations and managing file-based ETL workflows.' },
      /*{ name:'Python Wrapper', x:0.74, y:0.62, desc:'Orchestration layer managing file movement and execution while delegating transformation logic.' },*/
      { name:'VBScript', x:0.40, y:0.80, desc:'Rule-based transformation layer embedded within XML mappings, applying column-level business logic executed through Python-orchestrated workflows.' },
      { name:'Azure DevOps', x:0.53, y:0.65, desc:'Automation pipeline synchronizing mapping updates from Git into virtual machine environments.' },
      { name:'Pandas', x:0.75, y:0.80, desc:'Validation and enrichment layer standardizing transformed datasets before structured SQL Server loading.' }
    ]
  },

  /* CORE */
  {
    name:'CORE',
    color:'#ff8c00',
    skills:[
      { name:'SQL Server', x:0.75, y:0.65, desc:'Central warehouse storing final transformed datasets and powering operational ETL metrics.' },
      { name:'Grafana', x:0.90, y:0.60, desc:'Monitoring dashboard visualizing ETL performance metrics including volume and success rate.' },
      { name:'Azure Data Factory', x:0.75, y:0.45, desc:'Synchronization pipeline pushing processed datasets back into Databricks storage for ML workloads.' },
      { name:'MongoDB (WIP)', x:0.90, y:0.75, desc:'Upcoming schema-on-demand layer designed to enable dynamic API transformations and scalable real-time delivery.' }
    ]
  }

  ];


  /* Flatten nodes with canvas coordinates */
  let cNodes = [];
  let hoveredNode = null;
  let animFrame2;

  function buildNodes() {
    const W = cc.getBoundingClientRect().width;
    const H = cc.getBoundingClientRect().height;
    cNodes = [];
    skillGroups.forEach(g => {
      g.skills.forEach(s => {
        cNodes.push({
          ...s,
          gColor: g.color,
          gName: g.name,
          cx: s.x * W,
          cy: s.y * H,
          r: 7,
          hovered: false,
          pulseT: Math.random() * Math.PI * 2,
        });
      });
    });
  }
  buildNodes();

  /* ═══════════════════════════════════════════════════════════════
     CIRCUIT TRACES — Clean Flow (Matching Hand-Drawn Diagram)
     ═══════════════════════════════════════════════════════════════ */
  const traces = [

  /* XBRL to SDMX Pipeline */
  [0,1],[1,2],[5,3],[6,3],[4,3],[3,2],[2,7],

  /* RESO LAKEHOUSE PIPELINE*/
  [8,10],[9,10],[10,11],[11,16],[16,17],[16,19],
  
  /* RETS LEGACY XML PIPELINE */
  [4,13],[13,12],[8,14],[14,12],[12,15],[15,16],[16,18],[18,10],
 
  ];

  /* ── Pipeline definitions ─────────────────────────────────────
     Map pipeline key → set of trace indices that belong to it,
     and set of node indices involved.
  ──────────────────────────────────────────────────────────────── */
  const pipelineDefs = {
    xbrl: {
      label: 'XBRL → SDMX',
      traceIndices: new Set([0,1,2,3,4,5,6]),   // indices into traces array
      nodeIndices:  new Set([0,1,2,3,4,5,6,7]),
      color: 'rgba(204,136,0,',
    },
    reso: {
      label: 'RESO Lakehouse',
      traceIndices: new Set([7,8,9,10,11,12]),
      nodeIndices:  new Set([8,9,10,11,16,17,19]),
      color: 'rgba(255,170,0,',
    },
    rets: {
      label: 'RETS Legacy XML',
      traceIndices: new Set([13,14,15,16,17,18,19,20]),
      nodeIndices:  new Set([4,8,10,12,13,14,15,16,18]),
      color: 'rgba(212,160,0,',
    },
  };

  let activePipeline = 'xbrl'; // default on load

  // Wire up dropdown
  const pipelineSel = document.getElementById('pipeline-select');
  if (pipelineSel) {
    pipelineSel.value = 'xbrl';
    pipelineSel.addEventListener('change', e => {
      activePipeline = e.target.value;
    });
  }



  /* Local mouse for circuit canvas */
  let ccmx = -999, ccmy = -999;
  cc.addEventListener('mousemove', e => {
    const r = cc.getBoundingClientRect();
    ccmx = e.clientX - r.left;
    ccmy = e.clientY - r.top;
    checkHover();
  });
  cc.addEventListener('mouseleave', () => { ccmx = -999; ccmy = -999; clearHover(); });

  const panel = document.getElementById('skill-info-panel');

  function checkHover() {
    let found = null;
    cNodes.forEach((n, idx) => {
      const d = Math.hypot(n.cx - ccmx, n.cy - ccmy);
      const curDef = pipelineDefs[activePipeline];
      const inActivePipeline = curDef && curDef.nodeIndices.has(idx);
      n.hovered = inActivePipeline && d < n.r + 12;
      if (n.hovered) found = n;
    });
    if (found !== hoveredNode) {
      hoveredNode = found;
      if (found && panel) {
        document.getElementById('sip-name').textContent = found.name;
        const curDef = pipelineDefs[activePipeline];
        document.getElementById('sip-cat').textContent  = '';
        document.getElementById('sip-desc').textContent = found.desc;
        panel.classList.add('show');
      } else if (panel) {
        panel.classList.remove('show');
      }
    }
  }

  function clearHover() {
    cNodes.forEach(n => n.hovered = false);
    hoveredNode = null;
    if (panel) panel.classList.remove('show');
  }

  function drawCircuit() {
    const W = cc.getBoundingClientRect().width;
    const H = cc.getBoundingClientRect().height;
    cx.clearRect(0, 0, W, H);
  //     /* ==========================================
  //    DEBUG: LANE OVERLAY (REMOVE AFTER DESIGN)
  // ========================================== */

  // const lanePositions = [
  //   { x:0.20, label:'RBI' },
  //   { x:0.45, label:'BRIDGE' },
  //   { x:0.65, label:'RESO' },
  //   { x:0.78, label:'RETS' },
  //   { x:0.92, label:'FUTURE' }
  // ];

  // cx.save();

  // cx.strokeStyle = 'rgba(255,170,0,0.12)';
  // cx.fillStyle   = 'rgba(255,170,0,0.35)';
  // cx.font = '10px monospace';

  // lanePositions.forEach(lane => {

  //   const px = W * lane.x;   // use W not canvas.width

  //   cx.beginPath();
  //   cx.moveTo(px,0);
  //   cx.lineTo(px,H);
  //   cx.stroke();

  //   cx.fillText(lane.label, px + 4, 14);

  // });

  // cx.restore();

    // Cluster labels with clean hierarchy
    cx.font = '700 10px "JetBrains Mono", monospace';
    cx.letterSpacing = '0.1em';
    
    // Left: ON-PREM HADOOP ERA (TCS)
    cx.textAlign = 'left';
    cx.fillStyle = 'rgba(204,136,0,0.6)';
    cx.fillText('ON-PREM HADOOP ERA', W * 0.08, 40);
    cx.font = '600 8px "JetBrains Mono", monospace';
    cx.fillStyle = 'rgba(204,136,0,0.4)';
    cx.fillText('(TCS)', W * 0.13, 55);
    
    // Right: CLOUD MODERNIZATION ERA (XOME)
    cx.font = '700 10px "JetBrains Mono", monospace';
    cx.fillStyle = 'rgba(255,170,0,0.6)';
    cx.fillText('CLOUD MODERNIZATION ERA', W * 0.65, 40);
    cx.font = '600 8px "JetBrains Mono", monospace';
    cx.fillStyle = 'rgba(255,170,0,0.4)';
    cx.fillText('(XOME)', W * 0.72, 55);

    // Grid dots background
    cx.fillStyle = 'rgba(255,170,0,0.04)';
    for (let x = 0; x < W; x += 28) {
      for (let y = 0; y < H; y += 28) {
        cx.beginPath();
        cx.arc(x, y, 1, 0, Math.PI * 2);
        cx.fill();
      }
    }

    // Draw traces with pipeline-aware highlighting
    const activeDef = pipelineDefs[activePipeline];

    traces.forEach(([ai, bi], traceIdx) => {
      if (!cNodes[ai] || !cNodes[bi]) return;
      const a = cNodes[ai], b = cNodes[bi];
      const isHoverHighlight = a.hovered || b.hovered;
      const isPipelineActive = activeDef && activeDef.traceIndices.has(traceIdx);

      // Pipeline color lookup (consistent per pipeline)
      let pipeColor = 'rgba(200,150,0,';
      if (activeDef) pipeColor = activeDef.color;

      const baseColor      = isPipelineActive ? `${pipeColor}0.22)` : 'rgba(255,170,0,0.10)';
      const pipelineColor  = `${pipeColor}0.72)`;
      const hoverColor     = `${pipeColor}0.95)`;

      // Manhattan-style route
      const mx = (a.cx + b.cx) / 2;
      cx.beginPath();
      cx.moveTo(a.cx, a.cy);
      cx.lineTo(mx, a.cy);
      cx.lineTo(mx, b.cy);
      cx.lineTo(b.cx, b.cy);

      if (isHoverHighlight && isPipelineActive) {
        cx.strokeStyle = hoverColor;
        cx.lineWidth = 2.2;
        cx.shadowColor = pipeColor + '0.9)';
        cx.shadowBlur = 10;
      } else if (isPipelineActive) {
        cx.strokeStyle = pipelineColor;
        cx.lineWidth = 1.6;
        cx.shadowColor = pipeColor + '0.6)';
        cx.shadowBlur = 6;
      } else {
        cx.strokeStyle = baseColor;
        cx.lineWidth = 0.8;
        cx.shadowBlur = 0;
      }
      cx.stroke();
      cx.shadowBlur = 0;

      // Animated data packet — always on active pipeline traces, extra bright on hover
      if (isPipelineActive) {
        const now = Date.now() / 1000;
        // stagger packets per trace so they don't all move in sync
        const offset = (traceIdx * 0.37) % 1;
        const t = ((now * 0.55 + offset) % 1);
        const totalLen = Math.abs(b.cx - a.cx) + Math.abs(b.cy - a.cy);
        if (totalLen < 1) return;
        const seg1 = Math.abs(mx - a.cx) / totalLen;
        const seg2 = Math.abs(b.cy - a.cy) / totalLen;
        let px, py;
        if (t < seg1) {
          px = a.cx + (mx - a.cx) * (t / (seg1 || 0.001));
          py = a.cy;
        } else if (t < seg1 + seg2) {
          px = mx;
          py = a.cy + (b.cy - a.cy) * ((t - seg1) / (seg2 || 0.001));
        } else {
          const seg3 = 1 - seg1 - seg2;
          px = mx + (b.cx - mx) * ((t - seg1 - seg2) / (seg3 || 0.001));
          py = b.cy;
        }
        const packetR = isHoverHighlight ? 3 : 2;
        cx.beginPath();
        cx.arc(px, py, packetR, 0, Math.PI * 2);
        cx.fillStyle = isHoverHighlight ? '#ffe066' : '#ffcc44';
        cx.shadowColor = '#ffaa00';
        cx.shadowBlur = isHoverHighlight ? 14 : 8;
        cx.fill();
        cx.shadowBlur = 0;
      }
    });

    // Draw nodes
    cNodes.forEach((n, idx) => {
      n.pulseT += 0.02;
      const glow = (Math.sin(n.pulseT) + 1) / 2;
      const r = n.hovered ? n.r + 4 : n.r;

      // MongoDB gets special slow pulsing glow
      const isMongoDB = n.name === 'MongoDB (WIP)';
      if (isMongoDB) n.pulseT += 0.005; // slower pulse

      // Pipeline active state
      const isPipelineNode = activeDef && activeDef.nodeIndices.has(idx);
      const pipeColor = activeDef ? activeDef.color : 'rgba(255,170,0,';

      // Outer ring
      if (n.hovered || isMongoDB || isPipelineNode) {
        cx.beginPath();
        cx.arc(n.cx, n.cy, r + 8, 0, Math.PI * 2);
        cx.strokeStyle = isPipelineNode
          ? `${pipeColor}${n.hovered ? '0.55' : '0.25 + ' + glow * 0.15})`
          : (isMongoDB ? 'rgba(255,170,0,0.3)' : 'rgba(255,170,0,0.2)');
        // Simpler: just compute it
        if (isPipelineNode) {
          cx.strokeStyle = `${pipeColor}${n.hovered ? '0.55)' : (0.2 + glow * 0.15).toFixed(2) + ')'}`;
        } else if (isMongoDB) {
          cx.strokeStyle = 'rgba(255,170,0,0.3)';
        } else {
          cx.strokeStyle = 'rgba(255,170,0,0.2)';
        }
        cx.lineWidth = isPipelineNode && !n.hovered ? 1.5 : 1;
        cx.stroke();

        if (isMongoDB || n.hovered || isPipelineNode) {
          cx.beginPath();
          cx.arc(n.cx, n.cy, r + (isPipelineNode ? 14 : 16) * glow, 0, Math.PI * 2);
          const alpha = isMongoDB ? 0.12 * glow : (isPipelineNode ? 0.18 * glow : 0.07 * glow);
          cx.strokeStyle = `${isPipelineNode ? pipeColor : 'rgba(255,170,0,'}${alpha.toFixed(3)})`;
          cx.lineWidth = 1;
          cx.stroke();
        }
      }

      // Node body
      let nodeColor, nodeShadow, nodeShadowBlur;
      if (n.hovered) {
        nodeColor = n.gColor;
        nodeShadow = n.gColor;
        nodeShadowBlur = 20;
      } else if (isPipelineNode) {
        nodeColor = `${pipeColor}${(0.55 + glow * 0.3).toFixed(2)})`;
        nodeShadow = `${pipeColor}0.9)`;
        nodeShadowBlur = 14 + glow * 8;
      } else {
        nodeColor = `rgba(255,170,0,${0.18 + glow * 0.12})`;
        nodeShadow = n.gColor;
        nodeShadowBlur = isMongoDB ? 12 + glow * 8 : 4 + glow * 3;
      }

      cx.beginPath();
      cx.arc(n.cx, n.cy, r, 0, Math.PI * 2);
      cx.fillStyle = nodeColor;
      cx.shadowColor = nodeShadow;
      cx.shadowBlur  = nodeShadowBlur;
      cx.fill();
      cx.shadowBlur = 0;

      // Label
      const labelAlpha = isPipelineNode ? 0.95 : 0.6;
      cx.fillStyle = n.hovered ? '#080708' : `rgba(245,240,232,${labelAlpha})`;
      cx.font = `${n.hovered ? '500' : (isPipelineNode ? '500' : '400')} ${n.hovered ? 10 : 9}px 'JetBrains Mono', monospace`;
      cx.textAlign = 'center';
      cx.fillText(n.name, n.cx, n.cy + r + 13);
      /* ==========================================
        DEBUG: NODE INDEX NUMBERS (TRACE HELPER)
      ========================================== */

      // cx.save();
      // cx.fillStyle = 'rgba(255,170,0,0.75)';
      // cx.font = '8px monospace';
      // cx.textAlign = 'center';

      // /* draw index slightly above node */
      // cx.fillText(`[${idx}]`, n.cx, n.cy - r - 8);

      // cx.restore();

    });

    animFrame2 = requestAnimationFrame(drawCircuit);
  }

  // Start after section enters viewport
  const ccObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { buildNodes(); drawCircuit(); }
      else cancelAnimationFrame(animFrame2);
    });
  }, { threshold: 0.1 });
  if (document.getElementById('skills')) ccObs.observe(document.getElementById('skills'));
}

/* ──────────────────────────────────────────────────────────────
   9. GROWTH CURVE GRAPH (Journey Section)
   ────────────────────────────────────────────────────────────── */
(function () {
  const gsvg = document.getElementById('growth-svg');
  if (!gsvg) return;

  const SVG_NS = 'http://www.w3.org/2000/svg';
  const isMobile = () => window.innerWidth <= 768;

  /* ── Era data ──────────────────────────────────────────────── */
  const eras = [
    { id: 0, year: '2018', label: 'Era 0 · Origin',          sublabel: 'College',       xFrac: 0.09, yFrac: 0.82 },
    { id: 1, year: '2022', label: 'Era 1 · On-Premise Vault', sublabel: 'TCS × RBI',    xFrac: 0.36, yFrac: 0.60 },
    { id: 2, year: '2024', label: 'Era 2 · Cloud Native',     sublabel: 'Xome',          xFrac: 0.65, yFrac: 0.30 },
    { id: 3, year: '2025', label: 'Now · Building Next',      sublabel: 'Present →',     xFrac: 0.88, yFrac: 0.10 }
  ];

  /* Tooltip placement rules: which side the card appears on */
  const PLACEMENT = [
    { anchor: 'right',  cardOffsetX:  28, cardOffsetY: -80  },  // Era 0: card upper-right
    { anchor: 'right',  cardOffsetX:  28, cardOffsetY: -120 },  // Era 1: card upper-right
    { anchor: 'left',   cardOffsetX: -28, cardOffsetY: -120 },  // Era 2: card upper-left
    { anchor: 'left',   cardOffsetX: -28, cardOffsetY: -60  }   // Era 3: card left, slightly down
  ];

  let activeEra = -1;
  let connectors = []; // SVG line elements

  /* ── Build SVG ─────────────────────────────────────────────── */
  function buildGraph() {
    // Clear SVG
    while (gsvg.firstChild) gsvg.removeChild(gsvg.firstChild);
    connectors = [];

    const W   = gsvg.getBoundingClientRect().width || 900;
    const H   = isMobile() ? 280 : 420;
    gsvg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    gsvg.setAttribute('height', H);

    const PAD_L = 60, PAD_R = 30, PAD_T = 36, PAD_B = 64;
    const graphW = W - PAD_L - PAD_R;
    const graphH = H - PAD_T - PAD_B;

    // Helpers
    const px = frac => PAD_L + frac * graphW;
    const py = frac => PAD_T + frac * graphH;

    /* ── Defs ── */
    const defs = el('defs');

    // Glow filter for dots
    const flt = el('filter'); flt.id = 'dotGlow';
    flt.setAttribute('x', '-60%'); flt.setAttribute('y', '-60%');
    flt.setAttribute('width', '220%'); flt.setAttribute('height', '220%');
    const blur = el('feGaussianBlur'); blur.setAttribute('stdDeviation', '4'); blur.setAttribute('result', 'b');
    const merge = el('feMerge');
    const mn1 = el('feMergeNode'); mn1.setAttribute('in', 'b');
    const mn2 = el('feMergeNode'); mn2.setAttribute('in', 'SourceGraphic');
    merge.appendChild(mn1); merge.appendChild(mn2);
    flt.appendChild(blur); flt.appendChild(merge);
    defs.appendChild(flt);

    // Gradient under curve
    const areaGrad = el('linearGradient');
    areaGrad.id = 'areaGrad';
    areaGrad.setAttribute('x1', '0%'); areaGrad.setAttribute('y1', '0%');
    areaGrad.setAttribute('x2', '0%'); areaGrad.setAttribute('y2', '100%');
    [['0%','rgba(255,170,0,0.10)'], ['100%','rgba(255,170,0,0.00)']].forEach(([o, c]) => {
      const s = el('stop'); s.setAttribute('offset', o); s.setAttribute('stop-color', c);
      areaGrad.appendChild(s);
    });
    defs.appendChild(areaGrad);

    // Curve glow filter
    const crvFlt = el('filter'); crvFlt.id = 'crvGlow';
    crvFlt.setAttribute('x', '-20%'); crvFlt.setAttribute('y', '-100%');
    crvFlt.setAttribute('width', '140%'); crvFlt.setAttribute('height', '300%');
    const cb = el('feGaussianBlur'); cb.setAttribute('stdDeviation', '3'); cb.setAttribute('result', 'cb');
    const cm = el('feMerge');
    const cm1 = el('feMergeNode'); cm1.setAttribute('in', 'cb');
    const cm2 = el('feMergeNode'); cm2.setAttribute('in', 'SourceGraphic');
    cm.appendChild(cm1); cm.appendChild(cm2);
    crvFlt.appendChild(cb); crvFlt.appendChild(cm);
    defs.appendChild(crvFlt);

    gsvg.appendChild(defs);

    /* ── Grid lines (faint horizontal dashes) ── */
    for (let i = 0; i <= 4; i++) {
      const gy = PAD_T + (i / 4) * graphH;
      const gl = el('line');
      gl.setAttribute('x1', PAD_L); gl.setAttribute('y1', gy);
      gl.setAttribute('x2', PAD_L + graphW); gl.setAttribute('y2', gy);
      gl.setAttribute('stroke', 'rgba(255,170,0,0.05)');
      gl.setAttribute('stroke-width', '1');
      gl.setAttribute('stroke-dasharray', '4,8');
      gsvg.appendChild(gl);
    }

    /* ── Y-axis ── */
    const yAxis = el('line');
    yAxis.setAttribute('x1', PAD_L); yAxis.setAttribute('y1', PAD_T);
    yAxis.setAttribute('x2', PAD_L); yAxis.setAttribute('y2', PAD_T + graphH);
    yAxis.setAttribute('stroke', 'rgba(255,170,0,0.18)'); yAxis.setAttribute('stroke-width', '1');
    gsvg.appendChild(yAxis);

    // Y-axis label
    const yLbl = el('text');
    yLbl.setAttribute('x', 14); yLbl.setAttribute('y', PAD_T + graphH / 2);
    yLbl.setAttribute('text-anchor', 'middle');
    yLbl.setAttribute('fill', 'rgba(255,170,0,0.45)');
    yLbl.setAttribute('font-family', 'JetBrains Mono, monospace');
    yLbl.setAttribute('font-size', isMobile() ? '7' : '9');
    yLbl.setAttribute('letter-spacing', '3');
    yLbl.setAttribute('transform', `rotate(-90, 14, ${PAD_T + graphH / 2})`);
    yLbl.textContent = 'GROWTH';
    gsvg.appendChild(yLbl);

    /* ── X-axis ── */
    const xAxis = el('line');
    xAxis.setAttribute('x1', PAD_L); xAxis.setAttribute('y1', PAD_T + graphH);
    xAxis.setAttribute('x2', PAD_L + graphW); xAxis.setAttribute('y2', PAD_T + graphH);
    xAxis.setAttribute('stroke', 'rgba(255,170,0,0.18)'); xAxis.setAttribute('stroke-width', '1');
    gsvg.appendChild(xAxis);

    // X-axis year labels
    eras.forEach(era => {
      const xp = px(era.xFrac);
      const tick = el('line');
      tick.setAttribute('x1', xp); tick.setAttribute('y1', PAD_T + graphH);
      tick.setAttribute('x2', xp); tick.setAttribute('y2', PAD_T + graphH + 6);
      tick.setAttribute('stroke', 'rgba(255,170,0,0.35)'); tick.setAttribute('stroke-width', '1');
      gsvg.appendChild(tick);

      const yrLbl = el('text');
      yrLbl.setAttribute('x', xp); yrLbl.setAttribute('y', PAD_T + graphH + 20);
      yrLbl.setAttribute('text-anchor', 'middle');
      yrLbl.setAttribute('fill', 'rgba(154,143,160,0.7)');
      yrLbl.setAttribute('font-family', 'JetBrains Mono, monospace');
      yrLbl.setAttribute('font-size', isMobile() ? '8' : '10');
      yrLbl.setAttribute('letter-spacing', '1');
      yrLbl.textContent = era.year;
      gsvg.appendChild(yrLbl);
    });

    /* ── Curve control points ── */
    const pts = eras.map(e => ({ x: px(e.xFrac), y: py(e.yFrac) }));

    // Build smooth cubic bezier path through points using Catmull-Rom → Bezier conversion
    function catmullToBezier(p) {
      let d = `M ${p[0].x},${p[0].y}`;
      for (let i = 0; i < p.length - 1; i++) {
        const p0 = p[Math.max(0, i - 1)];
        const p1 = p[i];
        const p2 = p[i + 1];
        const p3 = p[Math.min(p.length - 1, i + 2)];
        const tension = 0.4;
        const cp1x = p1.x + (p2.x - p0.x) * tension / 2;
        const cp1y = p1.y + (p2.y - p0.y) * tension / 2;
        const cp2x = p2.x - (p3.x - p1.x) * tension / 2;
        const cp2y = p2.y - (p3.y - p1.y) * tension / 2;
        d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
      }
      return d;
    }

    const curvePath = catmullToBezier(pts);

    // Area fill under curve
    const areaPath = curvePath + ` L ${pts[pts.length-1].x},${PAD_T + graphH} L ${pts[0].x},${PAD_T + graphH} Z`;
    const area = el('path');
    area.setAttribute('d', areaPath);
    area.setAttribute('fill', 'url(#areaGrad)');
    area.setAttribute('stroke', 'none');
    gsvg.appendChild(area);

    // Glow copy of curve
    const curveGlow = el('path');
    curveGlow.setAttribute('d', curvePath);
    curveGlow.setAttribute('fill', 'none');
    curveGlow.setAttribute('stroke', 'rgba(255,170,0,0.25)');
    curveGlow.setAttribute('stroke-width', '8');
    curveGlow.setAttribute('stroke-linecap', 'round');
    curveGlow.setAttribute('filter', 'url(#crvGlow)');
    gsvg.appendChild(curveGlow);

    // Main curve
    const curve = el('path');
    curve.setAttribute('d', curvePath);
    curve.setAttribute('fill', 'none');
    curve.setAttribute('stroke', 'var(--amber)');
    curve.setAttribute('stroke-width', '2');
    curve.setAttribute('stroke-linecap', 'round');
    gsvg.appendChild(curve);

    // Animated dot travelling along the curve
    const traveller = el('circle');
    traveller.setAttribute('r', '4');
    traveller.setAttribute('fill', '#ffcc44');
    traveller.setAttribute('filter', 'url(#dotGlow)');
    const travAnim = el('animateMotion');
    travAnim.setAttribute('dur', '6s');
    travAnim.setAttribute('repeatCount', 'indefinite');
    travAnim.setAttribute('path', curvePath);
    traveller.appendChild(travAnim);
    gsvg.appendChild(traveller);

    /* ── Connector lines (hidden initially, shown on hover) ── */
    eras.forEach((era, i) => {
      const connector = el('line');
      connector.setAttribute('stroke', 'rgba(255,170,0,0.5)');
      connector.setAttribute('stroke-width', '1');
      connector.setAttribute('stroke-dasharray', '4,4');
      connector.setAttribute('opacity', '0');
      connector.classList.add('gc-connector');
      connector.id = `gc-connector-${i}`;
      gsvg.appendChild(connector);
      connectors.push(connector);
    });

    /* ── Dots ── */
    eras.forEach((era, i) => {
      const xp = px(era.xFrac);
      const yp = py(era.yFrac);
      const isActive = (i === 2); // Era 2 is currently active

      // Pulse ring (Era 2 pulses by default)
      const ring = el('circle');
      ring.setAttribute('cx', xp); ring.setAttribute('cy', yp);
      ring.setAttribute('r', '18');
      ring.setAttribute('fill', 'none');
      ring.setAttribute('stroke', 'rgba(255,170,0,0.15)');
      ring.setAttribute('stroke-width', '1');
      ring.id = `gc-ring-${i}`;
      if (isActive) {
        const a1 = el('animate');
        a1.setAttribute('attributeName', 'r'); a1.setAttribute('values', '14;22;14');
        a1.setAttribute('dur', '2.2s'); a1.setAttribute('repeatCount', 'indefinite');
        const a2 = el('animate');
        a2.setAttribute('attributeName', 'opacity'); a2.setAttribute('values', '0.2;0.0;0.2');
        a2.setAttribute('dur', '2.2s'); a2.setAttribute('repeatCount', 'indefinite');
        ring.appendChild(a1); ring.appendChild(a2);
      }
      gsvg.appendChild(ring);

      // Dot fill
      const dot = el('circle');
      dot.setAttribute('cx', xp); dot.setAttribute('cy', yp);
      dot.setAttribute('r', '8');
      dot.setAttribute('fill', isActive ? '#ffaa00' : 'rgba(255,170,0,0.65)');
      dot.setAttribute('filter', 'url(#dotGlow)');
      dot.setAttribute('cursor', 'pointer');
      dot.id = `gc-dot-${i}`;
      gsvg.appendChild(dot);

      // Invisible hit area (larger)
      const hit = el('circle');
      hit.setAttribute('cx', xp); hit.setAttribute('cy', yp);
      hit.setAttribute('r', '22');
      hit.setAttribute('fill', 'transparent');
      hit.setAttribute('cursor', 'pointer');
      hit.addEventListener('mouseenter', () => showTooltip(i));
      hit.addEventListener('mouseleave', () => hideTooltip(i));
      hit.addEventListener('click', () => toggleMobileTooltip(i));
      gsvg.appendChild(hit);

      // Era label below x-axis tick (already rendered), add sublabel above dot
      const subLbl = el('text');
      subLbl.setAttribute('x', xp); subLbl.setAttribute('y', yp - 16);
      subLbl.setAttribute('text-anchor', 'middle');
      subLbl.setAttribute('fill', isActive ? 'rgba(255,170,0,0.85)' : 'rgba(154,143,160,0.6)');
      subLbl.setAttribute('font-family', 'JetBrains Mono, monospace');
      subLbl.setAttribute('font-size', isMobile() ? '7' : '9');
      subLbl.setAttribute('letter-spacing', '1');
      subLbl.textContent = era.sublabel.toUpperCase();
      gsvg.appendChild(subLbl);
    });

    /* ── Hint text ── */
    if (!isMobile()) {
      const hint = el('text');
      hint.setAttribute('x', PAD_L + graphW / 2);
      hint.setAttribute('y', H - 8);
      hint.setAttribute('text-anchor', 'middle');
      hint.setAttribute('fill', 'rgba(107,96,112,0.45)');
      hint.setAttribute('font-family', 'JetBrains Mono, monospace');
      hint.setAttribute('font-size', '9');
      hint.setAttribute('letter-spacing', '2');
      hint.textContent = '— HOVER ANY DOT TO READ THE STORY —';
      gsvg.appendChild(hint);
    }

    // Position all tooltip cards after SVG is laid out
    requestAnimationFrame(positionTooltips);
  }

  /* ── Tooltip positioning ─────────────────────────────────────── */
  function positionTooltips() {
    const container = document.getElementById('growth-graph');
    if (!container) return;
    const cRect = container.getBoundingClientRect();
    const svgRect = gsvg.getBoundingClientRect();
    const W = svgRect.width || 900;
    const H = isMobile() ? 280 : 420;
    const PAD_L = 60, PAD_R = 30, PAD_T = 36, PAD_B = 64;
    const graphW = W - PAD_L - PAD_R;
    const graphH = H - PAD_T - PAD_B;
    const scaleX = svgRect.width / W;
    const scaleY = svgRect.height / H;

    eras.forEach((era, i) => {
      const card = document.getElementById(`gc-tooltip-${i}`);
      if (!card || isMobile()) return;

      const dotX = (PAD_L + era.xFrac * graphW) * scaleX;
      const dotY = (PAD_T + era.yFrac * graphH) * scaleY;
      const pl = PLACEMENT[i];
      const CARD_W = 320;

      let left, top;
      if (pl.anchor === 'right') {
        left = dotX + pl.cardOffsetX;
        // Clamp so card doesn't overflow right edge
        if (left + CARD_W > svgRect.width - 10) {
          left = dotX - CARD_W - Math.abs(pl.cardOffsetX);
        }
      } else {
        left = dotX - CARD_W + pl.cardOffsetX;
        if (left < 5) left = dotX + Math.abs(pl.cardOffsetX);
      }
      top = dotY + pl.cardOffsetY;

      // Viewport-aware vertical clamping:
      // dotY is relative to the container top. Convert to viewport coordinates
      // so the card stays fully visible regardless of how far the user has scrolled.
      const CARD_H = 340; // matches max-height in CSS
      const containerTop = cRect.top; // px from viewport top (negative when scrolled past)
      const cardTopInViewport = containerTop + top;
      const cardBotInViewport = cardTopInViewport + CARD_H;
      if (cardTopInViewport < 8) {
        // Card would clip above viewport — push it down
        top += (8 - cardTopInViewport);
      } else if (cardBotInViewport > window.innerHeight - 8) {
        // Card would clip below viewport — push it up
        top -= (cardBotInViewport - (window.innerHeight - 8));
      }
      // Never go above the container itself
      if (top < 0) top = 8;

      card.style.left = left + 'px';
      card.style.top  = top + 'px';

      // Connector line (from dot to card top-left or top-right)
      const connector = document.getElementById(`gc-connector-${i}`);
      if (connector) {
        const cardCenterX = pl.anchor === 'right' ? left : left + CARD_W;
        const cardTopY    = top + 2;
        connector.setAttribute('x1', dotX);
        connector.setAttribute('y1', dotY);
        connector.setAttribute('x2', cardCenterX / scaleX);
        connector.setAttribute('y2', cardTopY / scaleY);
      }
    });
  }

  /* ── Show / Hide ─────────────────────────────────────────────── */
  function showTooltip(idx) {
    if (isMobile()) return;
    // Recalculate positions fresh at hover time so card is always viewport-correct
    // regardless of how far the user has scrolled into the journey section.
    positionTooltips();
    // Close any previously open
    eras.forEach((_, i) => {
      if (i !== idx) _hideOne(i);
    });
    const card = document.getElementById(`gc-tooltip-${idx}`);
    const dot  = document.getElementById(`gc-dot-${idx}`);
    const conn = document.getElementById(`gc-connector-${idx}`);
    if (card) card.classList.add('visible');
    if (dot) {
      dot.setAttribute('r', '11');
      dot.setAttribute('fill', '#ffcc44');
    }
    if (conn) conn.setAttribute('opacity', '1');
    // Animate metric bars inside card
    if (card) {
      card.querySelectorAll('.sp-metric-fill').forEach(bar => {
        setTimeout(() => { bar.style.width = bar.dataset.w; }, 80);
      });
    }
    activeEra = idx;
  }

  function hideTooltip(idx) {
    if (isMobile()) return;
    // Check if mouse moved into card itself — handled by card mouseleave
    setTimeout(() => {
      const card = document.getElementById(`gc-tooltip-${idx}`);
      if (card && card.matches(':hover')) return; // still hovering card
      _hideOne(idx);
    }, 80);
  }

  function _hideOne(idx) {
    const card = document.getElementById(`gc-tooltip-${idx}`);
    const dot  = document.getElementById(`gc-dot-${idx}`);
    const conn = document.getElementById(`gc-connector-${idx}`);
    if (card) {
      card.classList.remove('visible');
      card.querySelectorAll('.sp-metric-fill').forEach(bar => { bar.style.width = '0'; });
    }
    if (dot) {
      dot.setAttribute('r', '8');
      dot.setAttribute('fill', idx === 2 ? '#ffaa00' : 'rgba(255,170,0,0.65)');
    }
    if (conn) conn.setAttribute('opacity', '0');
  }

  // Mobile tap toggle
  function toggleMobileTooltip(idx) {
    if (!isMobile()) return;
    const card = document.getElementById(`gc-tooltip-${idx}`);
    if (!card) return;
    const wasOpen = card.classList.contains('mobile-show');
    // Close all
    eras.forEach((_, i) => {
      document.getElementById(`gc-tooltip-${i}`)?.classList.remove('mobile-show');
    });
    if (!wasOpen) card.classList.add('mobile-show');
  }

  // Card hover keeps tooltip alive
  document.querySelectorAll('.gc-tooltip').forEach(card => {
    card.addEventListener('mouseleave', () => {
      const idx = parseInt(card.dataset.dot);
      _hideOne(idx);
    });
  });

  /* ── SVG element helper ─────────────────────────────────────── */
  function el(tag) { return document.createElementNS(SVG_NS, tag); }

  /* ── Init + resize ──────────────────────────────────────────── */
  const journeyObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        buildGraph();
        journeyObs.disconnect();
      }
    });
  }, { threshold: 0.15 });

  const journeySection = document.getElementById('journey');
  if (journeySection) journeyObs.observe(journeySection);

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (journeySection && journeySection.getBoundingClientRect().top < window.innerHeight * 1.2) {
        buildGraph();
      }
    }, 150);
  });
}());


/* ──────────────────────────────────────────────────────────────
   10. CONTACT CTA TOGGLE
   ────────────────────────────────────────────────────────────── */
const ctaBtn = document.getElementById('contact-cta-btn');
const ctaOptions = document.getElementById('contact-options');

if (ctaBtn && ctaOptions) {
  ctaBtn.addEventListener('click', () => {
    ctaOptions.classList.toggle('show');
    ctaBtn.textContent = ctaOptions.classList.contains('show') 
      ? 'Close ×' 
      : 'Get in Touch →';
  });
}

/* ──────────────────────────────────────────────────────────────
   11. HERO PARALLAX
   ────────────────────────────────────────────────────────────── */
const heroContent = document.querySelector('.hero-content');
window.addEventListener('scroll', () => {
  const sy = window.scrollY;
  if (heroContent && sy < window.innerHeight * 1.2) {
    heroContent.style.transform = `translateY(${sy * 0.22}px)`;
    heroContent.style.opacity   = Math.max(0, 1 - sy / (window.innerHeight * 0.75));
  }
});

/* ──────────────────────────────────────────────────────────────
   12. SMOOTH SCROLL
   ────────────────────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const t = document.querySelector(a.getAttribute('href'));
    if (t) t.scrollIntoView({ behavior: 'smooth' });
  });
});