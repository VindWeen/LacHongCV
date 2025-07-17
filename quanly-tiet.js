// Lấy danh sách key user đã nhập thông tin
function getUserKeys() {
  let arr = [];
  for (let i = 0; i < localStorage.length; ++i) {
    let key = localStorage.key(i);
    if (key.startsWith("nhanvien_")) arr.push(key);
  }
  return arr;
}

function getUserInfo(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch { return null; }
}

function renderTable() {
  let keys = getUserKeys();
  let tbody = document.getElementById('userTableBody');
  tbody.innerHTML = "";
  if (keys.length === 0) {
    tbody.innerHTML = `<tr><td colspan="14" style="color:#e57373;text-align:center;font-size:1.3rem;">Chưa có nhân viên nào được lưu!</td></tr>`;
    return;
  }
  keys.forEach((key, idx) => {
    let d = getUserInfo(key);
    if (!d) return;
    let tongnv = Number(d.tongnv) || 0;
    let phaituchien = Number(d.phaituchien) || 0;
    let ketqua = tongnv - phaituchien;
    let ketluan = (ketqua > 50) ? "Đạt" : "Không đạt";
    tbody.innerHTML += `
      <tr>
        <td>${idx + 1}</td>
        <td>${d.hoten || ""}</td>
        <td>${d.msnv || ""}</td>
        <td>${d.donvi || ""}</td>
        <td>${d.nhiemvu || ""}</td>
        <td>${d.miengiam || ""}</td>
        <td>${d.dinhmuc || ""}</td>
        <td>${d.phaituchien || ""}</td>
        <td>${d.baoluu || ""}</td>
        <td>${d.thuchiennam || ""}</td>
        <td>${d.tongnv || ""}</td>
        <td>${ketqua}</td>
        <td style="font-weight:700;${ketluan==="Đạt"?"color:#26b54c":"color:#d32f2f"}">${ketluan}</td>
        <td>
          <button class="btn-action btn-view" data-user="${key}">Xem</button>
          <button class="btn-action btn-del" data-user="${key}">Xóa</button>
        </td>
      </tr>
    `;
  });

  // Nút xem
  document.querySelectorAll('.btn-view').forEach(btn => {
    btn.onclick = function() {
      const key = btn.getAttribute('data-user');
      localStorage.setItem('loggedInUser', key.replace('nhanvien_', ''));
      window.location.href = "tiet.html";
    }
  });
  // Nút xóa
  document.querySelectorAll('.btn-del').forEach(btn => {
    btn.onclick = function() {
      const key = btn.getAttribute('data-user');
      if (confirm("Bạn có chắc chắn muốn xóa toàn bộ thông tin của nhân viên này không?")) {
        let username = key.replace('nhanvien_', '');
        let prefix = [
          "nhanvien_", "detai_", "giaotrinh_", "baibao_", "hoatdongkhac_",
          "dtbb_", "cuocthi_", "gt_", "bb_", "ct_"
        ];
        prefix.forEach(pf => {
          let fullkey = pf + username;
          if (localStorage.getItem(fullkey) !== null) localStorage.removeItem(fullkey);
        });
        renderTable();
      }
    };
  });
}

renderTable();
// In ra Word
document.addEventListener("DOMContentLoaded", function() {
  const btnPrint = document.getElementById('btnPrintWord');
  if (btnPrint) {
    btnPrint.onclick = function() {
      // Tạo html riêng cho nội dung in
      const printContents = document.querySelector('.main-container').innerHTML;
      const style = `
        <style>
          body { background: #fff !important; margin: 0; font-family: 'Segoe UI', Arial, sans-serif; }
          .main-title { text-align: center; font-size: 1.5rem; color: #1a237e; margin-bottom: 18px; }
          .user-table { width: 100%; border-collapse: collapse; background: #fff;}
          .user-table th { background: #1976d2; color: #fff; font-size: 1.08rem; -webkit-print-color-adjust: exact; print-color-adjust: exact;}
          .user-table td, .user-table th { border: 1px solid #ccc; padding: 8px; font-size: 1.03rem;}
        </style>
      `;
      const printWindow = window.open('', '', 'height=900,width=1100');
      printWindow.document.write('<html><head><title>In danh sách nhân viên</title>' + style + '</head><body>');
      printWindow.document.write(printContents);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => printWindow.print(), 400); // đợi css load
    }
  }
});
