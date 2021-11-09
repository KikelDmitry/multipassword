const mobileMenu = () => {
	let burger = document.querySelector('#burger-btn'),
		menu = document.querySelector('#main-menu');
	if (burger) {
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
	} else {
		return
	}
};
const tooltipsInit = () => {
	let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
	tooltipTriggerList.map(function (tooltipTriggerEl) {
		return new bootstrap.Tooltip(tooltipTriggerEl)
	})
}

document.addEventListener('DOMContentLoaded', () => {
	mobileMenu();
	tooltipsInit();
})
