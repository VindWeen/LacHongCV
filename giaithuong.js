// === QUẢN LÝ GIẢI THƯỞNG ===

// Đảm bảo có user
if (!localStorage.getItem('loggedInUser')) {
  localStorage.setItem('loggedInUser', 'guest');
}

// Khai báo biến lưu Base64
let ghiChuBase64 = "";

// ✅ Lấy các nút & input
const btnUpload = document.getElementById('btnUpload');
const fileInput = document.getElementById('fileInput');
const fileNameSpan = document.getElementById('fileName');

// ✅ Gán sự kiện chọn file ở NGOÀI submit
btnUpload.addEventListener('click', () => {
  fileInput.click();
});

fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      ghiChuBase64 = e.target.result;
      fileNameSpan.textContent = file.name;
    };
    reader.readAsDataURL(file);
  }
});

// ✅ Sự kiện submit form
document.getElementById('awardForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const form = e.target;

  const newAward = {
    awardId: Date.now(),
    title: form.elements['tenDeTai'].value.trim(),
    tenCuocThi: form.elements['tenCuocThi'].value.trim(),
    tacGia: form.elements['tacGia'].value.trim(),
    diaChi: form.elements['donVi'].value.trim(),
    datGiai: form.elements['datGiai'].value.trim(),
    tien: form.elements['tien'].value.trim(),
    minhChung: ghiChuBase64 ? [ghiChuBase64] : [], // 🟢 Ảnh Base64
    link: form.elements['link'].value.trim(),
    status: 'pending',
    user: localStorage.getItem('loggedInUser')
  };

  // Lưu user riêng
  let users = JSON.parse(localStorage.getItem('users')) || {};
  const viewingUser = newAward.user;
  if (!users[viewingUser]) {
    users[viewingUser] = { awards: [] };
  }
  users[viewingUser].awards.push(newAward);
  localStorage.setItem('users', JSON.stringify(users));

  // Lưu global
  let globalAwards = JSON.parse(localStorage.getItem('awards')) || [];
  globalAwards.push(newAward);
  localStorage.setItem('awards', JSON.stringify(globalAwards));

  alert('Đã lưu giải thưởng!');

  form.reset();
  fileInput.value = "";
  fileNameSpan.textContent = "Chưa chọn file";
  ghiChuBase64 = "";

  renderAwardTable();
  renderApprovedAwards();
});

// Bảng chờ xét duyệt
function renderAwardTable() {
  const viewingUser = localStorage.getItem('loggedInUser');
  const users = JSON.parse(localStorage.getItem('users')) || {};
  const awards = (users[viewingUser] && users[viewingUser].awards) || [];

  const tbody = document.getElementById('awardTableBody');
  tbody.innerHTML = '';

  awards.filter(a => a.status === 'pending').forEach((award, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${award.title}</td>
      <td>${award.tenCuocThi}</td>
      <td>${award.tacGia}</td>
      <td>${award.diaChi}</td>
      <td>${award.datGiai}</td>
      <td>${award.tien}</td>
      <td>${(award.minhChung && award.minhChung.length) ? `<img src="${award.minhChung[0]}" alt="Minh chứng" width="50">` : 'Không có'}</td>

      <td><a href="${award.link}" target="_blank">Link</a></td>
      <td>${award.status}</td>
      <td><button onclick="deleteAward(${award.awardId})">Xóa</button></td>
    `;
    tbody.appendChild(tr);
  });
}

// Bảng đã duyệt
function renderApprovedAwards() {
  const awards = JSON.parse(localStorage.getItem('awards')) || [];
  const approved = awards.filter(a => a.status === 'approved');

  const tbody = document.getElementById('awardApprovedTableBody');
  tbody.innerHTML = '';

  approved.forEach((award, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${award.title}</td>
      <td>${award.tenCuocThi}</td>
      <td>${award.tacGia}</td>
      <td>${award.diaChi}</td>
      <td>${award.datGiai}</td>
      <td>${award.tien}</td>
      <td>${(award.minhChung && award.minhChung.length) ? `<img src="${award.minhChung[0]}" alt="Minh chứng" width="50">` : 'Không có'}</td>

      <td><a href="${award.link}" target="_blank">Link</a></td>
      <td>${award.status}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Xóa
function deleteAward(id) {
  let users = JSON.parse(localStorage.getItem('users')) || {};
  let global = JSON.parse(localStorage.getItem('awards')) || [];
  const viewingUser = localStorage.getItem('loggedInUser');

  if (users[viewingUser]) {
    users[viewingUser].awards = users[viewingUser].awards.filter(a => a.awardId != id);
  }
  global = global.filter(a => a.awardId != id);

  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('awards', JSON.stringify(global));

  alert('Đã xóa!');
  renderAwardTable();
  renderApprovedAwards();
}
renderAwardTable();
renderApprovedAwards();
// Render ngay khi tải trang
window.addEventListener('load', () => {
  renderAwardTable();
  renderApprovedAwards();
});
