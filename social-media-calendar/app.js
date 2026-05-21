const brands = [
  { id: "luma", name: "Luma Skincare", logo: "LU", color: "linear-gradient(145deg, #f6b4c9, #be6b8b)" },
  { id: "north", name: "North & Co.", logo: "NC", color: "linear-gradient(145deg, #9fc4ee, #426d9d)" },
  { id: "terra", name: "Terra Home", logo: "TH", color: "linear-gradient(145deg, #afdfbf, #4c8767)" },
  { id: "atlas", name: "Atlas Studio", logo: "AS", color: "linear-gradient(145deg, #f1d765, #a67b2f)" }
];

const posts = [
  {
    id: 1,
    brandId: "luma",
    date: "2026-01-07",
    time: "09:00",
    title: "Winter glow launch",
    channel: "IG",
    status: "Ready",
    color: "#f1d3df",
    thumb: "linear-gradient(135deg, rgba(255,255,255,.2), rgba(255,255,255,.04)), url('https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=80')",
    caption: "Hydrated skin is the quiet luxury of January. Meet the new barrier cream, made for frosty mornings and late-night routines.",
    audience: "Skincare loyalists",
    owner: "Mia",
    notes: "Confirm final product claims before publishing."
  },
  {
    id: 2,
    brandId: "luma",
    date: "2026-01-14",
    time: "12:30",
    title: "Creator routine reel",
    channel: "TT",
    status: "Review",
    color: "#c8dcf7",
    thumb: "linear-gradient(135deg, #dfeaff, #9bb9e5)",
    caption: "A 22-second routine showing cleanser, serum, cream, and SPF with a soft voiceover and pinned product links.",
    audience: "New customers",
    owner: "Theo",
    notes: "Needs legal review on before/after framing."
  },
  {
    id: 3,
    brandId: "north",
    date: "2026-01-08",
    time: "08:00",
    title: "Founder note",
    channel: "LI",
    status: "Draft",
    color: "#f4df78",
    thumb: "linear-gradient(135deg, #202326, #748ba1)",
    caption: "A calm reflection on building better client onboarding rituals for the new year.",
    audience: "B2B prospects",
    owner: "Avery",
    notes: "Add two customer proof points."
  },
  {
    id: 4,
    brandId: "north",
    date: "2026-01-21",
    time: "16:00",
    title: "Case study carousel",
    channel: "IG",
    status: "Scheduled",
    color: "#d9d5cb",
    thumb: "linear-gradient(135deg, #efece5, #b9b2a7)",
    caption: "Five slides unpacking how one client reduced campaign review time by 38 percent.",
    audience: "Marketing leads",
    owner: "Sam",
    notes: "Export final carousel at 1080x1350."
  },
  {
    id: 5,
    brandId: "terra",
    date: "2026-01-10",
    time: "10:30",
    title: "Kitchen reveal",
    channel: "IG",
    status: "Ready",
    color: "#bddfc7",
    thumb: "linear-gradient(135deg, rgba(255,255,255,.1), rgba(255,255,255,.05)), url('https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=900&q=80')",
    caption: "Warm woods, practical storage, and the small design choices that make weekday cooking easier.",
    audience: "Home renovators",
    owner: "Jules",
    notes: "Tag cabinet partner after approval."
  },
  {
    id: 6,
    brandId: "terra",
    date: "2026-01-19",
    time: "14:00",
    title: "Design tips thread",
    channel: "X",
    status: "Draft",
    color: "#f1d3df",
    thumb: "linear-gradient(135deg, #d9eadf, #8fbfa2)",
    caption: "A practical thread on choosing finishes that age well instead of chasing fast trends.",
    audience: "DIY planners",
    owner: "Nora",
    notes: ""
  },
  {
    id: 7,
    brandId: "atlas",
    date: "2026-01-13",
    time: "11:00",
    title: "Brand refresh teaser",
    channel: "IG",
    status: "Scheduled",
    color: "#f4df78",
    thumb: "linear-gradient(135deg, #f5dd68, #f09f77 45%, #2f2f36)",
    caption: "A cropped first look at the new identity system with motion, type, and color details.",
    audience: "Creative directors",
    owner: "Rae",
    notes: "Hold until client posts first."
  },
  {
    id: 8,
    brandId: "atlas",
    date: "2026-01-27",
    time: "13:30",
    title: "Process breakdown",
    channel: "LI",
    status: "Review",
    color: "#c8dcf7",
    thumb: "linear-gradient(135deg, #c8dcf7, #f4df78)",
    caption: "A short written breakdown of naming, positioning, and design system handoff.",
    audience: "Startup founders",
    owner: "Kai",
    notes: "Add dashboard mockup image."
  }
];

