const brands = [
  { id: "area", name: "AREA", logo: "./assets/area-logo.svg", accent: "#003a5d" },
  { id: "learn", name: "AREA Learn", logo: "./assets/area-learn-logo.svg", accent: "#05ce7c" },
  { id: "wireless", name: "AREA Wireless", logo: "./assets/area-wireless-logo.svg", accent: "#03846d" },
  { id: "drive", name: "AREA DRIVE", logo: "./assets/area-drive-logo.svg", accent: "#1a7599" }
];

const today = new Date("2026-05-21T12:00:00");
const postStorageKey = "area-social-calendar-posts";
const notesStorageKey = "area-social-calendar-dashboard-notes";

const seedPosts = [
  {
    id: 101,
    brandId: "area",
    date: "2026-05-18",
    time: "09:00",
    title: "Weekly member update",
    channels: ["IG", "FB", "LinkedIn"],
    status: "Approved",
    format: "square",
    owner: "Communications",
    caption: "A clean Monday update for Alberta REALTORS with reminders, deadlines, and links to member resources.",
    notes: "Use the blue AREA frame and keep the CTA short.",
    mediaType: "image",
    mediaUrl: "",
    color: "#d8ecf5"
  },
  {
    id: 102,
    brandId: "learn",
    date: "2026-05-19",
    time: "10:30",
    title: "Course registration reminder",
    channels: ["IG", "FB"],
    status: "Scheduled",
    format: "story",
    owner: "Education",
    caption: "Last call to register for the next AREA Learn session. Highlight CE value and the registration deadline.",
    notes: "Story version needs sticker space at bottom.",
    mediaType: "image",
    mediaUrl: "",
    color: "#dbf9ec"
  },
  {
    id: 103,
    brandId: "wireless",
    date: "2026-05-20",
    time: "13:00",
    title: "Wireless savings carousel",
    channels: ["IG", "LinkedIn"],
    status: "In review",
    format: "square",
    owner: "Partnerships",
    caption: "Show the Rogers offer in three clear slides: plan value, member benefit, and how to activate.",
    notes: "Confirm partner logo spacing before approval.",
    mediaType: "image",
    mediaUrl: "",
    color: "#d8f2ed"
  },
  {
    id: 104,
    brandId: "area",
    date: "2026-05-21",
    time: "08:30",
    title: "Market insights clip",
    channels: ["X", "LinkedIn"],
    status: "Draft",
    format: "landscape",
    owner: "Policy",
    caption: "Short post linking to the latest market insight with one stat, one takeaway, and one link.",
    notes: "Needs final stat from the report.",
    mediaType: "video",
    mediaUrl: "",
    color: "#cfe4ef"
  },
  {
    id: 105,
    brandId: "drive",
    date: "2026-05-21",
    time: "15:00",
    title: "AREA DRIVE testimonial",
    channels: ["IG", "FB"],
    status: "Approved",
    format: "story",
    owner: "Partnerships",
    caption: "Member testimonial about fuel savings and why the program is easy to use on the road.",
    notes: "Use captions on the video for silent viewing.",
    mediaType: "video",
    mediaUrl: "",
    color: "#d6edf7"
  },
  {
    id: 106,
    brandId: "learn",
    date: "2026-05-22",
    time: "11:30",
    title: "Instructor spotlight",
    channels: ["IG", "FB", "LinkedIn"],
    status: "Draft",
    format: "square",
    owner: "Education",
    caption: "Introduce the instructor, their expertise, and why members should join the upcoming class.",
    notes: "Waiting on headshot.",
    mediaType: "image",
    mediaUrl: "",
    color: "#e0f8ee"
  }
];

let posts = loadPosts();
let selectedBrand = "all";
let selectedWeekStart = getMonday(today);

