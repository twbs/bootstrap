// Show Backdrop
$('.navbar-toggler').on('click', function () {
    $('.backdrop-overlay').fadeIn("400");
});

// Híde Backdrop
$('.backdrop-overlay, .btn-close').on('click', function () {
    $('.backdrop-overlay').fadeOut("400");
});

// Hide offcanvas and backdrop on resize
$(window).on('resize', function () {
    $('.offcanvas').offcanvas('hide');
    $('.backdrop-overlay').fadeOut("400");
});