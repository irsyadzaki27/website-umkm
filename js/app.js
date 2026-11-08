"use strict";

console.log("P09 JavaScript aktif");

// Data produk Kopi Nusa (array of object)
const produkUmkm = [
    { nama: "Kopi Garwo Signature", kategori: "Minuman", harga: 20000, stok: 15, unggulan: true, deskripsi: "Kopi dengan cita rasa lembut dan cocok untuk menemani aktivitas." },
    { nama: "Americano Peach", kategori: "Minuman", harga: 22000, stok: 9, unggulan: false, deskripsi: "Minuman kopi dengan perpaduan rasa americano dan peach." },
    { nama: "Kopi Tubruk Signature", kategori: "Kopi", harga: 15000, stok: 12, unggulan: true, deskripsi: "Kopi hitam tubruk yang pekat, harum, dan jujur. Tanpa gula, tanpa basa-basi." },
    { nama: "Cold Brew Aren", kategori: "Minuman", harga: 18000, stok: 4, unggulan: false, deskripsi: "Kopi dingin dengan rasa ringan dan manis aren seimbang." },
    { nama: "Kyoto Matcha Latte", kategori: "Minuman", harga: 20000, stok: 10, unggulan: false, deskripsi: "Matcha ala Kyoto dengan susu segar, rasa lembut, creamy, dan sedikit manis." },
    { nama: "Paket Seduh Rumahan", kategori: "Bundling", harga: 75000, stok: 0, unggulan: false, deskripsi: "Kopi 250 gram, filter, dan panduan seduh untuk pemula." },
];

// Ubah angka jadi teks rupiah
// Input: nilai (number), output: string, tanpa efek samping
function formatRupiah(nilai) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(nilai);
}

// Tentukan status dari jumlah stok
// Input: stok (number), output: object { label, className }
function statusStok(stok) {
    if (stok <= 0) {
        return { label: "Habis", className: "empty" };
    }

    if (stok <= 5) {
        return { label: "Stok terbatas", className: "warning" };
    }

    return { label: "Tersedia", className: "" };
}

// Label kategori produk
function labelKategori(kategori) {
    switch (kategori) {
        case "Kopi":
            return "Produk kopi pilihan";
        case "Minuman":
            return "Minuman siap saji";
        case "Bundling":
            return "Paket hemat";
        default:
            return "Produk UMKM";
    }
}

// Buat HTML satu kartu dari satu object produk
// Input: produk (object), output: string markup
function buatKartuProduk(produk) {
    const status = statusStok(produk.stok);
    const kategori = labelKategori(produk.kategori);
    const labelAksi = produk.stok > 0 ? "Siap dipesan" : "Hubungi admin";
    const badgeUnggulan = produk.unggulan
        ? '<span class="product-badge">Produk unggulan</span>'
        : "";

    return `
        <article class="js-product-card">
            ${badgeUnggulan}
            <h3>${produk.nama}</h3>
            <p class="category-note">${kategori}</p>
            <p>${produk.deskripsi}</p>
            <p class="price">${formatRupiah(produk.harga)}</p>
            <span class="stock-badge ${status.className}">${status.label}</span>
            <p>${labelAksi}</p>
        </article>
    `;
}

// Tampilkan produk ke halaman
function renderProduk() {                                       // forEach
    const grid = document.querySelector("#produk-dinamis");     // filter
    const ringkasan = document.querySelector("#produk-ringkasan"); // find
    const unggulan = document.querySelector("#produk-unggulan"); // map

    // Halaman lain tidak punya target, jadi berhenti
    if (!grid || !ringkasan || !unggulan) {
        return;
    }

    // forEach: cetak log tiap produk (aksi, bukan membuat array baru)
    produkUmkm.forEach((produk) => {
        console.log("Debug produk:", produk.nama, "stok:", produk.stok);
    });
    console.table(produkUmkm);

    // filter: ambil produk yang stoknya ada
    const produkTersedia = produkUmkm.filter((produk) => produk.stok > 0);
    // find: ambil satu produk unggulan pertama
    const produkUnggulan = produkUmkm.find((produk) => produk.unggulan === true);
    // map: ubah tiap produk jadi HTML, lalu gabung jadi satu string
    const markupProduk = produkTersedia.map(buatKartuProduk).join("");

    grid.innerHTML = markupProduk;
    ringkasan.textContent = `${produkTersedia.length} produk tersedia dari ${produkUmkm.length} data.`;
    unggulan.textContent = produkUnggulan
        ? `Produk unggulan: ${produkUnggulan.nama}`
        : "Belum ada produk unggulan.";
}

document.addEventListener("DOMContentLoaded", renderProduk);