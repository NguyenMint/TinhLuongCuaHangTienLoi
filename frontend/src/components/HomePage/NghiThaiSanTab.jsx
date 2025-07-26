import React, { useState, useEffect } from "react";
import {
  getNghiThaiSanByMaTK,
  createNghiThaiSan,
  updateNghiThaiSan,
  deleteNghiThaiSan,
  uploadGiayThaiSan,
} from "../../api/apiNghiThaiSan";
import { Plus, Edit, Trash2, FileText } from "lucide-react";
import { FileViewerModal } from "./HopDongTab/FileViewerModal";
import { formatDate } from "../../utils/format";
import { toast } from "react-toastify";

export const NghiThaiSanTab = ({ selectedEmployee, onSuccess }) => {
  const [nghiThaiSans, setNghiThaiSans] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    NgayBatDau: "",
    NgayKetThuc: "",
    TongSoNgayNghi: 0,
    TrangThai: 1,
    FileGiayThaiSan: "",
    LuongNghiPhep: 0,
    MaTK: selectedEmployee?.MaTK || "",
  });
  const [uploading, setUploading] = useState(false);
  const [showFileViewer, setShowFileViewer] = useState(false);
  const [selectedNTS, setSelectedNTS] = useState(null);
  const [errors, setErrors] = useState({});

  const calculateDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.NgayBatDau) {
      newErrors.NgayBatDau = "Vui lòng chọn ngày bắt đầu";
    }

    if (!form.NgayKetThuc) {
      newErrors.NgayKetThuc = "Vui lòng chọn ngày kết thúc";
    }

    const now = new Date().toISOString().split("T")[0];
    if (form.NgayKetThuc && now > form.NgayKetThuc) {
      toast.warning("Hợp đồng đã hết hạn. Vui lòng thêm hợp đồng khác");
      return;
    }

    if (form.NgayBatDau && form.NgayKetThuc) {
      const startDate = new Date(form.NgayBatDau);
      const endDate = new Date(form.NgayKetThuc);

      if (startDate > endDate) {
        newErrors.NgayKetThuc = "Ngày kết thúc phải sau ngày bắt đầu";
      }

      // Kiểm tra khoảng thời gian hợp lý cho thai sản (thường 4-6 tháng)
      const daysDiff = calculateDays(form.NgayBatDau, form.NgayKetThuc);
      if (daysDiff < 30) {
        newErrors.NgayKetThuc = "Thời gian nghỉ thai sản tối thiểu 30 ngày";
      }
      if (daysDiff > 365) {
        newErrors.NgayKetThuc = "Thời gian nghỉ thai sản tối đa 365 ngày";
      }
    }

    if (!form.LuongNghiPhep || form.LuongNghiPhep < 0) {
      newErrors.LuongNghiPhep = "Phụ cấp thai sản phải lớn hơn 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (form.NgayBatDau && form.NgayKetThuc) {
      const days = calculateDays(form.NgayBatDau, form.NgayKetThuc);
      const luong = form.MaPhuCap_phu_cap?.GiaTriPhuCap;

      setForm((prev) => ({
        ...prev,
        TongSoNgayNghi: days,
        LuongNghiPhep: luong,
      }));
    }
  }, [form.NgayBatDau, form.NgayKetThuc]);

  useEffect(() => {
    if (selectedEmployee) {
      const fetchData = async () => {
        const res = await getNghiThaiSanByMaTK(selectedEmployee.MaTK);
        if (res.success) {
          setNghiThaiSans(res.data);
        } else {
          console.error("Lỗi lấy nghỉ thai sản:", res.message);
        }
        setForm((f) => ({ ...f, MaTK: selectedEmployee.MaTK }));
      };
      fetchData();
    }
  }, [selectedEmployee, showModal]);

  const handleAdd = () => {
    setEditing(null);
    setForm({
      NgayBatDau: "",
      NgayKetThuc: "",
      TongSoNgayNghi: 0,
      TrangThai: 1,
      FileGiayThaiSan: "",
      LuongNghiPhep: 0,
      MaTK: selectedEmployee?.MaTK || "",
    });
    setShowModal(true);
  };

  const handleEdit = (nts) => {
    setEditing(nts.MaNTS);
    setForm({ ...nts });
    setShowModal(true);
  };

  const handleDelete = async (MaNTS) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa?")) {
      await deleteNghiThaiSan(MaNTS);
      onSuccess && onSuccess();
      setNghiThaiSans(nghiThaiSans.filter((n) => n.MaNTS !== MaNTS));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (editing) {
        await updateNghiThaiSan(editing, form);
      } else {
        await createNghiThaiSan(form);
      }
      setShowModal(false);
      setErrors({});
      onSuccess && onSuccess();
    } catch (error) {
      console.error("Lỗi khi lưu nghỉ thai sản:", error);
      toast.error("Có lỗi xảy ra khi lưu dữ liệu. Vui lòng thử lại.");
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Kiểm tra kích thước file (giới hạn 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.warning("File không được vượt quá 10MB");
        return;
      }

      setUploading(true);
      try {
        const res = await uploadGiayThaiSan(file);
        setForm((f) => ({
          ...f,
          FileGiayThaiSan: res.data.filePath,
        }));
      } catch (err) {
        toast.error(
          "Lỗi upload file: " + (err?.response?.data?.error || err.message)
        );
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div className="grid gap-6 mx-3">
      <div className="flex justify-end">
        <button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" /> Thêm nghỉ thai sản
        </button>
      </div>
      {nghiThaiSans.length > 0 ? (
        nghiThaiSans.map((nts) => (
          <div
            key={nts.MaNTS}
            className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="bg-gradient-to-r from-pink-500 to-pink-600 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold text-lg truncate">
                  Nghỉ thai sản #{nts.MaNTS}
                </h3>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    nts.TrangThai == 1
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {nts.TrangThai == 1 ? "Còn hiệu lực" : "Hết hieuu lực"}
                </span>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <div>
                Thời gian: {formatDate(nts.NgayBatDau)} đến{" "}
                {formatDate(nts.NgayKetThuc)}
              </div>
              <div>Thời gian có hiệu lực: {nts.TongSoNgayNghi} ngày</div>
              <div>
                <button
                  type="button"
                  className="text-blue-600 flex items-center hover:underline"
                  onClick={() => {
                    setSelectedNTS(nts);
                    setShowFileViewer(true);
                  }}
                >
                  <FileText className="w-4 h-4 mr-1" /> Xem giấy tờ
                </button>
              </div>
            </div>
            <div className="px-4 pb-4 flex gap-2">
              <button
                onClick={() => handleEdit(nts)}
                className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center"
              >
                <Edit className="w-4 h-4 mr-1" /> Sửa
              </button>
              <button
                onClick={() => handleDelete(nts.MaNTS)}
                className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center"
              >
                <Trash2 className="w-4 h-4 mr-1" /> Xóa
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-gray-500">
          Chưa có kỳ nghỉ thai sản nào.
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-lg font-bold mb-4">
              {editing ? "Chỉnh sửa" : "Thêm"} nghỉ thai sản
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày bắt đầu <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className={`border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.NgayBatDau ? "border-red-500" : "border-gray-300"
                }`}
                value={form.NgayBatDau}
                onChange={(e) => {
                  setForm((f) => ({ ...f, NgayBatDau: e.target.value }));
                  if (errors.NgayBatDau) {
                    setErrors((prev) => ({ ...prev, NgayBatDau: "" }));
                  }
                }}
                required
              />
              {errors.NgayBatDau && (
                <p className="text-red-500 text-xs mt-1">{errors.NgayBatDau}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày kết thúc <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className={`border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.NgayKetThuc ? "border-red-500" : "border-gray-300"
                }`}
                value={form.NgayKetThuc}
                onChange={(e) => {
                  setForm((f) => ({ ...f, NgayKetThuc: e.target.value }));
                  if (errors.NgayKetThuc) {
                    setErrors((prev) => ({ ...prev, NgayKetThuc: "" }));
                  }
                }}
                min={form.NgayBatDau} // Ngày kết thúc không được trước ngày bắt đầu
                required
              />
              {errors.NgayKetThuc && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.NgayKetThuc}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số ngày nghỉ
              </label>
              <input
                type="number"
                className="border border-gray-300 rounded px-3 py-2 w-full bg-gray-100"
                value={form.TongSoNgayNghi}
                readOnly // Chỉ đọc vì được tính tự động
              />
              <p className="text-xs text-gray-500 mt-1">
                Số ngày được tính tự động dựa trên ngày bắt đầu và kết thúc
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trạng thái
              </label>
              <select
                className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.TrangThai}
                onChange={(e) =>
                  setForm((f) => ({ ...f, TrangThai: e.target.value }))
                }
              >
                <option value="1">Còn hiệu lực</option>
                <option value="2">Hết hiệu lực</option>

              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phụ cấp thai sản (VNĐ) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="1000"
                className={`border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.LuongNghiPhep ? "border-red-500" : "border-gray-300"
                }`}
                value={form.LuongNghiPhep}
                onChange={(e) => {
                  setForm((f) => ({
                    ...f,
                    LuongNghiPhep: Number(e.target.value),
                  }));
                  if (errors.LuongNghiPhep) {
                    setErrors((prev) => ({ ...prev, LuongNghiPhep: "" }));
                  }
                }}
                placeholder="Nhập số tiền phụ cấp"
                required
              />
              {errors.LuongNghiPhep && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.LuongNghiPhep}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload giấy tờ <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept="image/*,application/pdf"
                className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={uploading}
                onChange={handleFileUpload} 
                required={!editing && !form.FileGiayThaiSan}
              />
              {uploading && (
                <div className="text-xs text-blue-600 mt-1 flex items-center">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-1"></div>
                  Đang upload...
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Chấp nhận file ảnh (JPG, PNG) hoặc PDF, tối đa 10MB
              </p>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setErrors({});
                }}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-700 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? "Đang xử lý..." : "Lưu"}
              </button>
            </div>
          </form>
        </div>
      )}
      <FileViewerModal
        show={showFileViewer}
        onClose={() => setShowFileViewer(false)}
        hopdong={
          selectedNTS
            ? {
                TenHD: `Giấy tờ nghỉ thai sản #${selectedNTS.MaNTS}`,
                File: selectedNTS.FileGiayThaiSan,
              }
            : null
        }
      />
    </div>
  );
};
