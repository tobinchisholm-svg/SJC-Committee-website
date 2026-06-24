/* ============================================================
   CEMETERY SEARCH — js/cemeteries.js
   Queries Cloudflare Worker → D1 database
   ============================================================ */

const SJC_WORKER_URL = 'https://sjc-cemetery-worker.st-joe-ph.workers.dev/search';

let searchTimeout = null;

const modal        = document.getElementById('cemetery-modal-overlay');
const modalTitle   = document.getElementById('modal-title');
const modalClose   = document.getElementById('cemetery-modal-close');
const searchInput  = document.getElementById('cemetery-search-input');
const searchStatus = document.getElementById('search-status');
const searchResults= document.getElementById('search-results');
const sjcBtn       = document.getElementById('sjc-search-btn');
const chapelBtn    = document.getElementById('chapel-search-btn');

// ── Open modal ──────────────────────────────────────────────
function openModal(cemeteryName) {
  modalTitle.textContent = 'Search ' + cemeteryName + ' Records';
  searchInput.value = '';
  searchStatus.innerHTML = '';
  searchResults.innerHTML = '';
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  setTimeout(() => searchInput.focus(), 100);
}

// ── Close modal ─────────────────────────────────────────────
function closeModal() {
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

// ── Button listeners ─────────────────────────────────────────
sjcBtn.addEventListener('click', () => openModal("St. Joseph's Cemetery"));

chapelBtn.addEventListener('click', () => {
  searchStatus.innerHTML = '';
  searchResults.innerHTML = '';
  openModal('Chapel Hill Cemetery');
  searchStatus.innerHTML = '<p class="search-coming-soon">Online records for Chapel Hill Cemetery are coming soon. Please contact the Parish Office for inquiries.</p>';
  searchInput.disabled = true;
});

// Re-enable input when modal reopens for SJC
sjcBtn.addEventListener('click', () => { searchInput.disabled = false; });

// ── Close triggers ────────────────────────────────────────────
modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

// ── Search input ──────────────────────────────────────────────
searchInput.addEventListener('input', () => {
  clearTimeout(searchTimeout);
  const q = searchInput.value.trim();

  if (q.length < 2) {
    searchStatus.innerHTML = '';
    searchResults.innerHTML = '';
    return;
  }

  searchStatus.innerHTML = '<p class="search-loading">Searching...</p>';
  searchResults.innerHTML = '';

  searchTimeout = setTimeout(() => doSearch(q), 350);
});

// ── Fetch from Worker ─────────────────────────────────────────
async function doSearch(query) {
  try {
    const res = await fetch(`${SJC_WORKER_URL}?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('Network error');
    const records = await res.json();
    renderResults(records, query);
  } catch (err) {
    searchStatus.innerHTML = '<p class="search-error">Something went wrong. Please try again.</p>';
    searchResults.innerHTML = '';
  }
}

// ── Render results ────────────────────────────────────────────
function renderResults(records, query) {
  if (records.length === 0) {
    searchStatus.innerHTML = `<p class="search-no-results">No records found for "<strong>${escapeHtml(query)}</strong>".</p>`;
    searchResults.innerHTML = '';
    return;
  }

  searchStatus.innerHTML = `<p class="search-count">${records.length} record${records.length !== 1 ? 's' : ''} found</p>`;

  searchResults.innerHTML = records.map(r => {
    const name      = [r.first_name, r.last_name].filter(Boolean).join(' ') || 'Unknown';
    const dob       = r.date_of_birth || '—';
    const dod       = r.date_of_death || '—';
    const blockId   = r.block_id || '—';
    const hasMap    = r.gps_lat && r.gps_lng;
    const mapsUrl   = hasMap ? `https://www.google.com/maps?q=${r.gps_lat},${r.gps_lng}` : null;

    return `
      <div class="search-result-card">
        <div class="result-name">${escapeHtml(name)}</div>
        <div class="result-details">
          <span class="result-detail"><span class="result-label">Born</span> ${escapeHtml(dob)}</span>
          <span class="result-detail"><span class="result-label">Died</span> ${escapeHtml(dod)}</span>
          <span class="result-detail"><span class="result-label">Block</span> ${escapeHtml(blockId)}</span>
        </div>
        ${hasMap ? `<a href="${mapsUrl}" target="_blank" rel="noopener noreferrer" class="btn-map">📍 View on Map</a>` : ''}
      </div>
    `;
  }).join('');
}

// ── Helper ────────────────────────────────────────────────────
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// =============================================
// HAMBURGER + SIDEBAR
// =============================================
const hamburger      = document.getElementById('hamburger');
const sidebar        = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const sidebarClose   = document.getElementById('sidebar-close');

function openSidebar() {
    sidebar.classList.add('open');
    sidebarOverlay.classList.add('open');
    hamburger.classList.add('active');
}

function closeSidebar() {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('open');
    hamburger.classList.remove('active');
}

hamburger.addEventListener('click', openSidebar);
sidebarClose.addEventListener('click', closeSidebar);
sidebarOverlay.addEventListener('click', closeSidebar);

document.querySelectorAll('.sidebar-dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
        const parent = toggle.parentElement;
        parent.classList.toggle('open');
    });
});