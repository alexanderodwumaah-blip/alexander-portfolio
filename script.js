/* ============================================================
   ALEXANDER OPOKU DWUMAAH — PORTFOLIO
   script.js: Modal, Navigation, Interactions
   ============================================================ */

// ------------------------------------------------------------
// PROJECT MODAL DATA
// ------------------------------------------------------------
const projectData = {
  demand: {
    type: "Final Year Project · Smart Grid · Thesis",
    title: "Smart Grid Enabled Household Level Load Shedding for Ghana's Demand Response Program Optimization",
    body: `
      <p>Designed and developed a smart grid based household demand response system that intelligently prioritises electrical loads under supply constraints. The system enables selective shedding of non-critical loads while maintaining essential services, and provides controlled load restoration following power recovery.</p>
      <p>The project explores how intelligent, automated demand response can improve the efficiency, reliability and resilience of Ghana's electricity supply while reducing the limitations of conventional load shedding.</p>
      <p>The work was developed as a Final Year Project at the University of Energy and Natural Resources and directly informed my continuing research interest in demand response, smart grids and power system planning.</p>
      <ul>
        <li><strong>Focus:</strong> Household-level demand management and load prioritisation</li>
        <li><strong>Engineering area:</strong> Smart grids, power systems, demand response</li>
        <li><strong>Key theme:</strong> Selective shedding of non-critical loads under constrained supply</li>
        <li><strong>Outcome:</strong> Framework for intelligent, automated load control at household level</li>
      </ul>
    `
  },
  cctv: {
    type: "Industrial Systems Concept",
    title: "Plant CCTV Infrastructure Mapping & Troubleshooting System",
    body: `
      <p>Developed around the challenge of maintaining a large industrial CCTV environment with cameras distributed across a plant and yard. The concept draws directly from experience gained at Sunon Asogli Power.</p>
      <p>The proposed system maps each camera to its IP address, cabinet, network path, power path, fibre route and monitoring point — making fault tracing faster by giving maintenance teams a clear view of how a camera connects from the field to the control room.</p>
      <p>The concept combines asset mapping, network documentation and maintenance information into one structured reference system.</p>
      <ul>
        <li><strong>Asset mapping:</strong> Cameras, field cabinets, control room equipment</li>
        <li><strong>Documentation:</strong> IP addresses, fibre and network routes, monitoring points</li>
        <li><strong>Workflow:</strong> Maintenance-oriented fault tracing procedure</li>
        <li><strong>Motivation:</strong> Real-world industrial CCTV maintenance experience</li>
      </ul>
    `
  },
  solar: {
    type: "Industrial Controls Concept",
    title: "Mobile Solar Camera Power Changeover",
    body: `
      <p>A practical control concept for a mobile solar camera unit requiring a dependable DC supply with an automatic fallback when the primary source is unavailable.</p>
      <p>The control arrangement uses relay-based logic for a manual changeover between the solar supply path and a backup DC supply. The circuit was designed and modelled using Simurelay as part of practical controls learning.</p>
      <p>This project connects a real field need with fundamental control design principles — relay logic, DC power management, changeover circuits and system documentation.</p>
      <ul>
        <li><strong>Primary supply:</strong> Solar-based DC source</li>
        <li><strong>Backup:</strong> Separate DC supply via relay changeover</li>
        <li><strong>Control approach:</strong> Relay-based manual changeover logic</li>
        <li><strong>Design tool:</strong> Simurelay</li>
      </ul>
    `
  },
  forecast: {
    type: "Engineering Research · 2026",
    title: "Load Forecasting in Electrical Engineering Using Machine Learning Technique",
    body: `
      <p>This active research project explores how machine learning techniques applied to historical electrical load data can improve forecasting accuracy for power system planning and demand management.</p>
      <p>The research investigates multiple ML approaches — including regression models and neural network architectures — to understand which methods best capture demand patterns in the Ghanaian power system context.</p>
      <p>The work aims to bridge the gap between machine learning research and practical grid planning, producing tools that could support load forecasting decisions at utility and system operator level.</p>
      <ul>
        <li><strong>Technology:</strong> Python, scikit-learn, data analysis and visualisation</li>
        <li><strong>Focus:</strong> Short and medium-term load forecasting</li>
        <li><strong>Application:</strong> Ghana's electricity grid planning and demand management</li>
        <li><strong>Status:</strong> Active research — 2026</li>
      </ul>
    `
  },
  sound: {
    type: "Technical Design · Apr 2022",
    title: "Industrial Sound Absorbing System",
    body: `
      <p>An engineering design project that developed a practical approach to reducing unwanted industrial sound through a purpose-built absorbing system, combining theoretical acoustic principles with hands-on engineering design.</p>
      <p>The project involved AutoCAD design work and prototype development — demonstrating the ability to move from concept to physical prototype, apply engineering design methodology and document a technical solution.</p>
      <ul>
        <li><strong>Design tool:</strong> AutoCAD for system layout and component design</li>
        <li><strong>Approach:</strong> Prototype development, fabrication and testing</li>
        <li><strong>Application:</strong> Industrial noise reduction in plant environments</li>
        <li><strong>Skills demonstrated:</strong> Engineering design, CAD, prototyping, technical documentation</li>
      </ul>
    `
  }
};

// ------------------------------------------------------------
// MODAL LOGIC
// ------------------------------------------------------------
const modal = document.getElementById("projectModal");
const modalType = document.getElementById("modalType");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");

document.querySelectorAll("[data-project]").forEach((button) => {
  button.addEventListener("click", () => {
    const item = projectData[button.dataset.project];
    if (!item) return;

    modalType.textContent = item.type;
    modalTitle.textContent = item.title;
    modalBody.innerHTML = item.body;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    // Focus the close button for accessibility
    setTimeout(() => {
      modal.querySelector(".modal-close")?.focus();
    }, 50);
  });
});

function closeModal() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

document.querySelectorAll("[data-close-modal]").forEach((el) => {
  el.addEventListener("click", closeModal);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("is-open")) {
    closeModal();
  }
});

// ------------------------------------------------------------
// MOBILE NAVIGATION
// ------------------------------------------------------------
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

menuToggle.addEventListener("click", () => {
  const open = mainNav.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(open));
});

mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// ------------------------------------------------------------
// ACTIVE NAV HIGHLIGHT ON SCROLL
// ------------------------------------------------------------
const sections = document.querySelectorAll("section[id], div[id]");
const navLinks = document.querySelectorAll(".main-nav a");

const observerOptions = {
  root: null,
  rootMargin: "-40% 0px -50% 0px",
  threshold: 0
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      navLinks.forEach((link) => {
        link.style.color = "";
        link.style.background = "";
        if (link.getAttribute("href") === `#${entry.target.id}`) {
          link.style.color = "var(--text-primary)";
          link.style.background = "var(--border-light)";
        }
      });
    }
  });
}, observerOptions);

sections.forEach((section) => observer.observe(section));

// ------------------------------------------------------------
// SCROLL REVEAL ANIMATION
// ------------------------------------------------------------
const revealElements = document.querySelectorAll(
  ".project-card, .web-card, .timeline-item, .journey-grid article, .leadership-grid article, .talk-list article, .research-card, .skills-grid > div, .milestone-grid > div"
);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

revealElements.forEach((el) => {
  el.style.opacity = "0";
  el.style.transform = "translateY(24px)";
  el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
  revealObserver.observe(el);
});

// ------------------------------------------------------------
// CURRENT YEAR
// ------------------------------------------------------------
document.getElementById("year").textContent = new Date().getFullYear();
