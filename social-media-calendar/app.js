const brands = [
  { id: "area", name: "AREA", logo: "./assets/area-logo.svg", accent: "#003a5d", tint: "#d8ecf5" },
  { id: "learn", name: "AREA Learn", logo: "./assets/area-learn-logo.svg", accent: "#05ce7c", tint: "#dcfaec" },
  { id: "wireless", name: "AREA Wireless", logo: "./assets/area-wireless-logo.svg", accent: "#03846d", tint: "#d9f3ee" },
  { id: "drive", name: "AREA DRIVE", logo: "./assets/area-drive-logo.svg", accent: "#1a7599", tint: "#dceff7" }
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
    format: "reel",
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
    format: "fourFive",
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
    format: "reel",
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
let returnToPreviewPostId = null;

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
const postFormTitle = document.querySelector("#postFormTitle");
const postFormSubmit = document.querySelector("#postFormSubmit");

function loadPosts() {
  const saved = JSON.parse(localStorage.getItem(postStorageKey) || "null");
  const source = saved?.length ? saved : seedPosts;
  return source.map((post) => ({
    ...post,
    format: normalizeFormat(post.format)
  }));
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

function normalizeFormat(format) {
  if (format === "story") return "reel";
  if (format === "landscape") return "fourFive";
  return format || "square";
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderBrands() {
  const items = [
    `<button class="brand-logo brand-all ${selectedBrand === "all" ? "active" : ""}" type="button" data-brand-id="all" title="All AREA brands"><span>All</span></button>`,
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
    <button class="post-card" type="button" data-post-id="${post.id}" style="--post-color: ${tintForBrand(post.brandId)}; --brand-accent: ${brand.accent}">
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
    return `<video src="${post.mediaUrl}" controls muted></video>`;
  }
  if (post.mediaUrl) {
    return `<img src="${post.mediaUrl}" alt="${escapeHtml(post.title)}">`;
  }
  return `<div class="media-placeholder"><span>${getBrand(post.brandId).name}</span><strong>${escapeHtml(post.title)}</strong></div>`;
}

function channelLabel(channel) {
  return {
    IG: "Instagram",
    FB: "Facebook",
    X: "X",
    LinkedIn: "LinkedIn",
    YouTube: "YouTube"
  }[channel] || channel;
}

function accountName(post, channel) {
  const brand = getBrand(post.brandId);
  if (channel === "IG") return brand.id === "area" ? "abrealestateassociation" : brand.name.toLowerCase().replaceAll(" ", "");
  if (channel === "X") return `@${brand.name.replaceAll(" ", "")}`;
  return brand.name === "AREA" ? "Alberta Real Estate Association" : brand.name;
}

function platformPreview(post, channel) {
  const brand = getBrand(post.brandId);
  const media = mediaMarkup(post);
  const format = normalizeFormat(post.format);
  const dateText = parseDate(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const safeCaption = escapeHtml(post.caption);
  const safeTitle = escapeHtml(post.title);
  const account = escapeHtml(accountName(post, channel));

  if (channel === "IG") {
    return `
      <article class="platform-card instagram-preview">
        <div class="platform-heading"><span class="ig-mark">◎</span><span>Instagram post</span></div>
        <div class="scheduled-line">Scheduled for ${dateText} ${post.time}</div>
        <div class="social-card">
          <div class="social-card-head">
            <img src="${brand.logo}" alt="${brand.name}">
            <strong>${account}</strong>
            <span>•••</span>
          </div>
          <div class="social-media ${format}">${media}</div>
          <div class="ig-actions"><span>♡</span><span>⌕</span><span>✈</span><span>▢</span></div>
          <p><strong>${account}</strong> ${safeCaption}</p>
        </div>
      </article>
    `;
  }

  if (channel === "LinkedIn") {
    return `
      <article class="platform-card linkedin-preview">
        <div class="platform-heading"><span class="li-mark">in</span><span>LinkedIn post</span></div>
        <div class="scheduled-line">Scheduled for ${dateText} ${post.time}</div>
        <div class="social-card">
          <div class="social-card-head">
            <img src="${brand.logo}" alt="${brand.name}">
            <div><strong>${account}</strong><small>now · Public</small></div>
            <span>•••</span>
          </div>
          <p>${safeCaption}</p>
          <div class="social-media linkedin-media ${format}">${media}</div>
          <div class="social-actions"><span>Like</span><span>Comment</span><span>Repost</span><span>Send</span></div>
        </div>
      </article>
    `;
  }

  if (channel === "X") {
    return `
      <article class="platform-card x-preview">
        <div class="platform-heading"><span class="x-mark">X</span><span>X post</span></div>
        <div class="scheduled-line">Scheduled for ${dateText} ${post.time}</div>
        <div class="social-card">
          <div class="social-card-head">
            <img src="${brand.logo}" alt="${brand.name}">
            <div><strong>${account}</strong><small>${brand.name}</small></div>
            <span>•••</span>
          </div>
          <p>${safeCaption}</p>
          <div class="social-media x-media ${format}">${media}</div>
          <div class="social-actions"><span>Reply</span><span>Repost</span><span>Like</span><span>Share</span></div>
        </div>
      </article>
    `;
  }

  if (channel === "YouTube") {
    return `
      <article class="platform-card youtube-preview">
        <div class="platform-heading"><span class="yt-mark">▶</span><span>YouTube post</span></div>
        <div class="scheduled-line">Scheduled for ${dateText} ${post.time}</div>
        <div class="social-card">
          <div class="social-media youtube-media ${format}">${media}</div>
          <h3>${safeTitle}</h3>
          <div class="social-card-head compact">
            <img src="${brand.logo}" alt="${brand.name}">
            <div><strong>${account}</strong><small>Scheduled upload</small></div>
          </div>
          <p>${safeCaption}</p>
        </div>
      </article>
    `;
  }

  return `
    <article class="platform-card facebook-preview">
      <div class="platform-heading"><span class="fb-mark">f</span><span>Facebook post</span></div>
      <div class="scheduled-line">Scheduled for ${dateText} ${post.time}</div>
      <div class="social-card">
        <div class="social-card-head">
          <img src="${brand.logo}" alt="${brand.name}">
          <div><strong>${account}</strong><small>Just now · Public</small></div>
          <span>•••</span>
        </div>
        <p>${safeCaption}</p>
        <div class="social-media facebook-media ${format}">${media}</div>
        <div class="social-actions"><span>Like</span><span>Comment</span><span>Share</span></div>
      </div>
    </article>
  `;
}

function openPost(postId) {
  const post = posts.find((item) => item.id === postId);
  if (!post) return;
  const brand = getBrand(post.brandId);
  postDialogContent.innerHTML = `
    <div class="detail-layout">
      <div class="preview-scroll" style="--brand-accent: ${brand.accent}">
        ${post.channels.map((channel) => platformPreview(post, channel)).join("")}
      </div>
      <div class="detail-copy">
        <p class="eyebrow">${brand.name} · ${post.channels.join(", ")}</p>
        <div class="detail-title-row">
          <h2>${escapeHtml(post.title)}</h2>
          <div class="detail-actions">
            <button class="icon-action" type="button" data-edit-post="${post.id}" title="Edit post" aria-label="Edit post">✎</button>
            <button class="text-action danger-action" type="button" data-delete-post="${post.id}">Delete</button>
          </div>
        </div>
        <section class="content-review">
          <span>Post content</span>
          <p>${escapeHtml(post.caption)}</p>
        </section>
        <div class="approval-panel ${post.approved ? "approved" : ""}">
          <div>
            <span>Approval</span>
            <strong>${post.approved ? "Approved" : "Needs approval"}</strong>
          </div>
          <button class="primary-button approval-button" type="button" data-toggle-approval="${post.id}">
            ${post.approved ? "Reset approval" : "Approve post"}
          </button>
        </div>
      </div>
    </div>
  `;
  postDialog.showModal();
}

function formatLabel(format) {
  const labels = {
    square: "Square",
    reel: "Reel",
    fourFive: "4:5"
  };
  return labels[normalizeFormat(format)] || labels.square;
}

function openAddPostDialog(date = dateKey(today), postId = null) {
  addPostForm.reset();
  addPostForm.elements.brandId.innerHTML = brands.map((brand) => `<option value="${brand.id}">${brand.name}</option>`).join("");
  addPostForm.elements.postId.value = postId || "";

  const post = postId ? posts.find((item) => item.id === postId) : null;
  postFormTitle.textContent = post ? "Edit social post" : "Add a social post";
  postFormSubmit.textContent = post ? "Update post" : "Save post";

  if (post) {
    addPostForm.elements.brandId.value = post.brandId;
    addPostForm.elements.date.value = post.date;
    addPostForm.elements.time.value = post.time;
    addPostForm.elements.owner.value = post.owner;
    addPostForm.elements.status.value = post.status;
    addPostForm.elements.format.value = normalizeFormat(post.format);
    addPostForm.elements.title.value = post.title;
    addPostForm.elements.caption.value = post.caption;
    addPostForm.elements.notes.value = post.notes || "";
    addPostForm.querySelectorAll('input[name="channels"]').forEach((input) => {
      input.checked = post.channels.includes(input.value);
    });
  } else {
    addPostForm.elements.brandId.value = selectedBrand === "all" ? "area" : selectedBrand;
    addPostForm.elements.date.value = date;
    addPostForm.elements.time.value = "09:00";
  }

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

  const existingPost = data.get("postId")
    ? posts.find((post) => post.id === Number(data.get("postId")))
    : null;
  const file = data.get("media");
  const mediaUrl = file && file.size ? URL.createObjectURL(file) : "";
  const mediaType = file && file.type.startsWith("video") ? "video" : file && file.size ? "image" : existingPost?.mediaType || "image";
  const brand = getBrand(data.get("brandId"));

  const nextPost = {
    id: existingPost?.id || Date.now(),
    brandId: data.get("brandId"),
    date: data.get("date"),
    time: data.get("time"),
    title: data.get("title"),
    channels,
    status: data.get("status"),
    format: normalizeFormat(data.get("format")),
    owner: data.get("owner"),
    caption: data.get("caption"),
    notes: data.get("notes"),
    mediaType,
    mediaUrl: mediaUrl || existingPost?.mediaUrl || "",
    approved: existingPost?.approved || false,
    color: tintForBrand(brand.id)
  };

  if (existingPost) {
    posts = posts.map((post) => post.id === existingPost.id ? nextPost : post);
  } else {
    posts.push(nextPost);
  }

  selectedWeekStart = getMonday(parseDate(data.get("date")));
  renderWeekOptions();
  savePosts();
  addPostDialog.close();
  renderCalendar();
  if (existingPost || returnToPreviewPostId === nextPost.id) {
    returnToPreviewPostId = null;
    openPost(nextPost.id);
  }
}

function tintForBrand(brandId) {
  return getBrand(brandId).tint || "#d8ecf5";
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
  const approvalButton = event.target.closest("[data-toggle-approval]");
  const editButton = event.target.closest("[data-edit-post]");
  const deleteButton = event.target.closest("[data-delete-post]");

  if (approvalButton) {
    const post = posts.find((item) => item.id === Number(approvalButton.dataset.toggleApproval));
    post.approved = !post.approved;
    savePosts();
    renderCalendar();
    postDialog.close();
    openPost(post.id);
  }

  if (editButton) {
    const postId = Number(editButton.dataset.editPost);
    returnToPreviewPostId = postId;
    postDialog.close();
    openAddPostDialog(dateKey(today), postId);
  }

  if (deleteButton) {
    const postId = Number(deleteButton.dataset.deletePost);
    const post = posts.find((item) => item.id === postId);
    if (!post) return;
    if (!confirm(`Delete "${post.title}" from the calendar?`)) return;
    posts = posts.filter((item) => item.id !== postId);
    savePosts();
    renderCalendar();
    postDialog.close();
  }
});

addPostForm.addEventListener("submit", handleAddPost);

addPostDialog.addEventListener("click", (event) => {
  if (event.target.closest("[data-close-dialog]")) addPostDialog.close();
});

[postDialog, addPostDialog, notesDialog].forEach((dialog) => {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
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
