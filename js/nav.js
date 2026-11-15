// Menu hamburger untuk tampilan HP
const nav = document.querySelector(".nav");
const tombolMenu = document.querySelector(".nav-toggle");
const daftarMenu = document.querySelector("#menu-utama");

// Berhenti kalau elemennya tidak ada
if (nav && tombolMenu && daftarMenu) {
    // Tanda JavaScript aktif, supaya CSS boleh menyembunyikan menu
    nav.classList.add("nav-js");

    // Buka atau tutup menu dan perbarui aria-expanded
    const aturMenu = (buka) => {
        tombolMenu.setAttribute("aria-expanded", String(buka));
        daftarMenu.classList.toggle("is-open", buka);
    };

    // Klik tombol membuka atau menutup menu
    tombolMenu.addEventListener("click", () => {
        const sedangBuka = tombolMenu.getAttribute("aria-expanded") === "true";
        aturMenu(!sedangBuka);
    });

    // Tombol Esc menutup menu dan fokus kembali ke tombol
    document.addEventListener("keydown", (event) => {
        const sedangBuka = tombolMenu.getAttribute("aria-expanded") === "true";

        if (event.key === "Escape" && sedangBuka) {
            aturMenu(false);
            tombolMenu.focus();
        }
    });

    // Layar melebar: kembalikan menu ke keadaan tertutup
    window.matchMedia("(min-width: 42rem)").addEventListener("change", (event) => {
        if (event.matches) {
            aturMenu(false);
        }
    });
}