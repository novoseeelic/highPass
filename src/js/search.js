document.addEventListener('click', function(e) {
    let btn = document.querySelector('.header__btn');
    let form = document.querySelector('.header__search');

    if (e.target.classList.contains('header__btn') || e.target.classList.contains('header__search-image')) {
        form.classList.add('header__search__active');
        btn.classList.add('header__btn__hidden');
    } else if (!e.target.classList.contains('header__search') && !e.target.classList.contains('header__search-btn') && !e.target.classList.contains('header__search-input')) {
        form.classList.remove('header__search__active');
        btn.classList.remove('header__btn__hidden');
    }
});
const searchOpen = document.querySelector('.header__btn');
const search =  document.querySelector('.header__search');
const searchClose = document.querySelector('.header__search-close');


searchOpen.addEventListener('click', () => {
  search.classList.add('search--open');
});

searchClose.addEventListener('click', () => {
  search.classList.remove('search--open');
});