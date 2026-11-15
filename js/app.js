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

// Target DOM (null kalau halamannya bukan produk.html)
const produkGrid = document.querySelector("#produk-dinamis");
const produkStatus = document.querySelector("#produk-ringkasan");
const produkUnggulan = document.querySelector("#produk-unggulan");
const tombolFilter = document.querySelectorAll("[data-filter]");
const tombolStok = document.querySelectorAll("[data-stok]");

// State filter yang sedang dipilih
let kategoriAktif = "Semua";
let stokAktif = "Semua";

// Buat satu kartu produk sebagai elemen DOM
// Input: produk (object), output: elemen <article>
function buatElemenProduk(produk) {
    const status = statusStok(produk.stok);

    const card = document.createElement("article");
    card.classList.add("js-product-card");

    // Badge unggulan hanya untuk produk unggulan
    if (produk.unggulan) {
        const badge = document.createElement("span");
        badge.classList.add("product-badge");
        badge.textContent = "Produk unggulan";
        card.append(badge);
    }

    const title = document.createElement("h3");
    title.textContent = produk.nama;

    const kategori = document.createElement("p");
    kategori.classList.add("category-note");
    kategori.textContent = labelKategori(produk.kategori);

    const deskripsi = document.createElement("p");
    deskripsi.textContent = produk.deskripsi;

    const harga = document.createElement("p");
    harga.classList.add("price");
    harga.textContent = formatRupiah(produk.harga);

    const stok = document.createElement("span");
    stok.classList.add("stock-badge");
    if (status.className) {
        stok.classList.add(status.className);
    }
    stok.textContent = status.label;

    const aksi = document.createElement("p");
    aksi.textContent = produk.stok > 0 ? "Siap dipesan" : "Hubungi admin";

    card.append(title, kategori, deskripsi, harga, stok, aksi);

    // Latihan remove(): tombol sementara, hapus setelah evidence diambil
    const tombolSembunyikan = document.createElement("button");
    tombolSembunyikan.type = "button";
    tombolSembunyikan.textContent = "Sembunyikan";
    tombolSembunyikan.classList.add("ghost-button");

    tombolSembunyikan.addEventListener("click", () => {
        card.remove();
        produkStatus.textContent = "Satu kartu disembunyikan dari tampilan sementara.";
    });

    card.append(tombolSembunyikan);
    return card;
}

// Buat pesan kalau hasil filter kosong (tidak ada produk)
function buatEmptyState(kategori, stok) {
    const empty = document.createElement("p");
    empty.classList.add("empty-state");
    empty.textContent = stok === "Semua"
        ? `Belum ada produk pada kategori ${kategori}.`
        : `Belum ada produk ${stok} pada kategori ${kategori}.`;
    return empty;
}

// Gambar ulang daftar produk sesuai kategori dan stok yang aktif
function renderProduk() {
    // Halaman lain tidak punya target, jadi berhenti
    if (!produkGrid || !produkStatus) {
        return;
    }

    // Dua filter digabung: kategori dulu, lalu stok (memakai statusStok dari P10)
    const produkTampil = produkUmkm
        .filter((produk) => kategoriAktif === "Semua" || produk.kategori === kategoriAktif)
        .filter((produk) => stokAktif === "Semua" || statusStok(produk.stok).label === stokAktif);
        
    console.log("Render kategori:", kategoriAktif, "|stok:", stokAktif);
    console.table(produkTampil);

    // Kosongkan dulu supaya kartu tidak dobel
    produkGrid.replaceChildren();

    // Challenge: penghitung filter aktif, tetap benar saat hasil kosong
    const namaKategori = kategoriAktif === "Semua" ? "Semua kategori" : `Kategori ${kategoriAktif}`;
    const namaStok = stokAktif === "Semua" ? "" : `, status ${stokAktif}`;
    produkStatus.textContent = `${namaKategori}${namaStok} menampilkan ${produkTampil.length} produk dari ${produkUmkm.length} total produk.`;

    if (produkTampil.length === 0) {
        produkGrid.append(buatEmptyState(kategoriAktif, stokAktif));
        return;
    }

    produkTampil.forEach((produk) => {
        produkGrid.append(buatElemenProduk(produk));
    });
}

// Tampilkan satu produk unggulan (find)
function tampilkanUnggulan() {
    if (!produkUnggulan) {
        return;
    }

    const unggulan = produkUmkm.find((produk) => produk.unggulan === true);
    produkUnggulan.textContent = unggulan
        ? `Produk unggulan: ${unggulan.nama}`
        : "Belum ada produk unggulan.";
}

// Pindahkan tanda aktif ke satu tombol dalam satu kelompok
function setTombolAktif(kelompok, tombolAktif) {
    kelompok.forEach((item) => {
        item.classList.remove("is-active");
        item.setAttribute("aria-pressed", "false");
    });
    tombolAktif.classList.add("is-active");
    tombolAktif.setAttribute("aria-pressed", "true");
}

// Klik tombol kategori
tombolFilter.forEach((tombol) => {
    tombol.addEventListener("click", (event) => {
        const tombolAktif = event.currentTarget;
        kategoriAktif = tombolAktif.dataset.filter;
        setTombolAktif(tombolFilter, tombolAktif);
        renderProduk();
    });
});

// Klik tombol stok (Pengayaan)
tombolStok.forEach((tombol) => {
    tombol.addEventListener("click", (event) => {
        const tombolAktif = event.currentTarget;
        stokAktif = tombolAktif.dataset.stok;
        setTombolAktif(tombolStok, tombolAktif);
        renderProduk();
    });
});

// Tampilan awal
renderProduk();
tampilkanUnggulan();