// =========================================
// P12: validasi form kontak + preferensi lokal
// =========================================

// ---------- 1. Ambil elemen ----------
const form = document.querySelector("#form-kontak");
const preview = document.querySelector("#preview-form");
const formFeedback = document.querySelector("#form-feedback");

// Field tunggal (punya id yang sama dengan id pesan error: #id-error)
const fields = ["nama", "email", "whatsapp", "paket", "pesan", "setuju"].map((id) => document.querySelector(`#${id}`));

// Kelompok radio dicek per nama grup
const kelompokRadio = ["topik", "waktu"];

const TEKS_PREVIEW_AWAL = "Data form akan muncul setelah semua bagian valid.";

// ---------- 2. Pesan error per field ----------
const pesanError = {
    nama: {
        valueMissing: "Nama lengkap wajib diisi.",
        tooShort: "Nama minimal 3 karakter.",
    },
    email: {
        valueMissing: "Email wajib diisi.",
        typeMismatch: "Format email belum benar. Contoh: nama@email.com.",
    },
    whatsapp: {
        valueMissing: "Nomor WhatsApp wajib diisi.",
        patternMismatch: "Nomor harus diawali 08 dan terdiri dari 10-13 digit angka, tanpa spasi.",
    },
    paket: {
        valueMissing: "Pilih salah satu paket.",
    },
    topik: {
        valueMissing: "Pilih salah satu topik pertanyaan.",
    },
    waktu: {
        valueMissing: "Pilih waktu yang nyaman untuk dihubungi.",
    },
    pesan: {
        valueMissing: "Pesan wajib diisi.",
        tooShort: "Pesan minimal 20 karakter.",
    },
    setuju: {
        valueMissing: "Centang persetujuan untuk melanjutkan.",
    },
};

// Cari pesan error dari validity. Spasi saja dianggap kosong.
function getFieldError(field) {
    const pesan = pesanError[field.name] || {};
    const validity = field.validity;
    const nilai = field.value.trim();
    const kosong = field.type !== "checkbox" && nilai === "";

    if (validity.valueMissing || (field.required && kosong)) {
        return pesan.valueMissing ?? "Bagian ini wajib diisi.";
    }
    if (validity.typeMismatch) {
        return pesan.typeMismatch ?? "Format data belum sesuai.";
    }
    if (validity.tooShort || (field.minLength > 0 && nilai.length < field.minLength)) {
        return pesan.tooShort ?? `Isi minimal ${field.minLength} karakter.`;
    }
    if (validity.patternMismatch) {
        return pesan.patternMismatch ?? "Format belum sesuai contoh yang diminta.";
    }

    return "";
}

// ---------- 3. Tampilkan / hapus error ----------
// elemen boleh satu input atau array input (untuk grup radio)
function tampilkanError(elemen, idError, pesan) {
    const daftar = Array.isArray(elemen) ? elemen : [elemen];

    daftar.forEach((item) => {
        // Pesan kosong menghapus error custom lama
        item.setCustomValidity(pesan);
        item.setAttribute("aria-invalid", pesan ? "true" : "false");
    });

    const error = document.querySelector(`#${idError}`);
    if (error) {
        error.textContent = pesan;
    }
}

function validasiField(field) {
    // Kosongkan dulu supaya hasil dihitung dari constraint HTML yang asli
    field.setCustomValidity("");
    const pesan = getFieldError(field);
    tampilkanError(field, `${field.id}-error`, pesan);
    return pesan === "";
}

function validasiRadio(nama) {
    const radios = Array.from(form.querySelectorAll(`input[name="${nama}"]`));
    radios.forEach((radio) => radio.setCustomValidity(""));

    const adaYangDipilih = radios.some((radio) => radio.checked);
    const pesan = adaYangDipilih ? "" : pesanError[nama].valueMissing;
    tampilkanError(radios, `${nama}-error`, pesan);
    return pesan === "";
}

// map (bukan every) supaya semua error tampil sekaligus, tidak berhenti di yang pertama
function validasiSemua() {
    const hasil = [...fields.map(validasiField), ...kelompokRadio.map(validasiRadio)];
    return hasil.every(Boolean);
}

// ---------- 4. Preview (hanya saat data valid) ----------
function tampilkanPreview() {
    const data = new FormData(form);

    preview.textContent = [
        `Nama: ${data.get("nama")}`,
        `Email: ${data.get("email")}`,
        `WhatsApp: ${data.get("whatsapp")}`,
        `Paket: ${data.get("paket")}`,
        `Topik: ${data.get("topik")}`,
        `Waktu dihubungi: ${data.get("waktu")}`,
        `Pesan: ${data.get("pesan")}`,
    ].join("\n");

    formFeedback.textContent = "Form valid. Preview berhasil dibuat.";
    formFeedback.classList.add("success");
}

