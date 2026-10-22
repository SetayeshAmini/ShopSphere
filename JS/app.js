AOS.init({
    duration: 800,
    once: true
});


document.addEventListener("DOMContentLoaded", () => {

    const header = document.getElementById("siteHeader");

    const searchToggle = document.getElementById("searchToggle");
    const searchPanel = document.getElementById("searchPanel");
    const searchClose = document.getElementById("searchClose");
    const searchInput = document.getElementById("searchInput");

    const navbarCollapse = document.getElementById("mainNavbar");
    const navbarToggler = document.querySelector(".menu-toggle");


    // =========================
    // HEADER SCROLL EFFECT
    // =========================

    function updateHeader() {
        header.classList.toggle("is-scrolled", window.scrollY > 10);
    }

    updateHeader();

    window.addEventListener("scroll", updateHeader, {
        passive: true
    });


    // =========================
    // SEARCH PANEL
    // =========================

    function openSearch() {
        searchPanel.hidden = false;

        searchToggle.setAttribute("aria-expanded", "true");
        searchToggle.setAttribute("aria-label", "Close search");

        searchInput.focus();
    }

    function closeSearchPanel() {
        searchPanel.hidden = true;

        searchToggle.setAttribute("aria-expanded", "false");
        searchToggle.setAttribute("aria-label", "Open search");

        searchToggle.focus();
    }

    searchToggle.addEventListener("click", () => {

        if (searchPanel.hidden) {
            openSearch();
        } else {
            closeSearchPanel();
        }

    });

    searchClose.addEventListener("click", closeSearchPanel);


    // =========================
    // ESCAPE KEY
    // =========================

    document.addEventListener("keydown", (event) => {

        if (event.key === "Escape" && !searchPanel.hidden) {
            closeSearchPanel();
        }

    });


    // =========================
    // MOBILE MENU
    // =========================

    navbarCollapse.querySelectorAll(".nav-link").forEach((link) => {

        link.addEventListener("click", () => {

            if (
                window.innerWidth < 992 &&
                navbarCollapse.classList.contains("show")
            ) {
                bootstrap.Collapse
                    .getOrCreateInstance(navbarCollapse)
                    .hide();
            }

        });

    });


    // Keep the custom hamburger icon synchronized with Bootstrap.
    navbarCollapse.addEventListener("show.bs.collapse", () => {
        navbarToggler.setAttribute("aria-expanded", "true");
    });

    navbarCollapse.addEventListener("hide.bs.collapse", () => {
        navbarToggler.setAttribute("aria-expanded", "false");
    });


    // =========================
    // SEARCH FORM
    // =========================

    document.getElementById("searchForm").addEventListener("submit", (event) => {
        event.preventDefault();

        const query = searchInput.value.trim();

        if (!query) {
            searchInput.focus();
            return;
        }

        // Product search will be connected
        // when we build the products section.
        console.log("Search query:", query);
    });

});


