// =============================================
// IMAGE PATHS — change filenames here only
// =============================================
const IMAGES = {
    pastor:       'images/pastor.png',
    deacon:       'images/deacon.png',
    announcement: 'images/announcement1.png',
};

// =============================================
// APPLY IMAGES
// =============================================
document.getElementById('img-pastor').src       = IMAGES.pastor;
document.getElementById('img-deacon').src       = IMAGES.deacon;
document.getElementById('img-announcement').src = IMAGES.announcement;

// =============================================
// HERO VIDEO - SLOW DOWN AND PAUSE AT END
// =============================================
const heroVideo = document.querySelector('.hero-video');
if (heroVideo) {
    heroVideo.playbackRate = 0.50;
    heroVideo.loop = false;

    heroVideo.addEventListener('ended', () => {
        setTimeout(() => {
            heroVideo.currentTime = 0;
            heroVideo.play();
        }, 1500);
    });
}

// =============================================
// GALLERY CAROUSEL
// =============================================
const GALLERY = [
    { src: 'gallery-photos/inside-church-2.jpg', caption: 'Inside St. Joseph\'s Church' },
    { src: 'gallery-photos/inside-the-church.jpg', caption: 'Inside St. Joseph\'s Church' },
    { src: 'gallery-photos/international-potluck-dinner.jpg', caption: 'International Potluck Dinner' },
    { src: 'gallery-photos/live-stream.jpg', caption: 'Live Stream' },
];

if (GALLERY.length > 0) {
    let currentIndex = 0;

    const galleryImg     = document.getElementById('gallery-img');
    const galleryCaption = document.getElementById('gallery-caption');
    const galleryPrev    = document.getElementById('gallery-prev');
    const galleryNext    = document.getElementById('gallery-next');
    const dotsContainer  = document.getElementById('gallery-dots');

    GALLERY.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'gallery-dot';
        dot.setAttribute('aria-label', `Go to photo ${i + 1}`);
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
    });

    function goTo(index) {
        currentIndex = (index + GALLERY.length) % GALLERY.length;
        galleryImg.src             = GALLERY[currentIndex].src;
        galleryImg.alt             = GALLERY[currentIndex].caption;
        galleryCaption.textContent = GALLERY[currentIndex].caption;
        document.querySelectorAll('.gallery-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    galleryPrev.addEventListener('click', () => goTo(currentIndex - 1));
    galleryNext.addEventListener('click', () => goTo(currentIndex + 1));

    goTo(0);
} else {
    document.getElementById('gallery').style.display = 'none';
}

// =============================================
// HAMBURGER + SIDEBAR
// =============================================
const hamburger       = document.getElementById('hamburger');
const sidebar         = document.getElementById('sidebar');
const sidebarOverlay  = document.getElementById('sidebar-overlay');
const sidebarClose    = document.getElementById('sidebar-close');

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

// =============================================
// SIDEBAR DROPDOWNS
// =============================================
document.querySelectorAll('.sidebar-dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
        const parent = toggle.parentElement;
        parent.classList.toggle('open');
    });
});