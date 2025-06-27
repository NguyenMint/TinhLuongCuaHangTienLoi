import { useEffect, useState } from "react";
import {
  getAllThangLuongFullTime,
  getAllThangLuongPartTime,
} from "../../api/apiThangLuong";
import { formatCurrency } from "../../utils/format";
import { getAllQuanLyByChiNhanh } from "../../api/apiTaiKhoan";
import { updateEmployee } from "../../api/apiTaiKhoan";
export function UpdateEmployeeModal({
  setShowModalUpdate,
  chiNhanhs,
  employee,
  refreshEmployeeData,
}) {
  const [form, setForm] = useState({
    MaTK: employee.MaTK,
    HoTen: employee.HoTen,
    GioiTinh: employee.GioiTinh,
    Email: employee.Email,
    SoDienThoai: employee.SoDienThoai,
    GioiTinh: employee.GioiTinh,
    NgaySinh: employee.NgaySinh,
    DiaChi: employee.DiaChi,
    CCCD: employee.CCCD,
    LoaiNV: employee.LoaiNV,
    TenNganHang: employee.TenNganHang,
    STK: employee.STK,
    BacLuong: employee.BacLuong,
    LuongCoBanHienTai: employee.LuongCoBanHienTai,
    LuongTheoGioHienTai: employee.LuongTheoGioHienTai,
    SoNgayNghiPhep: employee.SoNgayNghiPhep,
    MaVaiTro: employee.MaVaiTro,
    MaCN: employee.MaCN,
    QuanLyBoi: employee.QuanLyBoi,
    ThangLuong: "",
  });
  const [thangLuong, setThangLuong] = useState([]);
  const [mauLuong, setMauLuong] = useState([]);
  const [quanLys, setQuanLys] = useState([]);
    const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "ThangLuong" && form.LoaiNV === "FullTime") {
      const { BacLuong, LuongCoBanHienTai, LuongTheoGioHienTai } =
        JSON.parse(value);
      setForm((prev) => ({
        ...prev,
        BacLuong,
        LuongCoBanHienTai,
        LuongTheoGioHienTai,
        ThangLuong:value
      }));
      return;
    }
    if (name === "ThangLuong" && form.LoaiNV === "PartTime") {
      const { LuongTheoGio } = JSON.parse(value);
      setForm((prev) => ({
        ...prev,
        LuongCoBanHienTai: 0,
        LuongTheoGioHienTai: LuongTheoGio,
        ThangLuong:value
      }));
      return;
    }
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.HoTen ||
      !form.Email ||
      !form.SoDienThoai ||
      !form.NgaySinh ||
      !form.DiaChi ||
      !form.MaCN ||
      !form.CCCD ||
      !form.TenNganHang ||
      !form.STK
    ) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const avatarInput = document.querySelector('input[name="avatar"]');
    const avatarFile = avatarInput && avatarInput.files[0];
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }
    if (form.LoaiNV === "PartTime") {
      formData.set("BacLuong", 0);
      formData.set("MaVaiTro", 2);
    }
    const result = await updateEmployee(formData);
    if (!result.success) {
      alert(result.message || "Update nhân viên thất bại.");
      return;
    }
    alert("Update nhân viên thành công!");
    refreshEmployeeData();
    setShowModalUpdate(false);
  };
  const fetchAllThangLuongFullTime = async () => {
    try {
      const response = await getAllThangLuongFullTime();
      setThangLuong(response);
    } catch (error) {
      console.error("Lỗi khi lấy Tháng lương:", error);
    }
  };
  const fetchAllThangLuongPartTime = async () => {
    try {
      const response = await getAllThangLuongPartTime();
      setMauLuong(response);
    } catch (error) {
      console.error("Lỗi khi lấy Tháng lương:", error);
    }
  };
  const fetchAllQuanLyByChiNhanh = async () => {
    try {
      const response = await getAllQuanLyByChiNhanh(form.MaCN);
      setQuanLys(response);
    } catch (error) {
      console.error("Lỗi khi lấy Quản lý:", error);
    }
  };
  useEffect(() => {
    fetchAllThangLuongFullTime();
    fetchAllThangLuongPartTime();
  }, []);
  useEffect(() => {
    fetchAllQuanLyByChiNhanh();
  }, [form.MaCN]);
  const [isThangLuongInitialized, setIsThangLuongInitialized] = useState(false);

