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
module.exports = { getSoNgayTrongThang, tinhTongGioLamCaLam };
