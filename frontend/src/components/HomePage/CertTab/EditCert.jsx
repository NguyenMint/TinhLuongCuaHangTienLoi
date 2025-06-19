import { Edit, Plus } from "lucide-react";
import { updateChungChi } from "../../../api/apiChungChi";

export const EditCert = ({
  editingCertificate,
  setEditingCertificate,
  setShowEditModal,
  onSuccess,
}) => {
  const handleSaveUpdate = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("MaCC", editingCertificate.MaCC);
      formData.append("TenCC", editingCertificate.TenCC);
      formData.append("NoiDaoTao", editingCertificate.NoiDaoTao);
      formData.append("NgayCap", editingCertificate.NgayCap);
      formData.append("NgayHetHan", editingCertificate.NgayHetHan);
      formData.append("GhiChu", editingCertificate.GhiChu || "");
      formData.append("TrangThai", editingCertificate.TrangThai);
      formData.append("MaTK", editingCertificate.MaTK);

      // Append file if exists
      if (editingCertificate.fileObject) {
        formData.append("chungchi", editingCertificate.fileObject);
      }

      const result = await updateChungChi(formData);
      if (!result.success) {
        alert(result.message || "Thêm chứng chỉ thất bại.");
        return;
      }
      alert("Cập nhật chứng chỉ thành công!");
      setShowEditModal(false);
      onSuccess();
    } catch (error) {
      alert("Đã xảy ra lỗi khi thêm chứng chỉ: " + error.message);
    }
  };
  const handleThoiGianHieuLucChange = (e) => {
    const thoiHan = e.target.value;
    let ngayHetHan = "";
    if (thoiHan && editingCertificate.NgayCap) {
      const ngayCap = new Date(editingCertificate.NgayCap);
      ngayCap.setMonth(ngayCap.getMonth() + parseInt(thoiHan));
      ngayHetHan = ngayCap.toISOString().split("T")[0];
    }
    setEditingCertificate({
      ...editingCertificate,
      ThoiGianHieuLuc: thoiHan,
      NgayHetHan: ngayHetHan,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file.size > 5 * 1024 * 1024) {
      alert(
        "Dung lượng file quá lớn. Vui lòng chọn file có kích thước nhỏ hơn!"
      );
      e.target.value = "";
      return;
    } // 5MB limit for certificates

    setEditingCertificate({
      ...editingCertificate,
      FileCC: file ? file.name : "", // Store file name for display
      fileObject: file, // Store actual file object for upload
    });
  };
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tên chứng chỉ
        </label>
        <input
          type="text"
          value={editingCertificate.TenCC}
          onChange={(e) =>
            setEditingCertificate({
              ...editingCertificate,
              TenCC: e.target.value,
            })
          }
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nơi đào tạo
        </label>
        <input
          type="text"
          value={editingCertificate.NoiDaoTao}
          onChange={(e) =>
            setEditingCertificate({
              ...editingCertificate,
              NoiDaoTao: e.target.value,
            })
          }
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ngày cấp
        </label>
        <input
          type="date"
          value={editingCertificate.NgayCap}
          onChange={(e) =>
            setEditingCertificate({
              ...editingCertificate,
              NgayCap: e.target.value,
            })
          }
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Thời gian hiệu lực (tháng)
        </label>
        <input
          type="number"
          value={
            editingCertificate.ThoiGianHieuLuc ||
            (editingCertificate.NgayCap && editingCertificate.NgayHetHan
              ? Math.max(
                  0,
                  (new Date(editingCertificate.NgayHetHan).getFullYear() -
                    new Date(editingCertificate.NgayCap).getFullYear()) *
                    12 +
                    (new Date(editingCertificate.NgayHetHan).getMonth() -
                      new Date(editingCertificate.NgayCap).getMonth())
                )
              : "")
          }
          onChange={handleThoiGianHieuLucChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ngày hết hạn
        </label>
        <input
          type="date"
          value={editingCertificate.NgayHetHan || ""}
          onChange={(e) =>
            setEditingCertificate({
              ...editingCertificate,
              NgayHetHan: e.target.value,
            })
          }
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          File chứng chỉ (Chọn file mới nếu cần thay đổi)
        </label>
        <input
          type="file"
          name="file"
          onChange={handleFileChange}
          accept="application/pdf,image/png,image/jpeg,image/jpg"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ghi chú
        </label>
        <textarea
          value={editingCertificate.GhiChu}
          onChange={(e) =>
            setEditingCertificate({
              ...editingCertificate,
              GhiChu: e.target.value,
            })
          }
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="3"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="trangThaiAdd"
          checked={editingCertificate.TrangThai}
          onChange={(e) =>
            setEditingCertificate({
              ...editingCertificate,
              TrangThai: e.target.checked,
            })
          }
          className="mr-2"
        />
        <label htmlFor="trangThaiAdd" className="text-sm text-gray-700">
          Còn hiệu lực
        </label>
      </div>

      <div className="flex gap-2 pt-4">
        <button
          onClick={handleSaveUpdate}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
        >
          <Edit className="w-4 h-4 mr-2" />
          Cập nhật
        </button>
        <button
          onClick={() => setShowEditModal(false)}
          className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
        >
          Hủy
        </button>
      </div>
    </div>
  );
};
