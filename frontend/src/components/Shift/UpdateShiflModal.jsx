import { useState } from "react";
import { updateCaLam } from "../../api/apiCaLam.js";

export function UpdateShiftForm({
  setShowModalUpdate,
  getDataShift,
  shift,
}) {
  const [form, setForm] = useState({
    MaCa: shift.MaCa,
    TenCa: shift.TenCa,
    ThoiGianBatDau: shift.ThoiGianBatDau,
    ThoiGianKetThuc: shift.ThoiGianKetThuc,
    MoTa: shift.MoTa,
    HeSoLuong: shift.HeSoLuong,
  });
  const hours = Array.from({ length: 24 }, (_, i) =>
    i < 10 ? `0${i}` : `${i}`
  );
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
      const result = await updateCaLam(form);
      if (!result.success) {
        alert(result.message || "Update ca làm thất bại.");
        return;
      }
      alert("Update ca làm thành công!");
      getDataShift();
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
          Update ca làm việc
        </h2>

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
            <select
              name="ThoiGianBatDau"
              value={form.ThoiGianBatDau}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Chọn giờ</option>
              {hours.map((h) => (
                <option key={h} value={`${h}:00`}>{`${h}:00`}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Thời gian kết thúc</label>
            <select
              name="ThoiGianKetThuc"
              value={form.ThoiGianKetThuc}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Chọn giờ</option>
              {hours.map((h) => (
                <option key={h} value={`${h}:00`}>{`${h}:00`}</option>
              ))}
            </select>
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
            onClick={() => setShowModalUpdate(false)}
          >
            Thoát
          </button>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
}
