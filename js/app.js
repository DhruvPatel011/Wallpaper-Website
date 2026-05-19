// js/app.js
// COMPLETE WORKING FILE
// Features:
// - Search
// - Category filters
// - Theme toggle
// - Save wallpapers
// - Saved wallpapers view
// - Category dropdown
// - Infinite slideshow
// - Preview and Download buttons

const galleryContainer = document.getElementById('galleryContainer');
const searchInput = document.getElementById('searchInput');
const filterButtons = document.querySelectorAll('.filter-btn');
const themeToggle = document.getElementById('themeToggle');
const savedBtn = document.getElementById('savedBtn');
const navCategorySelect = document.getElementById('navCategorySelect');
const slideshowToggle = document.getElementById('slideshowToggle');

let currentCategory = 'all';
let currentWallpapers = wallpapers;
let slideshowInterval = null;
let slideshowIndex = 0;

// ==========================================
// URL PARAMETERS
// ==========================================
const params = new URLSearchParams(window.location.search);
const urlCategory = params.get('category');
const urlTag = params.get('tag');

if (urlCategory) {
  currentCategory = urlCategory;
}

// Replace these functions in js/app.js

// ==========================================
// GET SAVED WALLPAPERS
// ==========================================
function getSavedWallpapers() {
  return JSON.parse(
    localStorage.getItem('savedWallpapers')
  ) || [];
}

// ==========================================
// SAVE / UNSAVE WALLPAPER
// ==========================================
function toggleSaveWallpaper(id) {
  let saved = getSavedWallpapers();

  // If already saved → remove it
  if (saved.includes(id)) {
    saved = saved.filter(item => item !== id);
  } else {
    // Save it
    saved.push(id);
  }

  // Store in localStorage
  localStorage.setItem(
    'savedWallpapers',
    JSON.stringify(saved)
  );

  // Re-render current gallery so heart becomes red immediately
  renderGallery(currentWallpapers);
}

// ==========================================
// THEME
// ==========================================
(function loadTheme() {
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme === 'light') {
    document.body.classList.add('light');

    if (themeToggle) {
      themeToggle.textContent = '☀️';
    }
  } else {
    if (themeToggle) {
      themeToggle.textContent = '🌙';
    }
  }
})();

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light');

    const isLight = document.body.classList.contains('light');

    localStorage.setItem(
      'theme',
      isLight ? 'light' : 'dark'
    );

    themeToggle.textContent = isLight ? '☀️' : '🌙';
  });
}

// ==========================================
// FILTER BUTTONS
// ==========================================
filterButtons.forEach(btn => {
  if (btn.dataset.category === currentCategory) {
    btn.classList.add('active');
  }

  btn.addEventListener('click', () => {
    filterButtons.forEach(b =>
      b.classList.remove('active')
    );

    btn.classList.add('active');
    currentCategory = btn.dataset.category;

    if (currentCategory === 'all') {
      window.history.replaceState({}, '', 'index.html');
    } else {
      window.history.replaceState(
        {},
        '',
        `index.html?category=${currentCategory}`
      );
    }

    renderGallery();
  });
});

// ==========================================
// SEARCH
// ==========================================
if (searchInput) {
  searchInput.addEventListener('input', () => {
    renderGallery();
  });
}

// ==========================================
// CATEGORY DROPDOWN
// ==========================================
if (navCategorySelect) {
  navCategorySelect.value = currentCategory;

  navCategorySelect.addEventListener('change', function () {
    const value = this.value;

    currentCategory = value;

    if (value === 'all') {
      window.history.replaceState({}, '', 'index.html');
    } else {
      window.history.replaceState(
        {},
        '',
        `index.html?category=${encodeURIComponent(value)}`
      );
    }

    // Update filter buttons active state
    filterButtons.forEach(btn => {
      btn.classList.toggle(
        'active',
        btn.dataset.category === value
      );
    });

    renderGallery();
  });
}