const brandList = document.querySelector("#brandList");
const calendarGrid = document.querySelector("#calendarGrid");
const weekSelect = document.querySelector("#weekSelect");
const searchInput = document.querySelector("#searchInput");
const searchSuggestions = document.querySelector("#searchSuggestions");
const postDialog = document.querySelector("#postDialog");
const postDialogContent = document.querySelector("#postDialogContent");
const addPostDialog = document.querySelector("#addPostDialog");
const addPostForm = document.querySelector("#addPostForm");
const dashboardNotesButton = document.querySelector("#dashboardNotesButton");
const notesDialog = document.querySelector("#notesDialog");
const dashboardNotes = document.querySelector("#dashboardNotes");
const visibleBrandLabel = document.querySelector("#visibleBrandLabel");
const postCountLabel = document.querySelector("#postCountLabel");

function loadPosts() {
  const saved = JSON.parse(localStorage.getItem(postStorageKey) || "null");
  return saved?.length ? saved : seedPosts;
}

function savePosts() {
  localStorage.setItem(postStorageKey, JSON.stringify(posts));
}

function dateKey(date) {
  return date.toISOString().slice(0, 10);
}

function parseDate(value) {
  return new Date(`${value}T12:00:00`);
}

function getMonday(date) {
  const next = new Date(date);
  const day = next.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  next.setDate(next.getDate() + diff);
  next.setHours(12, 0, 0, 0);
  return next;
}

function addDays(date, amount) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