/* ==========================================
   SHOPSPHERE — HERO INTERACTIONS
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const hero = document.querySelector(".hero-section");

    if (!hero) return;


    // ======================================
    // 1. ANIMATED PARTICLES WITH CANVAS
    // ======================================

    const canvas = document.getElementById("heroCanvas");
    const ctx = canvas.getContext("2d");

    let particles = [];
    let canvasWidth = 0;
    let canvasHeight = 0;
    let animationFrame;

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const isSmallScreen = window.matchMedia(
        "(max-width: 575.98px)"
    ).matches;

    const particleCount = isSmallScreen ? 28 : 65;


    function resizeCanvas() {

        const rect = hero.getBoundingClientRect();

        canvasWidth = rect.width;
        canvasHeight = rect.height;

        const pixelRatio = Math.min(
            window.devicePixelRatio || 1,
            2
        );

        canvas.width = canvasWidth * pixelRatio;
        canvas.height = canvasHeight * pixelRatio;

        canvas.style.width = `${canvasWidth}px`;
        canvas.style.height = `${canvasHeight}px`;

        ctx.setTransform(
            pixelRatio,
            0,
            0,
            pixelRatio,
            0,
            0
        );

        createParticles();
    }


    function createParticles() {

        particles = [];

        for (let i = 0; i < particleCount; i++) {

            particles.push({
                x: Math.random() * canvasWidth,
                y: Math.random() * canvasHeight,

                radius: Math.random() * 1.8 + 0.4,

                speedX: (Math.random() - 0.5) * 0.25,
                speedY: -(Math.random() * 0.35 + 0.08),

                opacity: Math.random() * 0.55 + 0.12,

                phase: Math.random() * Math.PI * 2
            });

        }
    }


    function drawParticles(time = 0) {

        ctx.clearRect(
            0,
            0,
            canvasWidth,
            canvasHeight
        );

        particles.forEach((particle) => {

            if (!reduceMotion) {

                particle.x += particle.speedX;
                particle.y += particle.speedY;

                particle.phase += 0.012;

                if (particle.y < -10) {
                    particle.y = canvasHeight + 10;
                    particle.x = Math.random() * canvasWidth;
                }

                if (particle.x < -10) {
                    particle.x = canvasWidth + 10;
                }

                if (particle.x > canvasWidth + 10) {
                    particle.x = -10;
                }

            }

            const twinkle = reduceMotion
                ? 1
                : 0.65 + Math.sin(particle.phase) * 0.35;

            ctx.beginPath();

            ctx.arc(
                particle.x,
                particle.y,
                particle.radius,
                0,
                Math.PI * 2
            );

            ctx.fillStyle = `rgba(
                220,
                210,
                255,
                ${particle.opacity * twinkle}
            )`;

            ctx.fill();

        });

        if (!reduceMotion) {
            animationFrame = requestAnimationFrame(drawParticles);
        }
    }


    resizeCanvas();
    drawParticles();

    window.addEventListener("resize", resizeCanvas);


    // ======================================
    // 2. 3D PRODUCT MOUSE MOVEMENT
    // ======================================

    const visual = document.getElementById("heroVisual");
    const stage = document.getElementById("productStage");

    let pointerX = 0;
    let pointerY = 0;

    let currentX = 0;
    let currentY = 0;

    let tiltFrame;


    function animateProductTilt() {

        currentX += (pointerX - currentX) * 0.08;
        currentY += (pointerY - currentY) * 0.08;

        stage.style.transform = `
            rotateY(${currentX}deg)
            rotateX(${currentY}deg)
        `;

        if (
            Math.abs(pointerX - currentX) > 0.01 ||
            Math.abs(pointerY - currentY) > 0.01
        ) {
            tiltFrame = requestAnimationFrame(animateProductTilt);
        } else {
            tiltFrame = null;
        }
    }


    function startTiltAnimation() {

        if (!tiltFrame && !reduceMotion) {
            tiltFrame = requestAnimationFrame(animateProductTilt);
        }

    }


    if (visual && stage && !reduceMotion) {

        visual.addEventListener("pointermove", (event) => {

            // Ignore touch gestures to avoid interfering
            // with normal mobile scrolling.
            if (event.pointerType === "touch") return;

            const rect = visual.getBoundingClientRect();

            const relativeX =
                (event.clientX - rect.left) / rect.width;

            const relativeY =
                (event.clientY - rect.top) / rect.height;

            pointerX = (relativeX - 0.5) * 14;
            pointerY = (0.5 - relativeY) * 12;

            startTiltAnimation();

        });


        visual.addEventListener("pointerleave", () => {

            pointerX = 0;
            pointerY = 0;

            startTiltAnimation();

        });

    }


    // ======================================
    // 3. PRODUCT COLOR PICKER
    // ======================================

    const colorButtons = document.querySelectorAll(".color-option");

    const selectedColor = document.getElementById("selectedColor");

    const colorMap = {
        "Cosmic Purple": "rgba(167, 139, 250, 0.42)",
        "Ocean Blue": "rgba(96, 165, 250, 0.42)",
        "Rose Pink": "rgba(251, 113, 133, 0.42)",
        "Silver Mist": "rgba(209, 213, 219, 0.35)"
    };


    colorButtons.forEach((button) => {

        button.addEventListener("click", () => {

            const colorName = button.dataset.name;

            // Update selected label
            selectedColor.textContent = colorName;

            // Update active button
            colorButtons.forEach((item) => {

                const isActive = item === button;

                item.classList.toggle("active", isActive);

                item.setAttribute(
                    "aria-pressed",
                    String(isActive)
                );

            });

            // Change the product's ambient glow
            visual.style.setProperty(
                "--product-glow",
                colorMap[colorName]
            );

            // Update the background accent
            hero.style.setProperty(
                "--hero-accent",
                button.dataset.color
            );

        });

    });


    // ======================================
    // 4. REVEAL ELEMENTS ON SCROLL
    // ======================================

    const revealElements = hero.querySelectorAll("[data-reveal]");

    if (reduceMotion || !("IntersectionObserver" in window)) {

        revealElements.forEach((element) => {
            element.classList.add("is-visible");
        });

    } else {

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("is-visible");

                        observer.unobserve(entry.target);

                    }

                });

            },
            {
                threshold: 0.12
            }
        );

        revealElements.forEach((element) => {
            revealObserver.observe(element);
        });

    }


    // ======================================
    // 5. CLEANUP ANIMATION WHEN TAB IS HIDDEN
    // ======================================

    document.addEventListener("visibilitychange", () => {

        if (document.hidden) {

            cancelAnimationFrame(animationFrame);

        } else if (!reduceMotion) {

            cancelAnimationFrame(animationFrame);

            animationFrame = requestAnimationFrame(drawParticles);

        }

    });

});
