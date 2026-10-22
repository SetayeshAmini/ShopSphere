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