// ---------- 5. Event submit + focus management ----------
if (form) {
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const semuaValid = validasiSemua();

        if (!semuaValid || !form.checkValidity()) {
            formFeedback.textContent = "Periksa kembali bagian yang ditandai.";
            formFeedback.classList.remove("success");
            preview.textContent = TEKS_PREVIEW_AWAL;

            form.reportValidity();

            // Fokus ke kontrol invalid pertama. Selector sengaja menyebut tipe kontrol,
            // karena <fieldset> dan <form> juga bisa cocok dengan :invalid tetapi tidak bisa difokuskan.
            form.querySelector("input:invalid, select:invalid, textarea:invalid")?.focus();
            return;
        }

        tampilkanPreview();
    });

    // Umpan balik saat mengisi: fokus tidak dipindah, hanya pesan yang diperbarui
    fields.forEach((field) => {
        // Saat meninggalkan field yang sudah diisi, cek langsung
        field.addEventListener("blur", () => {
            if (field.value !== "" || field.getAttribute("aria-invalid") === "true") {
                validasiField(field);
            }
        });

        // Field yang sedang ditandai salah dicek ulang tiap perubahan, supaya error hilang saat sudah benar
        field.addEventListener("input", () => {
            if (field.getAttribute("aria-invalid") === "true") {
                validasiField(field);
            }
        });
    });

    kelompokRadio.forEach((nama) => {
        form.querySelectorAll(`input[name="${nama}"]`).forEach((radio) => {
            radio.addEventListener("change", () => validasiRadio(nama));
        });
    });
}

// =========================================
// Preferensi lokal (localStorage + JSON)
// =========================================
const STORAGE_KEY = "kopi-nusa-preferensi-kontak";

const channelInputs = document.querySelectorAll("[data-channel]");
const statusPreferensi = document.querySelector("#status-preferensi");
const tombolSimpan = document.querySelector("#simpan-preferensi");
const tombolHapus = document.querySelector("#hapus-preferensi");

function setStatusPreferensi(teks) {
    if (statusPreferensi) {
        statusPreferensi.textContent = teks;
    }
}

function simpanPreferensi() {
    const data = new FormData(form);

    // Object ini yang diubah menjadi string JSON
    const preferensi = {
        paket: data.get("paket") || "",
        topik: data.get("topik") || "",
        channel: Array.from(channelInputs)
            .filter((input) => input.checked)
            .map((input) => input.value),
        updatedAt: new Date().toISOString(),
    };

    if (!preferensi.paket && !preferensi.topik && preferensi.channel.length === 0) {
        setStatusPreferensi("Belum ada yang dipilih. Pilih paket, topik, atau channel kontak dulu.");
        return;
    }

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(preferensi));
        setStatusPreferensi("Preferensi tersimpan di browser ini.");
    } catch (error) {
        // Storage bisa diblokir (mode privat) atau penuh
        console.warn("Preferensi tidak bisa disimpan.", error);
        setStatusPreferensi("Preferensi tidak bisa disimpan di browser ini.");
    }
}

function muatPreferensi() {
    try {
        const tersimpan = localStorage.getItem(STORAGE_KEY);
        if (!tersimpan) return;

        const preferensi = JSON.parse(tersimpan);

        // JSON valid belum tentu bentuknya benar (mis. angka atau array)
        if (typeof preferensi !== "object" || preferensi === null || Array.isArray(preferensi)) {
            throw new Error("Bentuk data preferensi tidak sesuai.");
        }

        const selectPaket = document.querySelector("#paket");
        selectPaket.value = preferensi.paket ?? "";

        // Cocokkan nilai lewat perulangan, bukan lewat selector, supaya nilai aneh tidak merusak query
        Array.from(form.querySelectorAll('input[name="topik"]')).forEach((radio) => {
            radio.checked = radio.value === preferensi.topik;
        });

        const channelTersimpan = Array.isArray(preferensi.channel) ? preferensi.channel : [];
        channelInputs.forEach((input) => {
            input.checked = channelTersimpan.includes(input.value);
        });

        setStatusPreferensi("Preferensi sebelumnya dimuat dari browser ini.");
    } catch (error) {
        console.warn("Preferensi tidak valid.", error);
        localStorage.removeItem(STORAGE_KEY);
        setStatusPreferensi("Data preferensi lama rusak, sudah dibersihkan.");
    }
}

function hapusPreferensi() {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.warn("Preferensi tidak bisa dihapus.", error);
    }

    // Kosongkan juga pilihan yang tadi diambil dari preferensi
    document.querySelector("#paket").value = "";
    form.querySelectorAll('input[name="topik"]').forEach((radio) => {
        radio.checked = false;
    });
    channelInputs.forEach((input) => {
        input.checked = false;
    });

    setStatusPreferensi("Preferensi dihapus. Pilihan paket, topik, dan channel dikosongkan.");
}

if (form) {
    tombolSimpan?.addEventListener("click", simpanPreferensi);
    tombolHapus?.addEventListener("click", hapusPreferensi);
    muatPreferensi();
}