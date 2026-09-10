/* ============================================================
   PORTFOLIO ADMIN DASHBOARD
   admin.js
   ============================================================ */

// ------------------------------------------------------------
// DEFAULT PASSWORD (change via Settings tab)
// ------------------------------------------------------------
const DEFAULT_PASS = 'aod@admin2026';

// ------------------------------------------------------------
// AUTH
// ------------------------------------------------------------
function getPass() {
  return localStorage.getItem('aod_admin_pass') || DEFAULT_PASS;
}

const loginScreen = document.getElementById('loginScreen');
const adminShell  = document.getElementById('adminShell');
const loginForm   = document.getElementById('loginForm');
const loginError  = document.getElementById('loginError');

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const val = document.getElementById('adminPass').value;
  if (val === getPass()) {
    loginScreen.style.display = 'none';
    adminShell.style.display  = 'grid';
    renderAll();
  } else {
    loginError.classList.add('show');
    document.getElementById('adminPass').value = '';
  }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  adminShell.style.display  = 'none';
  loginScreen.style.display = 'flex';
  document.getElementById('adminPass').value = '';
});

// ------------------------------------------------------------
// TAB NAVIGATION
// ------------------------------------------------------------
const tabTitles = {
  overview: 'Overview',
  projects: 'Engineering Projects',
  webwork:  'Digital Work',
  skills:   'Skills and Capabilities',
  cv:       'CV Management',
  settings: 'Settings'
};

function switchTab(name) {
  document.querySelectorAll('.nav-item').forEach(b => {
    b.classList.toggle('active', b.dataset.tab === name);
  });
  document.querySelectorAll('.tab-panel').forEach(p => {
    p.classList.toggle('active', p.id === 'tab-' + name);
  });
  document.getElementById('topbarTitle').textContent = tabTitles[name] || name;
}

