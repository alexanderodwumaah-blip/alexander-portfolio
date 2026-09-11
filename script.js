/* ============================================================
   ALEXANDER OPOKU DWUMAAH — PORTFOLIO
   script.js — Firestore live content + interactions
   ============================================================ */

import { initializeApp }   from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getFirestore, doc, getDoc, onSnapshot }
  from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

// ============================================================
// FIREBASE INIT
// ============================================================
const firebaseConfig = {
  apiKey:            "AIzaSyCXJ879HJ4AW-HyUPIoAUzBMSNyNj1sg7Y",
  authDomain:        "alexander-portfolio-69333.firebaseapp.com",
  projectId:         "alexander-portfolio-69333",
  storageBucket:     "alexander-portfolio-69333.firebasestorage.app",
  messagingSenderId: "846698427538",
  appId:             "1:846698427538:web:7e4d41d3d3f0a23031a24b"
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);
const CONTENT_REF = doc(db, 'portfolio', 'content');

// ============================================================
// HARDCODED FALLBACK DATA
// Used if Firestore is unreachable or before first load
// ============================================================
const FALLBACK = {
  projects: [
    {
      key: 'demand', number: '01', featured: 'yes',
      type: 'Final Year Project · Smart Grid · Thesis',
      title: "Smart Grid Enabled Household Level Load Shedding for Ghana's Demand Response Program Optimization",
      desc: 'Designed and developed a smart grid based household demand response system that intelligently prioritises electrical loads under supply constraints.',
      tags: 'Smart Grid,Demand Response,Load Management,Power Systems,Ghana',
      body: `<p>Designed and developed a smart grid based household demand response system that intelligently prioritises electrical loads under supply constraints. The system enables selective shedding of non-critical loads while maintaining essential services and provides controlled load restoration following power recovery.</p><ul><li><strong>Focus:</strong> Household-level demand management and load prioritisation</li><li><strong>Engineering area:</strong> Smart grids, power systems, demand response</li><li><strong>Outcome:</strong> Framework for intelligent, automated load control at household level</li></ul>`
    },
    {
      key: 'cctv', number: '02', featured: 'no',
      type: 'Industrial Systems Concept',
      title: 'Plant CCTV Infrastructure Mapping and Troubleshooting System',
      desc: 'A structured concept for mapping a large plant CCTV network across cameras, cabinets, IP addresses, fibre routes and monitoring locations.',
      tags: 'CCTV,IP Networks,Fibre Optic,Asset Mapping',
      body: `<p>A concept for mapping a large industrial CCTV environment with cameras distributed across a plant and yard. Maps each camera to its IP address, cabinet, network path, fibre route and monitoring point.</p><ul><li><strong>Asset mapping:</strong> Cameras, field cabinets, control room equipment</li><li><strong>Documentation:</strong> IP addresses, fibre and network routes</li><li><strong>Workflow:</strong> Maintenance-oriented fault tracing procedure</li></ul>`
    },
    {
      key: 'solar', number: '03', featured: 'no',
      type: 'Industrial Controls Concept',
      title: 'Mobile Solar Camera Power Changeover',
      desc: 'A practical relay-based DC changeover control concept for mobile solar camera units.',
      tags: 'DC Control,Solar,Relay Logic,Simurelay',
      body: `<p>A practical control concept for a mobile solar camera unit requiring a dependable DC supply with a fallback when the primary source is unavailable.</p><ul><li><strong>Primary supply:</strong> Solar-based DC source</li><li><strong>Backup:</strong> Separate DC supply via relay changeover</li><li><strong>Design tool:</strong> Simurelay</li></ul>`
    },
    {
      key: 'forecast', number: '04', featured: 'no',
      type: 'Engineering Research · 2026',
      title: 'Load Forecasting in Electrical Engineering Using Machine Learning',
      desc: 'A developing research project examining how machine learning applied to historical load data can support better power system planning.',
      tags: 'Load Forecasting,Machine Learning,Python,Power Systems',
      body: `<p>Active research exploring how machine learning applied to historical electrical load data can improve forecasting accuracy for grid planning and demand management.</p><ul><li><strong>Technology:</strong> Python, scikit-learn</li><li><strong>Focus:</strong> Short and medium-term load forecasting</li><li><strong>Status:</strong> Active - 2026</li></ul>`
    },
    {
      key: 'sound', number: '05', featured: 'no',
      type: 'Technical Design · Apr 2022',
      title: 'Industrial Sound Absorbing System',
      desc: 'An engineering design and prototype project exploring a practical approach to reducing unwanted industrial sound.',
      tags: 'AutoCAD,Prototype,Engineering Design,Acoustics',
      body: `<p>An engineering design project developing a practical approach to reducing industrial sound, combining theoretical acoustic principles with hands-on design and fabrication.</p><ul><li><strong>Design tool:</strong> AutoCAD</li><li><strong>Approach:</strong> Prototype development and testing</li></ul>`
    }
  ],
  webwork: [
    { index: '01', type: 'Education Platform',  name: 'GERAMA Academic Resources Centre', desc: 'A student-focused academic platform for UENR engineering students.', url: 'https://gerama-portal.vercel.app/index.html', label: 'Student learning platform' },
    { index: '02', type: 'Career Tool',          name: 'CV Genius Ghana',                  desc: 'A CV platform for Ghanaian students, graduates and professionals.',           url: 'https://cv-genius-ghana.web.app/',                label: 'CV and career platform' },
    { index: '03', type: 'Marketplace',          name: 'SSM Campus Marketplace',           desc: 'A campus marketplace for students to discover and exchange products.',         url: 'https://ssm-market-bdcf6.firebaseapp.com/',       label: 'Campus commerce platform' },
    { index: '04', type: 'E-Commerce',           name: 'YHEOLUX Signature',                desc: 'An African-inspired fashion storefront for bags, clutches and accessories.',   url: 'https://yheolux-store.web.app/',                  label: 'Online fashion store' },
    { index: '05', type: 'Career Preparation',   name: 'NS Interview Prep',                desc: 'A national service interview preparation platform for engineering graduates.',  url: 'https://smart-prep-omega.vercel.app/',            label: 'Interview preparation platform' }
  ],
  skills: [
    { number: '01', title: 'Power and Energy',             desc: 'Power generation, power systems, demand response, load management, generation reliability and thermal plant operations.' },
    { number: '02', title: 'Controls and Instrumentation', desc: 'Industrial instrumentation, sensors, process transmitters, PLC (Simatic Manager, CodeSys), SCADA, DCS, relay logic and maintenance practice.' },
    { number: '03', title: 'Digital Development',          desc: 'HTML, CSS, JavaScript, Python, MATLAB, C++, Firebase, Vercel, responsive web design, UI/UX (Figma), PCB design (KiCAD), AutoCAD Electrical.' },
    { number: '04', title: 'Research and Technical Work',  desc: 'Technical literature review, engineering documentation, system analysis, data compilation, project presentation and academic mentorship.' }
  ],
  speaking: [
    { date: 'Aug 2026', format: 'Virtual',   title: 'Igniting Purpose, Discipline, and Professional Excellence in WAIMM',              event: 'WAIMM UENR Chapter, End of 2025/2026 Administrative Year.' },
    { date: 'Jul 2026', format: 'Virtual',   title: 'Beyond the Classroom: How to Prepare, Perform and Excel in NSS Aptitude Tests',  event: 'WAIMM, Career preparation webinar for final year students.' },
    { date: 'Mar 2026', format: 'Virtual',   title: "Beyond the Engineering Class: What's Next",                                       event: 'Ghana Institution of Engineering, GhIE UENR Students Chapter.' },
    { date: 'Mar 2026', format: 'In-Person', title: 'Transforming Robotics Innovations into Industry Solutions in Ghana',              event: 'UENR Robotics Club.' },
    { date: 'Feb 2026', format: 'Virtual',   title: 'Stay on Track: Balancing Academics and Extracurricular Activities',               event: 'WAIMM Student Webinar.' },
    { date: 'Jun 2024', format: 'In-Person', title: 'The Effect of Substance Abuse Within the University Fraternity',                 event: 'Guest speaker, UPC-UENR online seminar.' }
  ],
  milestones: [
    { value: 'First Class',   desc: 'CGPA 3.88 / 4.00 - BSc Electrical and Electronic Engineering' },
    { value: 'Best Graduate', desc: 'Best Graduating Student, Dept. of Computer and Electrical Engineering, Dec 2025' },
    { value: '50+',           desc: 'Students and graduates directly mentored through GERAMA and tutorials' },
    { value: '5',             desc: 'Live web products designed, built and deployed' },
    { value: '6+',            desc: 'Invited speaking engagements at student and professional events' },
    { value: '10+',           desc: 'University leadership roles across engineering, peer counselling and student bodies' }
  ]
};

