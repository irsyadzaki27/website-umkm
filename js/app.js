"use strict";

console.log("P09 JavaScript aktif");

// Data produk Kopi Nusa (array of object)
const produkUmkm = [
    { nama: "Kopi Garwo Signature", kategori: "Minuman", harga: 20000, stok: 15, unggulan: true, deskripsi: "Kopi dengan cita rasa lembut dan cocok untuk menemani aktivitas." },
    { nama: "Americano Peach", kategori: "Minuman", harga: 22000, stok: 9, unggulan: false, deskripsi: "Minuman kopi dengan perpaduan rasa americano dan peach." },
    { nama: "Kopi Tubruk Signature", kategori: "Kopi", harga: 45000, stok: 12, unggulan: true, deskripsi: "Karakter cokelat dan kacang dengan body yang kuat." },
    { nama: "Cold Brew Aren", kategori: "Minuman", harga: 22000, stok: 4, unggulan: false, deskripsi: "Kopi dingin dengan rasa ringan dan manis aren seimbang." },
    { nama: "Paket Seduh Rumahan", kategori: "Bundling", harga: 75000, stok: 0, unggulan: false, deskripsi: "Kopi 250 gram, filter, dan panduan seduh untuk pemula." },
];

// Lihat data mentah di Console
console.table(produkUmkm);

// Format angka jadi rupiah
const formatRupiah = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
});

// Tes cepat di Console
console.log(formatRupiah.format(produkUmkm[0].harga));

// Tentukan status stok dari jumlah stok
function statusStok(stok) {
    if (stok === 0) {
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

// Tampilkan produk ke halaman
function renderProduk() {
    const grid = document.querySelector("#produk-dinamis");
    const ringkasan = document.querySelector("#produk-ringkasan");

    // Halaman lain tidak punya target, jadi berhenti
    if (!grid || !ringkasan) {
        return;
    }

    let jumlahTersedia = 0;
    let markup = "";

    for (const produk of produkUmkm) {
        const status = statusStok(produk.stok);
        const kategori = labelKategori(produk.kategori);
        const labelAksi = produk.stok > 0 ? "Siap dipesan" : "Hubungi admin";
        const badgeUnggulan = produk.unggulan
            ? '<span class="product-badge">Produk unggulan</span>'
            : "";

        if (produk.stok > 0) {
            jumlahTersedia = jumlahTersedia + 1;
        }

        markup = markup + `
            <article class="js-product-card">
                ${badgeUnggulan}
                <h3>${produk.nama}</h3>
                <p>${kategori}</p>
                <p>${produk.deskripsi}</p>
                <p class="price">${formatRupiah.format(produk.harga)}</p>
                <span class="stock-badge ${status.className}">${status.label}</span>
                <p>${labelAksi}</p>
            </article>
        `;
    }

    grid.innerHTML = markup;
    ringkasan.textContent = `${jumlahTersedia} produk tersedia dari ${produkUmkm.length} data.`;
}

document.addEventListener("DOMContentLoaded", renderProduk);