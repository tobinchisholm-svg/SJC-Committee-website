// =============================================
// IMAGE PATHS — change filenames here only
// =============================================
const IMAGES = {
    heroBg:          'images/hero-bg.png',
    churchInterior:  'images/church-interior.png',
    pastor:          'images/pastor.png',
    deacon:          'images/deacon.png',
    nancy:           'images/nancy.png',
    carolena:        'images/carolena.png',
    koc:             'images/koc.png',
    cwl:             'images/cwl.png',
    choir:           'images/choir.png',
    closet:          'images/closet.png',
    announcement:    'images/announcement1.png',
    vision:          'images/vision2020.png',
    foodbank:        'images/foodbank.png',
};

// =============================================
// APPLY IMAGES
// =============================================
document.querySelector('.hero').style.backgroundImage = `url('${IMAGES.heroBg}')`;
document.getElementById('img-church-interior').src = IMAGES.churchInterior;
document.getElementById('img-pastor').src           = IMAGES.pastor;
document.getElementById('img-deacon').src           = IMAGES.deacon;
document.getElementById('img-nancy').src            = IMAGES.nancy;
document.getElementById('img-carolena').src         = IMAGES.carolena;
document.getElementById('img-koc').src              = IMAGES.koc;
document.getElementById('img-cwl').src              = IMAGES.cwl;
document.getElementById('img-choir').src            = IMAGES.choir;
document.getElementById('img-closet').src           = IMAGES.closet;
document.getElementById('img-announcement').src     = IMAGES.announcement;
document.getElementById('img-vision').src           = IMAGES.vision;
document.getElementById('img-foodbank').src         = IMAGES.foodbank;

// =============================================
// HAMBURGER MENU
// =============================================
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
    });
});