// ============================================================
// LIVE CONTENT RENDERING
// Reads from Firestore and renders all dynamic sections
// ============================================================

// -- Projects --
function renderProjectGrid(projects) {
  const grid = document.getElementById('projectGrid');
  if (!grid || !projects || !projects.length) return;

  // Build modal data map while rendering cards
  const modalMap = {};

  grid.innerHTML = projects.map(p => {
    modalMap[p.key] = { type: p.type, title: p.title, body: p.body };
    const tags = (p.tags || '').split(',').map(t => t.trim()).filter(Boolean)
      .map(t => `<span>${escHtml(t)}</span>`).join('');
    const featured = p.featured === 'yes' ? 'featured' : '';
    const featuredLabel = p.featured === 'yes' ? '<div class="project-number">' + p.number + ' · Featured</div>' : `<div class="project-number">${p.number}</div>`;
    const hasModal = p.body ? `<button class="text-button" data-project="${p.key}">Read project overview &rarr;</button>` : '';
    return `
      <article class="project-card ${featured}">
        ${featuredLabel}
        <p class="project-type">${escHtml(p.type)}</p>
        <h3>${escHtml(p.title)}</h3>
        <p>${escHtml(p.desc)}</p>
        <div class="tags">${tags}</div>
        ${hasModal}
      </article>
    `;
  }).join('');

  // Re-attach modal listeners with fresh data
  initModal(modalMap);
}

