import { useState } from "react";
import { createThangLuong } from "../../api/apiThangLuong";
export function AddSalaryStructureForm({ setShowModalAdd, getAllThangLuong }) {
  const [form, setForm] = useState({
    LuongCoBan: 0,
    LuongTheoGio: 0,
    BacLuong: 1,
    SoNgayPhep: 0,
    LoaiNV: "FullTime",
    MaVaiTro: 2,
    TenCa: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "MaVaiTro") {
      if (value === "1") {
        setForm((prev) => ({
          ...prev,
          MaVaiTro: 1,
          LoaiNV: "FullTime",
        }));
      } else {
        setForm((prev) => ({
          ...prev,
          MaVaiTro: 2,
        }));
      }
      return;
    }
    if (name === "LoaiNV" && form.MaVaiTro === 1) return;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "LuongCoBan" || name === "LuongTheoGio"
          ? parseFloat(value)
          : name === "BacLuong"
          ? parseInt(value)
          : value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.LoaiNV === "FullTime") {
      if (
        !form.LuongCoBan ||
        !form.BacLuong ||
        !form.SoNgayPhep
      ) {
        alert("Vui lòng điền đầy đủ thông tin.");
        return;
      } else if (form.LuongCoBan < 0) {
          alert("Lương cơ bản không được âm");
        return;
      }
    } else {
      if (!form.LuongTheoGio || form.LuongTheoGio < 0) {
        alert("Vui lòng điền đầy đủ thông tin và lương theo giờ >= 0.");
        return;
      }
    }
    try {
      const result = await createThangLuong(form);
      if (!result.success) {
        alert(result.message || "Thêm thang lương thất bại.");
        return;
      }
      alert("Thêm thang lương thành công!");
      getAllThangLuong();
    } catch (err) {
      console.error("Lỗi không xác định:", err);
      alert("Lỗi không xác định. Vui lòng thử lại.");
    }
    setShowModalAdd(false);
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <form className="bg-white p-6 rounded shadow-lg w-full max-w-xl mx-auto relative z-10"
      onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-bold mb-4 text-center">
          Thêm thang lương mới
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Loại nhân viên */}
          <div>
            <label className="block mb-1 font-medium">Loại Nhân Viên</label>
            <select
              name="LoaiNV"
              id="LoaiNV"
              value={form.LoaiNV}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              disabled={form.MaVaiTro === 1}
            >
              <option value="FullTime">FullTime</option>
              <option value="PartTime">PartTime</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Chức vụ</label>
            <select
              name="MaVaiTro"
              id="MaVaiTro"
              value={form.MaVaiTro}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value={2}>Nhân viên</option>
              <option value={1}>Quản lý</option>
            </select>
          </div>
          {form.LoaiNV === "FullTime" && (
            <>
              <div>
                <label className="block mb-1 font-medium">Lương cơ bản</label>
                <input
                  type="number"
                  name="LuongCoBan"
                  value={form.LuongCoBan}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Bậc lương</label>
                <input
                  type="number"
                  name="BacLuong"
                  value={form.BacLuong}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  min={1}
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Số ngày phép</label>
                <input
                  type="number"
                  name="SoNgayPhep"
                  value={form.SoNgayPhep}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  min={1}
                />
              </div>
            </>
          )}
          {form.LoaiNV === "PartTime" && (
            <div>
              <label className="block mb-1 font-medium">Lương theo giờ</label>
              <input
                type="number"
                name="LuongTheoGio"
                value={form.LuongTheoGio}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          )}
        </div>
        <div className="mt-6 flex justify-between">
          <button
            type="button"
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded"
            onClick={() => setShowModalAdd(false)}
          >
            Thoát
          </button>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
          >
            Thêm thang lương
          </button>
        </div>
      </form>
    </div>
  );
}
