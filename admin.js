window.onload = function() {
  const users = JSON.parse(localStorage.getItem('users')) || {};
  const awards = JSON.parse(localStorage.getItem('awards')) || [];

  const clients = Object.entries(users)
    .filter(([_, u]) => u.role === 'client')
    .sort((a, b) => (a[1].orderIndex ?? 9999) - (b[1].orderIndex ?? 9999));

  const tbody = document.getElementById('userTableBody');
  const adminAwardTableBody = document.querySelector('#adminAwardTable tbody');

  function renderUserTable(userList) {
    tbody.innerHTML = '';
    userList.forEach(([email, data]) => {
      const info = data.info || {};
      const row = `<tr>
        <td>${info.fullName || ''}</td>
        <td>${info.dob || ''}</td>
        <td>${info.gender || ''}</td>
        <td>${info.cccd || ''}</td>
        <td>${email}</td>
        <td>${info.phone || ''}</td>
        <td>${info.position || ''}</td>
        <td>
          <a href="test.html?user=${encodeURIComponent(email)}" target="_blank">Xem</a>
          <a class="delete-btn" data-email="${email}">Xóa</a>
        </td>
      </tr>`;
      tbody.innerHTML += row;
    });
    addDeleteEvent();
  }

  function addDeleteEvent() {
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(btn => {
      btn.onclick = () => {
        const email = btn.dataset.email;
        if (confirm(`Bạn chắc chắn muốn xóa user ${email}?`)) {
          delete users[email];
          localStorage.setItem('users', JSON.stringify(users));
          const index = clients.findIndex(([em, _]) => em === email);
          if (index !== -1) clients.splice(index, 1);
          renderUserTable(clients);
        }
      };
    });
  }

  function renderAwardTable() {
    adminAwardTableBody.innerHTML = '';
    const pendingAwards = awards.filter(a => a.status === 'pending');

    pendingAwards.forEach((award, index) => {
      let totalAmount = 0;
      switch (award.level) {
        case 'CapTinh': totalAmount = 10_000_000; break;
        case 'CapTP': totalAmount = 5_000_000; break;
        case 'CapHuyen': totalAmount = 2_000_000; break;
        case 'CapXa': totalAmount = 500_000; break;
      }
      const numPeople = parseInt(award.amountOfPeople) || 1;
      const amountPerPerson = totalAmount / numPeople;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${award.title}</td>
        <td>${award.amountOfPeople}</td>
        <td>${award.year}</td>
        <td>${award.level}</td>
        <td>${award.user || ''}</td>
        <td>${amountPerPerson.toLocaleString('vi-VN')} VND</td>
        <td><button class="approve-btn">Xác nhận</button></td>
      `;
      tr.querySelector('.approve-btn').onclick = () => {
        award.status = 'approved';
        localStorage.setItem('awards', JSON.stringify(awards));

        if (award.user && users[award.user]) {
          const userAwards = users[award.user].awards || [];
          userAwards.forEach(a => {
            if (a.title === award.title) a.status = 'approved';
          });
          users[award.user].awards = userAwards;
          localStorage.setItem('users', JSON.stringify(users));
        }

        alert('Đã duyệt!');
        renderAwardTable();
      };
      adminAwardTableBody.appendChild(tr);
    });
  }

  renderUserTable(clients);
  renderAwardTable();

  const positionOrder = {
    "Giáo sư": 5,
    "Phó giáo sư": 4,
    "Giảng viên": 3,
    "Chuyên viên": 2,
    "": 1
  };

  document.getElementById('sortPositionBtn').onclick = () => {
    const sorted = clients.sort((a, b) => {
      const posA = positionOrder[(a[1].info?.position || '').trim()] ?? 1;
      const posB = positionOrder[(b[1].info?.position || '').trim()] ?? 1;
      return posB - posA;
    });

    sorted.forEach(([email, data], index) => {
      data.orderIndex = index;
    });

    localStorage.setItem('users', JSON.stringify(users));
    renderUserTable(sorted);
  };

  new Sortable(tbody, {
    animation: 150,
    ghostClass: 'sortable-ghost',
    onEnd: function () {
      const newOrderEmails = Array.from(tbody.querySelectorAll('tr')).map(tr => {
        const emailCell = tr.querySelector('td:nth-child(5)');
        return emailCell?.textContent?.trim();
      });

      newOrderEmails.forEach((email, index) => {
        if (users[email]) {
          users[email].orderIndex = index;
        }
      });

      localStorage.setItem('users', JSON.stringify(users));
    }
  });
};