// -- Digital Work --
function renderWebGrid(webwork) {
  const grid = document.getElementById('webGrid');
  if (!grid || !webwork || !webwork.length) return;
  grid.innerHTML = webwork.map(w => `
    <article class="web-card">
      <div class="web-index">${escHtml(w.index)}</div>
      <p class="project-type">${escHtml(w.type)}</p>
      <h3>${escHtml(w.name)}</h3>
      <p>${escHtml(w.desc)}</p>
      <div class="web-footer">
        <span>${escHtml(w.label)}</span>
        <a href="${escHtml(w.url)}" target="_blank" rel="noopener">Visit live site &nearr;</a>
      </div>
    </article>
  `).join('');
}

// -- Skills --
function renderSkillsGrid(skills) {
  const grid = document.getElementById('skillsGrid');
  if (!grid || !skills || !skills.length) return;
  grid.innerHTML = skills.map(s => `
    <div>
      <span>${escHtml(s.number)}</span>
      <h3>${escHtml(s.title)}</h3>
      <p>${escHtml(s.desc)}</p>
    </div>
  `).join('');
  // Re-observe newly rendered skill cards for scroll reveal
  grid.querySelectorAll(':scope > div').forEach(el => attachReveal(el));
}

// -- Speaking --
function renderTalkList(speaking) {
  const list = document.getElementById('talkList');
  if (!list || !speaking || !speaking.length) return;
  list.innerHTML = speaking.map(s => `
    <article>
      <span>${escHtml(s.date)}</span>
      <div>
        <h3>${escHtml(s.title)}</h3>
        <p>${escHtml(s.event)} ${escHtml(s.format)}.</p>
      </div>
    </article>
  `).join('');
  list.querySelectorAll('article').forEach(el => attachReveal(el));
}

