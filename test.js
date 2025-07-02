// Lấy user hiện tại
const urlParams = new URLSearchParams(window.location.search);
const viewingUser = urlParams.get('user') || localStorage.getItem('loggedInUser');

if (!viewingUser) {
  alert('Không xác định được người dùng!');
}

const users = JSON.parse(localStorage.getItem('users')) || {};
if (!users[viewingUser]) {
  users[viewingUser] = {
    role: 'client',
    info: {},
    posts: [],
    awards: []
  };
}

// Phần Thông tin cá nhân
const infoForm = document.getElementById('infoForm');
const btnSave = document.getElementById('btnSave');
const profileName = document.getElementById('profileName');
const profileEmail = document.getElementById('profileEmail');
const infoTableContainer = document.getElementById('infoTableContainer');

function renderInfoTable(data) {
  const fieldLabels = {
    fullName: 'Họ và tên',
    dob: 'Ngày sinh',
    gender: 'Giới tính',
    cccd: 'Số CCCD',
    email: 'Email',
    phone: 'Số điện thoại'
  };

  let html = '<table class="info-table">';
  for (const key in fieldLabels) {
    const label = fieldLabels[key];
    let value = data[key] || '';
    if (key === 'dob' && value) {
      const d = new Date(value);
      value = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
    }
    html += `<tr><td><b>${label}</b></td><td>${value}</td></tr>`;
  }
  html += '</table>';
  infoTableContainer.innerHTML = html;
}

function loadPersonalInfo() {
  const data = users[viewingUser].info || {};
  for (const key in data) {
    if (infoForm[key]) infoForm[key].value = data[key];
  }
  profileName.textContent = data.fullName || 'Họ và Tên';
  profileEmail.textContent = viewingUser || 'Email';
  renderInfoTable(data);
}

btnSave.onclick = () => {
  const data = {};
  Array.from(infoForm.elements).forEach(el => {
    if (el.id) data[el.id] = el.value;
  });
  users[viewingUser].info = data;
  localStorage.setItem('users', JSON.stringify(users));
  profileName.textContent = data.fullName || 'Họ và Tên';
  renderInfoTable(data);
  alert("Đã lưu thông tin cá nhân!");
};

document.getElementById('fullName').addEventListener('input', e => {
  profileName.textContent = e.target.value || 'Họ và Tên';
});
document.getElementById('email').addEventListener('input', e => {
  // Không thay đổi viewingUser
});

loadPersonalInfo();

// Công bố khoa học
const postForm = document.getElementById('postForm');
const postList = document.getElementById('postList');
let posts = users[viewingUser].posts || [];

function renderAllPosts() {
  postList.innerHTML = '';
  if (posts.length === 0) {
    postList.innerHTML = '<div style="color:#888;">Chưa có công bố nào.</div>';
    return;
  }
  posts.forEach((post, i) => {
    const div = document.createElement('div');
    div.className = 'post';
    div.style.display = 'flex';
    div.style.justifyContent = 'space-between';
    div.style.alignItems = 'center';

    const contentDiv = document.createElement('div');
    contentDiv.innerHTML = `<h3>${i + 1}. ${post.title}</h3><p>${post.content}</p>`;

    const btn = document.createElement('button');
    btn.textContent = '🗑️';
    btn.onclick = () => {
      posts.splice(i, 1);
      renderAllPosts();
    };

    div.appendChild(contentDiv);
    div.appendChild(btn);
    postList.appendChild(div);
  });
}

postForm.addEventListener('submit', e => {
  e.preventDefault();
  const title = document.getElementById('title').value.trim();
  const content = document.getElementById('content').value.trim();
  if (title && content) {
    posts.unshift({ title, content });
    renderAllPosts();
    postForm.reset();
  }
});

document.getElementById('btnSavePosts').onclick = () => {
  users[viewingUser].posts = posts;
  localStorage.setItem('users', JSON.stringify(users));
  alert("Đã lưu công bố!");
};