useEffect(() => {
  if (!isThangLuongInitialized) {
    if (form.LoaiNV === "FullTime" && thangLuong.length > 0) {
      const current = thangLuong.find(
        (tl) =>
          tl.BacLuong === form.BacLuong &&
          tl.LuongCoBan === form.LuongCoBanHienTai
      );
      if (current) {
        setForm((prev) => ({
          ...prev,
          ThangLuong: JSON.stringify({
            BacLuong: current.BacLuong,
            LuongCoBanHienTai: current.LuongCoBan,
            LuongTheoGioHienTai: current.LuongTheoGio,
          }),
        }));
        setIsThangLuongInitialized(true);
      }
    }
    if (form.LoaiNV === "PartTime" && mauLuong.length > 0) {
      const current = mauLuong.find(
        (ml) => ml.LuongTheoGio === form.LuongTheoGioHienTai
      );
      if (current) {
        setForm((prev) => ({
          ...prev,
          ThangLuong: JSON.stringify({
            LuongTheoGio: current.LuongTheoGio,
          }),
        }));
        setIsThangLuongInitialized(true);
      }
    }
  }
  // eslint-disable-next-line
}, [thangLuong, mauLuong, form.LoaiNV]);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <form
        className="bg-white p-6 rounded shadow-lg w-full max-w-4xl mx-auto relative z-10"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-bold mb-4 text-center">Update nhân viên</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-1 font-medium">Họ tên</label>
            <input
              type="text"
              name="HoTen"
              value={form.HoTen}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              name="Email"
              value={form.Email}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">CCCD</label>
            <input
              type="text"
              name="CCCD"
              value={form.CCCD}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Số điện thoại</label>
            <input
              type="text"
              name="SoDienThoai"
              value={form.SoDienThoai}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Giới tính</label>
            <select
              name="GioiTinh"
              value={form.GioiTinh}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value={true}>Nam</option>
              <option value={false}>Nữ</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Ngày sinh</label>
            <input
              type="date"
              name="NgaySinh"
              value={form.NgaySinh}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Địa chỉ</label>
            <input
              type="text"
              name="DiaChi"
              value={form.DiaChi}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Avatar</label>
            <input type="file" name="avatar"></input>
          </div>
          {form.LoaiNV === "FullTime" && (
            <div>
              <label className="block mb-1 font-medium">Chức vụ</label>
              <select
                name="MaVaiTro"
                value={form.MaVaiTro}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value={2}>Nhân viên</option>
                <option value={1}>Quản lý</option>
              </select>
            </div>
          )}
          <div>
            <label className="block mb-1 font-medium">Loại NV</label>
            <select
              name="LoaiNV"
              value={form.LoaiNV}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="FullTime">FullTime</option>
              <option value="PartTime">PartTime</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Chi nhánh</label>
            <select
              name="MaCN"
              value={form.MaCN}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              {chiNhanhs.map((cn) => (
                <option value={cn.MaCN}>{cn.TenChiNhanh}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Tên ngân hàng</label>
            <input
              type="text"
              name="TenNganHang"
              value={form.TenNganHang}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Số tài khoản</label>
            <input
              type="text"
              name="STK"
              value={form.STK}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          {form.LoaiNV === "FullTime" && (
            <div>
              <label className="block mb-1 font-medium">Thang lương</label>
              <select
                name="ThangLuong"
                value={form.ThangLuong}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              >
                {thangLuong
                  .filter((tl) => tl.MaVaiTro === Number(form.MaVaiTro))
                  .map((thangluong) => (
                    <option
                      value={JSON.stringify({
                        BacLuong: thangluong.BacLuong,
                        LuongCoBanHienTai: thangluong.LuongCoBan,
                        LuongTheoGioHienTai: thangluong.LuongTheoGio,
                      })}
                    >
                      Bậc lương: {thangluong.BacLuong}, Lương cơ bản:{" "}
                      {formatCurrency(thangluong.LuongCoBan)}
                    </option>
                  ))}
              </select>
            </div>
          )}
          {form.LoaiNV === "PartTime" && (
            <div>
              <label className="block mb-1 font-medium">Mẫu lương</label>
              <select
                name="ThangLuong"
                value={form.ThangLuong}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              >
                <option value="">Chọn mẫu lương</option>
                {mauLuong.map((mauluong) => (
                  <option
                    value={JSON.stringify({
                      LuongTheoGio: mauluong.LuongTheoGio,
                    })}
                  >
                    Lương theo giờ: {formatCurrency(mauluong.LuongTheoGio)}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="block mb-1 font-medium">
              Số ngày nghỉ phép trong năm
            </label>
            <input
              type="number"
              name="SoNgayNghiPhep"
              value={form.SoNgayNghiPhep}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              min={0}
            />
          </div>
          {form.MaVaiTro === "2" && (
            <div>
              <label className="block mb-1 font-medium">Quản lý bởi</label>
              <select
                name="QuanLyBoi"
                value={form.QuanLyBoi}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Chọn quản lý</option>
                {quanLys.map((ql) => (
                  <option value={ql.MaTK}>{ql.HoTen}</option>
                ))}
              </select>
            </div>
          )}
        </div>
        <div className="mt-6 flex justify-between">
          <button
            type="button"
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded"
            onClick={() => setShowModalUpdate(false)}
          >
            Thoát
          </button>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
          >
            Update nhân viên
          </button>
        </div>
      </form>
    </div>
  );
}
