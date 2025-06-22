import { Edit, Plus } from "lucide-react";
import { updateChungChi } from "../../../api/apiChungChi";
import { updateHopDong } from "../../../api/apiHopDong";

export const EditHopDong = ({
  editingHopDong,
  setEditingHopDong,
  setShowEditModal,
  onSuccess,
}) => {
  const handleSaveUpdate = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("MaHDLD", editingHopDong.MaHDLD);
      formData.append("TenHD", editingHopDong.TenHD);
      formData.append("NgayBatDau", editingHopDong.NgayBatDau);
      formData.append("NgayKetThuc", editingHopDong.NgayKetThuc);
      formData.append("MaTK", editingHopDong.MaTK);

      // Append file if exists
      if (editingHopDong.fileObject) {
        formData.append("hopdong", editingHopDong.fileObject);
      }

      const result = await updateHopDong(formData);
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
    let NgayKetThuc = "";
    if (thoiHan && editingHopDong.NgayBatDau) {
      const NgayBatDau = new Date(editingHopDong.NgayBatDau);
      NgayBatDau.setMonth(NgayBatDau.getMonth() + parseInt(thoiHan));
      NgayKetThuc = NgayBatDau.toISOString().split("T")[0];
    }
    setEditingHopDong({
      ...editingHopDong,
      ThoiGianHieuLuc: thoiHan,
      NgayKetThuc: NgayKetThuc,
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

    setEditingHopDong({
      ...editingHopDong,
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
          value={editingHopDong.TenHD}
          onChange={(e) =>
            setEditingHopDong({
              ...editingHopDong,
              TenHD: e.target.value,
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
          value={editingHopDong.NgayBatDau}
          onChange={(e) =>
            setEditingHopDong({
              ...editingHopDong,
              NgayBatDau: e.target.value,
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
            editingHopDong.ThoiGianHieuLuc ||
            (editingHopDong.NgayBatDau && editingHopDong.NgayKetThuc
              ? Math.max(
                  0,
                  (new Date(editingHopDong.NgayKetThuc).getFullYear() -
                    new Date(editingHopDong.NgayBatDau).getFullYear()) *
                    12 +
                    (new Date(editingHopDong.NgayKetThuc).getMonth() -
                      new Date(editingHopDong.NgayBatDau).getMonth())
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
          value={editingHopDong.NgayKetThuc || ""}
          onChange={(e) =>
            setEditingHopDong({
              ...editingHopDong,
              NgayKetThuc: e.target.value,
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

      <div className="flex items-center">
        <input
          type="checkbox"
          id="trangThaiAdd"
          checked={editingHopDong.TrangThai}
          onChange={(e) =>
            setEditingHopDong({
              ...editingHopDong,
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
