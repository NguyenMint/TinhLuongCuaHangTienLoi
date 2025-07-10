import { useState } from "react";
import { updateChiNhanh } from "../../api/apiChiNhanh";

export function UpdateBranchForm({ setShowModalUpdate, fetchAllBranch, branch }) {
  const [form, setForm] = useState({
    MaCN:branch.MaCN,
    TenChiNhanh:branch.TenChiNhanh,
    DiaChi:branch.DiaChi
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

    if (
      !form.TenChiNhanh ||
      !form.DiaChi
    ) {
      alert("Vui lòng điền đầy đủ thông tin.");
      return;
    }
    try {  
      const result = await updateChiNhanh(form);
      if (!result.success) {
        alert(result.message || "Update chi nhánh thất bại.");
        return;
      }
      alert("Update chi nhánh thành công!");
      fetchAllBranch();
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
        <h2 className="text-xl font-bold mb-4 text-center">Update chi nhánh</h2>

          <div className="mt-4">
              <label className="block mb-1 font-medium">Tên chi nhánh</label>
              <input
                type="text"
                name="TenChiNhanh"
                value={form.TenChiNhanh}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
          </div>

        <div className="mt-4">
          <label className="block mb-1 font-medium">Địa chỉ</label>
          <input
                type="text"
                name="DiaChi"
                value={form.DiaChi}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
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
