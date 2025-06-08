function getSoNgayTrongThang(thoigian) {
  const [nam, thang] = thoigian.split("-").map(Number);
  return new Date(nam, thang, 0).getDate();
}

module.exports = { getSoNgayTrongThang };
