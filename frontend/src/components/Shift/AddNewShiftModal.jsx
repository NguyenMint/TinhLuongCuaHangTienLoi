import { useState } from "react";
import { createCaLam } from "../../api/apiCaLam.js";
import { toast } from "react-toastify";

export function AddShiftForm({ setShowModalAdd, getDataShift }) {
  const [form, setForm] = useState({
    TenCa: "",
    ThoiGianBatDau: "",
    ThoiGianKetThuc: "",
    MoTa: "",
    isCaDem: 0,
  });
  const hours = Array.from({ length: 24 }, (_, i) =>
    i < 10 ? `0${i}` : `${i}`
  );
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

    if (
      !form.TenCa ||
      !form.ThoiGianBatDau ||
      !form.ThoiGianKetThuc ||
      !form.MoTa
    ) {
      toast.warning("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    try {
      
      const result = await createCaLam(form);
      if (!result.success) {
        toast.error(result.message || "Thêm ca làm thất bại.");
        return;
      }
      toast.success("Thêm ca làm thành công!");
      getDataShift();
    } catch (err) {
      console.error("Lỗi không xác định:", err);
      toast.error("Lỗi không xác định. Vui lòng thử lại.");
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
          <div className="col-span-2 flex items-end gap-4">
            <div className="flex-1">
              <label className="block mb-1 font-medium">Tên ca</label>
              <input
                type="text"
                name="TenCa"
                value={form.TenCa}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isCaDem"
                checked={form.isCaDem}
                onChange={handleChange}
                className="w-5 h-5 accent-blue-600"
              />
              <label className="ml-2 font-medium">Ca đêm</label>
            </div>
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
