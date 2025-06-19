import { useState } from "react";
import { updateHeSoPhuCap } from "../../api/apiHeSoPC";
export function UpdateAllowanceCoefficientForm({ setShowModalUpdate, getData,allowanceCoefficient }) {
  const [form, setForm] = useState({
    Ngay: allowanceCoefficient.Ngay,
    LoaiNgay: allowanceCoefficient.LoaiNgay,
    HeSoLuong: allowanceCoefficient.HeSoLuong,
    isCaDem: allowanceCoefficient.isCaDem,
    MaHSN: allowanceCoefficient.MaHSN
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "isCaDem") {
      setForm((prev) => ({
        ...prev,
        [name]: e.target.checked ? 1 : 0,
      }));
    } else {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    }
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
            <label className="block mb-1 font-medium">Hệ số lương</label>
            <input
              type="number"
              step="0.1"
              name="HeSoLuong"
              value={form.HeSoLuong}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              min={1}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Ca đêm</label>
            <input
              type="checkbox"
              name="isCaDem"
              checked={form.isCaDem}
              onChange={handleChange}
              className="w-5 h-5 accent-blue-600"
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
