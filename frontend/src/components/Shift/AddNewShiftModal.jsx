import { useState } from "react";
import { createCaLam } from "../../api/apiCaLam.js";

export default function AddShiftForm({ setShowModalAdd, getDataShift }) {
  const [form, setForm] = useState({
    TenCa: "",
    ThoiGianBatDau: "",
    ThoiGianKetThuc: "",
    MoTa: "",
    HeSoLuong: 1,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "HeSoLuong" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.TenCa ||
      !form.ThoiGianBatDau ||
      !form.ThoiGianKetThuc ||
      !form.MoTa ||
      form.HeSoLuong < 1
    ) {
      alert("Vui lòng điền đầy đủ thông tin và hệ số >= 1.");
      return;
    }

    try {
      const result = await createCaLam(form);
      if (!result.success) {
        alert(result.message || "Thêm ca làm thất bại.");
        return;
      }
      alert("Thêm ca làm thành công!");
      getDataShift();
    } catch (err) {
      console.error("Lỗi không xác định:", err);
      alert("Lỗi không xác định. Vui lòng thử lại.");
    }
    setShowModalAdd(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-lg w-full max-w-xl mx-auto relative z-10"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Thêm ca làm việc</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Tên ca</label>
            <input
              type="text"
              name="TenCa"
              value={form.TenCa}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
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
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Thời gian bắt đầu</label>
            <input
              type="time"
              name="ThoiGianBatDau"
              value={form.ThoiGianBatDau}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Thời gian kết thúc</label>
            <input
              type="time"
              name="ThoiGianKetThuc"
              value={form.ThoiGianKetThuc}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block mb-1 font-medium">Mô tả</label>
          <textarea
            name="MoTa"
            value={form.MoTa}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            rows={3}
          ></textarea>
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
            Thêm ca
          </button>
        </div>
      </form>
    </div>
  );
}
