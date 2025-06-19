import { Save } from "lucide-react";
import { createChungChi } from "../../../api/apiChungChi";

export const AddCert = ({
  editingCertificate,
  setEditingCertificate,
  setShowEditModal,
  onSuccess,
}) => {
  // Handle file selection separately
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

  const handleSaveAdd = async (e) => {
    e.preventDefault();

    if (!editingCertificate.fileObject) {
      alert("Vui lòng thêm file chứng chỉ.");
      return;
    }

    const now = new Date().toISOString().split("T")[0];
    if (editingCertificate.NgayHetHan && now > editingCertificate.NgayHetHan) {
      alert("Chứng chỉ đã hết hạn. Vui lòng thêm chứng chỉ khác");
      return;
    }

    try {
      const formData = new FormData();
      // Append text fields
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

      const result = await createChungChi(formData);
      if (!result.success) {
        alert(result.message || "Thêm chứng chỉ thất bại.");
        return;
      }
      alert("Thêm chứng chỉ thành công!");
      setShowEditModal(false);
      // Reset form state
      setEditingCertificate({
        MaTK: "",
        TenCC: "",
        NoiDaoTao: "",
        NgayCap: "",
        NgayHetHan: "",
        GhiChu: "",
        ThoiGianHieuLuc: "",
        TrangThai: false,
        FileCC: "",
        fileObject: null,
      });
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
  return (
    <form onSubmit={handleSaveAdd} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tên chứng chỉ
        </label>
        <input
          type="text"
          value={editingCertificate.TenCC || ""}
          onChange={(e) =>
            setEditingCertificate({
              ...editingCertificate,
              TenCC: e.target.value,
            })
          }
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nơi đào tạo
        </label>
        <input
          type="text"
          value={editingCertificate.NoiDaoTao || ""}
          onChange={(e) =>
            setEditingCertificate({
              ...editingCertificate,
              NoiDaoTao: e.target.value,
            })
          }
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ngày cấp
        </label>
        <input
          type="date"
          value={editingCertificate.NgayCap || ""}
          onChange={(e) =>
            setEditingCertificate({
              ...editingCertificate,
              NgayCap: e.target.value,
            })
          }
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
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
          disabled={editingCertificate.ThoiGianHieuLuc}
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
          File chứng chỉ
        </label>
        <input
          type="file"
          name="file"
          onChange={handleFileChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          accept="application/pdf,image/png,image/jpeg,image/jpg"
        />
        {editingCertificate.FileCC && (
          <p className="text-sm text-gray-600 mt-1">
            File đã chọn: {editingCertificate.FileCC}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ghi chú
        </label>
        <textarea
          value={editingCertificate.GhiChu || ""}
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
          id="trangThai"
          checked={editingCertificate.TrangThai || false}
          onChange={(e) =>
            setEditingCertificate({
              ...editingCertificate,
              TrangThai: e.target.checked,
            })
          }
          className="mr-2"
        />
        <label htmlFor="trangThai" className="text-sm text-gray-700">
          Còn hiệu lực
        </label>
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
          onClick={() => setShowEditModal(false)}
          className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
        >
          Hủy
        </button>
      </div>
    </form>
  );
};
