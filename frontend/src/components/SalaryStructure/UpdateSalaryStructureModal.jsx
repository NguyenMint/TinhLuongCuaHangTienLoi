import { useState } from "react";
import { updateThangLuong } from "../../api/apiThangLuong";
import { formatCurrency } from "../../utils/format";
export function UpdateSalaryStructureForm({ setShowModalUpdate, getAllThangLuongFullTime,getAllThangLuongParTime,salaryStructure }) {
  const [form, setForm] = useState({
    LuongCoBan: salaryStructure.LuongCoBan ,
    LuongTheoGio: salaryStructure.LuongTheoGio ,
    BacLuong: salaryStructure.BacLuong ,
    LoaiNV: salaryStructure.LoaiNV ,
    MaVaiTro: salaryStructure.MaVaiTro ,
    MaThangLuong: salaryStructure.MaThangLuong,
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    if(name === "LuongCoBan" || name === "LuongTheoGio"){
      const number = value.replace(/[^0-9]/g, "");
      setForm((prev) => ({
        ...prev,
        [name]: number
      }));
      return;
    }
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
        !form.BacLuong
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
      const result = await updateThangLuong(form);
      if (!result.success) {
        alert(result.message || "Cập nhật thang lương thất bại.");
        return;
      }
      alert("Cập nhật thang lương thành công!");
      getAllThangLuongFullTime();
      getAllThangLuongParTime();
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
          Update thang lương mới
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
                  type="text"
                  name="LuongCoBan"
                  value={formatCurrency(form.LuongCoBan)}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  inputMode="numeric"
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
            </>
          )}
          {form.LoaiNV === "PartTime" && (
            <div>
              <label className="block mb-1 font-medium">Lương theo giờ</label>
              <input
                type="text"
                name="LuongTheoGio"
                value={formatCurrency(form.LuongTheoGio)}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                inputMode="numeric"
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
