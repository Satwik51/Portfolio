// Theme persistence
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const storedTheme = localStorage.getItem('theme');
if (storedTheme === 'light') {
	root.setAttribute('data-theme', 'light');
}

themeToggle?.addEventListener('click', () => {
	const isLight = root.getAttribute('data-theme') === 'light';
	root.setAttribute('data-theme', isLight ? 'dark' : 'light');
	localStorage.setItem('theme', isLight ? 'dark' : 'light');
});

// Mobile nav toggle
const nav = document.querySelector('.nav');
const navToggle = document.querySelector('.nav-toggle');
navToggle?.addEventListener('click', () => {
	const expanded = navToggle.getAttribute('aria-expanded') === 'true';
	navToggle.setAttribute('aria-expanded', String(!expanded));
	nav?.classList.toggle('open');
});

// Elevation on scroll for header
const header = document.querySelector('[data-elevate]');
let lastY = 0;
window.addEventListener('scroll', () => {
	const y = window.scrollY;
	if (y > 8 && y >= lastY) header?.classList.add('elevated');
	if (y < 4) header?.classList.remove('elevated');
	lastY = y;
});

// Scroll reveal
const revealEls = document.querySelectorAll('[data-reveal]');
const io = new IntersectionObserver((entries) => {
	entries.forEach((entry) => {
		if (entry.isIntersecting) {
			entry.target.classList.add('visible');
			io.unobserve(entry.target);
		}
	});
}, { threshold: 0.08 });
revealEls.forEach((el) => io.observe(el));

// Scroll progress and back-to-top button
const progress = document.getElementById('scrollProgress');
const backToTop = document.getElementById('backToTop');
const sections = Array.from(document.querySelectorAll('main section[id]'));
const navLinks = Array.from(document.querySelectorAll('.nav-list a[href^="#"]'));

const updateProgressAndActive = () => {
	const doc = document.documentElement;
	const max = doc.scrollHeight - doc.clientHeight;
	const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
	if (progress) progress.style.width = pct + '%';

	// Active link highlight
	const y = window.scrollY + 120; // offset for header
	let currentId = '';
	for (const sec of sections) {
		if (sec.offsetTop <= y) currentId = sec.id;
	}
	navLinks.forEach((a) => {
		const href = a.getAttribute('href') || '';
		const id = href.startsWith('#') ? href.slice(1) : '';
		if (id && id === currentId) a.classList.add('active'); else a.classList.remove('active');
	});

	// Back to top visibility
	if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 400);
};

window.addEventListener('scroll', updateProgressAndActive);
window.addEventListener('resize', updateProgressAndActive);
updateProgressAndActive();

// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach((a) => {
	a.addEventListener('click', (e) => {
		const id = a.getAttribute('href');
		if (!id || id === '#') return;
		const target = document.querySelector(id);
		if (!target) return;
		e.preventDefault();
		target.scrollIntoView({ behavior: 'smooth', block: 'start' });
		// close mobile nav
		nav?.classList.remove('open');
		navToggle?.setAttribute('aria-expanded', 'false');
	});
});

// Year in footer
document.getElementById('year').textContent = String(new Date().getFullYear());

// Parallax tilt for elements with data-tilt
const tiltElements = Array.from(document.querySelectorAll('[data-tilt]'));
tiltElements.forEach((el) => {
	const strength = 10;
	el.addEventListener('mousemove', (e) => {
		const rect = el.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		const rx = ((y / rect.height) - 0.5) * -strength;
		const ry = ((x / rect.width) - 0.5) * strength;
		el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
	});
	el.addEventListener('mouseleave', () => {
		el.style.transform = '';
	});
});

// Subtle parallax for hero visual
const parallaxEl = document.querySelector('[data-parallax]');
if (parallaxEl) {
	window.addEventListener('scroll', () => {
		const y = window.scrollY;
		parallaxEl.style.transform = `translateY(${Math.min(40, y * 0.06)}px)`;
	});
}


