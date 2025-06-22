import { Save } from "lucide-react";
import { createChungChi } from "../../../api/apiChungChi";
import { createHopDong } from "../../../api/apiHopDong";

export const AddHopDong = ({
  editingHopDong,
  setEditingHopDong,
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

    setEditingHopDong({
      ...editingHopDong,
      File: file ? file.name : "", // Store file name for display
      fileObject: file, // Store actual file object for upload
    });
  };

  const handleSaveAdd = async (e) => {
    e.preventDefault();

    if (!editingHopDong.fileObject) {
      alert("Vui lòng thêm file hợp đồng.");
      return;
    }

    const now = new Date().toISOString().split("T")[0];
    if (editingHopDong.NgayKetThuc && now > editingHopDong.NgayKetThuc) {
      alert("Hợp đồng đã hết hạn. Vui lòng thêm hợp đồng khác");
      return;
    }

    try {
      const formData = new FormData();
      // formData.append("MaHDLD", editingHopDong.MaHDLD);
      formData.append("TenHD", editingHopDong.TenHD);
      formData.append("NgayBatDau", editingHopDong.NgayBatDau);
      formData.append("NgayKy", editingHopDong.NgayBatDau);
      formData.append("NgayKetThuc", editingHopDong.NgayKetThuc);
      formData.append("MaTK", editingHopDong.MaTK);

      if (editingHopDong.fileObject) {
        formData.append("hopdong", editingHopDong.fileObject);
      }
      const result = await createHopDong(formData);
      if (!result.success) {
        alert(result.message || "Thêm hợp đồng thất bại.");
        return;
      }
      alert("Thêm hợp đồng thành công!");
      setShowEditModal(false);
      // Reset form state
      setEditingHopDong({
        MaTK: "",
        MaHDLD: "",
        TenHD: "",
        NgayBatDau: "",
        NgayKetThuc: "",
        GhiChu: "",
        ThoiGianHieuLuc: "",
        TrangThai: false,
        FileCC: "",
        fileObject: null,
      });
      onSuccess();
    } catch (error) {
      alert("Đã xảy ra lỗi khi thêm hợp đồng: " + error.message);
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
  return (
    <form onSubmit={handleSaveAdd} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tên hợp đồng
        </label>
        <input
          type="text"
          value={editingHopDong.TenHD || ""}
          onChange={(e) =>
            setEditingHopDong({
              ...editingHopDong,
              TenHD: e.target.value,
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
          value={editingHopDong.NgayBatDau || ""}
          onChange={(e) =>
            setEditingHopDong({
              ...editingHopDong,
              NgayBatDau: e.target.value,
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
          disabled={editingHopDong.ThoiGianHieuLuc}
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
          File hợp đồng
        </label>
        <input
          type="file"
          name="file"
          onChange={handleFileChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          accept="application/pdf,image/png,image/jpeg,image/jpg"
        />
        {editingHopDong.FileCC && (
          <p className="text-sm text-gray-600 mt-1">
            File đã chọn: {editingHopDong.FileCC}
          </p>
        )}
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="trangThai"
          checked={editingHopDong.TrangThai || false}
          onChange={(e) =>
            setEditingHopDong({
              ...editingHopDong,
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