document.querySelectorAll('.nav-item').forEach(btn => {
  btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

// Save button
document.getElementById('topbarSaveBtn').addEventListener('click', () => {
  saveAll();
  showSaveIndicator('All changes saved');
});

function showSaveIndicator(msg) {
  const el = document.getElementById('saveIndicator');
  el.textContent = msg;
  setTimeout(() => { el.textContent = ''; }, 3000);
}

// ------------------------------------------------------------
// DATA STORE (localStorage)
// ------------------------------------------------------------
const STORE_KEY = 'aod_portfolio_data';

const defaults = {
  projects: [
    { key: 'demand', number: '01', type: 'Final Year Project · Smart Grid · Thesis', title: "Smart Grid Enabled Household Level Load Shedding for Ghana's Demand Response Program Optimization", desc: 'Designed and developed a smart grid based household demand response system that intelligently prioritises electrical loads under supply constraints.', tags: 'Smart Grid,Demand Response,Load Management,Power Systems,Ghana', featured: 'yes', body: '<p>Designed and developed a smart grid based household demand response system that intelligently prioritises electrical loads under supply constraints. The system enables selective shedding of non-critical loads while maintaining essential services and provides controlled load restoration following power recovery.</p><ul><li>Focus: Household-level demand management and load prioritisation</li><li>Engineering area: Smart grids, power systems, demand response</li><li>Outcome: Framework for intelligent, automated load control at household level</li></ul>' },
    { key: 'cctv',   number: '02', type: 'Industrial Systems Concept', title: 'Plant CCTV Infrastructure Mapping and Troubleshooting System', desc: 'A structured concept for mapping a large plant CCTV network across cameras, cabinets, IP addresses, fibre routes and monitoring locations.', tags: 'CCTV,IP Networks,Fibre Optic,Asset Mapping', featured: 'no', body: '<p>A concept for mapping a large industrial CCTV environment with cameras distributed across a plant and yard. Maps each camera to its IP address, cabinet, network path, fibre route and monitoring point.</p><ul><li>Asset mapping: Cameras, field cabinets, control room equipment</li><li>Documentation: IP addresses, fibre and network routes</li><li>Workflow: Maintenance-oriented fault tracing procedure</li></ul>' },
    { key: 'solar',  number: '03', type: 'Industrial Controls Concept', title: 'Mobile Solar Camera Power Changeover', desc: 'A practical relay-based DC changeover control concept for mobile solar camera units, switching between a solar primary supply and a backup DC source.', tags: 'DC Control,Solar,Relay Logic,Simurelay', featured: 'no', body: '<p>A practical control concept for a mobile solar camera unit requiring a dependable DC supply with a fallback when the primary source is unavailable.</p><ul><li>Primary supply: Solar-based DC source</li><li>Backup: Separate DC supply via relay changeover</li><li>Control approach: Relay-based manual changeover logic</li><li>Design tool: Simurelay</li></ul>' },
    { key: 'forecast', number: '04', type: 'Engineering Research · 2026', title: 'Load Forecasting in Electrical Engineering Using Machine Learning', desc: 'A developing research project examining how machine learning techniques applied to historical load data can support better power system planning.', tags: 'Load Forecasting,Machine Learning,Python,Power Systems', featured: 'no', body: '<p>Active research exploring how machine learning applied to historical electrical load data can improve forecasting accuracy for grid planning and demand management.</p><ul><li>Technology: Python, scikit-learn, data analysis</li><li>Focus: Short and medium-term load forecasting</li><li>Application: Ghana electricity grid planning</li><li>Status: Active - 2026</li></ul>' },
    { key: 'sound',  number: '05', type: 'Technical Design · Apr 2022', title: 'Industrial Sound Absorbing System', desc: 'An engineering design and prototype project exploring a practical approach to reducing unwanted industrial sound using AutoCAD and prototype fabrication.', tags: 'AutoCAD,Prototype,Engineering Design,Acoustics', featured: 'no', body: '<p>An engineering design project developing a practical approach to reducing industrial sound, combining theoretical acoustic principles with hands-on design and fabrication.</p><ul><li>Design tool: AutoCAD</li><li>Approach: Prototype development and testing</li><li>Application: Industrial noise reduction</li></ul>' }
  ],
  webwork: [
    { index: '01', type: 'Education Platform', name: 'GERAMA Academic Resources Centre', desc: 'A student-focused academic platform for UENR engineering students bringing together lecture materials, textbooks, past questions, video tutorials and live classes.', url: 'https://gerama-portal.vercel.app/index.html', label: 'Student learning platform' },
    { index: '02', type: 'Career Tool', name: 'CV Genius Ghana', desc: 'A CV platform designed for Ghanaian students, graduates and professionals supporting CV refinement, creation, guidance and expert review workflows.', url: 'https://cv-genius-ghana.web.app/', label: 'CV and career platform' },
    { index: '03', type: 'Marketplace', name: 'SSM Campus Marketplace', desc: 'A campus marketplace giving students a digital place to discover and exchange products and services within a university community.', url: 'https://ssm-market-bdcf6.firebaseapp.com/', label: 'Campus commerce platform' },
    { index: '04', type: 'E-Commerce', name: 'YHEOLUX Signature', desc: 'An African-inspired fashion storefront for bags, clutches and accessories with product browsing, accounts, cart workflows and an admin catalogue area.', url: 'https://yheolux-store.web.app/', label: 'Online fashion store' },
    { index: '05', type: 'Career Preparation', name: 'NS Interview Prep', desc: 'A national service interview preparation platform for Ghanaian engineering graduates with mock sessions, aptitude tests and progress tracking.', url: 'https://smart-prep-omega.vercel.app/', label: 'Interview preparation platform' }
  ],
  skills: [
    { number: '01', title: 'Power and Energy', desc: 'Power generation, power systems, demand response, load management, generation reliability and thermal plant operations.' },
    { number: '02', title: 'Controls and Instrumentation', desc: 'Industrial instrumentation, sensors, process transmitters, PLC (Simatic Manager, CodeSys), SCADA, DCS, relay logic and maintenance practice.' },
    { number: '03', title: 'Digital Development', desc: 'HTML, CSS, JavaScript, Python, MATLAB, C++, Firebase, Vercel, responsive web design, UI/UX (Figma), PCB design (KiCAD), AutoCAD Electrical.' },
    { number: '04', title: 'Research and Technical Work', desc: 'Technical literature review, engineering documentation, system analysis, data compilation, project presentation and academic mentorship.' }
  ]
};

function loadData() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(defaults));
  } catch { return JSON.parse(JSON.stringify(defaults)); }
}