let selectedBrand = brands[0].id;
let selectedDate = new Date("2026-01-07T12:00:00");
let currentView = "month";

const storageKey = "social-calendar-post-notes";
const dashboardNotesKey = "social-calendar-dashboard-notes";
const savedPostNotes = JSON.parse(localStorage.getItem(storageKey) || "{}");

const brandList = document.querySelector("#brandList");
const brandHeading = document.querySelector("#brandHeading");
const dateStrip = document.querySelector("#dateStrip");
const calendarGrid = document.querySelector("#calendarGrid");
const monthLabel = document.querySelector("#monthLabel");
const searchInput = document.querySelector("#searchInput");
const postDialog = document.querySelector("#postDialog");
const postDialogContent = document.querySelector("#postDialogContent");
const notesDialog = document.querySelector("#notesDialog");
const dashboardNotes = document.querySelector("#dashboardNotes");

function formatMonth(date) {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function dateKey(date) {
  return date.toISOString().slice(0, 10);
}

function parseDate(value) {
  return new Date(`${value}T12:00:00`);
}

function getVisibleDays() {
  const year = 2026;
  if (currentView === "year") {
    return Array.from({ length: 365 }, (_, index) => new Date(year, 0, index + 1, 12));
  }

  if (currentView === "quarter") {
    const quarterStart = Math.floor(selectedDate.getMonth() / 3) * 3;
    const start = new Date(year, quarterStart, 1, 12);
    const end = new Date(year, quarterStart + 3, 0, 12);
    const days = [];
    for (let day = new Date(start); day <= end; day.setDate(day.getDate() + 1)) {
      days.push(new Date(day));
    }
    return days;
  }

  const start = new Date(year, selectedDate.getMonth(), 1, 12);
  const end = new Date(year, selectedDate.getMonth() + 1, 0, 12);
  const days = [];
  for (let day = new Date(start); day <= end; day.setDate(day.getDate() + 1)) {
    days.push(new Date(day));
  }
  return days;
}

function getFilteredPosts() {
  const query = searchInput.value.trim().toLowerCase();
  return posts
    .map((post) => ({ ...post, notes: savedPostNotes[post.id] ?? post.notes }))
    .filter((post) => post.brandId === selectedBrand)
    .filter((post) => {
      if (!query) return true;
      return [post.title, post.caption, post.channel, post.status, post.owner, post.notes]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
}

function renderBrands() {
  brandList.innerHTML = brands.map((brand) => `
    <button class="brand-logo ${brand.id === selectedBrand ? "active" : ""}" style="--brand-color: ${brand.color}" type="button" data-brand-id="${brand.id}" title="${brand.name}" aria-label="${brand.name}">
      <span>${brand.logo}</span>
    </button>
  `).join("");
}

function renderCalendar() {
  const brand = brands.find((item) => item.id === selectedBrand);
  const days = getVisibleDays();
  const filteredPosts = getFilteredPosts();
  brandHeading.textContent = brand.name;
  monthLabel.textContent = currentView === "quarter"
    ? `Q${Math.floor(selectedDate.getMonth() / 3) + 1} 2026`
    : currentView === "year" ? "2026" : formatMonth(selectedDate);

  dateStrip.innerHTML = days.map((day) => {
    const active = dateKey(day) === dateKey(selectedDate);
    return `
      <button class="date-pill ${active ? "active" : ""}" type="button" data-date="${dateKey(day)}">
        <span class="weekday">${day.toLocaleDateString("en-US", { weekday: "short" })}</span>
        <span class="day">${day.getDate()}</span>
      </button>
    `;
  }).join("");

  calendarGrid.innerHTML = days.map((day) => {
    const key = dateKey(day);
    const dayPosts = filteredPosts.filter((post) => post.date === key);
    return `
      <article class="day-column ${key === dateKey(selectedDate) ? "active" : ""}">
        <div class="day-label">${day.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
        ${dayPosts.length ? dayPosts.map(renderPostCard).join("") : `<div class="empty-state">Open</div>`}
      </article>
    `;
  }).join("");

  const activePill = dateStrip.querySelector(".date-pill.active");
  activePill?.scrollIntoView({ inline: "center", block: "nearest" });
}

function renderPostCard(post) {
  return `
    <button class="post-card" type="button" data-post-id="${post.id}" style="--post-color: ${post.color}; --thumb: ${post.thumb}">
      <div class="post-topline">
        <span class="channel">${post.channel}</span>
        <span class="status">${post.status}</span>
      </div>
      <h3>${post.title}</h3>
      <p>${post.caption}</p>
      <div class="thumb" aria-hidden="true"></div>
      <div class="post-meta">
        <span>${post.time}</span>
        <span>${post.owner}</span>
      </div>
    </button>
  `;
}

function openPost(postId) {
  const post = getFilteredPosts().find((item) => item.id === postId) || posts.find((item) => item.id === postId);
  const brand = brands.find((item) => item.id === post.brandId);
  postDialogContent.innerHTML = `
    <div class="post-detail-hero" style="--thumb: ${post.thumb}"></div>
    <div class="post-detail-body">
      <p class="eyebrow">${brand.name} · ${post.channel}</p>
      <h2>${post.title}</h2>
      <p>${post.caption}</p>
      <div class="detail-grid">
        <div class="metric"><span>Date</span><strong>${parseDate(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</strong></div>
        <div class="metric"><span>Status</span><strong>${post.status}</strong></div>
        <div class="metric"><span>Owner</span><strong>${post.owner}</strong></div>
      </div>
      <div class="note-block">
        <label for="postNote"><strong>Post notes</strong></label>
        <textarea id="postNote">${post.notes || ""}</textarea>
        <button class="primary-button" type="button" data-save-note="${post.id}">Save post note</button>
      </div>
    </div>
  `;
  postDialog.showModal();
}

function savePostNote(postId) {
  const note = document.querySelector("#postNote").value;
  savedPostNotes[postId] = note;
  localStorage.setItem(storageKey, JSON.stringify(savedPostNotes));
  renderCalendar();
  postDialog.close();
}

brandList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-brand-id]");
  if (!button) return;
  selectedBrand = button.dataset.brandId;
  renderBrands();
  renderCalendar();
});

