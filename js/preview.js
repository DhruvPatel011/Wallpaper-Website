// js/preview.js
// COMPLETE FIXED FILE
// Features:
// 1. Dynamic title, category, description
// 2. Clickable category and tags
// 3. No duplicate tags
// 4. Related wallpapers section
// 5. Fallback to other wallpapers if same category not found

(function loadTheme() {
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme === 'light') {
    document.body.classList.add('light');
  } else {
    document.body.classList.remove('light');
  }
})();

const params = new URLSearchParams(window.location.search);
const id = Number(params.get('id')) || 1;

// Find selected wallpaper
const wallpaper = wallpapers.find(w => w.id === id);

// If wallpaper not found, redirect to home
if (!wallpaper) {
  window.location.href = 'index.html';
}

// =========================
// BASIC INFO
// =========================
document.getElementById('previewTitle').textContent = wallpaper.title;

document.getElementById('previewCategory').textContent =
  capitalize(wallpaper.category);

document.getElementById('previewDescription').textContent =
  `Download ${wallpaper.title} in 4K and original resolution.`;

// =========================
// MAIN IMAGE
// =========================
const previewImage = document.getElementById('previewImage');
previewImage.src = wallpaper.image;
previewImage.alt = wallpaper.title;

// =========================
// DOWNLOAD BUTTONS
// =========================
document.getElementById('download4k').href = wallpaper.image;
document.getElementById('downloadOriginal').href = wallpaper.image;

// =========================
// CATEGORY BADGE
// =========================
document.getElementById('categoryBadges').innerHTML = `
  <a
    href="index.html?category=${encodeURIComponent(wallpaper.category)}"
    class="badge"
  >
    ${capitalize(wallpaper.category)}
  </a>
`;

// =========================
// TAGS (DYNAMIC + UNIQUE)
// =========================
const dynamicTags = [
  wallpaper.category,
  wallpaper.title.split(' ')[0],
  '4K',
  'HD Wallpaper'
];

// Remove duplicates (case-insensitive)
const uniqueTags = [];
dynamicTags.forEach(tag => {
  if (
    !uniqueTags.some(
      existing =>
        existing.toLowerCase() === tag.toLowerCase()
    )
  ) {
    uniqueTags.push(tag);
  }
});

// Render tags
document.getElementById('tagBadges').innerHTML = uniqueTags
  .map(tag => {
    const lowerTag = tag.toLowerCase();

    // Category tag
    if (lowerTag === wallpaper.category.toLowerCase()) {
      return `
        <a
          href="index.html?category=${encodeURIComponent(wallpaper.category)}"
          class="badge"
        >
          ${capitalize(tag)}
        </a>
      `;
    }

    // 4K tag
    if (tag === '4K') {
      return `
        <a href="index.html?tag=4k" class="badge">
          4K
        </a>
      `;
    }

    // HD Wallpaper tag
    if (tag === 'HD Wallpaper') {
      return `
        <a href="index.html?tag=hd" class="badge">
          HD Wallpaper
        </a>
      `;
    }

    // Title-based tag
    return `
      <a
        href="index.html?search=${encodeURIComponent(tag)}"
        class="badge"
      >
        ${capitalize(tag)}
      </a>
    `;
  })
  .join('');

// =========================
// RELATED WALLPAPERS
// =========================
const relatedContainer = document.getElementById('relatedWallpapers');

if (relatedContainer) {
  // Same category wallpapers excluding current one
  let related = wallpapers
    .filter(item =>
      item.category === wallpaper.category &&
      item.id !== wallpaper.id
    )
    .slice(0, 6);

  // Fallback: show other wallpapers if same category not available
  if (related.length === 0) {
    related = wallpapers
      .filter(item => item.id !== wallpaper.id)
      .slice(0, 6);
  }

  if (related.length > 0) {
    relatedContainer.innerHTML = related
      .map(item => `
        <div class="card">
          <img src="${item.image}" alt="${item.title}">

          <div class="card-content">
            <h3>${item.title}</h3>
            <p>${item.category.toUpperCase()} • 4K</p>

            <div class="actions">
              <!-- Preview Button -->
              <a
                class="btn icon-btn"
                href="preview.html?id=${item.id}"
                title="Preview"
              >
                👁
              </a>

              <!-- Download Button -->
              <a
                class="btn download-btn-card"
                href="${item.image}"
                download
                target="_blank"
              >
                Download
              </a>
            </div>
          </div>
        </div>
      `)
      .join('');
  } else {
    relatedContainer.innerHTML =
      '<p>No related wallpapers found.</p>';
  }
}

// =========================
// HELPER FUNCTION
// =========================
function capitalize(text) {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}