// -- Milestones --
function renderMilestoneGrid(milestones) {
  const grid = document.getElementById('milestoneGrid');
  if (!grid || !milestones || !milestones.length) return;
  grid.innerHTML = milestones.map(m => `
    <div>
      <strong>${escHtml(m.value)}</strong>
      <span>${escHtml(m.desc)}</span>
    </div>
  `).join('');
  grid.querySelectorAll(':scope > div').forEach(el => attachReveal(el));
}

// -- Render all sections from a data object --
function renderAll(content) {
  renderProjectGrid(content.projects   || FALLBACK.projects);
  renderWebGrid(content.webwork        || FALLBACK.webwork);
  renderSkillsGrid(content.skills      || FALLBACK.skills);
  renderTalkList(content.speaking      || FALLBACK.speaking);
  renderMilestoneGrid(content.milestones || FALLBACK.milestones);
}

// ============================================================
// LOAD FROM FIRESTORE WITH REAL-TIME LISTENER
// ============================================================
async function loadContent() {
  try {
    // First fetch for immediate render
    const snap = await getDoc(CONTENT_REF);
    if (snap.exists()) {
      renderAll(snap.data());
    } else {
      // No Firestore data yet — render fallback
      renderAll(FALLBACK);
    }

    // Then set up real-time listener so updates from admin appear instantly
    onSnapshot(CONTENT_REF, snap => {
      if (snap.exists()) renderAll(snap.data());
    });

  } catch (err) {
    console.warn('Firestore unavailable, using fallback data.', err);
    renderAll(FALLBACK);
  }
}

// ============================================================
// ESCAPE HTML
// ============================================================
function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ============================================================
// MODAL LOGIC
// ============================================================
const modal      = document.getElementById('projectModal');
const modalType  = document.getElementById('modalType');
const modalTitle = document.getElementById('modalTitle');
const modalBody  = document.getElementById('modalBody');

function initModal(projectDataMap) {
  // Remove old listeners by replacing nodes
  document.querySelectorAll('[data-project]').forEach(btn => {
    const clone = btn.cloneNode(true);
    btn.parentNode.replaceChild(clone, btn);
  });

  document.querySelectorAll('[data-project]').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = projectDataMap[btn.dataset.project];
      if (!item) return;
      modalType.textContent  = item.type;
      modalTitle.textContent = item.title;
      modalBody.innerHTML    = item.body;
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      setTimeout(() => modal.querySelector('.modal-close')?.focus(), 50);
    });
  });
}

function closeModal() {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.querySelectorAll('[data-close-modal]').forEach(el => el.addEventListener('click', closeModal));

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
});

// ============================================================
// MOBILE NAVIGATION
// ============================================================
const menuToggle = document.getElementById('menuToggle');
const mainNav    = document.getElementById('mainNav');

menuToggle.addEventListener('click', () => {
  const open = mainNav.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(open));
});

mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

// ============================================================
// ACTIVE NAV HIGHLIGHT ON SCROLL
// ============================================================
const navLinks = document.querySelectorAll('.main-nav a');

const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        const active = link.getAttribute('href') === `#${entry.target.id}`;
        link.style.color      = active ? 'var(--text-primary)' : '';
        link.style.background = active ? 'var(--border-light)' : '';
      });
    }
  });
}, { root: null, rootMargin: '-40% 0px -50% 0px', threshold: 0 });

document.querySelectorAll('section[id]').forEach(s => navObserver.observe(s));

// ============================================================
// SCROLL REVEAL
// ============================================================
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity   = '1';
      entry.target.style.transform = 'translateY(0)';
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });

function attachReveal(el) {
  el.style.opacity    = '0';
  el.style.transform  = 'translateY(24px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  revealObserver.observe(el);
}

// Attach to static elements that exist in HTML at load time
document.querySelectorAll(
  '.timeline-item, .journey-grid article, .leadership-grid article, .research-card'
).forEach(attachReveal);

// ============================================================
// CURRENT YEAR
// ============================================================
document.getElementById('year').textContent = new Date().getFullYear();

// ============================================================
// BOOT — load Firestore content, then set up interactions
// ============================================================
loadContent();
