import { useState } from "react";
import { updateThangLuong } from "../../api/apiThangLuong";
export function UpdateSalaryStructureForm({ setShowModalUpdate, getAllThangLuong,salaryStructure }) {
  const [form, setForm] = useState({
    LuongCoBan: salaryStructure.LuongCoBan ,
    LuongTheoGio: salaryStructure.LuongTheoGio ,
    BacLuong: salaryStructure.BacLuong ,
    SoNgayPhep: salaryStructure.SoNgayPhep ,
    LoaiNV: salaryStructure.LoaiNV ,
    MaVaiTro: salaryStructure.MaVaiTro ,
    MaThangLuong: salaryStructure.MaThangLuong,
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        value
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("form", form);
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
      }else if(form.SoNgayPhep > 28){
          alert("Số ngày phép không được vượt quá 28");
        return;
      }
    } else {
      if (!form.LuongTheoGio || form.LuongTheoGio < 0) {
        alert("Vui lòng điền đầy đủ thông tin và lương theo giờ >= 0.");
        return;
      }
    }
    try {
      const result = await updateThangLuong(form);
      if (!result.success) {
        alert(result.message || "Cập nhật thang lương thất bại.");
        return;
      }
      alert("Cập nhật thang lương thành công!");
      getAllThangLuong();
    } catch (err) {
      console.error("Lỗi không xác định:", err);
      alert("Lỗi không xác định. Vui lòng thử lại.");
    }
    setShowModalUpdate(false);
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
            onClick={() => setShowModalUpdate(false)}
          >
            Thoát
          </button>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
          >
            Cập nhật
          </button>
        </div>
      </form>
    </div>
  );
}
