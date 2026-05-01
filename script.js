// ===== LOGIN =====
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", function(e) {
    e.preventDefault();

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    let user = dataPengguna.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

if (user) {
  alert("Login berhasil!");

  // simpan data user
  localStorage.setItem("userLogin", JSON.stringify(user));

  window.location.href = "dashboard.html";
}
  });
}

// ===== MODAL =====
function openModal(id) {
  document.getElementById(id).style.display = "flex";
}

function closeModal(id) {
  document.getElementById(id).style.display = "none";
}

function kirimReset() {
  let email = document.getElementById("lupaEmail").value;

  if (email === "") {
    alert("Email harus diisi!");
    return;
  }

  let user = dataPengguna.find(u => u.email === email);

  if (user) {
    alert("Link reset password sudah dikirim ke email!");
    closeModal("lupaModal");
  } else {
    alert("Email tidak ditemukan!");
  }
}

function daftarUser() {
  let nama = document.getElementById("regNama").value;
  let email = document.getElementById("regEmail").value;
  let password = document.getElementById("regPassword").value;

  if (nama === "" || email === "" || password === "") {
    alert("Semua data harus diisi!");
    return;
  }

  let cek = dataPengguna.find(u => u.email === email);

  if (cek) {
    alert("Email sudah terdaftar!");
    return;
  }

  let userBaru = {
    id: dataPengguna.length + 1,
    nama: nama,
    email: email,
    password: password,
    role: "User",
    lokasi: "-"
  };

  dataPengguna.push(userBaru);

  alert("Pendaftaran berhasil!");

  closeModal("daftarModal");

  // reset input
  document.getElementById("regNama").value = "";
  document.getElementById("regEmail").value = "";
  document.getElementById("regPassword").value = "";
}

// ===== GREETING DASHBOARD =====
window.addEventListener("load", function() {
  let greeting = document.getElementById("greeting");
  let lokasiText = document.getElementById("lokasiUser");

  if (!greeting) return;

  let jam = new Date().getHours();

  let salam = "";

  if (jam >= 5 && jam < 12) {
    salam = "Selamat Pagi";
  } else if (jam >= 12 && jam < 15) {
    salam = "Selamat Siang";
  } else if (jam >= 15 && jam < 18) {
    salam = "Selamat Sore";
  } else {
    salam = "Selamat Malam";
  }

  let user = JSON.parse(localStorage.getItem("userLogin"));

  if (user) {
    greeting.innerText = `${salam}, ${user.nama} 👋`;

    if (lokasiText) {
      lokasiText.innerText = `📍 ${user.lokasi}`;
    }

  } else {
    greeting.innerText = salam;
  }
});

// ===== TRACKING =====
function cariTracking() {
  let noDO = document.getElementById("noDO").value;

  if (noDO === "") {
    alert("Nomor DO harus diisi!");
    return;
  }

  let data = dataTracking[noDO];
  let hasil = document.getElementById("hasilTracking");

  if (!data) {
    hasil.innerHTML = "<p style='color:red;'>Data tidak ditemukan!</p>";
    return;
  }

  let perjalananHTML = "";

  data.perjalanan.forEach(p => {
    perjalananHTML += `<li>${p.waktu} - ${p.keterangan}</li>`;
  });

  hasil.innerHTML = `
    <div class="card">
      <p><strong>Nama:</strong> ${data.nama}</p>
      <p class="status"><strong>Status:</strong> ${data.status}</p>
      <p><strong>Ekspedisi:</strong> ${data.ekspedisi}</p>
      <p><strong>Tanggal Kirim:</strong> ${data.tanggalKirim}</p>
      <p><strong>Paket:</strong> ${data.paket}</p>
      <p><strong>Total:</strong> ${data.total}</p>

      <h4>Riwayat Perjalanan:</h4>
      <ul class="timeline">
        ${perjalananHTML}
      </ul>
    </div>
  `;
}

// ===== STOK =====
function tampilkanStok() {
  let tbody = document.querySelector("#tabelStok tbody");

  if (!tbody) return;

  tbody.innerHTML = "";

  dataBahanAjar.forEach(item => {
    tbody.innerHTML += `
      <tr>
        <td>${item.kodeBarang}</td>
        <td>
        <img src="${item.gambar}" width="40" 
            style="cursor:pointer;"
            onclick="previewGambar('${item.gambar}')">
        </td>
        <td>${item.namaBarang}</td>
        <td>${item.jenisBarang}</td>
        <td>${item.stok}</td>
      </tr>
    `;
  });
}

