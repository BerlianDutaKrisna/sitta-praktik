function getUserData() {
    if (typeof dataPengguna !== "undefined" && Array.isArray(dataPengguna)) {
        return dataPengguna;
    }
    return [
        { email: "admin@ut.ac.id", password: "admin123", nama: "Admin SITTA" }
    ];
}

function login() {
    var emailInput = document.getElementById("email");
    var passwordInput = document.getElementById("password");
    var email = emailInput ? emailInput.value.trim() : "";
    var password = passwordInput ? passwordInput.value.trim() : "";

    var pengguna = getUserData();
    var akun = pengguna.find(function (item) {
        return item.email === email && item.password === password;
    });

    if (akun) {
        localStorage.setItem("userLogin", akun.email);
        localStorage.setItem("namaUserLogin", akun.nama || akun.email);
        window.location.href = "dashboard.html";
        return;
    }

    alert("email/password yang anda masukkan salah");
}

function loadUser() {
    var userLogin = localStorage.getItem("userLogin");
    var namaUserLogin = localStorage.getItem("namaUserLogin");

    if (!userLogin) {
        window.location.href = "login.html";
        return;
    }

    var target = document.getElementById("userLogin");
    if (target) {
        target.textContent = namaUserLogin || userLogin;
    }
}

function logout() {
    localStorage.removeItem("userLogin");
    localStorage.removeItem("namaUserLogin");
    window.location.href = "login.html";
}

function openModal(type) {
    var modal = document.getElementById("modal");
    var text = document.getElementById("modalText");
    if (!modal || !text) {
        return;
    }

    modal.style.display = "block";
    if (type === "lupa") {
        text.textContent = "Fitur lupa password akan segera tersedia.";
    } else {
        text.textContent = "Fitur pendaftaran akan segera tersedia.";
    }
}

function closeModal() {
    var modal = document.getElementById("modal");
    if (modal) {
        modal.style.display = "none";
    }
}

window.onclick = function (event) {
    var modal = document.getElementById("modal");
    if (modal && event.target === modal) {
        modal.style.display = "none";
    }
};

function getGreetingByTime() {
    var hour = new Date().getHours();
    if (hour < 11) {
        return "Selamat pagi";
    }
    if (hour < 15) {
        return "Selamat siang";
    }
    if (hour < 18) {
        return "Selamat sore";
    }
    return "Selamat malam";
}

function initDashboard() {
    loadUser();
    var target = document.getElementById("greetingText");
    if (target) {
        var nama = localStorage.getItem("namaUserLogin") || "Pengguna";
        target.textContent = getGreetingByTime() + ", " + nama;
    }
}

function getStatusDetail(status) {
    var lower = String(status || "").toLowerCase();
    if (lower === "dikirim") {
        return { progress: 45, className: "status-dikirim" };
    }
    if (lower === "dalam perjalanan") {
        return { progress: 75, className: "status-perjalanan" };
    }
    return { progress: 100, className: "status-selesai" };
}

function cariTracking() {
    var input = document.getElementById("nomorDO");
    var hasil = document.getElementById("hasilTracking");
    if (!input || !hasil || typeof dataTracking === "undefined") {
        return;
    }

    var nomorDO = input.value.trim();
    var data = dataTracking[nomorDO];

    if (!data) {
        alert("Nomor Delivery Order tidak ditemukan.");
        hasil.style.display = "none";
        return;
    }

    document.getElementById("namaMahasiswa").textContent = data.nama;

    var statusChip = document.getElementById("statusPengiriman");
    var statusDetail = getStatusDetail(data.status);
    statusChip.textContent = data.status;
    statusChip.className = "status-chip " + statusDetail.className;

    var progress = document.getElementById("progressValue");
    progress.style.width = statusDetail.progress + "%";

    document.getElementById("detailEkspedisi").textContent = data.ekspedisi;
    document.getElementById("detailTanggal").textContent = data.tanggalKirim;
    document.getElementById("detailPaket").textContent = data.paket;
    document.getElementById("detailTotal").textContent = data.total;

    var riwayatBody = document.getElementById("riwayatPerjalanan");
    riwayatBody.innerHTML = "";
    data.perjalanan.forEach(function (item) {
        var row = document.createElement("tr");
        row.innerHTML = "<td>" + item.waktu + "</td><td>" + item.keterangan + "</td>";
        riwayatBody.appendChild(row);
    });

    hasil.style.display = "block";
}

function renderStokTable() {
    var tbody = document.getElementById("stokTableBody");
    if (!tbody || typeof dataBahanAjar === "undefined") {
        return;
    }

    tbody.innerHTML = "";
    dataBahanAjar.forEach(function (item) {
        var row = document.createElement("tr");
        row.innerHTML =
            "<td>" + item.kodeLokasi + "</td>" +
            "<td>" + item.kodeBarang + "</td>" +
            "<td>" + item.namaBarang + "</td>" +
            "<td>" + item.jenisBarang + "</td>" +
            "<td>" + item.edisi + "</td>" +
            "<td>" + item.stok + "</td>";
        tbody.appendChild(row);
    });
}

function initStokPage() {
    loadUser();
    renderStokTable();
}

function tambahStok() {
    if (typeof dataBahanAjar === "undefined") {
        return;
    }

    var kodeLokasi = document.getElementById("kodeLokasi").value.trim();
    var kodeBarang = document.getElementById("kodeBarang").value.trim();
    var namaBarang = document.getElementById("namaBarang").value.trim();
    var jenisBarang = document.getElementById("jenisBarang").value.trim();
    var edisi = document.getElementById("edisiBarang").value.trim();
    var stok = document.getElementById("jumlahStok").value.trim();

    if (!kodeLokasi || !kodeBarang || !namaBarang || !jenisBarang || !edisi || !stok) {
        alert("Semua input stok wajib diisi.");
        return;
    }

    dataBahanAjar.push({
        kodeLokasi: kodeLokasi,
        kodeBarang: kodeBarang,
        namaBarang: namaBarang,
        jenisBarang: jenisBarang,
        edisi: edisi,
        stok: Number(stok),
        cover: ""
    });

    renderStokTable();
    alert("Data stok baru berhasil ditambahkan.");

    document.getElementById("kodeLokasi").value = "";
    document.getElementById("kodeBarang").value = "";
    document.getElementById("namaBarang").value = "";
    document.getElementById("jenisBarang").value = "";
    document.getElementById("edisiBarang").value = "";
    document.getElementById("jumlahStok").value = "";
}