renderAllPosts();

// Giải thưởng
const awardForm = document.getElementById('awardForm');
const awardList = document.getElementById('awardList');
let awards = users[viewingUser].awards || [];

function renderAllAwards() {
  awardList.innerHTML = '';
  if (awards.length === 0) {
    awardList.innerHTML = '<div style="color:#888;">Chưa có giải thưởng nào.</div>';
    return;
  }

  awards.forEach((award, index) => {
    const div = document.createElement('div');
    div.className = 'post';
    div.style.display = 'flex';
    div.style.justifyContent = 'space-between';
    div.style.alignItems = 'center';

    const contentDiv = document.createElement('div');
    contentDiv.innerHTML = `<h3>${index + 1}. ${award.title} (${award.year})</h3><p><b>Trình độ:</b> ${award.level}</p>`;

    const btn = document.createElement('button');
    btn.textContent = '🗑️';
    btn.onclick = () => {
      awards.splice(index, 1);
      renderAllAwards();
    };

    div.appendChild(contentDiv);
    div.appendChild(btn);
    awardList.appendChild(div);
  });
}

awardForm.addEventListener('submit', e => {
  e.preventDefault();
  const title = document.getElementById('awardTitle').value.trim();
  const year = document.getElementById('awardYear').value.trim();
  const level = document.getElementById('awardLevel').value.trim();
  if (title && year) {
    awards.push({ title, year, level });
    renderAllAwards();
    awardForm.reset();
  }
});

document.getElementById('btnSaveAwards').onclick = () => {
  users[viewingUser].awards = awards;
  localStorage.setItem('users', JSON.stringify(users));
  alert("Đã lưu giải thưởng!");
};

renderAllAwards();

function toWord() {
  const info = users[viewingUser].info || {};
  const posts = users[viewingUser].posts || [];
  const awards = users[viewingUser].awards || [];

  let awardTableHtml = '<p>Không có giải thưởng nào.</p>';
  if (awards.length > 0) {
    awardTableHtml = `
      <table>
        <tr><th>Tên giải thưởng</th><th>Năm nhận</th></tr>
        ${awards.map(a => `<tr><td>${a.title}</td><td>${a.year}</td></tr>`).join('')}
      </table>`;
  }

  let html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: Segoe UI, sans-serif; padding: 20px; }
      h2 { color: #0d47a1; border-bottom: 1px solid #90caf9; padding-bottom: 4px; }
      .section { margin-bottom: 24px; }
      table { width: 100%; border-collapse: collapse; margin-top: 10px; }
      td, th { border: 1px solid #ddd; padding: 8px; }
      th { background: #e3f2fd; color: #0d47a1; text-align: left; }
    </style>
  </head>
  <body>
    <h2>A. Thông tin cá nhân</h2>
    <table>
      <tr><th>Họ và tên</th><td>${info.fullName || ''}</td></tr>
      <tr><th>Ngày sinh</th><td>${info.dob ? new Date(info.dob).toLocaleDateString('vi-VN') : ''}</td></tr>
      <tr><th>Giới tính</th><td>${info.gender || ''}</td></tr>
      <tr><th>Số CCCD</th><td>${info.cccd || ''}</td></tr>
      <tr><th>Email</th><td>${info.email || ''}</td></tr>
      <tr><th>Số điện thoại</th><td>${info.phone || ''}</td></tr>
    </table>
    <div class="section">
      <h2>B. Công bố khoa học</h2>
      ${posts.length === 0 ? '<p>Không có công bố nào.</p>' : posts.map((p, i) => `<p><b>${i + 1}. ${p.title}</b><br>${p.content}</p>`).join('')}
    </div>
    <div class="section">
      <h2>C. Giải thưởng</h2>
      ${awardTableHtml}
    </div>
  </body>
</html>`;

  const blob = new Blob(['\ufeff' + html], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Thong_tin_cv-${Date.now()}.doc`;
  link.click();
  URL.revokeObjectURL(url);
}
