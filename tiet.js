document.addEventListener("DOMContentLoaded", function () {
  // === NHÂN VIÊN ===
  const nhanvienGrid = document.querySelector('.input-row-nhanvien');
  let hotenInput, msnvInput, donviInput, miengiamInput, btnLuuNhanVien;

  if (nhanvienGrid) {
    nhanvienGrid.innerHTML = `
    <input type="text" class="input hoten" placeholder="Họ và tên">
    <input type="text" class="input msnv" placeholder="MSNV">
    <select class="input donvi">
      <option value="">Chọn đơn vị</option>
      <option value="Khoa công nghệ thông tin">Khoa công nghệ thông tin</option>
      <option value="Trung tâm nghiên cứu khoa học và ứng dụng">Trung tâm nghiên cứu khoa học và ứng dụng</option>
      <option value="Khoa tài chính">Khoa tài chính</option>
      <option value="Khoa cơ điện">Khoa cơ điện</option>
      <option value="Khoa công nghệ thực phẩm">Khoa công nghệ thực phẩm</option>
      <option value="Khoa đông phương học">Khoa đông phương học</option>
    </select>
    <input type="text" class="input miengiam" placeholder="Mức miễn giảm">
  `;

    hotenInput = nhanvienGrid.querySelector('.hoten');
    msnvInput = nhanvienGrid.querySelector('.msnv');
    donviInput = nhanvienGrid.querySelector('.donvi');
    miengiamInput = nhanvienGrid.querySelector('.miengiam');
    btnLuuNhanVien = document.querySelector('.luu-nhanvien');
  }

  btnLuuNhanVien.addEventListener('click', function (e) {
    e.preventDefault();
    const user = localStorage.getItem('loggedInUser');
    if (!user) {
      alert('Bạn chưa đăng nhập!');
      return;
    }
    const hoten = hotenInput.value.trim();
    const msnv = msnvInput.value.trim();
    const donvi = donviInput.value;
    const miengiam = miengiamInput.value.trim();
    if (!hoten || !msnv || !donvi) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    localStorage.setItem('nhanvien_' + user, JSON.stringify({ hoten, msnv, donvi, miengiam }));
    alert('Đã lưu thông tin nhân viên!');
  });

  function loadNhanVienInfo() {
    const user = localStorage.getItem('loggedInUser');
    if (!user) return;
    const data = JSON.parse(localStorage.getItem('nhanvien_' + user));
    if (data) {
      hotenInput.value = data.hoten || '';
      msnvInput.value = data.msnv || '';
      donviInput.value = data.donvi || '';
      miengiamInput.value = data.miengiam || '';
    }
  }
  loadNhanVienInfo();

  // === ĐỀ TÀI KHOA HỌC ===
  const detaiGrid = document.querySelector('.form-container-wide:nth-of-type(2) .input-grid');
  let inputTen, selectCap, selectNhiemVu, inputFile, selectNghiemThu, inputKetQua, btnLuu, tbody, renderDetaiList;
  if (detaiGrid) {
    detaiGrid.innerHTML = `
      <input type="text" class="input tendetai" placeholder="Tên đề tài">
      <select class="input cap">
        <option value="">Chọn cấp</option>
        <option value="coso">Cơ sở</option>
        <option value="tinh">Tỉnh</option>
        <option value="bo">Bộ</option>
      </select>
      <select class="input nhiemvu-detai">
        <option value="">Chọn nhiệm vụ</option>
        <option value="chunhiem">Chủ nhiệm</option>
        <option value="khongchunhiem">Không chủ nhiệm</option>
      </select>
      <input type="file" class="input minhchung-detai" style="padding: 0.5em; background: #fff;">
      <span></span>
      <select class="input nghiemthu-detai">
        <option value="chua">Chưa</option>
        <option value="roi">Rồi</option>
      </select>
      <input type="number" class="input ketqua-detai" value="0" min="0" readonly>
    `;

    const CAP_GIA_TRI = { coso: 10, tinh: 30, bo: 50 };
    const NHIEMVU_GIA_TRI = { chunhiem: 10, khongchunhiem: 5 };

    inputTen = detaiGrid.querySelector('.tendetai');
    selectCap = detaiGrid.querySelector('.cap');
    selectNhiemVu = detaiGrid.querySelector('.nhiemvu-detai');
    inputFile = detaiGrid.querySelector('.minhchung-detai');
    selectNghiemThu = detaiGrid.querySelector('.nghiemthu-detai');
    inputKetQua = detaiGrid.querySelector('.ketqua-detai');
    btnLuu = document.querySelector('.luu-detai');
    tbody = document.getElementById('bang-noidung-detai');

    function calcKetQua() {
      const capVal = selectCap.value;
      const nvVal = selectNhiemVu.value;
      const ntVal = selectNghiemThu.value;
      if (ntVal === "roi" && CAP_GIA_TRI[capVal] && NHIEMVU_GIA_TRI[nvVal]) {
        inputKetQua.value = CAP_GIA_TRI[capVal] + NHIEMVU_GIA_TRI[nvVal];
      } else {
        inputKetQua.value = 0;
      }
    }
    [selectCap, selectNhiemVu, selectNghiemThu].forEach(el => el.addEventListener('change', calcKetQua));
    calcKetQua();

    renderDetaiList = function () {
      tbody.innerHTML = "";
      const user = localStorage.getItem('loggedInUser');
      if (!user) return;
      const data = JSON.parse(localStorage.getItem('detai_' + user)) || [];
      data.forEach((dt, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${dt.capText}</td>
          <td>${dt.nhiemvuText}</td>
          <td>${dt.minhchungName || ''}</td>
          <td>${dt.nghiemthuText}</td>
          <td>${dt.ketqua}</td>
          <td>
            <button class="del-detai-btn" data-idx="${idx}" style="background:#e57373;color:#fff;border:none;border-radius:7px;padding:6px 14px;font-weight:600;cursor:pointer;">Xóa</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
      const delBtns = tbody.querySelectorAll('.del-detai-btn');
      delBtns.forEach(btn => {
        btn.addEventListener('click', function () {
          const idx = parseInt(btn.getAttribute('data-idx'));
          deleteDetai(idx);
        });
      });
      updateTongSoTiet();
    }

    function deleteDetai(idx) {
      const user = localStorage.getItem('loggedInUser');
      if (!user) return;
      let data = JSON.parse(localStorage.getItem('detai_' + user)) || [];
      data.splice(idx, 1);
      localStorage.setItem('detai_' + user, JSON.stringify(data));
      renderDetaiList();
      checkAndSaveUserFullInfo(user);
    }

    btnLuu.addEventListener('click', function (e) {
      e.preventDefault();
      const user = localStorage.getItem('loggedInUser');
      if (!user) {
        alert('Bạn chưa đăng nhập!');
        return;
      }
      const tendetai = inputTen.value.trim();
      const cap = selectCap.value;
      const capText = selectCap.options[selectCap.selectedIndex].text;
      const nhiemvu = selectNhiemVu.value;
      const nhiemvuText = selectNhiemVu.options[selectNhiemVu.selectedIndex].text;
      const minhchungFile = inputFile.files[0];
      const minhchungName = minhchungFile ? minhchungFile.name : '';
      const nghiemthu = selectNghiemThu.value;
      const nghiemthuText = selectNghiemThu.options[selectNghiemThu.selectedIndex].text;
      const ketqua = inputKetQua.value;
      if (!tendetai || !cap || !nhiemvu || !nghiemthu) {
        alert('Vui lòng nhập đầy đủ thông tin!');
        return;
      }
      let data = JSON.parse(localStorage.getItem('detai_' + user)) || [];
      data.push({
        tendetai, cap, capText, nhiemvu, nhiemvuText, minhchungName, nghiemthu, nghiemthuText, ketqua
      });
      localStorage.setItem('detai_' + user, JSON.stringify(data));
      inputTen.value = '';
      selectCap.value = '';
      selectNhiemVu.value = '';
      inputFile.value = '';
      selectNghiemThu.value = 'chua';
      inputKetQua.value = 0;
      renderDetaiList();
      checkAndSaveUserFullInfo(user);
    });

    renderDetaiList();
  }

  // === GIÁO TRÌNH ===
  const giaotrinhGrid = document.querySelector('.form-container-wide:nth-of-type(3) .input-grid');
  let inputTenGT, selectTheLoai, inputFileGT, selectNhiemVuGT, selectNghiemThuGT, inputKetQuaGT, btnLuuGT, tbodyGT, renderGiaotrinhList;
  if (giaotrinhGrid) {
    giaotrinhGrid.innerHTML = `
      <input type="text" class="input tengaotrinh" placeholder="Tên giáo trình">
      <select class="input theloai-gt">
        <option value="">Chọn thể loại</option>
        <option value="trongnuoc">Sách trong nước</option>
        <option value="quocte">Sách quốc tế</option>
      </select>
      <select class="input nhiemvu-gt">
        <option value="">Chọn nhiệm vụ</option>
        <option value="chunhiem">Chủ nhiệm</option>
        <option value="khongchunhiem">Không chủ nhiệm</option>
      </select>
      <input type="file" class="input minhchung-gt" style="padding: 0.5em; background: #fff;">
      <span></span>
      <select class="input nghiemthu-gt">
        <option value="chua">Chưa</option>
        <option value="roi">Rồi</option>
      </select>
      <input type="number" class="input ketqua-gt" value="0" min="0" readonly>
    `;

    const THELOAI_GIA_TRI = { trongnuoc: 10, quocte: 30 };
    const NHIEMVU_GIA_TRI_GT = { chunhiem: 10, khongchunhiem: 0 };

    inputTenGT = giaotrinhGrid.querySelector('.tengaotrinh');
    selectTheLoai = giaotrinhGrid.querySelector('.theloai-gt');
    inputFileGT = giaotrinhGrid.querySelector('.minhchung-gt');
    selectNhiemVuGT = giaotrinhGrid.querySelector('.nhiemvu-gt');
    selectNghiemThuGT = giaotrinhGrid.querySelector('.nghiemthu-gt');
    inputKetQuaGT = giaotrinhGrid.querySelector('.ketqua-gt');
    btnLuuGT = document.querySelector('.luu-gt');
    tbodyGT = document.getElementById('bang-noidung-giaotrinh');

    function calcKetQuaGT() {
      const theloaiVal = selectTheLoai.value;
      const nvVal = selectNhiemVuGT.value;
      const ntVal = selectNghiemThuGT.value;
      if (ntVal === "roi" && THELOAI_GIA_TRI[theloaiVal] !== undefined && NHIEMVU_GIA_TRI_GT[nvVal] !== undefined) {
        inputKetQuaGT.value = THELOAI_GIA_TRI[theloaiVal] + NHIEMVU_GIA_TRI_GT[nvVal];
      } else {
        inputKetQuaGT.value = 0;
      }
    }
    [selectTheLoai, selectNhiemVuGT, selectNghiemThuGT].forEach(el => el.addEventListener('change', calcKetQuaGT));
    calcKetQuaGT();

    renderGiaotrinhList = function () {
      tbodyGT.innerHTML = "";
      const user = localStorage.getItem('loggedInUser');
      if (!user) return;
      const data = JSON.parse(localStorage.getItem('giaotrinh_' + user)) || [];
      data.forEach((gt, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${gt.ten}</td>
          <td>${gt.theloaiText}</td>
          <td>${gt.minhchungName || ''}</td>
          <td>${gt.nhiemvuText}</td>
          <td>${gt.nghiemthuText}</td>
          <td>${gt.ketqua}</td>
          <td>
            <button class="del-gt-btn" data-idx="${idx}" style="background:#e57373;color:#fff;border:none;border-radius:7px;padding:6px 14px;font-weight:600;cursor:pointer;">Xóa</button>
          </td>
        `;
        tbodyGT.appendChild(tr);
      });
      const delBtns = tbodyGT.querySelectorAll('.del-gt-btn');
      delBtns.forEach(btn => {
        btn.addEventListener('click', function () {
          const idx = parseInt(btn.getAttribute('data-idx'));
          deleteGiaotrinh(idx);
        });
      });
      updateTongSoTiet();
    }

    function deleteGiaotrinh(idx) {
      const user = localStorage.getItem('loggedInUser');
      if (!user) return;
      let data = JSON.parse(localStorage.getItem('giaotrinh_' + user)) || [];
      data.splice(idx, 1);
      localStorage.setItem('giaotrinh_' + user, JSON.stringify(data));
      renderGiaotrinhList();
      checkAndSaveUserFullInfo(user);
    }

    btnLuuGT.addEventListener('click', function (e) {
      e.preventDefault();
      const user = localStorage.getItem('loggedInUser');
      if (!user) {
        alert('Bạn chưa đăng nhập!');
        return;
      }
      const ten = inputTenGT.value.trim();
      const theloai = selectTheLoai.value;
      const theloaiText = selectTheLoai.options[selectTheLoai.selectedIndex].text;
      const minhchungFile = inputFileGT.files[0];
      const minhchungName = minhchungFile ? minhchungFile.name : '';
      const nhiemvu = selectNhiemVuGT.value;
      const nhiemvuText = selectNhiemVuGT.options[selectNhiemVuGT.selectedIndex].text;
      const nghiemthu = selectNghiemThuGT.value;
      const nghiemthuText = selectNghiemThuGT.options[selectNghiemThuGT.selectedIndex].text;
      const ketqua = inputKetQuaGT.value;
      if (!ten || !theloai || !nhiemvu || !nghiemthu) {
        alert('Vui lòng nhập đầy đủ thông tin!');
        return;
      }
      let data = JSON.parse(localStorage.getItem('giaotrinh_' + user)) || [];
      data.push({
        ten, theloai, theloaiText, minhchungName, nhiemvu, nhiemvuText, nghiemthu, nghiemthuText, ketqua
      });
      localStorage.setItem('giaotrinh_' + user, JSON.stringify(data));
      inputTenGT.value = '';
      selectTheLoai.value = '';
      inputFileGT.value = '';
      selectNhiemVuGT.value = '';
      selectNghiemThuGT.value = 'chua';
      inputKetQuaGT.value = 0;
      renderGiaotrinhList();
      checkAndSaveUserFullInfo(user);
    });

    renderGiaotrinhList();
  }

  // === BÀI BÁO ===
  const baibaoGrid = document.querySelector('.form-container-wide:nth-of-type(4) .input-grid');
  let inputTenBB, selectTheLoaiBB, inputFileBB, selectTacGia, selectNghiemThuBB, inputKetQuaBB, btnLuuBB, tbodyBB, renderBaibaoList;
  if (baibaoGrid) {
    baibaoGrid.innerHTML = `
      <input type="text" class="input tenbaibao" placeholder="Tên bài báo">
      <select class="input theloai-bb">
        <option value="">Chọn thể loại</option>
        <option value="nos">NOS</option>
        <option value="seopuc">SEOPUC</option>
        <option value="hoithaquocte">Hội thảo quốc tế</option>
        <option value="dctsnn">DCTSNN</option>
      </select>
      <select class="input tacgia">
        <option value="">Chọn tác giả</option>
        <option value="chinh">Tác giả chính</option>
        <option value="phu">Tác giả phụ</option>
      </select>
      <input type="file" class="input minhchung-bb" style="padding: 0.5em; background: #fff;">
      <span></span>
      <select class="input nghiemthu-bb">
        <option value="chua">Chưa</option>
        <option value="roi">Rồi</option>
      </select>
      <input type="number" class="input ketqua-bb" value="0" min="0" readonly>
    `;

    const THELOAI_BB_GIA_TRI = { nos: 30, seopuc: 20, hoithaquocte: 10, dctsnn: 5 };
    const TACGIA_BB_GIA_TRI = { chinh: 10, phu: 0 };

    inputTenBB = baibaoGrid.querySelector('.tenbaibao');
    selectTheLoaiBB = baibaoGrid.querySelector('.theloai-bb');
    inputFileBB = baibaoGrid.querySelector('.minhchung-bb');
    selectTacGia = baibaoGrid.querySelector('.tacgia');
    selectNghiemThuBB = baibaoGrid.querySelector('.nghiemthu-bb');
    inputKetQuaBB = baibaoGrid.querySelector('.ketqua-bb');
    btnLuuBB = document.querySelector('.luu-bb');
    tbodyBB = document.getElementById('bang-noidung-baibao');

    function calcKetQuaBB() {
      const theloaiVal = selectTheLoaiBB.value;
      const tgVal = selectTacGia.value;
      const ntVal = selectNghiemThuBB.value;
      if (
        ntVal === "roi" &&
        THELOAI_BB_GIA_TRI[theloaiVal] !== undefined &&
        TACGIA_BB_GIA_TRI[tgVal] !== undefined
      ) {
        inputKetQuaBB.value = THELOAI_BB_GIA_TRI[theloaiVal] + TACGIA_BB_GIA_TRI[tgVal];
      } else {
        inputKetQuaBB.value = 0;
      }
    }
    [selectTheLoaiBB, selectTacGia, selectNghiemThuBB].forEach(el =>
      el.addEventListener('change', calcKetQuaBB)
    );
    calcKetQuaBB();

    renderBaibaoList = function () {
      tbodyBB.innerHTML = "";
      const user = localStorage.getItem('loggedInUser');
      if (!user) return;
      const data = JSON.parse(localStorage.getItem('baibao_' + user)) || [];
      data.forEach((bb, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${bb.ten}</td>
          <td>${bb.theloaiText}</td>
          <td>${bb.minhchungName || ''}</td>
          <td>${bb.tacgiaText}</td>
          <td>${bb.nghiemthuText}</td>
          <td>${bb.ketqua}</td>
          <td>
            <button class="del-bb-btn" data-idx="${idx}" style="background:#e57373;color:#fff;border:none;border-radius:7px;padding:6px 14px;font-weight:600;cursor:pointer;">Xóa</button>
          </td>
        `;
        tbodyBB.appendChild(tr);
      });
      const delBtns = tbodyBB.querySelectorAll('.del-bb-btn');
      delBtns.forEach(btn => {
        btn.addEventListener('click', function () {
          const idx = parseInt(btn.getAttribute('data-idx'));
          deleteBaibao(idx);
        });
      });
      updateTongSoTiet();
    }

    function deleteBaibao(idx) {
      const user = localStorage.getItem('loggedInUser');
      if (!user) return;
      let data = JSON.parse(localStorage.getItem('baibao_' + user)) || [];
      data.splice(idx, 1);
      localStorage.setItem('baibao_' + user, JSON.stringify(data));
      renderBaibaoList();
      checkAndSaveUserFullInfo(user);
    }

    btnLuuBB.addEventListener('click', function (e) {
      e.preventDefault();
      const user = localStorage.getItem('loggedInUser');
      if (!user) {
        alert('Bạn chưa đăng nhập!');
        return;
      }
      const ten = inputTenBB.value.trim();
      const theloai = selectTheLoaiBB.value;
      const theloaiText = selectTheLoaiBB.options[selectTheLoaiBB.selectedIndex].text;
      const minhchungFile = inputFileBB.files[0];
      const minhchungName = minhchungFile ? minhchungFile.name : '';
      const tacgia = selectTacGia.value;
      const tacgiaText = selectTacGia.options[selectTacGia.selectedIndex].text;
      const nghiemthu = selectNghiemThuBB.value;
      const nghiemthuText = selectNghiemThuBB.options[selectNghiemThuBB.selectedIndex].text;
      const ketqua = inputKetQuaBB.value;
      if (!ten || !theloai || !tacgia || !nghiemthu) {
        alert('Vui lòng nhập đầy đủ thông tin!');
        return;
      }
      let data = JSON.parse(localStorage.getItem('baibao_' + user)) || [];
      data.push({
        ten, theloai, theloaiText, minhchungName, tacgia, tacgiaText, nghiemthu, nghiemthuText, ketqua
      });
      localStorage.setItem('baibao_' + user, JSON.stringify(data));
      inputTenBB.value = '';
      selectTheLoaiBB.value = '';
      inputFileBB.value = '';
      selectTacGia.value = '';
      selectNghiemThuBB.value = 'chua';
      inputKetQuaBB.value = 0;
      renderBaibaoList();
      checkAndSaveUserFullInfo(user);
    });

    renderBaibaoList();
  }

  // === LƯU TOÀN BỘ ===
  document.querySelector('.luu-tong').addEventListener('click', function (e) {
    e.preventDefault();
    const user = localStorage.getItem('loggedInUser');
    if (!user) {
      alert('Bạn chưa đăng nhập!');
      return;
    }
    // Lưu đề tài khoa học nếu đang nhập hợp lệ
    if (
      typeof inputTen !== 'undefined' &&
      inputTen.value.trim() &&
      selectCap.value &&
      selectNhiemVu.value &&
      selectNghiemThu.value
    ) {
      const tendetai = inputTen.value.trim();
      const cap = selectCap.value;
      const capText = selectCap.options[selectCap.selectedIndex].text;
      const nhiemvu = selectNhiemVu.value;
      const nhiemvuText = selectNhiemVu.options[selectNhiemVu.selectedIndex].text;
      const minhchungFile = inputFile.files[0];
      const minhchungName = minhchungFile ? minhchungFile.name : '';
      const nghiemthu = selectNghiemThu.value;
      const nghiemthuText = selectNghiemThu.options[selectNghiemThu.selectedIndex].text;
      const ketqua = inputKetQua.value;
      let data = JSON.parse(localStorage.getItem('detai_' + user)) || [];
      data.push({ tendetai, cap, capText, nhiemvu, nhiemvuText, minhchungName, nghiemthu, nghiemthuText, ketqua });
      localStorage.setItem('detai_' + user, JSON.stringify(data));
      inputTen.value = '';
      selectCap.value = '';
      selectNhiemVu.value = '';
      inputFile.value = '';
      selectNghiemThu.value = 'chua';
      inputKetQua.value = 0;
      if (typeof renderDetaiList === 'function') renderDetaiList();
    }

    // Lưu giáo trình nếu đang nhập hợp lệ
    if (
      typeof inputTenGT !== 'undefined' &&
      inputTenGT.value.trim() &&
      selectTheLoai.value &&
      selectNhiemVuGT.value &&
      selectNghiemThuGT.value
    ) {
      const ten = inputTenGT.value.trim();
      const theloai = selectTheLoai.value;
      const theloaiText = selectTheLoai.options[selectTheLoai.selectedIndex].text;
      const minhchungFile = inputFileGT.files[0];
      const minhchungName = minhchungFile ? minhchungFile.name : '';
      const nhiemvu = selectNhiemVuGT.value;
      const nhiemvuText = selectNhiemVuGT.options[selectNhiemVuGT.selectedIndex].text;
      const nghiemthu = selectNghiemThuGT.value;
      const nghiemthuText = selectNghiemThuGT.options[selectNghiemThuGT.selectedIndex].text;
      const ketqua = inputKetQuaGT.value;
      let data = JSON.parse(localStorage.getItem('giaotrinh_' + user)) || [];
      data.push({ ten, theloai, theloaiText, minhchungName, nhiemvu, nhiemvuText, nghiemthu, nghiemthuText, ketqua });
      localStorage.setItem('giaotrinh_' + user, JSON.stringify(data));
      inputTenGT.value = '';
      selectTheLoai.value = '';
      inputFileGT.value = '';
      selectNhiemVuGT.value = '';
      selectNghiemThuGT.value = 'chua';
      inputKetQuaGT.value = 0;
      if (typeof renderGiaotrinhList === 'function') renderGiaotrinhList();
    }

    // Lưu bài báo nếu đang nhập hợp lệ
    if (
      typeof inputTenBB !== 'undefined' &&
      inputTenBB.value.trim() &&
      selectTheLoaiBB.value &&
      selectTacGia.value &&
      selectNghiemThuBB.value
    ) {
      const ten = inputTenBB.value.trim();
      const theloai = selectTheLoaiBB.value;
      const theloaiText = selectTheLoaiBB.options[selectTheLoaiBB.selectedIndex].text;
      const minhchungFile = inputFileBB.files[0];
      const minhchungName = minhchungFile ? minhchungFile.name : '';
      const tacgia = selectTacGia.value;
      const tacgiaText = selectTacGia.options[selectTacGia.selectedIndex].text;
      const nghiemthu = selectNghiemThuBB.value;
      const nghiemthuText = selectNghiemThuBB.options[selectNghiemThuBB.selectedIndex].text;
      const ketqua = inputKetQuaBB.value;
      let data = JSON.parse(localStorage.getItem('baibao_' + user)) || [];
      data.push({ ten, theloai, theloaiText, minhchungName, tacgia, tacgiaText, nghiemthu, nghiemthuText, ketqua });
      localStorage.setItem('baibao_' + user, JSON.stringify(data));
      inputTenBB.value = '';
      selectTheLoaiBB.value = '';
      inputFileBB.value = '';
      selectTacGia.value = '';
      selectNghiemThuBB.value = 'chua';
      inputKetQuaBB.value = 0;
      if (typeof renderBaibaoList === 'function') renderBaibaoList();
    }

    updateTongSoTiet();
    checkAndSaveUserFullInfo(user);
    alert('Đã lưu toàn bộ dữ liệu đang nhập!');
  });

  // === Tổng Số Tiết - Cập nhật tự động ===
  function updateTongSoTiet() {
    const user = localStorage.getItem('loggedInUser');
    let tong = 0;
    // Đề tài khoa học
    let detai = JSON.parse(localStorage.getItem('detai_' + user)) || [];
    tong += detai.reduce((s, i) => s + (Number(i.ketqua) || 0), 0);
    // Giáo trình
    let giaotrinh = JSON.parse(localStorage.getItem('giaotrinh_' + user)) || [];
    tong += giaotrinh.reduce((s, i) => s + (Number(i.ketqua) || 0), 0);
    // Bài báo
    let baibao = JSON.parse(localStorage.getItem('baibao_' + user)) || [];
    tong += baibao.reduce((s, i) => s + (Number(i.ketqua) || 0), 0);
    const datStr = tong >= 150 ? "Đạt" : "Không đạt";
    const el = document.getElementById('tong-so-tiet');
    if (el) el.textContent = `Tổng số tiết: ${tong} - ${datStr}`;
    updateBangTongHop(); // update banner on every total update
  }
  updateTongSoTiet();

  // === Banner tổng hợp tiết theo tác giả ===
  function updateBangTongHop() {
    // Lấy danh sách các user đã nhập đủ 3 phần
    let usersList = JSON.parse(localStorage.getItem('users_has_full_info')) || [];
    const tbody = document.getElementById('bang-tong-hop');
    tbody.innerHTML = '';
    usersList.forEach(function (username) {
      // Lấy thông tin từng phần
      let detai = JSON.parse(localStorage.getItem('detai_' + username)) || [];
      let giaotrinh = JSON.parse(localStorage.getItem('giaotrinh_' + username)) || [];
      let baibao = JSON.parse(localStorage.getItem('baibao_' + username)) || [];
      // Nếu 3 phần đều có dữ liệu thì hiển thị
      if (detai.length && giaotrinh.length && baibao.length) {
        // Lấy tổng tiết
        let tong = detai.reduce((s, i) => s + (Number(i.ketqua) || 0), 0)
          + giaotrinh.reduce((s, i) => s + (Number(i.ketqua) || 0), 0)
          + baibao.reduce((s, i) => s + (Number(i.ketqua) || 0), 0);
        let datStr = tong >= 150 ? "Đạt" : "Không đạt";
        // Lấy tên tác giả
        let nhanvien = JSON.parse(localStorage.getItem('nhanvien_' + username));
        let hoten = nhanvien && nhanvien.hoten ? nhanvien.hoten : username;
        // Render row
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${hoten}</td>
          <td>${tong}</td>
          <td>${datStr}</td>
        `;
        tbody.appendChild(tr);
      }
    });
  }

  // --- Kiểm tra mỗi lần lưu từng phần (hoặc toàn bộ) ---
  function checkAndSaveUserFullInfo(username) {
    if (!username) return;
    let detai = JSON.parse(localStorage.getItem('detai_' + username)) || [];
    let giaotrinh = JSON.parse(localStorage.getItem('giaotrinh_' + username)) || [];
    let baibao = JSON.parse(localStorage.getItem('baibao_' + username)) || [];
    // Đủ 3 phần thì thêm vào danh sách users_has_full_info
    if (detai.length && giaotrinh.length && baibao.length) {
      let usersList = JSON.parse(localStorage.getItem('users_has_full_info')) || [];
      if (!usersList.includes(username)) {
        usersList.push(username);
        localStorage.setItem('users_has_full_info', JSON.stringify(usersList));
      }
    }
    updateBangTongHop();
  }

  // --- Gọi lại updateBangTongHop khi load ---
  updateBangTongHop();

  // === Custom file input button ===
  function setupCustomFileInput(selector, text) {
    document.querySelectorAll(selector).forEach(function (input) {
      // Nếu input đã được bọc rồi thì bỏ qua (tránh double wrap)
      if (input.parentNode.classList && input.parentNode.classList.contains('file-input-wrap')) return;

      // Tạo wrap
      const wrap = document.createElement('span');
      wrap.className = 'file-input-wrap';
      input.parentNode.insertBefore(wrap, input);
      wrap.appendChild(input);

      // Tạo label button
      const label = document.createElement('label');
      label.className = 'file-input-label';
      label.textContent = text || "Chọn file minh chứng";
      label.htmlFor = input.id || '';
      wrap.insertBefore(label, input);

      // Đổi style của input
      input.classList.add('file-input-custom');
      // Set id nếu chưa có
      if (!input.id) input.id = 'file-' + Math.random().toString(36).substr(2, 9);

      // Preview tên file
      const preview = document.createElement('span');
      preview.className = 'file-name-preview';
      wrap.appendChild(preview);

      // Sự kiện click vào label sẽ trigger input file
      label.addEventListener('click', function (e) {
        e.preventDefault();
        input.click();
      });
      // Sự kiện đổi file thì hiện tên
      input.addEventListener('change', function () {
        preview.textContent = input.files.length ? input.files[0].name : '';
      });
    });
  }

  // Gọi cho các input file (sau khi các input đã được render vào DOM)
  setTimeout(function () {
    setupCustomFileInput('.minhchung-detai', "Chọn file minh chứng");
    setupCustomFileInput('.minhchung-gt', "Chọn file minh chứng");
    setupCustomFileInput('.minhchung-bb', "Chọn file minh chứng");
  }, 0);

});

// === IN RA WORD ===
document.querySelector('.in-word').addEventListener('click', function () {
  const user = localStorage.getItem('loggedInUser');
  if (!user) {
    alert('Bạn chưa đăng nhập!');
    return;
  }
  // Lấy thông tin nhân viên
  const nv = JSON.parse(localStorage.getItem('nhanvien_' + user)) || {};
  // Lấy các bảng
  const detai = JSON.parse(localStorage.getItem('detai_' + user)) || [];
  const giaotrinh = JSON.parse(localStorage.getItem('giaotrinh_' + user)) || [];
  const baibao = JSON.parse(localStorage.getItem('baibao_' + user)) || [];

  // Style cho tiêu đề bảng
  const tableHeaderStyle = "background:#38aaff;color:#fff;font-weight:bold;text-align:center;font-size:1.02em;";

  // Tạo nội dung HTML cho Word
  let html = `
    <h2 style="text-align:left;color:#1766a5;font-size:1.22em;">Thông tin nhân viên</h2>
    <table border="1" cellpadding="6" style="border-collapse:collapse;width:100%;margin-bottom:18px">
      <tr>
        <th style="${tableHeaderStyle}">Họ và tên</th>
        <th style="${tableHeaderStyle}">MSNV</th>
        <th style="${tableHeaderStyle}">Đơn vị</th>
        <th style="${tableHeaderStyle}">Mức miễn giảm</th>
      </tr>
      <tr>
        <td style="text-align:center">${nv.hoten || ''}</td>
        <td style="text-align:center">${nv.msnv || ''}</td>
        <td style="text-align:center">${nv.donvi || ''}</td>
        <td style="text-align:center">${nv.miengiam || ''}</td>
      </tr>
    </table>
    
    <h2 style="text-align:left;color:#1766a5;font-size:1.22em;">I. Đề tài khoa học</h2>
    <table border="1" cellpadding="6" style="border-collapse:collapse;width:100%;margin-bottom:18px">
      <tr>
        <th style="${tableHeaderStyle}">Tên đề tài</th>
        <th style="${tableHeaderStyle}">Cấp</th>
        <th style="${tableHeaderStyle}">Nhiệm vụ</th>
        <th style="${tableHeaderStyle}">Minh chứng</th>
        <th style="${tableHeaderStyle}">Nghiệm thu</th>
        <th style="${tableHeaderStyle}">Kết quả</th>
      </tr>
      ${detai.map(row => `
          <tr>
            <td style="text-align:center">${row.tendetai || ''}</td>
            <td style="text-align:center">${row.capText || ''}</td>
            <td style="text-align:center">${row.nhiemvuText || ''}</td>
            <td style="text-align:center">${row.minhchungName || ''}</td>
            <td style="text-align:center">${row.nghiemthuText || ''}</td>
            <td style="text-align:center">${row.ketqua || ''}</td>
          </tr>
        `).join('')
    }
    </table>
    
    <h2 style="text-align:left;color:#1766a5;font-size:1.22em;">II. Giáo trình</h2>
    <table border="1" cellpadding="6" style="border-collapse:collapse;width:100%;margin-bottom:18px">
      <tr>
        <th style="${tableHeaderStyle}">Tên giáo trình</th>
        <th style="${tableHeaderStyle}">Thể loại</th>
        <th style="${tableHeaderStyle}">Minh chứng</th>
        <th style="${tableHeaderStyle}">Nhiệm vụ</th>
        <th style="${tableHeaderStyle}">Nghiệm thu</th>
        <th style="${tableHeaderStyle}">Kết quả</th>
      </tr>
      ${giaotrinh.map(row => `
          <tr>
            <td style="text-align:center">${row.ten || ''}</td>
            <td style="text-align:center">${row.theloaiText || ''}</td>
            <td style="text-align:center">${row.minhchungName || ''}</td>
            <td style="text-align:center">${row.nhiemvuText || ''}</td>
            <td style="text-align:center">${row.nghiemthuText || ''}</td>
            <td style="text-align:center">${row.ketqua || ''}</td>
          </tr>
        `).join('')
    }
    </table>
    
    <h2 style="text-align:left;color:#1766a5;font-size:1.22em;">III. Bài báo</h2>
    <table border="1" cellpadding="6" style="border-collapse:collapse;width:100%;margin-bottom:18px">
      <tr>
        <th style="${tableHeaderStyle}">Tên bài báo</th>
        <th style="${tableHeaderStyle}">Thể loại</th>
        <th style="${tableHeaderStyle}">Minh chứng</th>
        <th style="${tableHeaderStyle}">Tác giả</th>
        <th style="${tableHeaderStyle}">Nghiệm thu</th>
        <th style="${tableHeaderStyle}">Kết quả</th>
      </tr>
      ${baibao.map(row => `
          <tr>
            <td style="text-align:center">${row.ten || ''}</td>
            <td style="text-align:center">${row.theloaiText || ''}</td>
            <td style="text-align:center">${row.minhchungName || ''}</td>
            <td style="text-align:center">${row.tacgiaText || ''}</td>
            <td style="text-align:center">${row.nghiemthuText || ''}</td>
            <td style="text-align:center">${row.ketqua || ''}</td>
          </tr>
        `).join('')
    }
    </table>
  `;

  // Tạo blob và tải về
  const blob = new Blob(['\ufeff' + html], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = (nv.hoten ? nv.hoten.replace(/\s+/g, '_') : 'ThongTin') + '_TongHop.doc';

  document.body.appendChild(link);
  link.click();
  setTimeout(function () {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
});
