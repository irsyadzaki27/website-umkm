// Mengambil tombol promo dari halaman
const promoButton = document.querySelector("#promoButton");

// Mengecek apakah tombol promo tersedia
if (promoButton) {

    // Menjalankan kode ketika tombol promo diklik
    promoButton.addEventListener("click", () => {

        // Mengubah tulisan tombol setelah diklik
        promoButton.textContent = "promo beli 1 gratis 1!";

        // Menampilkan pesan di console
        console.log("promo kopi nusa berhasil ditampilkan.");
    });
}


// ================================
// PREVIEW FORM KONTAK
// ================================

// Mengambil form kontak
const formKontak = document.querySelector("form");

// Mengambil tempat untuk menampilkan preview
const previewForm = document.querySelector("#previewForm");

// Mengecek apakah form tersedia
if (formKontak && previewForm) {

    // Menjalankan kode ketika form dikirim
    formKontak.addEventListener("submit", (event) => {

        // Mencegah halaman melakukan refresh
        event.preventDefault();

        // Mengambil data nama dari form
        const nama = document.querySelector("#nama").value;

        // Mengambil data email dari form
        const email = document.querySelector("#email").value;

        // Mengambil data WhatsApp dari form
        const whatsapp = document.querySelector("#whatsapp").value;

        // Mengambil pilihan waktu yang dipilih
        const waktu = document.querySelector(
            "input[name='waktu']:checked"
        ).value;

        // Mengambil isi pesan
        const pesan = document.querySelector("#pesan").value;

        // Menampilkan data form sebagai preview
        previewForm.innerHTML = `
            <h2>Preview Pesan</h2>

            <p>
                <strong>Nama:</strong>
                ${nama}
            </p>

            <p>
                <strong>Email:</strong>
                ${email}
            </p>

            <p>
                <strong>WhatsApp:</strong>
                ${whatsapp}
            </p>

            <p>
                <strong>Waktu yang nyaman:</strong>
                ${waktu}
            </p>

            <p>
                <strong>Pesan:</strong>
                ${pesan}
            </p>
        `;
    });
}