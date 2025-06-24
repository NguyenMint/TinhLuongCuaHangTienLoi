import { useState } from "react";
import { updateHeSoPhuCap } from "../../api/apiHeSoPC";
export function UpdateAllowanceCoefficientForm({
  setShowModalUpdate,
  getData,
  allowanceCoefficient,
}) {
  const [form, setForm] = useState({
    Ngay: allowanceCoefficient.ngay,
    LoaiNgay: allowanceCoefficient.loaiNgay,
    HeSoLuongCaDem: allowanceCoefficient.caDem.HeSoLuong,
    HeSoLuongCaThuong: allowanceCoefficient.caThuong.HeSoLuong,
    MaHSNCaDem: allowanceCoefficient.caDem.MaHSN,
    MaHSNCaThuong: allowanceCoefficient.caThuong.MaHSN
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await updateHeSoPhuCap(form);
      if (!result.success) {
        alert(result.message || "Update hệ số phụ cấp thất bại.");
        return;
      }
      alert("Update hệ số phụ cấp thành công!");
      getData();
    } catch (err) {
      console.error("Lỗi không xác định:", err);
      alert("Lỗi không xác định. Vui lòng thử lại.");
    }
    setShowModalUpdate(false);
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-lg w-full max-w-xl mx-auto relative z-10"
      >
        <h2 className="text-xl font-bold mb-4 text-center">
          Update hệ số phụ cấp
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Loại ngày</label>
            <select
              name="LoaiNgay"
              id="LoaiNgay"
              value={form.LoaiNgay}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              disabled
            >
              <option value="Ngày lễ">Ngày lễ</option>
              <option value="Cuối tuần">Cuối tuần</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Hệ số lương ca thường</label>
            <input
              type="number"
              step="0.1"
              name="HeSoLuongCaThuong"
              value={form.HeSoLuongCaThuong}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              min={1}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Hệ số lương ca đêm</label>
            <input
              type="number"
              step="0.1"
              name="HeSoLuongCaDem"
              value={form.HeSoLuongCaDem}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              min={1}
            />
          </div>
          {form.LoaiNgay === "Ngày lễ" && (
            <div>
              <label className="block mb-1 font-medium">Ngày áp dụng</label>
              <input
                type="date"
                name="Ngay"
                value={form.Ngay}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                min={1}
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
