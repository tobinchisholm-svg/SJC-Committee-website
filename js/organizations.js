const IMAGES = {
    cwlBanner:    'images/CWL_Banner.png',
    cwlChristmas: 'images/CWL_Christmas.png',
    cwlSneakers:  'images/CWL_Sneakers.png',
    cwlGroup:     'images/CWL_Website.png',
    kocLogo:      'images/koc-logo.png',
    choir:        'images/choir.png',
};

document.getElementById('img-cwl-banner').src    = IMAGES.cwlBanner;
document.getElementById('img-cwl-christmas').src  = IMAGES.cwlChristmas;
document.getElementById('img-cwl-sneakers').src   = IMAGES.cwlSneakers;
document.getElementById('img-cwl-group').src      = IMAGES.cwlGroup;
document.getElementById('img-koc-logo').src       = IMAGES.kocLogo;
document.getElementById('img-choir').src          = IMAGES.choir;

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