function formatWeekLabel(monday) {
  const friday = addDays(monday, 4);
  return `${monday.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${friday.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
}

function getWeekdays() {
  return Array.from({ length: 5 }, (_, index) => addDays(selectedWeekStart, index));
}

function getVisiblePosts() {
  const query = searchInput.value.trim().toLowerCase();
  const weekKeys = new Set(getWeekdays().map(dateKey));
  return posts
    .filter((post) => weekKeys.has(post.date))
    .filter((post) => selectedBrand === "all" || post.brandId === selectedBrand)
    .filter((post) => {
      if (!query) return true;
      return [
        post.title,
        post.caption,
        post.owner,
        post.status,
        post.notes,
        post.channels.join(" "),
        getBrand(post.brandId).name
      ].join(" ").toLowerCase().includes(query);
    })
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
}

function getBrand(brandId) {
  return brands.find((brand) => brand.id === brandId) || brands[0];
}

function renderBrands() {
  const items = [
    `<button class="brand-logo ${selectedBrand === "all" ? "active" : ""}" type="button" data-brand-id="all" title="All AREA brands"><span>All</span></button>`,
    ...brands.map((brand) => `
      <button class="brand-logo ${brand.id === selectedBrand ? "active" : ""}" style="--brand-accent: ${brand.accent}" type="button" data-brand-id="${brand.id}" title="${brand.name}">
        <img src="${brand.logo}" alt="${brand.name}">
      </button>
    `)
  ];
  brandList.innerHTML = items.join("");
}

function renderWeekOptions() {
  const yearStart = getMonday(new Date("2026-01-01T12:00:00"));
  const options = [];
  for (let index = 0; index < 54; index += 1) {
    const monday = addDays(yearStart, index * 7);
    if (monday.getFullYear() > 2026 && addDays(monday, 4).getFullYear() > 2026) continue;
    options.push(`<option value="${dateKey(monday)}">${formatWeekLabel(monday)}</option>`);
  }
  weekSelect.innerHTML = options.join("");
  weekSelect.value = dateKey(selectedWeekStart);
}

function renderCalendar() {
  const weekdays = getWeekdays();
  const visiblePosts = getVisiblePosts();
  const times = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

  visibleBrandLabel.textContent = selectedBrand === "all" ? "All AREA brands" : getBrand(selectedBrand).name;
  postCountLabel.textContent = `${visiblePosts.length} ${visiblePosts.length === 1 ? "post" : "posts"}`;

  const header = `
    <div class="time-corner">Time</div>
    ${weekdays.map((day) => `
      <button class="day-head ${dateKey(day) === dateKey(today) ? "today" : ""}" type="button" data-jump-date="${dateKey(day)}">
        <span>${day.toLocaleDateString("en-US", { weekday: "long" })}</span>
        <strong>${day.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</strong>
      </button>
    `).join("")}
  `;

  const rows = times.map((time) => `
    <div class="time-label">${time}</div>
    ${weekdays.map((day) => renderCell(day, time, visiblePosts)).join("")}
  `).join("");

  calendarGrid.innerHTML = header + rows;
}

function renderCell(day, time, visiblePosts) {
  const key = dateKey(day);
  const hour = Number(time.slice(0, 2));
  const cellPosts = visiblePosts.filter((post) => {
    const postHour = Number(post.time.slice(0, 2));
    return post.date === key && postHour === hour;
  });

  return `
    <div class="calendar-cell ${key === dateKey(today) ? "today-column" : ""}">
      ${cellPosts.map(renderPostCard).join("")}
    </div>
  `;
}

function renderPostCard(post) {
  const brand = getBrand(post.brandId);
  return `
    <button class="post-card" type="button" data-post-id="${post.id}" style="--post-color: ${post.color}; --brand-accent: ${brand.accent}">
      <span class="brand-dot"></span>
      <span class="post-time">${post.time}</span>
      <strong>${post.title}</strong>
      <span>${brand.name}</span>
      <span class="channel-row">${post.channels.map((channel) => `<em>${channel}</em>`).join("")}</span>
      <small>${post.status} · ${post.owner}</small>
    </button>
  `;
}

function renderSuggestions() {
  const query = searchInput.value.trim().toLowerCase();
  if (!query) {
    searchSuggestions.hidden = true;
    searchSuggestions.innerHTML = "";
    renderCalendar();
    return;
  }

  const matches = posts
    .filter((post) => [
      post.title,
      post.caption,
      post.owner,
      post.status,
      post.channels.join(" "),
      getBrand(post.brandId).name
    ].join(" ").toLowerCase().includes(query))
    .slice(0, 5);

  searchSuggestions.hidden = matches.length === 0;
  searchSuggestions.innerHTML = matches.map((post) => `
    <button type="button" data-suggestion-id="${post.id}">
      <strong>${post.title}</strong>
      <span>${getBrand(post.brandId).name} · ${post.date} · ${post.channels.join(", ")}</span>
    </button>
  `).join("");
  renderCalendar();
}

function mediaMarkup(post) {
  if (post.mediaUrl && post.mediaType === "video") {
    return `<video src="${post.mediaUrl}" controls></video>`;
  }
  if (post.mediaUrl) {
    return `<img src="${post.mediaUrl}" alt="${post.title}">`;
  }
  return `<div class="media-placeholder"><span>${getBrand(post.brandId).name}</span><strong>${post.title}</strong></div>`;
}

function openPost(postId) {
  const post = posts.find((item) => item.id === postId);
  if (!post) return;
  const brand = getBrand(post.brandId);
  postDialogContent.innerHTML = `
    <div class="detail-layout">
      <div class="social-preview ${post.format}" style="--brand-accent: ${brand.accent}">
        ${mediaMarkup(post)}
      </div>
      <div class="detail-copy">
        <p class="eyebrow">${brand.name} · ${post.channels.join(", ")}</p>
        <h2>${post.title}</h2>
        <p>${post.caption}</p>
        <div class="detail-grid">
          <div><span>Date</span><strong>${parseDate(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</strong></div>
          <div><span>Time</span><strong>${post.time}</strong></div>
          <div><span>Status</span><strong>${post.status}</strong></div>
          <div><span>Owner</span><strong>${post.owner}</strong></div>
          <div><span>Size</span><strong>${formatLabel(post.format)}</strong></div>
          <div><span>Media</span><strong>${post.mediaType || "Image"}</strong></div>
        </div>
        <label class="note-editor">
          Notes
          <textarea id="postNote">${post.notes || ""}</textarea>
        </label>
        <button class="primary-button" type="button" data-save-note="${post.id}">Save note</button>
      </div>
    </div>
  `;
  postDialog.showModal();
}

function formatLabel(format) {
  const labels = {
    square: "1080 × 1080",
    story: "1080 × 1920",
    landscape: "1200 × 628"
  };
  return labels[format] || labels.square;
}

function openAddPostDialog(date = dateKey(today)) {
  addPostForm.reset();
  addPostForm.elements.brandId.innerHTML = brands.map((brand) => `<option value="${brand.id}">${brand.name}</option>`).join("");
  addPostForm.elements.brandId.value = selectedBrand === "all" ? "area" : selectedBrand;
  addPostForm.elements.date.value = date;
  addPostForm.elements.time.value = "09:00";
  addPostDialog.showModal();
}

function handleAddPost(event) {
  event.preventDefault();
  const data = new FormData(addPostForm);
  const channels = data.getAll("channels");
  if (!channels.length) {
    alert("Choose at least one channel.");
    return;
  }

  const file = data.get("media");
  const mediaUrl = file && file.size ? URL.createObjectURL(file) : "";
  const mediaType = file && file.type.startsWith("video") ? "video" : "image";
  const brand = getBrand(data.get("brandId"));

  posts.push({
    id: Date.now(),
    brandId: data.get("brandId"),
    date: data.get("date"),
    time: data.get("time"),
    title: data.get("title"),
    channels,
    status: data.get("status"),
    format: data.get("format"),
    owner: data.get("owner"),
    caption: data.get("caption"),
    notes: data.get("notes"),
    mediaType,
    mediaUrl,
    color: tintForBrand(brand.id)
  });

  selectedWeekStart = getMonday(parseDate(data.get("date")));
  renderWeekOptions();
  savePosts();
  addPostDialog.close();
  renderCalendar();
}

function tintForBrand(brandId) {
  return {
    area: "#d8ecf5",
    learn: "#dbf9ec",
    wireless: "#d8f2ed",
    drive: "#d6edf7"
  }[brandId] || "#d8ecf5";
}

brandList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-brand-id]");
  if (!button) return;
  selectedBrand = button.dataset.brandId;
  renderBrands();
  renderCalendar();
});

weekSelect.addEventListener("change", () => {
  selectedWeekStart = parseDate(weekSelect.value);
  renderCalendar();
});

document.querySelector("#previousWeek").addEventListener("click", () => {
  selectedWeekStart = addDays(selectedWeekStart, -7);
  weekSelect.value = dateKey(selectedWeekStart);
  renderCalendar();
});

document.querySelector("#nextWeek").addEventListener("click", () => {
  selectedWeekStart = addDays(selectedWeekStart, 7);
  weekSelect.value = dateKey(selectedWeekStart);
  renderCalendar();
});

document.querySelector("#todayButton").addEventListener("click", () => {
  selectedWeekStart = getMonday(today);
  weekSelect.value = dateKey(selectedWeekStart);
  renderCalendar();
});

document.querySelector("#newPostButton").addEventListener("click", () => openAddPostDialog());

calendarGrid.addEventListener("click", (event) => {
  const postButton = event.target.closest("[data-post-id]");
  if (postButton) {
    openPost(Number(postButton.dataset.postId));
    return;
  }
  const dayButton = event.target.closest("[data-jump-date]");
  if (dayButton) openAddPostDialog(dayButton.dataset.jumpDate);
});

searchInput.addEventListener("input", renderSuggestions);

searchSuggestions.addEventListener("click", (event) => {
  const button = event.target.closest("[data-suggestion-id]");
  if (!button) return;
  const post = posts.find((item) => item.id === Number(button.dataset.suggestionId));
  selectedWeekStart = getMonday(parseDate(post.date));
  weekSelect.value = dateKey(selectedWeekStart);
  searchInput.value = post.title;
  searchSuggestions.hidden = true;
  renderCalendar();
  openPost(post.id);
});

postDialog.addEventListener("click", (event) => {
  const button = event.target.closest("[data-save-note]");
  if (!button) return;
  const post = posts.find((item) => item.id === Number(button.dataset.saveNote));
  post.notes = document.querySelector("#postNote").value;
  savePosts();
  renderCalendar();
  postDialog.close();
});

addPostForm.addEventListener("submit", handleAddPost);

addPostDialog.addEventListener("click", (event) => {
  if (event.target.closest("[data-close-dialog]")) addPostDialog.close();
});

dashboardNotesButton.addEventListener("click", () => {
  dashboardNotes.value = localStorage.getItem(notesStorageKey) || "";
  notesDialog.showModal();
});

document.querySelector("#saveDashboardNotes").addEventListener("click", () => {
  localStorage.setItem(notesStorageKey, dashboardNotes.value);
  notesDialog.close();
});

renderBrands();
renderWeekOptions();
renderCalendar();
