/* ============================================================
   PORTFOLIO ADMIN DASHBOARD — admin.js
   Alexander Opoku Dwumaah
   Firebase Firestore integration — live content updates
   ============================================================ */

'use strict';

// ============================================================
// FIREBASE CONFIG & INIT
// ============================================================
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

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

// Firestore document reference — all portfolio content in one doc
const CONTENT_REF = doc(db, 'portfolio', 'content');

// ============================================================
// CONSTANTS
// ============================================================
const DEFAULT_PASS = 'aod@admin2026';
const STORE_KEY    = 'aod_portfolio_data';
const PASS_KEY     = 'aod_admin_pass';

// ============================================================
// TOAST SYSTEM
// ============================================================
function toast(msg, type = 'success', duration = 3500) {
  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  const container = document.getElementById('toastContainer');
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<span class="toast-icon">${icons[type]}</span><span class="toast-msg">${msg}</span>`;
  container.appendChild(el);
  setTimeout(() => {
    el.classList.add('removing');
    el.addEventListener('animationend', () => el.remove(), { once: true });
  }, duration);
}

// ============================================================
// CONFIRM MODAL
// ============================================================
let confirmResolve = null;

function confirmDialog(title, msg, okLabel = 'Delete', icon = '⚠️') {
  return new Promise(resolve => {
    confirmResolve = resolve;
    document.getElementById('confirmTitle').textContent = title;
    document.getElementById('confirmMsg').textContent   = msg;
    document.getElementById('confirmIcon').textContent  = icon;
    document.getElementById('confirmOk').textContent    = okLabel;
    document.getElementById('confirmOverlay').style.display = 'flex';
  });
}

document.getElementById('confirmOk').addEventListener('click', () => {
  document.getElementById('confirmOverlay').style.display = 'none';
  if (confirmResolve) { confirmResolve(true); confirmResolve = null; }
});

document.getElementById('confirmCancel').addEventListener('click', () => {
  document.getElementById('confirmOverlay').style.display = 'none';
  if (confirmResolve) { confirmResolve(false); confirmResolve = null; }
});

document.getElementById('confirmOverlay').addEventListener('click', e => {
  if (e.target === e.currentTarget) {
    document.getElementById('confirmOverlay').style.display = 'none';
    if (confirmResolve) { confirmResolve(false); confirmResolve = null; }
  }
});

// ============================================================
// PASSWORD VISIBILITY TOGGLE
// ============================================================
document.getElementById('passToggle').addEventListener('click', () => {
  const input = document.getElementById('adminPass');
  const isText = input.type === 'text';
  input.type = isText ? 'password' : 'text';
  document.getElementById('eyeIcon').style.opacity = isText ? '1' : '0.4';
});

// ============================================================
// AUTH
// ============================================================
function getPass() {
  return localStorage.getItem(PASS_KEY) || DEFAULT_PASS;
}

const loginScreen = document.getElementById('loginScreen');
const adminShell  = document.getElementById('adminShell');

document.getElementById('loginForm').addEventListener('submit', async e => {
  e.preventDefault();
  const val = document.getElementById('adminPass').value.trim();
  if (val === getPass()) {
    loginScreen.style.display = 'none';
    adminShell.style.display  = 'grid';
    await initAdmin();
  } else {
    document.getElementById('loginError').classList.add('show');
    document.getElementById('adminPass').value = '';
    document.getElementById('adminPass').focus();
  }
});

document.getElementById('adminPass').addEventListener('input', () => {
  document.getElementById('loginError').classList.remove('show');
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  adminShell.style.display  = 'none';
  loginScreen.style.display = 'flex';
  document.getElementById('adminPass').value = '';
  document.getElementById('loginError').classList.remove('show');
});

// ============================================================
// MOBILE SIDEBAR
// ============================================================
document.getElementById('mobileMenuBtn').addEventListener('click', () => {
  document.getElementById('adminSidebar').classList.toggle('open');
  document.getElementById('sidebarOverlay').classList.toggle('show');
});

document.getElementById('sidebarOverlay').addEventListener('click', () => {
  document.getElementById('adminSidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('show');
});

// ============================================================
// TAB NAVIGATION
// ============================================================
const TAB_TITLES = {
  overview:   ['Overview',                    'Welcome back, Alexander'],
  projects:   ['Engineering Projects',        'Add, edit or remove project cards'],
  webwork:    ['Digital Work',                'Manage your live web products'],
  skills:     ['Skills and Capabilities',     'Update your capability cards'],
  speaking:   ['Speaking and Community',      'Manage talks and presentations'],
  milestones: ['Milestones and Achievements', 'Update your key highlights'],
  cv:         ['CV / Resume',                 'Upload and manage your downloadable CV'],
  activity:   ['Activity Log',                'Recent changes in this session'],
  settings:   ['Settings',                    'Password, links and data management'],
};

function switchTab(name) {
  document.querySelectorAll('.nav-item[data-tab]').forEach(b => b.classList.toggle('active', b.dataset.tab === name));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.id === 'tab-' + name));
  const titles = TAB_TITLES[name] || [name, ''];
  document.getElementById('topbarTitle').textContent = titles[0];
  document.getElementById('topbarSub').textContent   = titles[1];
  document.getElementById('adminSidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('show');
}

document.querySelectorAll('.nav-item[data-tab]').forEach(btn => {
  btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

// ============================================================
// DEPLOY BANNER
// ============================================================
document.getElementById('deployDismiss').addEventListener('click', () => {
  document.getElementById('deployBanner').style.display = 'none';
});

// ============================================================
// AUTOSAVE BADGE
// ============================================================
function showAutosave() {
  const badge = document.getElementById('autosaveBadge');
  badge.classList.add('show');
  setTimeout(() => badge.classList.remove('show'), 2500);
}

// ============================================================
// FIRESTORE — SYNC STATUS UI
// ============================================================
function setSyncStatus(state) {
  // state: 'saving' | 'saved' | 'error'
  const badge = document.getElementById('autosaveBadge');
  const dot   = badge.querySelector('.autosave-dot');
  if (state === 'saving') {
    badge.classList.add('show');
    badge.style.background = 'rgba(245,158,11,0.1)';
    badge.style.borderColor = 'rgba(245,158,11,0.3)';
    badge.style.color = '#fbbf24';
    dot.style.background = '#f59e0b';
    badge.querySelector('span:last-child') && (badge.lastChild.textContent = ' Saving...');
  } else if (state === 'saved') {
    badge.classList.add('show');
    badge.style.background = '';
    badge.style.borderColor = '';
    badge.style.color = '';
    dot.style.background = '';
    setTimeout(() => badge.classList.remove('show'), 2500);
  } else if (state === 'error') {
    badge.classList.add('show');
    badge.style.background = 'rgba(239,68,68,0.1)';
    badge.style.borderColor = 'rgba(239,68,68,0.3)';
    badge.style.color = '#f87171';
    dot.style.background = '#ef4444';
  }
}

// ============================================================
// ACTIVITY LOG
// ============================================================
const activityLog = [];

function logActivity(type, msg) {
  const time = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  activityLog.unshift({ type, msg, time });
  renderActivity();
}

function renderActivity() {
  const list = document.getElementById('activityList');
  if (!activityLog.length) {
    list.innerHTML = '<div class="activity-empty">No activity yet. Start editing your portfolio content.</div>';
    return;
  }
  list.innerHTML = activityLog.map(e => `
    <div class="activity-entry">
      <div class="activity-dot ${e.type}"></div>
      <div class="activity-text">${e.msg}</div>
      <div class="activity-time">${e.time}</div>
    </div>
  `).join('');
}

document.getElementById('clearActivityBtn').addEventListener('click', () => {
  activityLog.length = 0;
  renderActivity();
});

// ============================================================
// FIRESTORE READ & WRITE
// ============================================================

/**
 * Load all portfolio content from Firestore.
 * Falls back to DEFAULTS if no document exists yet.
 */
async function loadFromFirestore() {
  try {
    showLoadingOverlay('Loading content from Firebase...');
    const snap = await getDoc(CONTENT_REF);
    if (snap.exists()) {
      const remote = snap.data();
      // Merge with defaults to fill any missing keys
      data = {
        projects:   remote.projects   || deepClone(DEFAULTS.projects),
        webwork:    remote.webwork    || deepClone(DEFAULTS.webwork),
        skills:     remote.skills     || deepClone(DEFAULTS.skills),
        speaking:   remote.speaking   || deepClone(DEFAULTS.speaking),
        milestones: remote.milestones || deepClone(DEFAULTS.milestones)
      };
      logActivity('info', 'Content loaded from Firestore');
    } else {
      // First time — write defaults to Firestore
      data = deepClone(DEFAULTS);
      await saveToFirestore(false);
      logActivity('info', 'First run: defaults written to Firestore');
    }
  } catch (err) {
    console.error('Firestore load error:', err);
    toast('Could not reach Firebase. Using local data.', 'warning', 5000);
    data = loadLocalFallback();
    logActivity('error', 'Firestore load failed - using local fallback');
  } finally {
    hideLoadingOverlay();
  }
}

/**
 * Save entire data object to Firestore.
 * showToast: whether to show the success toast (suppress on init)
 */
async function saveToFirestore(showToast = true) {
  setSyncStatus('saving');
  try {
    await setDoc(CONTENT_REF, {
      ...data,
      updatedAt: serverTimestamp()
    });
    // Also save to localStorage as offline fallback
    localStorage.setItem(STORE_KEY, JSON.stringify(data));
    setSyncStatus('saved');
    updateBadges();
    if (showToast) showAutosave();
    return true;
  } catch (err) {
    console.error('Firestore save error:', err);
    setSyncStatus('error');
    toast('Firebase save failed. Check your connection and try again.', 'error', 6000);
    return false;
  }
}

// ============================================================
// DATA STORE (with localStorage fallback)
// ============================================================
const DEFAULTS = {
  projects: [
    {
      key: 'demand', number: '01', featured: 'yes',
      type: 'Final Year Project · Smart Grid · Thesis',
      title: "Smart Grid Enabled Household Level Load Shedding for Ghana's Demand Response Program Optimization",
      desc:  'Designed and developed a smart grid based household demand response system that intelligently prioritises electrical loads under supply constraints.',
      tags:  'Smart Grid,Demand Response,Load Management,Power Systems,Ghana',
      body:  '<p>Designed and developed a smart grid based household demand response system that intelligently prioritises electrical loads under supply constraints. The system enables selective shedding of non-critical loads while maintaining essential services and provides controlled load restoration following power recovery.</p><ul><li>Focus: Household-level demand management and load prioritisation</li><li>Engineering area: Smart grids, power systems, demand response</li><li>Outcome: Framework for intelligent, automated load control at household level</li></ul>'
    },
    {
      key: 'cctv', number: '02', featured: 'no',
      type: 'Industrial Systems Concept',
      title: 'Plant CCTV Infrastructure Mapping and Troubleshooting System',
      desc:  'A structured concept for mapping a large plant CCTV network across cameras, cabinets, IP addresses, fibre routes and monitoring locations.',
      tags:  'CCTV,IP Networks,Fibre Optic,Asset Mapping',
      body:  '<p>A concept for mapping a large industrial CCTV environment with cameras distributed across a plant and yard. Maps each camera to its IP address, cabinet, network path, fibre route and monitoring point.</p><ul><li>Asset mapping: Cameras, field cabinets, control room equipment</li><li>Documentation: IP addresses, fibre and network routes</li><li>Workflow: Maintenance-oriented fault tracing procedure</li></ul>'
    },
    {
      key: 'solar', number: '03', featured: 'no',
      type: 'Industrial Controls Concept',
      title: 'Mobile Solar Camera Power Changeover',
      desc:  'A practical relay-based DC changeover control concept for mobile solar camera units, switching between a solar primary supply and a backup DC source.',
      tags:  'DC Control,Solar,Relay Logic,Simurelay',
      body:  '<p>A practical control concept for a mobile solar camera unit requiring a dependable DC supply with a fallback when the primary source is unavailable.</p><ul><li>Primary supply: Solar-based DC source</li><li>Backup: Separate DC supply via relay changeover</li><li>Control approach: Relay-based manual changeover logic</li><li>Design tool: Simurelay</li></ul>'
    },
    {
      key: 'forecast', number: '04', featured: 'no',
      type: 'Engineering Research · 2026',
      title: 'Load Forecasting in Electrical Engineering Using Machine Learning',
      desc:  'A developing research project examining how machine learning applied to historical load data can support better power system planning.',
      tags:  'Load Forecasting,Machine Learning,Python,Power Systems',
      body:  '<p>Active research exploring how machine learning applied to historical electrical load data can improve forecasting accuracy for grid planning and demand management.</p><ul><li>Technology: Python, scikit-learn, data analysis</li><li>Focus: Short and medium-term load forecasting</li><li>Application: Ghana electricity grid planning</li><li>Status: Active - 2026</li></ul>'
    },
    {
      key: 'sound', number: '05', featured: 'no',
      type: 'Technical Design · Apr 2022',
      title: 'Industrial Sound Absorbing System',
      desc:  'An engineering design and prototype project exploring a practical approach to reducing unwanted industrial sound.',
      tags:  'AutoCAD,Prototype,Engineering Design,Acoustics',
      body:  '<p>An engineering design project developing a practical approach to reducing industrial sound, combining theoretical acoustic principles with hands-on design and fabrication.</p><ul><li>Design tool: AutoCAD</li><li>Approach: Prototype development and testing</li><li>Application: Industrial noise reduction</li></ul>'
    }
  ],
  webwork: [
    { index: '01', type: 'Education Platform',  name: 'GERAMA Academic Resources Centre', desc: 'A student-focused academic platform for UENR engineering students bringing together lecture materials, textbooks, past questions, video tutorials and live classes.', url: 'https://gerama-portal.vercel.app/index.html', label: 'Student learning platform' },
    { index: '02', type: 'Career Tool',          name: 'CV Genius Ghana',                  desc: 'A CV platform designed for Ghanaian students, graduates and professionals supporting CV refinement, creation, guidance and expert review workflows.',           url: 'https://cv-genius-ghana.web.app/',                label: 'CV and career platform' },
    { index: '03', type: 'Marketplace',          name: 'SSM Campus Marketplace',           desc: 'A campus marketplace giving students a digital place to discover and exchange products and services within a university community.',                             url: 'https://ssm-market-bdcf6.firebaseapp.com/',       label: 'Campus commerce platform' },
    { index: '04', type: 'E-Commerce',           name: 'YHEOLUX Signature',                desc: 'An African-inspired fashion storefront for bags, clutches and accessories with product browsing, accounts, cart workflows and an admin catalogue area.',         url: 'https://yheolux-store.web.app/',                  label: 'Online fashion store' },
    { index: '05', type: 'Career Preparation',   name: 'NS Interview Prep',                desc: 'A national service interview preparation platform for Ghanaian engineering graduates with mock sessions, aptitude tests and progress tracking.',                  url: 'https://smart-prep-omega.vercel.app/',            label: 'Interview preparation platform' }
  ],
  skills: [
    { number: '01', title: 'Power and Energy',             desc: 'Power generation, power systems, demand response, load management, generation reliability and thermal plant operations.' },
    { number: '02', title: 'Controls and Instrumentation', desc: 'Industrial instrumentation, sensors, process transmitters, PLC (Simatic Manager, CodeSys), SCADA, DCS, relay logic and maintenance practice.' },
    { number: '03', title: 'Digital Development',          desc: 'HTML, CSS, JavaScript, Python, MATLAB, C++, Firebase, Vercel, responsive web design, UI/UX (Figma), PCB design (KiCAD), AutoCAD Electrical.' },
    { number: '04', title: 'Research and Technical Work',  desc: 'Technical literature review, engineering documentation, system analysis, data compilation, project presentation and academic mentorship.' }
  ],
  speaking: [
    { date: 'Aug 2026', format: 'Virtual',   title: 'Igniting Purpose, Discipline, and Professional Excellence in WAIMM',                event: 'WAIMM UENR Chapter, End of 2025/2026 Administrative Year.' },
    { date: 'Jul 2026', format: 'Virtual',   title: 'Beyond the Classroom: How to Prepare, Perform and Excel in NSS Aptitude Tests',   event: 'WAIMM, Career preparation webinar for final year students.' },
    { date: 'Mar 2026', format: 'Virtual',   title: "Beyond the Engineering Class: What's Next",                                        event: 'Ghana Institution of Engineering, GhIE UENR Students Chapter.' },
    { date: 'Mar 2026', format: 'In-Person', title: 'Transforming Robotics Innovations into Industry Solutions in Ghana',               event: 'UENR Robotics Club.' },
    { date: 'Feb 2026', format: 'Virtual',   title: 'Stay on Track: Balancing Academics and Extracurricular Activities',                event: 'WAIMM Student Webinar.' },
    { date: 'Jun 2024', format: 'In-Person', title: 'The Effect of Substance Abuse Within the University Fraternity',                  event: 'Guest speaker, UPC-UENR online seminar.' }
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

function loadLocalFallback() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return deepClone(DEFAULTS);
    const parsed = JSON.parse(raw);
    return {
      projects:   parsed.projects   || deepClone(DEFAULTS.projects),
      webwork:    parsed.webwork    || deepClone(DEFAULTS.webwork),
      skills:     parsed.skills     || deepClone(DEFAULTS.skills),
      speaking:   parsed.speaking   || deepClone(DEFAULTS.speaking),
      milestones: parsed.milestones || deepClone(DEFAULTS.milestones)
    };
  } catch { return deepClone(DEFAULTS); }
}

function deepClone(obj) { return JSON.parse(JSON.stringify(obj)); }

let data = deepClone(DEFAULTS);

// ============================================================
// LOADING OVERLAY
// ============================================================
function showLoadingOverlay(msg = 'Loading...') {
  let overlay = document.getElementById('loadingOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'loadingOverlay';
    overlay.style.cssText = `
      position:fixed;inset:0;z-index:9998;
      background:rgba(8,13,24,0.85);
      backdrop-filter:blur(6px);
      display:flex;flex-direction:column;
      align-items:center;justify-content:center;gap:16px;
      color:#f0f4ff;font-size:14px;font-weight:600;
    `;
    overlay.innerHTML = `
      <div style="width:40px;height:40px;border:3px solid rgba(59,130,246,0.2);border-top-color:#3b82f6;border-radius:50%;animation:spin 0.8s linear infinite;"></div>
      <div id="loadingMsg">${msg}</div>
      <style>@keyframes spin{to{transform:rotate(360deg)}}</style>
    `;
    document.body.appendChild(overlay);
  } else {
    document.getElementById('loadingMsg').textContent = msg;
    overlay.style.display = 'flex';
  }
}

function hideLoadingOverlay() {
  const overlay = document.getElementById('loadingOverlay');
  if (overlay) overlay.style.display = 'none';
}

// ============================================================
// NAV BADGES & OVERVIEW COUNTS
// ============================================================
function updateBadges() {
  const map = {
    'badge-projects':  data.projects.length,
    'badge-webwork':   data.webwork.length,
    'badge-skills':    data.skills.length,
    'badge-speaking':  data.speaking.length,
    'badge-milestones':data.milestones.length,
    'ov-projects':     data.projects.length,
    'ov-webwork':      data.webwork.length,
    'ov-skills':       data.skills.length,
    'ov-speaking':     data.speaking.length,
    'ov-milestones':   data.milestones.length
  };
  Object.entries(map).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  });
}

// ============================================================
// CV STATUS CHECK
// ============================================================
async function checkCvOnLoad() {
  try {
    const res = await fetch('cv/Alexander-Opoku-Dwumaah-CV.pdf', { method: 'HEAD', cache: 'no-store' });
    if (res.ok) {
      document.getElementById('ov-cv').textContent      = 'Live';
      document.getElementById('ov-cv-foot').textContent = 'accessible on site';
      const dot = document.getElementById('cvLiveDot');
      if (dot) dot.style.display = 'block';
      const card = document.getElementById('ov-cv').closest('.stat-card');
      if (card) { card.className = 'stat-card green'; }
    } else {
      document.getElementById('ov-cv').textContent      = 'Missing';
      document.getElementById('ov-cv-foot').textContent = 'not on site yet';
    }
  } catch {
    document.getElementById('ov-cv').textContent      = '—';
    document.getElementById('ov-cv-foot').textContent = 'could not check';
  }
}

// ============================================================
// HELPERS
// ============================================================
function pad(n) { return String(n).padStart(2, '0'); }

function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function openDrawer(formId, titleElId, titleText) {
  document.getElementById(titleElId).textContent = titleText;
  const form = document.getElementById(formId);
  form.style.display = 'block';
  setTimeout(() => form.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
}

function closeDrawer(formId) {
  document.getElementById(formId).style.display = 'none';
}

// Copy buttons
document.addEventListener('click', e => {
  const btn = e.target.closest('.btn-copy');
  if (!btn) return;
  const target = document.getElementById(btn.dataset.target);
  if (!target) return;
  target.select();
  try {
    document.execCommand('copy');
    btn.textContent = 'Copied!';
    btn.classList.add('copied');
    setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 2000);
  } catch { toast('Select the text manually to copy.', 'warning'); }
});

// ============================================================
// SAVE HELPER — save to Firestore then re-render
// ============================================================
async function saveSection(sectionName, renderFn, actionLabel) {
  const ok = await saveToFirestore(true);
  if (ok) {
    renderFn();
    logActivity('edit', actionLabel);
    toast(`${actionLabel} — live on your portfolio now.`, 'success');
  }
}

// ============================================================
// PROJECTS TAB
// ============================================================
let editProjectIdx = -1;

function renderProjects() {
  const list = document.getElementById('projectList');
  if (!data.projects.length) {
    list.innerHTML = '<div class="empty-state">No projects yet. Click "+ Add project" to create one.</div>';
    document.getElementById('projectExport').style.display = 'none';
    return;
  }
  list.innerHTML = data.projects.map((p, i) => `
    <div class="item-row">
      <div class="item-num">${p.number}</div>
      <div class="item-info">
        <div class="item-title">${escHtml(p.title)}</div>
        <div class="item-meta">${escHtml(p.type)}${p.featured === 'yes' ? ' &nbsp;·&nbsp; <strong style="color:var(--gold2)">Featured</strong>' : ''}</div>
      </div>
      <div class="item-actions">
        <button class="item-edit-btn" onclick="editProject(${i})">Edit</button>
        <button class="item-del-btn"  onclick="deleteProject(${i})">Delete</button>
      </div>
    </div>
  `).join('');
  renderProjectExport();
}

function editProject(i) {
  editProjectIdx = i;
  const p = data.projects[i];
  document.getElementById('pKey').value      = p.key;
  document.getElementById('pNumber').value   = p.number;
  document.getElementById('pType').value     = p.type;
  document.getElementById('pTitle').value    = p.title;
  document.getElementById('pDesc').value     = p.desc;
  document.getElementById('pTags').value     = p.tags;
  document.getElementById('pBody').value     = p.body;
  document.getElementById('pFeatured').value = p.featured || 'no';
  openDrawer('projectForm', 'projectFormTitle', 'Edit project');
}

async function deleteProject(i) {
  const ok = await confirmDialog('Delete project?', `"${data.projects[i].title.substring(0,60)}..." will be removed from your live portfolio.`, 'Delete', '🗑️');
  if (!ok) return;
  const title = data.projects[i].title;
  data.projects.splice(i, 1);
  await saveSection('projects', renderProjects, `Deleted project: ${title.substring(0,50)}`);
}

document.getElementById('addProjectBtn').addEventListener('click', () => {
  editProjectIdx = -1;
  ['pKey','pNumber','pType','pTitle','pDesc','pTags','pBody'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('pNumber').value   = pad(data.projects.length + 1);
  document.getElementById('pFeatured').value = 'no';
  openDrawer('projectForm', 'projectFormTitle', 'Add project');
});

document.getElementById('cancelProjectBtn').addEventListener('click', () => closeDrawer('projectForm'));
document.getElementById('cancelProjectX').addEventListener('click',   () => closeDrawer('projectForm'));

document.getElementById('saveProjectBtn').addEventListener('click', async () => {
  const key   = document.getElementById('pKey').value.trim().replace(/\s+/g, '');
  const title = document.getElementById('pTitle').value.trim();
  if (!key)   { toast('Project key is required.', 'error'); return; }
  if (!title) { toast('Project title is required.', 'error'); return; }

  const entry = {
    key,
    number:   document.getElementById('pNumber').value.trim(),
    type:     document.getElementById('pType').value.trim(),
    title,
    desc:     document.getElementById('pDesc').value.trim(),
    tags:     document.getElementById('pTags').value.trim(),
    body:     document.getElementById('pBody').value.trim(),
    featured: document.getElementById('pFeatured').value
  };

  const isEdit = editProjectIdx >= 0;
  if (isEdit) { data.projects[editProjectIdx] = entry; }
  else        { data.projects.push(entry); }

  closeDrawer('projectForm');
  await saveSection('projects', renderProjects, `${isEdit ? 'Updated' : 'Added'} project: ${title.substring(0,50)}`);
});

function renderProjectExport() {
  const box = document.getElementById('projectExport');
  if (!data.projects.length) { box.style.display = 'none'; return; }
  box.style.display = 'block';
  const obj = {};
  data.projects.forEach(p => { obj[p.key] = { type: p.type, title: p.title, body: p.body }; });
  document.getElementById('projectExportCode').value =
    'const projectData = ' + JSON.stringify(obj, null, 2) + ';';
}

// ============================================================
// DIGITAL WORK TAB
// ============================================================
let editWebIdx = -1;

function renderWebwork() {
  const list = document.getElementById('webList');
  if (!data.webwork.length) {
    list.innerHTML = '<div class="empty-state">No digital products yet. Click "+ Add product" to create one.</div>';
    document.getElementById('webExport').style.display = 'none';
    return;
  }
  list.innerHTML = data.webwork.map((w, i) => `
    <div class="item-row">
      <div class="item-num">${w.index}</div>
      <div class="item-info">
        <div class="item-title">${escHtml(w.name)}</div>
        <div class="item-meta">${escHtml(w.type)} &nbsp;·&nbsp; <a href="${escHtml(w.url)}" target="_blank">${escHtml(w.url)}</a></div>
      </div>
      <div class="item-actions">
        <button class="item-edit-btn" onclick="editWeb(${i})">Edit</button>
        <button class="item-del-btn"  onclick="deleteWeb(${i})">Delete</button>
      </div>
    </div>
  `).join('');
  renderWebExport();
}

function editWeb(i) {
  editWebIdx = i;
  const w = data.webwork[i];
  document.getElementById('wIndex').value = w.index;
  document.getElementById('wType').value  = w.type;
  document.getElementById('wName').value  = w.name;
  document.getElementById('wDesc').value  = w.desc;
  document.getElementById('wUrl').value   = w.url;
  document.getElementById('wLabel').value = w.label;
  openDrawer('webForm', 'webFormTitle', 'Edit digital product');
}

async function deleteWeb(i) {
  const ok = await confirmDialog('Delete product?', `"${data.webwork[i].name}" will be removed from your live portfolio.`, 'Delete', '🗑️');
  if (!ok) return;
  const name = data.webwork[i].name;
  data.webwork.splice(i, 1);
  await saveSection('webwork', renderWebwork, `Deleted digital product: ${name}`);
}

document.getElementById('addWebBtn').addEventListener('click', () => {
  editWebIdx = -1;
  ['wIndex','wType','wName','wDesc','wUrl','wLabel'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('wIndex').value = pad(data.webwork.length + 1);
  openDrawer('webForm', 'webFormTitle', 'Add digital product');
});

document.getElementById('cancelWebBtn').addEventListener('click', () => closeDrawer('webForm'));
document.getElementById('cancelWebX').addEventListener('click',   () => closeDrawer('webForm'));

document.getElementById('saveWebBtn').addEventListener('click', async () => {
  const name = document.getElementById('wName').value.trim();
  if (!name) { toast('Product name is required.', 'error'); return; }
  const entry = {
    index: document.getElementById('wIndex').value.trim(),
    type:  document.getElementById('wType').value.trim(),
    name,
    desc:  document.getElementById('wDesc').value.trim(),
    url:   document.getElementById('wUrl').value.trim(),
    label: document.getElementById('wLabel').value.trim()
  };
  const isEdit = editWebIdx >= 0;
  if (isEdit) { data.webwork[editWebIdx] = entry; }
  else        { data.webwork.push(entry); }
  closeDrawer('webForm');
  await saveSection('webwork', renderWebwork, `${isEdit ? 'Updated' : 'Added'} digital product: ${name}`);
});

function renderWebExport() {
  const box = document.getElementById('webExport');
  if (!data.webwork.length) { box.style.display = 'none'; return; }
  box.style.display = 'block';
  document.getElementById('webExportCode').value = data.webwork.map(w =>
`<article class="web-card">
  <div class="web-index">${w.index}</div>
  <p class="project-type">${w.type}</p>
  <h3>${w.name}</h3>
  <p>${w.desc}</p>
  <div class="web-footer">
    <span>${w.label}</span>
    <a href="${w.url}" target="_blank" rel="noopener">Visit live site &nearr;</a>
  </div>
</article>`).join('\n\n');
}

// ============================================================
// SKILLS TAB
// ============================================================
let editSkillIdx = -1;

function renderSkills() {
  const list = document.getElementById('skillList');
  if (!data.skills.length) {
    list.innerHTML = '<div class="empty-state">No skill categories yet. Click "+ Add skill" to create one.</div>';
    document.getElementById('skillExport').style.display = 'none';
    return;
  }
  list.innerHTML = data.skills.map((s, i) => `
    <div class="item-row">
      <div class="item-num">${s.number}</div>
      <div class="item-info">
        <div class="item-title">${escHtml(s.title)}</div>
        <div class="item-meta">${escHtml(s.desc.substring(0,90))}${s.desc.length > 90 ? '...' : ''}</div>
      </div>
      <div class="item-actions">
        <button class="item-edit-btn" onclick="editSkill(${i})">Edit</button>
        <button class="item-del-btn"  onclick="deleteSkill(${i})">Delete</button>
      </div>
    </div>
  `).join('');
  renderSkillExport();
}

function editSkill(i) {
  editSkillIdx = i;
  const s = data.skills[i];
  document.getElementById('sNumber').value = s.number;
  document.getElementById('sTitle').value  = s.title;
  document.getElementById('sDesc').value   = s.desc;
  openDrawer('skillForm', 'skillFormTitle', 'Edit skill');
}

async function deleteSkill(i) {
  const ok = await confirmDialog('Delete skill?', `"${data.skills[i].title}" will be removed.`, 'Delete', '🗑️');
  if (!ok) return;
  const title = data.skills[i].title;
  data.skills.splice(i, 1);
  await saveSection('skills', renderSkills, `Deleted skill: ${title}`);
}

document.getElementById('addSkillBtn').addEventListener('click', () => {
  editSkillIdx = -1;
  ['sNumber','sTitle','sDesc'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('sNumber').value = pad(data.skills.length + 1);
  openDrawer('skillForm', 'skillFormTitle', 'Add skill');
});

document.getElementById('cancelSkillBtn').addEventListener('click', () => closeDrawer('skillForm'));
document.getElementById('cancelSkillX').addEventListener('click',   () => closeDrawer('skillForm'));

document.getElementById('saveSkillBtn').addEventListener('click', async () => {
  const title = document.getElementById('sTitle').value.trim();
  if (!title) { toast('Skill title is required.', 'error'); return; }
  const entry = {
    number: document.getElementById('sNumber').value.trim(),
    title,
    desc:   document.getElementById('sDesc').value.trim()
  };
  const isEdit = editSkillIdx >= 0;
  if (isEdit) { data.skills[editSkillIdx] = entry; }
  else        { data.skills.push(entry); }
  closeDrawer('skillForm');
  await saveSection('skills', renderSkills, `${isEdit ? 'Updated' : 'Added'} skill: ${title}`);
});

function renderSkillExport() {
  const box = document.getElementById('skillExport');
  if (!data.skills.length) { box.style.display = 'none'; return; }
  box.style.display = 'block';
  document.getElementById('skillExportCode').value = data.skills.map(s =>
`<div>
  <span>${s.number}</span>
  <h3>${s.title}</h3>
  <p>${s.desc}</p>
</div>`).join('\n\n');
}

// ============================================================
// SPEAKING TAB
// ============================================================
let editSpeakIdx = -1;

function renderSpeaking() {
  const list = document.getElementById('speakList');
  if (!data.speaking.length) {
    list.innerHTML = '<div class="empty-state">No talks yet. Click "+ Add talk" to log your first engagement.</div>';
    document.getElementById('speakExport').style.display = 'none';
    return;
  }
  list.innerHTML = data.speaking.map((s, i) => `
    <div class="item-row">
      <div class="item-num">${escHtml(s.date)}</div>
      <div class="item-info">
        <div class="item-title">${escHtml(s.title)}</div>
        <div class="item-meta">${escHtml(s.event)} &nbsp;·&nbsp; ${escHtml(s.format)}</div>
      </div>
      <div class="item-actions">
        <button class="item-edit-btn" onclick="editSpeak(${i})">Edit</button>
        <button class="item-del-btn"  onclick="deleteSpeak(${i})">Delete</button>
      </div>
    </div>
  `).join('');
  renderSpeakExport();
}

function editSpeak(i) {
  editSpeakIdx = i;
  const s = data.speaking[i];
  document.getElementById('spDate').value   = s.date;
  document.getElementById('spFormat').value = s.format;
  document.getElementById('spTitle').value  = s.title;
  document.getElementById('spEvent').value  = s.event;
  openDrawer('speakForm', 'speakFormTitle', 'Edit talk');
}

async function deleteSpeak(i) {
  const ok = await confirmDialog('Delete talk?', `"${data.speaking[i].title.substring(0,60)}..." will be removed.`, 'Delete', '🗑️');
  if (!ok) return;
  const title = data.speaking[i].title;
  data.speaking.splice(i, 1);
  await saveSection('speaking', renderSpeaking, `Deleted talk: ${title.substring(0,50)}`);
}

document.getElementById('addSpeakBtn').addEventListener('click', () => {
  editSpeakIdx = -1;
  ['spDate','spTitle','spEvent'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('spFormat').value = 'Virtual';
  openDrawer('speakForm', 'speakFormTitle', 'Add talk');
});

document.getElementById('cancelSpeakBtn').addEventListener('click', () => closeDrawer('speakForm'));
document.getElementById('cancelSpeakX').addEventListener('click',   () => closeDrawer('speakForm'));

document.getElementById('saveSpeakBtn').addEventListener('click', async () => {
  const title = document.getElementById('spTitle').value.trim();
  const date  = document.getElementById('spDate').value.trim();
  if (!title) { toast('Talk title is required.', 'error'); return; }
  if (!date)  { toast('Date is required.', 'error'); return; }
  const entry = {
    date, format: document.getElementById('spFormat').value,
    title, event: document.getElementById('spEvent').value.trim()
  };
  const isEdit = editSpeakIdx >= 0;
  if (isEdit) { data.speaking[editSpeakIdx] = entry; }
  else        { data.speaking.push(entry); }
  closeDrawer('speakForm');
  await saveSection('speaking', renderSpeaking, `${isEdit ? 'Updated' : 'Added'} talk: ${title.substring(0,50)}`);
});

function renderSpeakExport() {
  const box = document.getElementById('speakExport');
  if (!data.speaking.length) { box.style.display = 'none'; return; }
  box.style.display = 'block';
  document.getElementById('speakExportCode').value = data.speaking.map(s =>
`<article>
  <span>${s.date}</span>
  <div>
    <h3>${s.title}</h3>
    <p>${s.event} ${s.format}.</p>
  </div>
</article>`).join('\n\n');
}

// ============================================================
// MILESTONES TAB
// ============================================================
let editMilestoneIdx = -1;

function renderMilestones() {
  const list = document.getElementById('milestoneList');
  if (!data.milestones.length) {
    list.innerHTML = '<div class="empty-state">No milestones yet. Click "+ Add milestone" to highlight an achievement.</div>';
    document.getElementById('milestoneExport').style.display = 'none';
    return;
  }
  list.innerHTML = data.milestones.map((m, i) => `
    <div class="item-row">
      <div class="item-num" style="color:var(--gold2);min-width:80px;">${escHtml(m.value)}</div>
      <div class="item-info">
        <div class="item-title">${escHtml(m.desc)}</div>
      </div>
      <div class="item-actions">
        <button class="item-edit-btn" onclick="editMilestone(${i})">Edit</button>
        <button class="item-del-btn"  onclick="deleteMilestone(${i})">Delete</button>
      </div>
    </div>
  `).join('');
  renderMilestoneExport();
}

function editMilestone(i) {
  editMilestoneIdx = i;
  const m = data.milestones[i];
  document.getElementById('mValue').value = m.value;
  document.getElementById('mDesc').value  = m.desc;
  openDrawer('milestoneForm', 'milestoneFormTitle', 'Edit milestone');
}

async function deleteMilestone(i) {
  const ok = await confirmDialog('Delete milestone?', `"${data.milestones[i].value}" will be removed.`, 'Delete', '🗑️');
  if (!ok) return;
  const val = data.milestones[i].value;
  data.milestones.splice(i, 1);
  await saveSection('milestones', renderMilestones, `Deleted milestone: ${val}`);
}

document.getElementById('addMilestoneBtn').addEventListener('click', () => {
  editMilestoneIdx = -1;
  ['mValue','mDesc'].forEach(id => document.getElementById(id).value = '');
  openDrawer('milestoneForm', 'milestoneFormTitle', 'Add milestone');
});

document.getElementById('cancelMilestoneBtn').addEventListener('click', () => closeDrawer('milestoneForm'));
document.getElementById('cancelMilestoneX').addEventListener('click',   () => closeDrawer('milestoneForm'));

document.getElementById('saveMilestoneBtn').addEventListener('click', async () => {
  const value = document.getElementById('mValue').value.trim();
  const desc  = document.getElementById('mDesc').value.trim();
  if (!value) { toast('Value/headline is required.', 'error'); return; }
  if (!desc)  { toast('Description is required.', 'error'); return; }
  const entry = { value, desc };
  const isEdit = editMilestoneIdx >= 0;
  if (isEdit) { data.milestones[editMilestoneIdx] = entry; }
  else        { data.milestones.push(entry); }
  closeDrawer('milestoneForm');
  await saveSection('milestones', renderMilestones, `${isEdit ? 'Updated' : 'Added'} milestone: ${value}`);
});

function renderMilestoneExport() {
  const box = document.getElementById('milestoneExport');
  if (!data.milestones.length) { box.style.display = 'none'; return; }
  box.style.display = 'block';
  document.getElementById('milestoneExportCode').value = data.milestones.map(m =>
`<div>
  <strong>${m.value}</strong>
  <span>${m.desc}</span>
</div>`).join('\n\n');
}

// ============================================================
// CV TAB
// ============================================================
const cvDropArea  = document.getElementById('cvDropArea');
const cvFileInput = document.getElementById('cvFileInput');

cvDropArea.addEventListener('click', () => cvFileInput.click());
cvDropArea.addEventListener('dragover', e => { e.preventDefault(); cvDropArea.classList.add('dragging'); });
cvDropArea.addEventListener('dragleave', e => { if (!cvDropArea.contains(e.relatedTarget)) cvDropArea.classList.remove('dragging'); });
cvDropArea.addEventListener('drop', e => { e.preventDefault(); cvDropArea.classList.remove('dragging'); if (e.dataTransfer.files[0]) handleCvFile(e.dataTransfer.files[0]); });
cvFileInput.addEventListener('change', () => { if (cvFileInput.files[0]) handleCvFile(cvFileInput.files[0]); });

document.getElementById('cvRemoveBtn').addEventListener('click', () => {
  cvFileInput.value = '';
  document.getElementById('cvFileSelected').style.display = 'none';
  cvDropArea.style.display = 'block';
});

function handleCvFile(file) {
  if (!file.name.toLowerCase().endsWith('.pdf')) { toast('Only PDF files are accepted.', 'error'); return; }
  const sizeMB = (file.size / 1024 / 1024).toFixed(2);
  document.getElementById('cvFileName').textContent = file.name;
  document.getElementById('cvFileSize').textContent = `${sizeMB} MB · PDF`;
  document.getElementById('cvFileSelected').style.display = 'flex';
  cvDropArea.style.display = 'none';
  document.getElementById('ov-cv').textContent      = 'Ready';
  document.getElementById('ov-cv-foot').textContent = 'file selected';
  toast(`"${file.name}" selected. Place it in cv/ folder and deploy to go live.`, 'info', 5000);
  logActivity('add', `CV file selected: ${file.name} (${sizeMB} MB)`);
}

document.getElementById('checkCvBtn').addEventListener('click', async () => {
  const result = document.getElementById('cvResult');
  const btn    = document.getElementById('checkCvBtn');
  result.style.display = 'none';
  btn.textContent = 'Checking...';
  btn.disabled    = true;
  try {
    const res = await fetch('cv/Alexander-Opoku-Dwumaah-CV.pdf', { method: 'HEAD', cache: 'no-store' });
    result.style.display = 'block';
    if (res.ok) {
      result.className = 'cv-result ok';
      result.textContent = 'CV is live and accessible. The Download CV buttons are working.';
      document.getElementById('cvLiveDot').style.display = 'block';
      document.getElementById('ov-cv').textContent      = 'Live';
      document.getElementById('ov-cv-foot').textContent = 'accessible on site';
      logActivity('info', 'CV check: live and accessible');
    } else {
      result.className = 'cv-result fail';
      result.textContent = `CV not found (${res.status}). Add the file to cv/ folder and run firebase deploy --only hosting.`;
      logActivity('info', `CV check: not found (${res.status})`);
    }
  } catch {
    result.style.display = 'block';
    result.className = 'cv-result fail';
    result.textContent = 'Could not check. Open this admin on your live Firebase site to test.';
  } finally {
    btn.textContent = 'Check availability';
    btn.disabled    = false;
  }
});

document.getElementById('copyCvLinkBtn').addEventListener('click', () => {
  const input = document.getElementById('cvLinkInput');
  input.style.cssText = 'position:fixed;top:0;opacity:1;';
  input.select();
  try { document.execCommand('copy'); toast('CV link copied to clipboard.', 'success'); }
  catch { toast('Select the link manually to copy.', 'warning'); }
  input.style.cssText = 'position:fixed;top:-9999px;opacity:0;';
});

// ============================================================
// SETTINGS
// ============================================================
document.getElementById('changePassBtn').addEventListener('click', () => {
  const current = document.getElementById('currentPass').value;
  const next    = document.getElementById('newPass').value;
  const confirm = document.getElementById('confirmPass').value;
  const msg     = document.getElementById('passMsg');
  if (current !== getPass())  { msg.className = 'settings-msg fail'; msg.textContent = 'Current password is incorrect.'; return; }
  if (next.length < 8)        { msg.className = 'settings-msg fail'; msg.textContent = 'New password must be at least 8 characters.'; return; }
  if (next !== confirm)       { msg.className = 'settings-msg fail'; msg.textContent = 'Passwords do not match.'; return; }
  localStorage.setItem(PASS_KEY, next);
  msg.className = 'settings-msg ok';
  msg.textContent = 'Password updated.';
  ['currentPass','newPass','confirmPass'].forEach(id => document.getElementById(id).value = '');
  logActivity('edit', 'Admin password changed');
  toast('Password updated.', 'success');
  setTimeout(() => { msg.textContent = ''; }, 5000);
});

document.getElementById('resetDataBtn').addEventListener('click', async () => {
  const ok = await confirmDialog(
    'Reset all data?',
    'Clears all Firestore and local data and writes the defaults back to Firebase. Your live site will update.',
    'Reset', '🔄'
  );
  if (!ok) return;
  data = deepClone(DEFAULTS);
  await saveToFirestore(false);
  renderAll();
  logActivity('edit', 'All data reset to defaults and pushed to Firestore');
  toast('Data reset to defaults and pushed live.', 'info');
});

// ============================================================
// RENDER ALL
// ============================================================
function renderAll() {
  renderProjects();
  renderWebwork();
  renderSkills();
  renderSpeaking();
  renderMilestones();
  updateBadges();
  renderActivity();
}

// ============================================================
// INIT
// ============================================================
async function initAdmin() {
  await loadFromFirestore();
  renderAll();
  checkCvOnLoad();
  logActivity('info', 'Admin session started — connected to Firestore');
}
