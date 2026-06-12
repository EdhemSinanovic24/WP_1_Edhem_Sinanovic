document.addEventListener("DOMContentLoaded", () => {
    const iframe = document.getElementById("sadrzajOkvir");
    const pocetniSadrzaj = document.getElementById("pocetniSadrzaj");
    const funZoneLinks = document.querySelectorAll(".dropdown-content a");

    // Fun Zone iframe handling
    funZoneLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (pocetniSadrzaj) pocetniSadrzaj.style.display = "none";
            if (iframe) {
                iframe.style.display = "block";
                iframe.style.width = "100%";
            }
        });
    });

    if (iframe) {
        iframe.addEventListener("load", () => {
            try {
                iframe.contentWindow.document.body.style.overflow = "hidden";
                const visinaIgrice = iframe.contentWindow.document.documentElement.scrollHeight || iframe.contentWindow.document.body.scrollHeight;
                iframe.style.height = (visinaIgrice + 50) + "px";
            } catch (e) {
                iframe.style.height = "1150px";
            }
        });
    }

    // Mobile menu toggle
    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");

    if (menuToggle && mainNav) {
        menuToggle.addEventListener("click", () => {
            mainNav.classList.toggle("open");
        });
    }

    // Mobile dropdown toggle
    if (window.innerWidth <= 640) {
        const dropdowns = document.querySelectorAll(".dropdown");
        dropdowns.forEach(dropdown => {
            const dropbtn = dropdown.querySelector(".dropbtn");
            dropbtn.addEventListener("click", (e) => {
                e.preventDefault();
                dropdown.classList.toggle("open");
            });
        });
    }
});
