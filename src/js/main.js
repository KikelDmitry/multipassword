const mobileMenu = () => {
	let burger = document.querySelector('#burger-btn'),
		menu = document.querySelector('#main-menu');
	burger.addEventListener('click', () => {
		if (!burger.classList.contains('is-active')) {
			burger.classList.add('is-active');
			burger.setAttribute('aria-label', 'Close menu')
			menu.classList.add('is-active');
		} else {
			burger.classList.remove('is-active');
			burger.setAttribute('aria-label', 'Open menu')
			menu.classList.remove('is-active');

		}
	})
}

document.addEventListener('DOMContentLoaded', () => {
	mobileMenu();
})