dateStrip.addEventListener("click", (event) => {
  const button = event.target.closest("[data-date]");
  if (!button) return;
  selectedDate = parseDate(button.dataset.date);
  renderCalendar();
});

calendarGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-post-id]");
  if (!button) return;
  openPost(Number(button.dataset.postId));
});

postDialog.addEventListener("click", (event) => {
  const button = event.target.closest("[data-save-note]");
  if (!button) return;
  savePostNote(button.dataset.saveNote);
});

document.querySelector("#previousMonth").addEventListener("click", () => {
  selectedDate = new Date(2026, Math.max(0, selectedDate.getMonth() - 1), 1, 12);
  renderCalendar();
});

document.querySelector("#nextMonth").addEventListener("click", () => {
  selectedDate = new Date(2026, Math.min(11, selectedDate.getMonth() + 1), 1, 12);
  renderCalendar();
});

document.querySelector("#todayButton").addEventListener("click", () => {
  selectedDate = new Date("2026-01-07T12:00:00");
  renderCalendar();
});

document.querySelector("#newPostButton").addEventListener("click", () => {
  notesDialog.showModal();
});

document.querySelector("#dashboardNotesButton").addEventListener("click", () => {
  dashboardNotes.value = localStorage.getItem(dashboardNotesKey) || "";
  notesDialog.showModal();
});

document.querySelector("#saveDashboardNotes").addEventListener("click", () => {
  localStorage.setItem(dashboardNotesKey, dashboardNotes.value);
  notesDialog.close();
});

document.querySelector("#viewTabs").addEventListener("click", (event) => {
  const button = event.target.closest("[data-view]");
  if (!button) return;
  currentView = button.dataset.view;
  document.querySelectorAll("#viewTabs button").forEach((tab) => tab.classList.toggle("active", tab === button));
  renderCalendar();
});

searchInput.addEventListener("input", renderCalendar);

renderBrands();
renderCalendar();
