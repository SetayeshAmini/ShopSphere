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

/* =====================================
   SHOPSPHERE — CATEGORIES INTERACTIONS
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    const categoriesSection = document.querySelector(
        ".categories-section"
    );

    if (!categoriesSection) return;


    // ==================================
    // 1. CATEGORY FILTERING
    // ==================================

    const filterButtons = categoriesSection.querySelectorAll(
        ".category-filter"
    );

    const categoryItems = categoriesSection.querySelectorAll(
        ".category-item"
    );

    let filterToken = 0;


    function filterCategories(selectedCategory) {

        const currentToken = ++filterToken;

        filterButtons.forEach((button) => {

            const isActive =
                button.dataset.filter === selectedCategory;

            button.classList.toggle("active", isActive);

            button.setAttribute(
                "aria-pressed",
                String(isActive)
            );

        });


        categoryItems.forEach((item) => {

            const matches =
                selectedCategory === "all" ||
                item.dataset.category === selectedCategory;

            // Cancel any previous pending hide operation.
            item.classList.remove("is-filtering-out");

            if (!matches) {

                item.classList.add("is-filtering-out");

                window.setTimeout(() => {

                    if (currentToken !== filterToken) return;

                    item.classList.add("is-hidden");

                }, 220);

            } else {

                item.classList.remove("is-hidden");

            }

        });

    }


    filterButtons.forEach((button) => {

        button.addEventListener("click", () => {

            filterCategories(button.dataset.filter);

        });

    });


    // ==================================
    // 2. POINTER-TRACKING LIGHT
    // ==================================

    const cards = categoriesSection.querySelectorAll(
        ".category-card"
    );

    const supportsFinePointer = window.matchMedia(
        "(hover: hover) and (pointer: fine)"
    ).matches;

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


    if (supportsFinePointer && !reduceMotion) {

        cards.forEach((card) => {

            card.addEventListener("pointermove", (event) => {

                const rect = card.getBoundingClientRect();

                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;

                const xPercent = (x / rect.width) * 100;
                const yPercent = (y / rect.height) * 100;

                card.style.setProperty(
                    "--pointer-x",
                    `${xPercent}%`
                );

                card.style.setProperty(
                    "--pointer-y",
                    `${yPercent}%`
                );

            });


            // ==================================
            // 3. SUBTLE 3D TILT
            // ==================================

            let frame = null;

            card.addEventListener("pointermove", (event) => {

                if (event.pointerType === "touch") return;

                const rect = card.getBoundingClientRect();

                const relativeX =
                    (event.clientX - rect.left) / rect.width;

                const relativeY =
                    (event.clientY - rect.top) / rect.height;

                const rotateY = (relativeX - 0.5) * 5;
                const rotateX = (0.5 - relativeY) * 5;

                if (frame !== null) {
                    cancelAnimationFrame(frame);
                }

                frame = requestAnimationFrame(() => {

                    card.style.transform = `
                        perspective(900px)
                        rotateX(${rotateX}deg)
                        rotateY(${rotateY}deg)
                        translateY(-3px)
                    `;

                    frame = null;

                });

            });


            card.addEventListener("pointerleave", () => {

                if (frame !== null) {
                    cancelAnimationFrame(frame);
                    frame = null;
                }

                card.style.transform = "";

            });

        });

    }


    // ==================================
    // 4. REVEAL CARDS WHEN VISIBLE
    // ==================================

    const revealItems = categoriesSection.querySelectorAll(
        "[data-reveal], .category-item"
    );


    if (reduceMotion || !("IntersectionObserver" in window)) {

        revealItems.forEach((element) => {
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
                threshold: 0.08
            }
        );


        revealItems.forEach((element, index) => {

            if (element.matches(".category-item")) {

                element.style.transitionDelay =
                    `${(index % 3) * 90}ms`;

            }

            revealObserver.observe(element);

        });

    }


    // ==================================
    // 5. CATEGORY CARD CLICK
    // ==================================

    cards.forEach((card) => {

        card.addEventListener("click", () => {

            const category = card.dataset.categoryLink;

            console.log(
                `Selected category: ${category}`
            );

            // Later, we will connect this category
            // to the real products section.

        });

    });

});

/* ==========================
   SHOP SECTION INTERACTIONS
========================== */

