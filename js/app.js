const navList = document.getElementById("nav-list");
const currentTitle = document.getElementById("current-title");
const currentMeta = document.getElementById("current-meta");
const viewerDisplay = document.getElementById("viewer-display");
const searchInput = document.getElementById("search-input");
const backBtn = document.getElementById("back-btn");

let allResearch = [];

async function loadResearch() {
  try {
    const response = await fetch("research_manifest.json");
    if (!response.ok) {
      throw new Error("Manifest not found");
    }
    allResearch = await response.json();

    if (allResearch.length === 0) {
      navList.innerHTML =
        '<div style="padding: 1rem; color: #94a3b8;">No research found.</div>';
      return;
    }

    renderNav(allResearch);

    // On Desktop: Auto-select first item
    // On Mobile: Do NOT auto-select, so user sees the list first
    if (window.innerWidth > 768 && allResearch.length > 0) {
      selectItem(allResearch[0], 0);
    }
  } catch (error) {
    navList.innerHTML =
      '<div style="padding: 1rem; color: #ef4444;">Error loading index.</div>';
    console.error(error);
  }
}

function renderNav(items) {
  navList.innerHTML = "";

  if (items.length === 0) {
    navList.innerHTML =
      '<div style="padding: 1rem; color: #94a3b8; font-size: 0.9rem;">No results found.</div>';
    return;
  }

  items.forEach((item, index) => {
    const navItem = document.createElement("div");
    navItem.className = "nav-item";
    navItem.id = `nav-item-${index}`;

    const iconName =
      item.type === "pdf" ? "document-text-outline" : "image-outline";

    // Shorten title if too long
    const displayTitle =
      item.title.length > 32 ? item.title.substring(0, 32) + "..." : item.title;

    navItem.innerHTML = `
      <ion-icon name="${iconName}"></ion-icon>
      <span>${displayTitle}</span>
    `;

    navItem.addEventListener("click", () => selectItem(item, index));
    navList.appendChild(navItem);
  });
}

function selectItem(item, index) {
  // Update Active State
  document
    .querySelectorAll(".nav-item")
    .forEach((el) => el.classList.remove("active"));
  const activeEl = document.getElementById(`nav-item-${index}`);
  if (activeEl) activeEl.classList.add("active");

  // Show Viewer (Mobile Logic)
  document.body.classList.add("mobile-view");

  // Explicitly show button on mobile (css handles media query, but ensure block)
  if (window.innerWidth <= 768) {
    backBtn.style.display = "flex";
  } else {
    backBtn.style.display = "none";
  }

  // Update Header
  currentTitle.textContent = item.title;
  currentMeta.textContent = new Date(item.date).toLocaleDateString();

  // Update Display
  viewerDisplay.innerHTML = "";

  if (item.type === "pdf") {
    const iframe = document.createElement("iframe");
    iframe.src = item.path;
    iframe.className = "viewer-iframe";
    viewerDisplay.appendChild(iframe);
  } else {
    const img = document.createElement("img");
    img.src = item.path;
    img.className = "image-preview";
    img.alt = item.title;
    viewerDisplay.appendChild(img);
  }
}

function goBack() {
  document.body.classList.remove("mobile-view");
  // Clear viewer on mobile to save memory/stop video? optional
}

// Search Functionality
searchInput.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  const filtered = allResearch.filter(
    (item) =>
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query),
  );
  renderNav(filtered);
});

// Back Button
backBtn.addEventListener("click", goBack);

// Handle Resize
window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    document.body.classList.remove("mobile-view");
    backBtn.style.display = "none";
  }
});

// Start
loadResearch();
