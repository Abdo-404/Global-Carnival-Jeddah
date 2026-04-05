document.addEventListener('DOMContentLoaded', function() {
    // ---------- 1. SCROLL REVEAL (Intersection Observer) ----------
    const revealSelectors = [
        '.reveal-on-scroll', '.fade-up', '.fade-left', '.fade-right',
        '.hero-title', '.hero-subtitle', '.hero-btn', '.hero-info', '.scroll-indicator'
    ];
    const revealElements = document.querySelectorAll(revealSelectors.join(','));
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible', 'revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    revealElements.forEach(el => observer.observe(el));

    // Auto-convert any inline opacity:0 elements (outside carousels)
    document.querySelectorAll('[style*="opacity:0"]').forEach(el => {
        if (!el.closest('#highlightsCarousel') && !el.closest('#heroSlidesContainer')) {
            el.classList.add('fade-up');
            el.style.opacity = '';
            el.style.transform = '';
            observer.observe(el);
        }
    });

    // ---------- 2. HERO SLIDESHOW ----------
    const heroImages = [
        'images/image_17.jpg', 'images/image_22.jpg', 'images/image_13.jpg',
        'images/image_9.jpg', 'images/image_12.jpg', 'images/image_20.jpg'
    ];
    let currentHeroIndex = 0;
    let heroInterval;
    let isHeroPlaying = true;
    const heroContainer = document.querySelector('#heroSlidesContainer .relative.w-full');
    if (heroContainer) {
        function renderHeroSlides() {
            heroContainer.innerHTML = '';
            heroImages.forEach((src, idx) => {
                const slideDiv = document.createElement('div');
                slideDiv.className = `absolute inset-0 hero-slide transition-opacity duration-1000`;
                slideDiv.style.opacity = idx === currentHeroIndex ? '1' : '0';
                slideDiv.innerHTML = `<img class="object-cover w-full h-full" src="${src}" alt="Carnival view">`;
                heroContainer.appendChild(slideDiv);
            });
            const gradientDiv = document.createElement('div');
            gradientDiv.className = "absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/70 pointer-events-none";
            heroContainer.appendChild(gradientDiv);
        }

        function showHeroSlide(index) {
            const slides = heroContainer.querySelectorAll('.hero-slide');
            slides.forEach((slide, i) => {
                slide.style.opacity = i === index ? '1' : '0';
            });
        }

        function nextHeroSlide() {
            currentHeroIndex = (currentHeroIndex + 1) % heroImages.length;
            showHeroSlide(currentHeroIndex);
        }

        function startHeroAutoPlay() {
            if (heroInterval) clearInterval(heroInterval);
            heroInterval = setInterval(nextHeroSlide, 5000);
        }

        function stopHeroAutoPlay() {
            if (heroInterval) clearInterval(heroInterval);
            heroInterval = null;
        }

        renderHeroSlides();
        startHeroAutoPlay();

        const pauseBtn = document.getElementById('pauseSlideshowBtn');
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => {
                if (isHeroPlaying) {
                    stopHeroAutoPlay();
                    isHeroPlaying = false;
                    pauseBtn.innerHTML = '<svg class="lucide lucide-play h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
                } else {
                    startHeroAutoPlay();
                    isHeroPlaying = true;
                    pauseBtn.innerHTML = '<svg class="lucide lucide-pause h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="14" y="3" width="5" height="18" rx="1"/><rect x="5" y="3" width="5" height="18" rx="1"/></svg>';
                }
            });
        }
    }

    // ---------- 3. HIGHLIGHTS CAROUSEL ----------
    const highlightsData = [
        { title: "Adventure Park", desc: "Thrilling rides and adventures for all ages", img: "images/image_13.jpg" },
        { title: "Balloon Park", desc: "Children's park with fun inflated rides and bouncy attractions", img: "images/image_22.jpg" },
        { title: "Sports Court", desc: "Multi-sport facilities for active visitors", img: "images/image_9.jpg" },
        { title: "Food Kiosks", desc: "Diverse street food from around the world", img: "images/image_12.jpg" },
        { title: "Restaurants", desc: "Fine dining experiences in cultural settings", img: "images/image_20.jpg" },
        { title: "Parking", desc: "Convenient parking facilities for all visitors", img: "images/image_10.jpg" }
    ];
    let currentHighlight = 0;
    const slidesWrapper = document.getElementById('highlightSlidesWrapper');
    const dotsContainer = document.getElementById('highlightDots');
    const prevBtn = document.getElementById('prevHighlight');
    const nextBtn = document.getElementById('nextHighlight');

    if (slidesWrapper) {
        function buildCarousel() {
            slidesWrapper.innerHTML = '';
            highlightsData.forEach((item, idx) => {
                const slide = document.createElement('div');
                slide.className = `absolute inset-0 highlight-slide transition-opacity duration-500`;
                slide.style.opacity = idx === currentHighlight ? '1' : '0';
                slide.innerHTML = `
                    <img class="object-cover w-full h-full" src="${item.img}" alt="${item.title}">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                    <div class="absolute bottom-0 left-0 right-0 p-8 text-white">
                        <h3 class="text-2xl md:text-3xl font-bold mb-3">${item.title}</h3>
                        <p class="text-lg text-gray-200 mb-4">${item.desc}</p>
                    </div>
                `;
                slidesWrapper.appendChild(slide);
            });
            renderDots();
        }

        function renderDots() {
            if (!dotsContainer) return;
            dotsContainer.innerHTML = '';
            highlightsData.forEach((_, idx) => {
                const dot = document.createElement('button');
                dot.className = `w-3 h-3 rounded-full transition-all duration-300 ${idx === currentHighlight ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'}`;
                dot.addEventListener('click', () => setHighlightSlide(idx));
                dotsContainer.appendChild(dot);
            });
        }

        function setHighlightSlide(index) {
            currentHighlight = index;
            const slides = slidesWrapper.querySelectorAll('.highlight-slide');
            slides.forEach((slide, i) => {
                slide.style.opacity = i === currentHighlight ? '1' : '0';
            });
            renderDots();
        }

        function nextHighlight() {
            setHighlightSlide((currentHighlight + 1) % highlightsData.length);
        }

        function prevHighlight() {
            setHighlightSlide((currentHighlight - 1 + highlightsData.length) % highlightsData.length);
        }

        buildCarousel();
        if (prevBtn) prevBtn.addEventListener('click', prevHighlight);
        if (nextBtn) nextBtn.addEventListener('click', nextHighlight);
    }

    // ---------- 4. MOBILE MENU ----------
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    const closeMobileNav = document.getElementById('closeMobileNav');
    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileNav.classList.add('open');
            document.body.classList.add('mobile-menu-active');
        });
        if (closeMobileNav) {
            closeMobileNav.addEventListener('click', () => {
                mobileNav.classList.remove('open');
                document.body.classList.remove('mobile-menu-active');
            });
        }
        document.addEventListener('click', (e) => {
            if (mobileNav.classList.contains('open') && !mobileNav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                mobileNav.classList.remove('open');
                document.body.classList.remove('mobile-menu-active');
            }
        });
    }

    // ---------- 5. LANGUAGE DROPDOWN ----------
    const langToggle = document.getElementById('langToggleBtn');
    const langDropdown = document.getElementById('langDropdown');
    if (langToggle && langDropdown) {
        langToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown.classList.toggle('open');
        });
        document.addEventListener('click', () => {
            langDropdown.classList.remove('open');
        });
        document.querySelectorAll('#langDropdown a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                alert(`Language switched to ${link.innerText} (demo)`);
                langDropdown.classList.remove('open');
            });
        });
    }

    // ---------- 6. STICKY HEADER ----------
    const header = document.getElementById('mainHeader');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('shadow-md', 'bg-white/95');
        } else {
            header.classList.remove('shadow-md', 'bg-white/95');
        }
    });

    // ---------- 7. WHATSAPP BUTTON ----------
    const whatsappBtn = document.getElementById('whatsappBtnFixed');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', () => {
            window.open('https://wa.me/971503545972?text=Hello%20I%20want%20to%20know%20more%20about%20Global%20Carnival%20Jeddah', '_blank');
        });
    }

    // ---------- 8. FLOATING CONTACT BUTTON (scroll to contact section) ----------
    const floatingBtn = document.getElementById('floatingContactBtn');
    if (floatingBtn) {
        floatingBtn.addEventListener('click', () => {
            window.location.href = 'contactSection.html';
        });
    }

    // ---------- 9. ADDITIONAL UI POLISH ----------
    const allGradientBtns = document.querySelectorAll('.relative.inline-flex.h-12');
    allGradientBtns.forEach(btn => btn.classList.add('btn-glow'));
});
