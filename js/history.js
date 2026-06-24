// =============================================
// IMAGE PATHS
// =============================================
const IMAGES = {
    oldChurch:         'images/old-church.png',
    oldChurchInterior: 'images/old-church-interior.jpg',
    stTeresas:         'images/st-teresas-school.jpg',
};

// =============================================
// APPLY IMAGES
// =============================================
document.getElementById('img-old-church').src          = IMAGES.oldChurch;
document.getElementById('img-old-church-interior').src = IMAGES.oldChurchInterior;
document.getElementById('img-st-teresas').src          = IMAGES.stTeresas;

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