function tambahStok() {
  let nama = document.getElementById("namaBarang").value;
  let stok = document.getElementById("stok").value;

  if (nama === "" || stok === "") {
    alert("Data harus diisi!");
    return;
  }

  let dataBaru = {
    kodeBarang: "NEW",
    namaBarang: nama,
    jenisBarang: "BMP",
    stok: stok
  };

  dataBahanAjar.push(dataBaru);

  tampilkanStok();

  document.getElementById("namaBarang").value = "";
  document.getElementById("stok").value = "";
}

function previewGambar(src) {
  let modal = document.getElementById("imgModal");
  modal.style.display = "flex"; // HARUS flex
  document.getElementById("previewImg").src = src;
}

function closeImage() {
  document.getElementById("imgModal").style.display = "none";
}

window.onclick = function(event) {
  let modal = document.getElementById("imgModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

function logout() {
  localStorage.removeItem("userLogin");
  window.location.href = "login.html";
}

function cekLogin() {
  let user = localStorage.getItem("userLogin");

  if (!user) {
    alert("Silakan login terlebih dahulu!");
    window.location.href = "login.html";
  }
}

function filterStok() {
  let keyword = document.getElementById("searchStok").value.toLowerCase();
  let rows = document.querySelectorAll("#tabelStok tbody tr");

  rows.forEach(row => {
    let nama = row.children[2].innerText.toLowerCase();

    if (nama.includes(keyword)) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}

// auto load stok kalau ada tabel
window.addEventListener("load", function() {
  tampilkanStok();
});

window.addEventListener("load", function() {
  let stok = dataBahanAjar.length;
  let kirim = Object.keys(dataTracking).length;

  document.querySelectorAll(".card-box")[0].innerHTML =
    `📦 Total Stok<br><strong>${stok}</strong>`;

  document.querySelectorAll(".card-box")[1].innerHTML =
    `🚚 Pengiriman<br><strong>${kirim}</strong>`;
});

function animateNumber(el, target) {
  let count = 0;
  let interval = setInterval(() => {
    count += Math.ceil(target / 20);
    if (count >= target) {
      count = target;
      clearInterval(interval);
    }
    el.innerText = count;
  }, 30);
}

function tampilkanLaporan() {
  let container = document.getElementById("progressDO");
  let rekap = document.getElementById("rekapTable");

  if (!container) return;

  container.innerHTML = "";

  for (let key in dataTracking) {
    let item = dataTracking[key];

    container.innerHTML += `
      <div class="card">
        <p><strong>${item.nama}</strong></p>
        <p>Status: ${item.status}</p>
      </div>
    `;
  }

  // Rekap stok
  rekap.innerHTML = "";

  dataBahanAjar.forEach(item => {
    rekap.innerHTML += `
      <tr>
        <td>${item.namaBarang}</td>
        <td>${item.stok}</td>
      </tr>
    `;
  });
}

function tampilkanHistori() {
  let tbody = document.getElementById("historiTable");

  if (!tbody) return;

  tbody.innerHTML = "";

  for (let key in dataTracking) {
    let item = dataTracking[key];

    tbody.innerHTML += `
      <tr>
        <td>${item.nama}</td>
        <td>${item.tanggalKirim}</td>
        <td>${item.total}</td>
      </tr>
    `;
  }
}

function tampilkanChart() {
  let nama = [];
  let stok = [];

  dataBahanAjar.forEach(item => {
    nama.push(item.namaBarang);
    stok.push(item.stok);
  });

  let ctx = document.getElementById("chartRekap");

  if (!ctx) return;

  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: nama,
      datasets: [{
        label: 'Jumlah Stok',
        data: stok
      }]
    },
    options: {
      responsive: true,
    }
  });
}

function togglePassword() {
  let pass = document.getElementById("password");
  let icon = document.querySelector(".toggle-pass");

  if (pass.type === "password") {
    pass.type = "text";
    icon.innerText = "🙈";
  } else {
    pass.type = "password";
    icon.innerText = "👁️";
  }
}