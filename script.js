const projectData = {
  demand: {
    type: "Final Year Project · Smart Grid",
    title: "Smart Grid Enabled Household Level Load Shedding for Ghana’s Demand Response Program Optimization",
    body: `
      <p>This project explored a more targeted approach to household load shedding using smart grid and demand response principles.</p>
      <p>The core idea is to distinguish between priority and non priority household loads so that demand can be managed with less disruption. The project considered smart metering, household demand information, load classification and control logic as parts of a wider demand response framework.</p>
      <p>The work was developed as a group final year project at the University of Energy and Natural Resources and formed an important part of my interest in smart grids, demand response and power system planning.</p>
      <ul>
        <li>Focus: household level demand management</li>
        <li>Engineering area: smart grids and power systems</li>
        <li>Key theme: practical load prioritisation during constrained supply</li>
      </ul>
    `
  },
  cctv: {
    type: "Industrial Systems Concept",
    title: "Plant CCTV Infrastructure Mapping & Troubleshooting System",
    body: `
      <p>This concept was developed around the challenge of maintaining a large industrial CCTV environment with cameras distributed across a plant and yard.</p>
      <p>The proposed system maps each camera to its IP address, cabinet, network path, power path, fibre route and monitoring point. The goal is to make fault tracing faster by giving maintenance teams a clear view of how a camera connects from the field to the monitoring infrastructure.</p>
      <p>The concept combines asset mapping, network documentation and maintenance information into one structured reference system.</p>
      <ul>
        <li>Asset mapping for cameras and field cabinets</li>
        <li>IP address and monitoring point records</li>
        <li>Fibre and network route documentation</li>
        <li>Maintenance oriented troubleshooting workflow</li>
      </ul>
    `
  },
  forecast: {
    type: "Engineering Research · 2026",
    title: "Load Forecasting in Electrical Engineering Using Machine Learning Technique",
    body: `
      <p>This developing research project explores machine learning methods for electrical load forecasting to support better power system planning and operational decisions.</p>
      <p>The research investigates how data-driven forecasting approaches can improve demand prediction accuracy, supporting Ghana's power system reliability and efficiency. The work combines electrical engineering principles with machine learning techniques to address real-world power system challenges.</p>
      <ul>
        <li>Focus: Machine learning applications in power systems</li>
        <li>Technology: Python, data analysis, predictive modeling</li>
        <li>Goal: Enhanced load forecasting for system planning</li>
        <li>Application: Ghana's electricity supply optimization</li>
      </ul>
    `
  },
  sound: {
    type: "Technical Design",
    title: "Industrial Sound Absorbing System",
    body: `
      <p>An engineering design project that developed a practical approach to reducing unwanted industrial sound through an engineered absorbing system.</p>
      <p>The project involved AutoCAD design work and prototype development, combining theoretical acoustics principles with practical engineering implementation. This work demonstrated design methodology, CAD skills, and prototype fabrication capabilities.</p>
      <ul>
        <li>Design tool: AutoCAD for system layout</li>
        <li>Approach: Prototype development and testing</li>
        <li>Application: Industrial noise reduction</li>
        <li>Skills: Engineering design, CAD, prototyping</li>
      </ul>
    `
  },
  solar: {
    type: "Industrial Controls Concept",
    title: "Mobile Solar Camera Power Changeover",
    body: `
      <p>This design concept looks at a mobile solar camera unit that needs a dependable DC supply with a backup source available when the primary supply is unavailable.</p>
      <p>The control arrangement uses a relay based manual changeover between the solar supply path and a backup DC supply. The circuit was considered and modelled using relay logic tools as part of practical controls learning.</p>
      <p>The project connects a real field need with basic control design, relay logic, DC power management and system documentation.</p>
      <ul>
        <li>Primary supply: solar based DC source</li>
        <li>Backup: separate DC supply</li>
        <li>Control: relay based changeover</li>
        <li>Design tool: Simurelay</li>
      </ul>
    `
  }
};

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
  });
});

function closeModal() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

document.querySelectorAll("[data-close-modal]").forEach((element) => {
  element.addEventListener("click", closeModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("is-open")) {
    closeModal();
  }
});

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

document.getElementById("year").textContent = new Date().getFullYear();