function saveAll() {
  localStorage.setItem(STORE_KEY, JSON.stringify(data));
  updateOverviewCounts();
}

let data = loadData();

function updateOverviewCounts() {
  document.getElementById('ov-projects').textContent = data.projects.length;
  document.getElementById('ov-webwork').textContent  = data.webwork.length;
  document.getElementById('ov-skills').textContent   = data.skills.length;
}

// ------------------------------------------------------------
// PROJECTS TAB
// ------------------------------------------------------------
let editingProjectIndex = -1;

function renderProjects() {
  const list = document.getElementById('projectList');
  if (!data.projects.length) {
    list.innerHTML = '<div class="empty-state">No projects yet. Click "Add project" to get started.</div>';
    return;
  }
  list.innerHTML = data.projects.map((p, i) => `
    <div class="item-row">
      <div class="item-num">${p.number}</div>
      <div class="item-info">
        <div class="item-title">${p.title}</div>
        <div class="item-meta">${p.type}${p.featured === 'yes' ? ' · Featured' : ''}</div>
      </div>
      <div class="item-actions">
        <button class="item-edit-btn" onclick="editProject(${i})">Edit</button>
        <button class="item-delete-btn" onclick="deleteProject(${i})">Delete</button>
      </div>
    </div>
  `).join('');
  renderProjectExport();
}

function editProject(i) {
  editingProjectIndex = i;
  const p = data.projects[i];
  document.getElementById('pKey').value      = p.key;
  document.getElementById('pNumber').value   = p.number;
  document.getElementById('pType').value     = p.type;
  document.getElementById('pTitle').value    = p.title;
  document.getElementById('pDesc').value     = p.desc;
  document.getElementById('pTags').value     = p.tags;
  document.getElementById('pBody').value     = p.body;
  document.getElementById('pFeatured').value = p.featured || 'no';
  document.getElementById('projectFormTitle').textContent = 'Edit project';
  document.getElementById('projectForm').style.display = 'block';
  document.getElementById('projectForm').scrollIntoView({ behavior: 'smooth' });
}

function deleteProject(i) {
  if (!confirm('Delete this project? This cannot be undone.')) return;
  data.projects.splice(i, 1);
  saveAll();
  renderProjects();
}