// ==========================================
// RENDER GALLERY
// ==========================================
function renderGallery(customWallpapers = null) {
  if (!galleryContainer) return;

  const query = searchInput
    ? searchInput.value.toLowerCase()
    : '';

  let source = customWallpapers || wallpapers;

  const filtered = source.filter(item => {
    const matchesCategory =
      currentCategory === 'all' ||
      item.category === currentCategory;

    const matchesSearch =
      item.title.toLowerCase().includes(query);

    const matchesTag =
      !urlTag ||
      urlTag === '4k' ||
      urlTag === 'hd';

    return (
      matchesCategory &&
      matchesSearch &&
      matchesTag
    );
  });

  currentWallpapers = filtered;

  if (filtered.length === 0) {
    galleryContainer.innerHTML =
      '<p>No wallpapers found.</p>';
    return;
  }

  const savedIds = getSavedWallpapers();

  galleryContainer.innerHTML = filtered
    .map(
      item => `
      <div class="card">
        <!-- Save Button -->

        <button
          class="save-btn ${
            getSavedWallpapers().includes(item.id)
              ? 'saved'
              : ''
          }"
          data-id="${item.id}"
          title="${
            getSavedWallpapers().includes(item.id)
              ? 'Remove from Saved'
              : 'Save Wallpaper'
          }"
        >
          ♥
        </button>

        <!-- Wallpaper Image -->
        <img
          src="${item.image}"
          alt="${item.title}"
        >

        <!-- Card Content -->
        <div class="card-content">
          <h3>${item.title}</h3>
          <p>${item.category.toUpperCase()} • 4K</p>

          <div class="actions">
            <!-- Preview -->
            <a
              class="btn icon-btn"
              href="preview.html?id=${item.id}"
              title="Preview"
            >
              👁
            </a>

            <!-- Download -->
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
    `
    )
    .join('');
}

// ==========================================
// SAVE BUTTON CLICK
// ==========================================
document.addEventListener('click', function (e) {
  const saveBtn = e.target.closest('.save-btn');

  if (saveBtn) {
    const id = Number(saveBtn.dataset.id);
    toggleSaveWallpaper(id);
  }
});

// ==========================================
// SAVED BUTTON
// ==========================================
// Replace the Saved button logic in js/app.js with this

if (savedBtn) {
  savedBtn.addEventListener('click', function (e) {
    e.preventDefault();

    const savedIds = getSavedWallpapers();

    // Get only saved wallpapers
    const savedWallpapers = wallpapers.filter(
      wallpaper =>
        savedIds.includes(wallpaper.id)
    );

    // Reset category
    currentCategory = 'all';

    // Reset category buttons
    filterButtons.forEach(btn =>
      btn.classList.remove('active')
    );

    const allBtn = document.querySelector(
      '.filter-btn[data-category=\"all\"]'
    );

    if (allBtn) {
      allBtn.classList.add('active');
    }

    // Reset dropdown
    if (navCategorySelect) {
      navCategorySelect.value = 'all';
    }

    // Show saved wallpapers
    renderGallery(savedWallpapers);
  });
}

// ==========================================
// INFINITE SLIDESHOW
// ==========================================
if (slideshowToggle) {
  slideshowToggle.addEventListener('click', function () {
    // Stop slideshow
    if (slideshowInterval) {
      clearInterval(slideshowInterval);
      slideshowInterval = null;
      slideshowToggle.classList.remove('active');
      return;
    }

    // Start slideshow
    slideshowToggle.classList.add('active');

    slideshowInterval = setInterval(() => {
      if (wallpapers.length === 0) return;

      slideshowIndex =
        (slideshowIndex + 1) % wallpapers.length;

      const wallpaper = wallpapers[slideshowIndex];

      window.location.href =
        `preview.html?id=${wallpaper.id}`;
    }, 3000);
  });
}

// ==========================================
// INITIAL RENDER
// ==========================================
renderGallery();