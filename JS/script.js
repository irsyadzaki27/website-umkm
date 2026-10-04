// ================================
// TOMBOL PROMO
// ================================

// Mengambil tombol promo dari halaman
const promoButton = document.querySelector("#promoButton");

// Mengecek apakah tombol promo tersedia
if (promoButton) {

    promoButton.addEventListener("click", () => {

        // Mengubah tulisan tombol ketika diklik
        promoButton.textContent = "Promo Beli 1 Gratis 1!";

        // Menampilkan informasi di console
        console.log("Promo Kopi Nusa berhasil ditampilkan.");

    });
}


// ================================
// PREVIEW FORM KONTAK
// ================================

// Mengambil form kontak
const formKontak = document.querySelector("#form-kontak");

// Mengambil tempat untuk menampilkan preview
const previewForm = document.querySelector("#previewForm");


// Mengecek apakah form dan preview tersedia
if (formKontak && previewForm) {

    // Menjalankan kode ketika form dikirim
    formKontak.addEventListener("submit", (event) => {

        // Mencegah halaman melakukan reload
        event.preventDefault();


        // ================================
        // MENGAMBIL DATA FORM
        // ================================

        const nama =
            document.querySelector("#nama").value;

        const email =
            document.querySelector("#email").value;

        const whatsapp =
            document.querySelector("#whatsapp").value;

        const paket =
            document.querySelector("#paket").value;

        const topik =
            document.querySelector(
                "input[name='topik']:checked"
            ).value;

        const waktu =
            document.querySelector(
                "input[name='waktu']:checked"
            ).value;

        const pesan =
            document.querySelector("#pesan").value;


        // ================================
        // MENAMPILKAN PREVIEW
        // ================================

        previewForm.innerHTML = `

            <h2>
                Preview Pesan
            </h2>

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
                <strong>Paket:</strong>
                ${paket}
            </p>

            <p>
                <strong>Topik:</strong>
                ${topik}
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