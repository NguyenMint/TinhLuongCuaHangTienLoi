import axios from "axios";
import { useState } from "react";
import { Save, XCircle } from "lucide-react";
import { createNguoiPhuThuoc } from "../../../api/apiNguoiPhuThuoc";
import { toast } from "react-toastify";
export const AddDependentPersonForm = ({
  employee,
  setShowModalAdd,
  fetchNguoiPhuThuoc,
}) => {
  const [form, setForm] = useState({
    HoTen: "",
    NgaySinh: "",
    DiaChi: "",
    SoDienThoai: "",
    CCCD: "",
    TruongHopPhuThuoc: "",
    QuanHe: "",
    MaTK:employee.MaTK
  });
  const handleUseEmployeeAddress = (e) => {
    if (e.target.checked) {
        setForm((prev) => ({
            ...prev,
            DiaChi: employee.DiaChi,
        }));
    } else {
        setForm((prev) => ({
            ...prev,
            DiaChi: "",
        }));
    }
  };
  const HandleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await createNguoiPhuThuoc(form);
      if (!result.success) {
        toast.error(result.message || "Thêm người phụ thuộc thất bại.");
        return;
      }
      toast.success("Thêm người phụ thuộc thành công!");
      fetchNguoiPhuThuoc();
    } catch (err) {
      console.error("Lỗi không xác định:", err);
      toast.error("Lỗi không xác định. Vui lòng thử lại.");
    }
    setShowModalAdd(false);
  };
  const HandleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Thêm người phụ thuộc</h3>
          <button
            onClick={() => {
              setShowModalAdd(false);
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={HandleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Họ tên
            </label>
            <input
              type="text"
              name="HoTen"
              value={form.HoTen}
              onChange={HandleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ngày sinh
            </label>
            <input
              type="date"
              name="NgaySinh"
              value={form.NgaySinh}
              onChange={HandleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Địa chỉ
            </label>
            <input
              type="text"
              name="DiaChi"
              value={form.DiaChi}
              onChange={HandleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex items-center">
            <input
                id="useEmployeeAddress"
                type="checkbox"
                onChange={handleUseEmployeeAddress}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="useEmployeeAddress" className="ml-2 block text-sm text-gray-900">
                Lấy địa chỉ của nhân viên
            </label>
        </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số điện thoại (Có thể bỏ trống)
            </label>
            <input
              type="text"
              name="SoDienThoai"
              value={form.SoDienThoai}
              onChange={HandleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CCCD (Có thể bỏ trống)
            </label>
            <input
              type="text"
              name="CCCD"
              value={form.CCCD}
              onChange={HandleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trường hợp phụ thuộc
            </label>
            <input
              type="text"
              name="TruongHopPhuThuoc"
              value={form.TruongHopPhuThuoc}
              onChange={HandleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quan hệ
            </label>
            <input
              type="text"
              name="QuanHe"
              value={form.QuanHe}
              onChange={HandleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
            >
              <Save className="w-4 h-4 mr-2" />
              Lưu
            </button>
            <button
              type="button"
              onClick={() => {
                setShowModalAdd(false);
              }}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
