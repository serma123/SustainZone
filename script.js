document.addEventListener('DOMContentLoaded', function () {

    // ---- Smooth Scroll for all anchor links ----
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            var target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // ---- Section highlighting (Intersection Observer) ----
    var sections = ['footprint', 'emissions', 'regulatory', 'operations', 'solution', 'casestudy', 'faq'];
    var tocLinks = document.querySelectorAll('.toc-link');
    var mobileTocLinks = document.querySelectorAll('.mobile-toc-link');
    var mobileTocLabel = document.getElementById('mobile-toc-label');
    var labelMap = {
        footprint: "Healthcare's Footprint",
        emissions: "Carbon Emissions",
        regulatory: "Regulatory Landscape",
        operations: "Greening Operations",
        solution: "SustainZone Solution",
        casestudy: "Case Study",
        faq: "FAQ"
    };

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var id = entry.target.id;
                tocLinks.forEach(function (link) {
                    link.classList.toggle('active', link.getAttribute('data-section') === id);
                });
                mobileTocLinks.forEach(function (link) {
                    var isActive = link.getAttribute('data-section') === id;
                    link.classList.toggle('bg-brand-50', isActive);
                    link.classList.toggle('text-brand-600', isActive);
                    link.classList.toggle('font-medium', isActive);
                });
                if (mobileTocLabel && labelMap[id]) mobileTocLabel.textContent = labelMap[id];
            }
        });
    }, { rootMargin: '-20% 0px -60% 0px', threshold: 0 });

    sections.forEach(function (id) {
        var el = document.getElementById(id);
        if (el) observer.observe(el);
    });

    // ---- Fade-in animation ----
    var fadeObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(function (el) {
        fadeObserver.observe(el);
    });

    // ---- Interactive Donut Chart ----
    var scopeData = {
        '1': { label: 'Scope 1', value: '~10%', sublabel: 'Direct operations', color: '#f97316' },
        '2': { label: 'Scope 2', value: '~10%', sublabel: 'Purchased energy', color: '#0284c7' },
        '3': { label: 'Scope 3', value: '~80%', sublabel: 'Supply chain', color: '#16a34a' }
    };
    var donutLabel = document.getElementById('donut-label');
    var donutValue = document.getElementById('donut-value');
    var donutSublabel = document.getElementById('donut-sublabel');
    var segments = document.querySelectorAll('.donut-segment');
    var legendItems = document.querySelectorAll('.scope-legend-item');
    var scopeCards = document.querySelectorAll('.scope-card');

    function highlightScope(scopeNum) {
        var d = scopeData[scopeNum];
        if (!d) return;
        donutLabel.textContent = d.label;
        donutValue.textContent = d.value;
        donutValue.style.color = d.color;
        donutSublabel.textContent = d.sublabel;
        segments.forEach(function (s) {
            s.classList.toggle('active', s.dataset.scope === scopeNum);
        });
        scopeCards.forEach(function (c) {
            c.classList.toggle('highlighted', c.dataset.scope === scopeNum);
        });
        legendItems.forEach(function (l) {
            if (l.dataset.scope === scopeNum) {
                l.style.borderColor = d.color;
                l.style.boxShadow = '0 2px 8px -2px ' + d.color + '33';
            } else {
                l.style.borderColor = '';
                l.style.boxShadow = '';
            }
        });
    }

    function resetScope() {
        donutLabel.textContent = 'Scope 3';
        donutValue.textContent = '~80%';
        donutValue.style.color = '#16a34a';
        donutSublabel.textContent = 'Supply chain';
        segments.forEach(function (s) { s.classList.remove('active'); });
        scopeCards.forEach(function (c) { c.classList.remove('highlighted'); });
        legendItems.forEach(function (l) { l.style.borderColor = ''; l.style.boxShadow = ''; });
    }

    segments.forEach(function (seg) {
        seg.addEventListener('mouseenter', function () { highlightScope(this.dataset.scope); });
        seg.addEventListener('mouseleave', resetScope);
    });
    legendItems.forEach(function (item) {
        item.addEventListener('mouseenter', function () { highlightScope(this.dataset.scope); });
        item.addEventListener('mouseleave', resetScope);
    });
    scopeCards.forEach(function (card) {
        card.addEventListener('mouseenter', function () { highlightScope(this.dataset.scope); });
        card.addEventListener('mouseleave', resetScope);
    });

    // ---- Animated Roadmap ----
    var roadmapContainer = document.getElementById('roadmap-container');
    if (roadmapContainer) {
        var roadmapObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    roadmapContainer.querySelectorAll('.roadmap-dot').forEach(function (dot) {
                        var delay = parseInt(dot.dataset.delay || 0);
                        setTimeout(function () { dot.classList.add('animate'); }, delay);
                    });
                    roadmapContainer.querySelectorAll('.roadmap-card').forEach(function (card) {
                        var delay = parseInt(card.dataset.delay || 0);
                        setTimeout(function () { card.classList.add('animate'); }, delay);
                    });
                    roadmapObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        roadmapObserver.observe(roadmapContainer);
    }

    // ---- Animated Counters ----
    var counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var el = entry.target;
                if (el.dataset.animated) return;
                el.dataset.animated = 'true';
                var target = parseFloat(el.dataset.target);
                var decimals = parseInt(el.dataset.decimals || '0');
                var duration = 2000;
                var startTime = performance.now();
                function animate(currentTime) {
                    var elapsed = currentTime - startTime;
                    var progress = Math.min(elapsed / duration, 1);
                    var eased = 1 - Math.pow(1 - progress, 3);
                    var current = eased * target;
                    el.textContent = decimals > 0 ? current.toFixed(decimals) : Math.round(current).toLocaleString();
                    if (progress < 1) requestAnimationFrame(animate);
                }
                requestAnimationFrame(animate);
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.counter').forEach(function (el) {
        counterObserver.observe(el);
    });

    // ---- FAQ Accordion ----
    document.querySelectorAll('.accordion-trigger').forEach(function (trigger) {
        trigger.addEventListener('click', function () {
            var content = this.nextElementSibling;
            var isOpen = content.classList.contains('open');
            // Close all
            document.querySelectorAll('.accordion-content').forEach(function (c) { c.classList.remove('open'); });
            document.querySelectorAll('.accordion-trigger').forEach(function (t) { t.classList.remove('open'); t.setAttribute('aria-expanded', 'false'); });
            // Toggle current
            if (!isOpen) {
                content.classList.add('open');
                this.classList.add('open');
                this.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // ---- Mobile TOC Toggle ----
    var mobileTocBtn = document.getElementById('mobile-toc-btn');
    var mobileTocMenu = document.getElementById('mobile-toc-menu');
    var mobileTocChevron = document.getElementById('mobile-toc-chevron');
    var isMobileTocOpen = false;

    if (mobileTocBtn) {
        mobileTocBtn.addEventListener('click', function () {
            isMobileTocOpen = !isMobileTocOpen;
            mobileTocMenu.classList.toggle('open', isMobileTocOpen);
            mobileTocChevron.style.transform = isMobileTocOpen ? 'rotate(90deg)' : '';
        });
    }

    mobileTocLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            isMobileTocOpen = false;
            mobileTocMenu.classList.remove('open');
            mobileTocChevron.style.transform = '';
        });
    });

    document.addEventListener('click', function (e) {
        if (isMobileTocOpen && !mobileTocBtn.contains(e.target) && !mobileTocMenu.contains(e.target)) {
            isMobileTocOpen = false;
            mobileTocMenu.classList.remove('open');
            mobileTocChevron.style.transform = '';
        }
    });

    // ---- Toast ----
    function showToast(title, desc, type) {
        var toast = document.getElementById('toast');
        var toastTitle = document.getElementById('toast-title');
        var toastDesc = document.getElementById('toast-desc');
        toastTitle.textContent = title;
        toastDesc.textContent = desc;
        toast.classList.remove('translate-x-[120%]', 'opacity-0');
        toast.classList.add('translate-x-0', 'opacity-100');
        if (type === 'error') {
            toast.style.borderColor = '#ef4444';
        } else {
            toast.style.borderColor = '#22c55e';
        }
        setTimeout(function () {
            toast.classList.add('translate-x-[120%]', 'opacity-0');
            toast.classList.remove('translate-x-0', 'opacity-100');
        }, 4000);
    }

    // ---- Lead Capture Form ----
    var form = document.getElementById('lead-form');
    var submitBtn = document.getElementById('submit-btn');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';

            var data = {
                fullName: document.getElementById('fullName').value,
                organization: document.getElementById('organization').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };

            fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
                .then(function (res) {
                    if (!res.ok) throw new Error('Failed');
                    return res.json();
                })
                .then(function () {
                    showToast('Assessment Request Submitted', 'Thank you! Our team will be in touch within 24 hours.', 'success');
                    form.reset();
                })
                .catch(function () {
                    showToast('Submission Failed', 'Please try again or contact us directly.', 'error');
                })
                .finally(function () {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Get Your Free Assessment';
                });
        });
    }


    // ---- Modal Logic ----
    window.openModal = function (id) {
        var modal = document.getElementById(id);
        if (modal) {
            modal.classList.remove('hidden');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }
    };

    window.closeModal = function (id) {
        var modal = document.getElementById(id);
        if (modal) {
            modal.classList.add('hidden');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    };

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('[role="dialog"]').forEach(function (modal) {
                if (!modal.classList.contains('hidden')) {
                    closeModal(modal.id);
                }
            });
        }
    });

    document.addEventListener('click', function (e) {
        // Close if clicking the backdrop
        if (e.target.hasAttribute('data-modal-backdrop')) {
            var modal = e.target.closest('[role="dialog"]');
            if (modal) closeModal(modal.id);
        }
    });

    // ---- Generic Carousel Logic ----
    function setupCarousel(containerSelector, trackSelector, prevBtnSelector, nextBtnSelector, dotsContainerSelector) {
        var container = document.querySelector(containerSelector);
        if (!container) return;

        var track = container.querySelector(trackSelector);
        var prevBtn = container.querySelector(prevBtnSelector);
        var nextBtn = container.querySelector(nextBtnSelector);
        var dotsContainer = container.querySelector(dotsContainerSelector);
        var dots = dotsContainer ? dotsContainer.querySelectorAll('.carousel-dot') : [];
        var cards = track.querySelectorAll('.carousel-card');

        var currentIndex = 0;
        var totalCards = cards.length;

        if (totalCards === 0) return;

        function getCardsPerView() {
            if (window.innerWidth >= 1024) return 3;
            if (window.innerWidth >= 640) return 2;
            return 1;
        }

        function updateCarousel() {
            var cardsPerView = getCardsPerView();
            var maxIndex = Math.max(0, totalCards - cardsPerView);

            // Clamp index
            if (currentIndex < 0) currentIndex = 0;
            if (currentIndex > maxIndex) currentIndex = maxIndex;

            var cardWidth = cards[0].offsetWidth;
            var style = window.getComputedStyle(track);
            var gapVal = parseFloat(style.gap) || 0;

            var moveAmount = (cardWidth + gapVal) * currentIndex;
            track.style.transform = 'translateX(-' + moveAmount + 'px)';

            // Update UI
            if (prevBtn) prevBtn.disabled = currentIndex === 0;
            if (nextBtn) nextBtn.disabled = currentIndex === maxIndex;

            dots.forEach(function (dot, index) {
                var isActive = index === currentIndex;
                dot.classList.toggle('active', isActive);
                // Handle tailwind classes if they were used for color override
                if (isActive) {
                    dot.classList.remove('bg-slate-300');
                    dot.classList.add('bg-emerald-500');
                } else {
                    dot.classList.add('bg-slate-300');
                    dot.classList.remove('bg-emerald-500');
                }
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', function () {
                if (currentIndex > 0) {
                    currentIndex--;
                    updateCarousel();
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', function () {
                var cardsPerView = getCardsPerView();
                var maxIndex = Math.max(0, totalCards - cardsPerView);
                if (currentIndex < maxIndex) {
                    currentIndex++;
                    updateCarousel();
                }
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                var idx = parseInt(this.dataset.index);
                var cardsPerView = getCardsPerView();
                var maxIndex = Math.max(0, totalCards - cardsPerView);
                if (idx > maxIndex) idx = maxIndex;
                currentIndex = idx;
                updateCarousel();
            });
        });

        window.addEventListener('resize', function () {
            // Re-clamp index on resize
            var cardsPerView = getCardsPerView();
            var maxIndex = Math.max(0, totalCards - cardsPerView);
            if (currentIndex > maxIndex) currentIndex = maxIndex;
            updateCarousel();
        });

        // Initial update
        setTimeout(updateCarousel, 100);
    }

    // Initialize Carousels
    setupCarousel('[data-testid="carousel-comparison"]', '#comparison-track', '#prev-btn', '#next-btn', '#carousel-dots');
    setupCarousel('[data-testid="carousel-compliance"]', '#compliance-track', '#prev-btn-comp', '#next-btn-comp', '#compliance-dots');

});
