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
function formatDate (date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
function isWeekend(dateStr) {
  const date = new Date(dateStr);
  const day = date.getDay();
  return day === 0;
}

module.exports = { getSoNgayTrongThang, tinhTongGioLamCaLam, formatDate, isWeekend };
