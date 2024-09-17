document.addEventListener('click', function(e) {
    let menu = document.querySelector('.header__nav-list');
    
    if (!e.target.classList.contains('header__nav-btn') && !e.target.classList.contains('header__nav-btn__image') && !e.target.classList.contains('header__nav-list')) {
        menu.classList.remove('header__nav-list__active');
    } else {
        menu.classList.add('header__nav-list__active');
    }
});