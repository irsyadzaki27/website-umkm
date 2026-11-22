// =========================================
// P12: newsletter ringan (ingat email terakhir)
// Dibungkus fungsi agar nama variabel tidak bentrok dengan js/form.js
// =========================================
(() => {
    const formNewsletter = document.querySelector("#form-newsletter");

    // Halaman lain tidak punya form newsletter
    if (!formNewsletter) return;

    const NEWSLETTER_KEY = "kopi-nusa-newsletter";

    const inputEmail = document.querySelector("#newsletter-email");
    const errorEmail = document.querySelector("#newsletter-email-error");
    const statusNewsletter = document.querySelector("#newsletter-status");
    const tombolHapusEmail = document.querySelector("#newsletter-hapus");

    function pesanEmail() {
        const nilai = inputEmail.value.trim();

        if (inputEmail.validity.valueMissing || nilai === "") {
            return "Email wajib diisi.";
        }
        if (inputEmail.validity.typeMismatch) {
            return "Format email belum benar. Contoh: nama@email.com.";
        }
        return "";
    }

    function tampilkanErrorEmail(pesan) {
        inputEmail.setCustomValidity(pesan);
        inputEmail.setAttribute("aria-invalid", pesan ? "true" : "false");
        errorEmail.textContent = pesan;
    }

    function validasiEmail() {
        inputEmail.setCustomValidity("");
        const pesan = pesanEmail();
        tampilkanErrorEmail(pesan);
        return pesan === "";
    }

    function simpanEmail(email) {
        const data = {
            email,
            subscribedAt: new Date().toISOString(),
        };

        try {
            localStorage.setItem(NEWSLETTER_KEY, JSON.stringify(data));
            statusNewsletter.textContent = `Terima kasih! ${email} tersimpan di browser ini (simulasi, belum dikirim ke server).`;
            statusNewsletter.classList.add("success");
        } catch (error) {
            console.warn("Email newsletter tidak bisa disimpan.", error);
            statusNewsletter.textContent = "Email tidak bisa disimpan di browser ini.";
            statusNewsletter.classList.remove("success");
        }
    }

    function muatEmail() {
        try {
            const tersimpan = localStorage.getItem(NEWSLETTER_KEY);
            if (!tersimpan) return;

            const data = JSON.parse(tersimpan);

            if (typeof data !== "object" || data === null || typeof data.email !== "string") {
                throw new Error("Bentuk data newsletter tidak sesuai.");
            }

            inputEmail.value = data.email;
            statusNewsletter.textContent = "Email terakhir dimuat dari browser ini.";
        } catch (error) {
            console.warn("Data newsletter tidak valid.", error);
            localStorage.removeItem(NEWSLETTER_KEY);
            statusNewsletter.textContent = "Data newsletter lama rusak, sudah dibersihkan.";
        }
    }

    function hapusEmail() {
        try {
            localStorage.removeItem(NEWSLETTER_KEY);
        } catch (error) {
            console.warn("Email newsletter tidak bisa dihapus.", error);
        }

        inputEmail.value = "";
        tampilkanErrorEmail("");
        statusNewsletter.textContent = "Email tersimpan dihapus.";
        statusNewsletter.classList.remove("success");
    }

    formNewsletter.addEventListener("submit", (event) => {
        event.preventDefault();
        statusNewsletter.classList.remove("success");

        if (!validasiEmail() || !formNewsletter.checkValidity()) {
            statusNewsletter.textContent = "Periksa kembali email Anda.";
            formNewsletter.reportValidity();
            inputEmail.focus();
            return;
        }

        simpanEmail(inputEmail.value.trim());
    });

    inputEmail.addEventListener("input", () => {
        if (inputEmail.getAttribute("aria-invalid") === "true") {
            validasiEmail();
        }
    });

    tombolHapusEmail.addEventListener("click", hapusEmail);

    muatEmail();
})();