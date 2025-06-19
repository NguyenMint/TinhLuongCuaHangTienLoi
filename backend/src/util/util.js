const { Op } = require("sequelize");

function getSoNgayTrongThang(thoigian) {
  const [nam, thang] = thoigian.split("-").map(Number);
  return new Date(nam, thang, 0).getDate();
}
function tinhTongGioLamCaLam(thoiGianBatDau, thoiGianKetThuc) {
  const batDau = new Date(`1970-01-01T${thoiGianBatDau}`);
  let ketThuc = new Date(`1970-01-01T${thoiGianKetThuc}`);
  if (ketThuc <= batDau) {
    ketThuc.setDate(ketThuc.getDate() + 1);
  }
  return (ketThuc - batDau) / 3600000;
}
function formatDate(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}
function isWeekend(dateStr) {
  const date = new Date(dateStr);
  const day = date.getDay();
  return day === 0;
}
function tinhThueTNCN(thuNhapChiuThue) {
  let thue = 0;
  const bacThue = [
    { max: 5000000, rate: 0.05 },
    { max: 10000000, rate: 0.10 },
    { max: 18000000, rate: 0.15 },
    { max: 32000000, rate: 0.20 },
    { max: 52000000, rate: 0.25 },
    { max: 80000000, rate: 0.30 },
    { max: Infinity, rate: 0.35 },
  ];
  let start = 0;
  for (let i = 0; i < bacThue.length; i++) {
    const { max, rate } = bacThue[i];
    if (thuNhapChiuThue > start) {
      const taxable = Math.min(thuNhapChiuThue, max) - start;
      thue += taxable * rate;
      start = max;
    } else {
      break;
    }
  }
  return thue;
}
module.exports = {
  getSoNgayTrongThang,
  tinhTongGioLamCaLam,
  formatDate,
  isWeekend,
  tinhThueTNCN
};
