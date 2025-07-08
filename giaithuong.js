document.addEventListener("DOMContentLoaded", function () {
  let awards = [];

  document.getElementById("awardForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const title = document.getElementById("awardTitle").value.trim();
    const year = document.getElementById("awardYear").value.trim();

    if (title && year) {
      awards.push({ title, year });

      const li = document.createElement("li");
      li.textContent = `${title} (${year})`;
      document.getElementById("awardList").appendChild(li);

      document.getElementById("awardTitle").value = "";
      document.getElementById("awardYear").value = "";
    }
  });

  document.getElementById("exportBtn").addEventListener("click", function () {
    // Lấy thông tin cá nhân từ localStorage
    const personalInfo = JSON.parse(localStorage.getItem("personalInfo")) || {};
    // Lấy danh sách bài đăng từ localStorage
    const posts = JSON.parse(localStorage.getItem("posts")) || [];

    // Tạo file Word đơn giản từ HTML với CSS đẹp
    const wordStyles = `
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background: #fff; color: #222; }
        h2 { color: #0d47a1; border-bottom: 2px solid #bbdefb; padding-bottom: 4px; margin-top: 28px; text-align: center; }
        ul { list-style: disc; margin-left: 28px; margin-bottom: 18px; }
        li { margin-bottom: 10px; font-size: 16px; }
        b { color: #1a237e; }
        .info-list li { margin-bottom: 6px; }
        .section { background: #f5faff; border-radius: 10px; padding: 18px 22px; margin-bottom: 18px; box-shadow: 0 2px 8px #e3f2fd; }
      </style>
    `;
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
      "xmlns:w='urn:schemas-microsoft-com:office:word' " +
      "xmlns='http://www.w3.org/TR/REC-html40'>" +
      "<head><meta charset='utf-8'>" + wordStyles + "</head><body>";
    const footer = "</body></html>";
    const sourceHTML =
      header +
      `<div class='section'><h2>Thông tin cá nhân</h2><ul class='info-list'>${
        `<li>Họ và Tên: ${personalInfo.fullName || ''}</li>` +
        `<li>Ngày sinh: ${personalInfo.dob || ''}</li>` +
        // `<li>Giới tính: ${personalInfo.gender || ''}</li>` +
        `<li>Email: ${personalInfo.email || ''}</li>` +
        `<li>Số điện thoại: ${personalInfo.phone || ''}</li>` +
        `<li>Địa chỉ: ${personalInfo.address || ''}</li>` +
        `<li>Ghi chú: ${personalInfo.notes || ''}</li>`
      }</ul></div>` +
      `<div class='section'><h2>Danh sách bài đăng</h2><ul>` +
      posts.map(p => `<li><b>${p.title}</b><br>${p.content}</li>`).join('') +
      `</ul></div>` +
      `<div class='section'><h2>Danh sách giải thưởng</h2><ul>` +
      awards.map(a => `<li>${a.title} (${a.year})</li>`).join('') +
      `</ul></div>` +
      footer;

    const blob = new Blob(['\ufeff', sourceHTML], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Thong_tin_tong_hop-${Date.now()}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  });
});