document.addEventListener("DOMContentLoaded", () => {
    const shopGrid = document.getElementById("shopGrid");

    if (!shopGrid) return;

    const cards = Array.from(
        shopGrid.querySelectorAll(".shop-card")
    );

    const filterButtons = document.querySelectorAll(".shop-filter");
    const sortSelect = document.getElementById("shopSort");
    const productCount = document.getElementById("productCount");
    const loadMoreButton = document.getElementById("loadMoreProducts");

    let activeFilter = "all";
    let activeSort = "featured";

    // FILTER PRODUCTS
    function updateProducts() {
        const visibleCards = cards.filter(card => {
            return (
                activeFilter === "all" ||
                card.dataset.category === activeFilter
            );
        });

        // SORT PRODUCTS
        if (activeSort === "low-high") {
            visibleCards.sort(
                (a, b) => Number(a.dataset.price) - Number(b.dataset.price)
            );
        } else if (activeSort === "high-low") {
            visibleCards.sort(
                (a, b) => Number(b.dataset.price) - Number(a.dataset.price)
            );
        } else {
            visibleCards.sort(
                (a, b) => cards.indexOf(a) - cards.indexOf(b)
            );
        }

        // Hide cards that don't match
        cards.forEach(card => {
            card.classList.add("is-hidden");
            card.classList.remove("is-visible", "is-filtering-out");
        });

        // Show matching cards in the chosen order
        visibleCards.forEach((card, index) => {
            shopGrid.appendChild(card);
            card.classList.remove("is-hidden");

            requestAnimationFrame(() => {
                setTimeout(() => {
                    card.classList.add("is-visible");
                }, index * 60);
            });
        });

        // Update result count
        if (productCount) {
            productCount.textContent = visibleCards.length;
        }

        // Hide load-more when no products match
        if (loadMoreButton) {
            loadMoreButton.style.display =
                visibleCards.length === 0 ? "none" : "inline-flex";
        }
    }

    // FILTER BUTTON EVENTS
    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            filterButtons.forEach(item => {
                item.classList.remove("active");
            });

            button.classList.add("active");
            activeFilter = button.dataset.filter;

            updateProducts();
        });
    });

    // SORT EVENTS
    if (sortSelect) {
        sortSelect.addEventListener("change", () => {
            activeSort = sortSelect.value;
            updateProducts();
        });
    }

    // WISHLIST BUTTONS
    document.querySelectorAll(".wishlist-btn").forEach(button => {
        button.addEventListener("click", () => {
            const icon = button.querySelector("i");
            const isFavorite = button.classList.toggle("is-favorite");

            if (icon) {
                icon.classList.toggle("bi-heart", !isFavorite);
                icon.classList.toggle("bi-heart-fill", isFavorite);
            }

            button.setAttribute("aria-pressed", String(isFavorite));
        });
    });

    // QUICK ADD BUTTONS
    document.querySelectorAll(".quick-add").forEach(button => {
        button.addEventListener("click", () => {
            const card = button.closest(".shop-card");
            const productName =
                card?.querySelector("h3")?.textContent.trim() || "Product";

            button.innerHTML = `
                <i class="bi bi-check-circle-fill"></i>
                Added!
            `;

            button.classList.add("added");

            // Small visual confirmation
            button.setAttribute(
                "aria-label",
                `${productName} added to cart`
            );

            setTimeout(() => {
                button.innerHTML = `
                    <i class="bi bi-plus-lg"></i>
                    Quick Add
                `;

                button.classList.remove("added");
                button.setAttribute("aria-label", "Add product to cart");
            }, 1500);

            console.log(`${productName} added to cart`);
        });
    });

    // LOAD MORE BUTTON
    // This is a demo interaction until more products are added.
    if (loadMoreButton) {
        loadMoreButton.addEventListener("click", () => {
            const originalText = loadMoreButton.innerHTML;

            loadMoreButton.innerHTML = `
                <i class="bi bi-check2-circle"></i>
                You're all caught up!
            `;

            setTimeout(() => {
                loadMoreButton.innerHTML = originalText;
            }, 1800);
        });
    }

    // REVEAL ANIMATION
    const revealCards = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                revealCards.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12
    });

    cards.forEach(card => revealCards.observe(card));

    // INITIAL STATE
    updateProducts();
});