document.getElementById('addProjectBtn').addEventListener('click', () => {
  editingProjectIndex = -1;
  document.getElementById('pKey').value      = '';
  document.getElementById('pNumber').value   = String(data.projects.length + 1).padStart(2, '0');
  document.getElementById('pType').value     = '';
  document.getElementById('pTitle').value    = '';
  document.getElementById('pDesc').value     = '';
  document.getElementById('pTags').value     = '';
  document.getElementById('pBody').value     = '';
  document.getElementById('pFeatured').value = 'no';
  document.getElementById('projectFormTitle').textContent = 'Add project';
  document.getElementById('projectForm').style.display = 'block';
  document.getElementById('projectForm').scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('cancelProjectBtn').addEventListener('click', () => {
  document.getElementById('projectForm').style.display = 'none';
});

document.getElementById('saveProjectBtn').addEventListener('click', () => {
  const key = document.getElementById('pKey').value.trim().replace(/\s+/g, '');
  if (!key || !document.getElementById('pTitle').value.trim()) {
    alert('Project key and title are required.');
    return;
  }
  const entry = {
    key,
    number:   document.getElementById('pNumber').value.trim(),
    type:     document.getElementById('pType').value.trim(),
    title:    document.getElementById('pTitle').value.trim(),
    desc:     document.getElementById('pDesc').value.trim(),
    tags:     document.getElementById('pTags').value.trim(),
    body:     document.getElementById('pBody').value.trim(),
    featured: document.getElementById('pFeatured').value
  };
  if (editingProjectIndex >= 0) {
    data.projects[editingProjectIndex] = entry;
  } else {
    data.projects.push(entry);
  }
  saveAll();
  renderProjects();
  document.getElementById('projectForm').style.display = 'none';
  showSaveIndicator('Project saved');
});

function renderProjectExport() {
  const box = document.getElementById('projectExport');
  const code = document.getElementById('projectExportCode');
  if (!data.projects.length) { box.style.display = 'none'; return; }
  box.style.display = 'block';
  const obj = {};
  data.projects.forEach(p => { obj[p.key] = { type: p.type, title: p.title, body: p.body }; });
  code.value = 'const projectData = ' + JSON.stringify(obj, null, 2) + ';';
}

// ------------------------------------------------------------
// DIGITAL WORK TAB
// ------------------------------------------------------------
let editingWebIndex = -1;

function renderWebwork() {
  const list = document.getElementById('webList');
  if (!data.webwork.length) {
    list.innerHTML = '<div class="empty-state">No digital products yet. Click "Add product" to get started.</div>';
    return;
  }
  list.innerHTML = data.webwork.map((w, i) => `
    <div class="item-row">
      <div class="item-num">${w.index}</div>
      <div class="item-info">
        <div class="item-title">${w.name}</div>
        <div class="item-meta">${w.type} · <a href="${w.url}" target="_blank" style="color:var(--accent2)">${w.url}</a></div>
      </div>
      <div class="item-actions">
        <button class="item-edit-btn" onclick="editWeb(${i})">Edit</button>
        <button class="item-delete-btn" onclick="deleteWeb(${i})">Delete</button>
      </div>
    </div>
  `).join('');
  renderWebExport();
}

function editWeb(i) {
  editingWebIndex = i;
  const w = data.webwork[i];
  document.getElementById('wIndex').value = w.index;
  document.getElementById('wType').value  = w.type;
  document.getElementById('wName').value  = w.name;
  document.getElementById('wDesc').value  = w.desc;
  document.getElementById('wUrl').value   = w.url;
  document.getElementById('wLabel').value = w.label;
  document.getElementById('webFormTitle').textContent = 'Edit digital product';
  document.getElementById('webForm').style.display = 'block';
  document.getElementById('webForm').scrollIntoView({ behavior: 'smooth' });
}

function deleteWeb(i) {
  if (!confirm('Delete this product? This cannot be undone.')) return;
  data.webwork.splice(i, 1);
  saveAll();
  renderWebwork();
}

document.getElementById('addWebBtn').addEventListener('click', () => {
  editingWebIndex = -1;
  document.getElementById('wIndex').value = String(data.webwork.length + 1).padStart(2, '0');
  document.getElementById('wType').value  = '';
  document.getElementById('wName').value  = '';
  document.getElementById('wDesc').value  = '';
  document.getElementById('wUrl').value   = '';
  document.getElementById('wLabel').value = '';
  document.getElementById('webFormTitle').textContent = 'Add digital product';
  document.getElementById('webForm').style.display = 'block';
  document.getElementById('webForm').scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('cancelWebBtn').addEventListener('click', () => {
  document.getElementById('webForm').style.display = 'none';
});

document.getElementById('saveWebBtn').addEventListener('click', () => {
  if (!document.getElementById('wName').value.trim()) {
    alert('Product name is required.');
    return;
  }
  const entry = {
    index: document.getElementById('wIndex').value.trim(),
    type:  document.getElementById('wType').value.trim(),
    name:  document.getElementById('wName').value.trim(),
    desc:  document.getElementById('wDesc').value.trim(),
    url:   document.getElementById('wUrl').value.trim(),
    label: document.getElementById('wLabel').value.trim()
  };
  if (editingWebIndex >= 0) {
    data.webwork[editingWebIndex] = entry;
  } else {
    data.webwork.push(entry);
  }
  saveAll();
  renderWebwork();
  document.getElementById('webForm').style.display = 'none';
  showSaveIndicator('Product saved');
});

function renderWebExport() {
  const box = document.getElementById('webExport');
  const code = document.getElementById('webExportCode');
  if (!data.webwork.length) { box.style.display = 'none'; return; }
  box.style.display = 'block';
  const html = data.webwork.map(w => `
<article class="web-card">
  <div class="web-index">${w.index}</div>
  <p class="project-type">${w.type}</p>
  <h3>${w.name}</h3>
  <p>${w.desc}</p>
  <div class="web-footer">
    <span>${w.label}</span>
    <a href="${w.url}" target="_blank" rel="noopener">Visit live site &nearr;</a>
  </div>
</article>`).join('\n');
  code.value = html.trim();
}

// ------------------------------------------------------------
// SKILLS TAB
// ------------------------------------------------------------
let editingSkillIndex = -1;

function renderSkills() {
  const list = document.getElementById('skillList');
  if (!data.skills.length) {
    list.innerHTML = '<div class="empty-state">No skill categories yet. Click "Add skill category" to get started.</div>';
    return;
  }
  list.innerHTML = data.skills.map((s, i) => `
    <div class="item-row">
      <div class="item-num">${s.number}</div>
      <div class="item-info">
        <div class="item-title">${s.title}</div>
        <div class="item-meta">${s.desc.substring(0, 80)}...</div>
      </div>
      <div class="item-actions">
        <button class="item-edit-btn" onclick="editSkill(${i})">Edit</button>
        <button class="item-delete-btn" onclick="deleteSkill(${i})">Delete</button>
      </div>
    </div>
  `).join('');
  renderSkillExport();
}

function editSkill(i) {
  editingSkillIndex = i;
  const s = data.skills[i];
  document.getElementById('sNumber').value = s.number;
  document.getElementById('sTitle').value  = s.title;
  document.getElementById('sDesc').value   = s.desc;
  document.getElementById('skillFormTitle').textContent = 'Edit skill category';
  document.getElementById('skillForm').style.display = 'block';
  document.getElementById('skillForm').scrollIntoView({ behavior: 'smooth' });
}

function deleteSkill(i) {
  if (!confirm('Delete this skill category?')) return;
  data.skills.splice(i, 1);
  saveAll();
  renderSkills();
}

document.getElementById('addSkillBtn').addEventListener('click', () => {
  editingSkillIndex = -1;
  document.getElementById('sNumber').value = String(data.skills.length + 1).padStart(2, '0');
  document.getElementById('sTitle').value  = '';
  document.getElementById('sDesc').value   = '';
  document.getElementById('skillFormTitle').textContent = 'Add skill category';
  document.getElementById('skillForm').style.display = 'block';
  document.getElementById('skillForm').scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('cancelSkillBtn').addEventListener('click', () => {
  document.getElementById('skillForm').style.display = 'none';
});

document.getElementById('saveSkillBtn').addEventListener('click', () => {
  if (!document.getElementById('sTitle').value.trim()) {
    alert('Skill title is required.');
    return;
  }
  const entry = {
    number: document.getElementById('sNumber').value.trim(),
    title:  document.getElementById('sTitle').value.trim(),
    desc:   document.getElementById('sDesc').value.trim()
  };
  if (editingSkillIndex >= 0) {
    data.skills[editingSkillIndex] = entry;
  } else {
    data.skills.push(entry);
  }
  saveAll();
  renderSkills();
  document.getElementById('skillForm').style.display = 'none';
  showSaveIndicator('Skill saved');
});

function renderSkillExport() {
  const box  = document.getElementById('skillExport');
  const code = document.getElementById('skillExportCode');
  if (!data.skills.length) { box.style.display = 'none'; return; }
  box.style.display = 'block';
  const html = data.skills.map(s => `
<div>
  <span>${s.number}</span>
  <h3>${s.title}</h3>
  <p>${s.desc}</p>
</div>`).join('\n');
  code.value = html.trim();
}

// ------------------------------------------------------------
// CV CHECK
// ------------------------------------------------------------
document.getElementById('checkCvBtn').addEventListener('click', async () => {
  const result = document.getElementById('cvCheckResult');
  result.style.display = 'none';
  try {
    const res = await fetch('cv/Alexander-Opoku-Dwumaah-CV.pdf', { method: 'HEAD' });
    result.style.display = 'block';
    if (res.ok) {
      result.className = 'cv-check-result ok';
      result.textContent = 'CV is available and ready for download.';
      document.getElementById('cvStatusTitle').textContent = 'CV is live';
      document.getElementById('cvStatusText').textContent  = 'Alexander-Opoku-Dwumaah-CV.pdf is accessible on the site.';
    } else {
      result.className = 'cv-check-result fail';
      result.textContent = 'CV file not found (HTTP ' + res.status + '). Make sure the file is in the cv/ folder and the site is deployed.';
    }
  } catch {
    result.style.display = 'block';
    result.className = 'cv-check-result fail';
    result.textContent = 'Could not check CV. Make sure you are viewing this on the live site or a local server.';
  }
});

// ------------------------------------------------------------
// SETTINGS
// ------------------------------------------------------------
document.getElementById('changePassBtn').addEventListener('click', () => {
  const current  = document.getElementById('currentPass').value;
  const next     = document.getElementById('newPass').value;
  const confirm  = document.getElementById('confirmPass').value;
  const msg      = document.getElementById('passMsg');

  if (current !== getPass()) {
    msg.className = 'settings-msg fail';
    msg.textContent = 'Current password is incorrect.';
    return;
  }
  if (next.length < 8) {
    msg.className = 'settings-msg fail';
    msg.textContent = 'New password must be at least 8 characters.';
    return;
  }
  if (next !== confirm) {
    msg.className = 'settings-msg fail';
    msg.textContent = 'New passwords do not match.';
    return;
  }

  localStorage.setItem('aod_admin_pass', next);
  msg.className = 'settings-msg ok';
  msg.textContent = 'Password updated successfully.';
  document.getElementById('currentPass').value = '';
  document.getElementById('newPass').value      = '';
  document.getElementById('confirmPass').value  = '';
  setTimeout(() => { msg.textContent = ''; }, 4000);
});

document.getElementById('resetDataBtn').addEventListener('click', () => {
  if (!confirm('This will reset all admin data to the portfolio defaults. Continue?')) return;
  localStorage.removeItem(STORE_KEY);
  data = JSON.parse(JSON.stringify(defaults));
  renderAll();
  showSaveIndicator('Data reset to defaults');
});

// ------------------------------------------------------------
// COPY TO CLIPBOARD
// ------------------------------------------------------------
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = document.getElementById(btn.dataset.target);
    target.select();
    document.execCommand('copy');
    btn.textContent = 'Copied!';
    setTimeout(() => { btn.textContent = 'Copy to clipboard'; }, 2500);
  });
});

// ------------------------------------------------------------
// INIT
// ------------------------------------------------------------
function renderAll() {
  renderProjects();
  renderWebwork();
  renderSkills();
  updateOverviewCounts();
}
