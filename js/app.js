const navList = document.getElementById("nav-list");
const currentTitle = document.getElementById("current-title");
const currentMeta = document.getElementById("current-meta");
const viewerDisplay = document.getElementById("viewer-display");

async function loadResearch() {
  try {
    const response = await fetch("research_manifest.json");
    if (!response.ok) {
      throw new Error("Manifest not found");
    }
    const data = await response.json();

    if (data.length === 0) {
      navList.innerHTML =
        '<div style="padding: 1rem; color: #94a3b8;">No research found.</div>';
      return;
    }

    renderNav(data);

    // Auto-select first item
    if (data.length > 0) {
      selectItem(data[0], 0);
    }
  } catch (error) {
    navList.innerHTML =
      '<div style="padding: 1rem; color: #ef4444;">Error loading index.</div>';
    console.error(error);
  }
}

function renderNav(items) {
  navList.innerHTML = "";

  items.forEach((item, index) => {
    const navItem = document.createElement("div");
    navItem.className = "nav-item";
    navItem.id = `nav-item-${index}`;

    const iconName =
      item.type === "pdf" ? "document-text-outline" : "image-outline";

    // Shorten title if too long
    const displayTitle =
      item.title.length > 28 ? item.title.substring(0, 28) + "..." : item.title;

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

  // Update Header
  currentTitle.textContent = item.title;
  currentMeta.textContent = new Date(item.date).toLocaleDateString();

  // Update Display
  viewerDisplay.innerHTML = "";

  if (item.type === "pdf") {
    const iframe = document.createElement("iframe");
    iframe.src = item.path;
    iframe.className = "viewer-iframe";
    // Add permission policy if needed, but for local files/same-origin it's fine
    viewerDisplay.appendChild(iframe);
  } else {
    const img = document.createElement("img");
    img.src = item.path;
    img.className = "image-preview";
    img.alt = item.title;
    viewerDisplay.appendChild(img);
  }
}

// Start
loadResearch();
