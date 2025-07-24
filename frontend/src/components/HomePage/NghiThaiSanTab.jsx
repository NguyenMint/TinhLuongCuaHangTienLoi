import React, { useState, useEffect } from "react";
import { getNghiThaiSanByMaTK, createNghiThaiSan, updateNghiThaiSan, deleteNghiThaiSan, uploadGiayThaiSan } from "../../api/apiNghiThaiSan";
import { Plus, Edit, Trash2, FileText } from "lucide-react";
import { FileViewerModal } from "./HopDongTab/FileViewerModal";

export const NghiThaiSanTab = ({ selectedEmployee, onSuccess }) => {
  const [nghiThaiSans, setNghiThaiSans] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    NgayBatDau: "",
    NgayKetThuc: "",
    TongSoNgayNghi: 0,
    TrangThai: "Chờ duyệt",
    FileGiayThaiSan: "",
    LuongNghiPhep: 0,
    MaTK: selectedEmployee?.MaTK || ""
  });
  const [uploading, setUploading] = useState(false);
  const [showFileViewer, setShowFileViewer] = useState(false);
  const [selectedNTS, setSelectedNTS] = useState(null);

  useEffect(() => {
    if (selectedEmployee) {
      getNghiThaiSanByMaTK(selectedEmployee.MaTK).then(res => setNghiThaiSans(res.data));
      setForm(f => ({ ...f, MaTK: selectedEmployee.MaTK }));
    }
  }, [selectedEmployee, showModal]);

  const handleAdd = () => {
    setEditing(null);
    setForm({
      NgayBatDau: "",
      NgayKetThuc: "",
      TongSoNgayNghi: 0,
      TrangThai: "Chờ duyệt",
      FileGiayThaiSan: "",
      LuongNghiPhep: 0,
      MaTK: selectedEmployee?.MaTK || ""
    });
    setShowModal(true);
  };

  const handleEdit = (nts) => {
    setEditing(nts.MaNTS);
    setForm({ ...nts });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa?")) {
      await deleteNghiThaiSan(id);
      onSuccess && onSuccess();
      setNghiThaiSans(nghiThaiSans.filter(n => n.MaNTS !== id));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await updateNghiThaiSan(editing, form);
    } else {
      await createNghiThaiSan(form);
    }
    setShowModal(false);
    onSuccess && onSuccess();
  };

  return (
    <div className="grid gap-6 mx-3">
      <div className="flex justify-end">
        <button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center">
          <Plus className="w-4 h-4 mr-2" /> Thêm nghỉ thai sản
        </button>
      </div>
      {nghiThaiSans.length > 0 ? (
        nghiThaiSans.map(nts => (
          <div key={nts.MaNTS} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="bg-gradient-to-r from-pink-500 to-pink-600 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold text-lg truncate">
                  Nghỉ thai sản #{nts.MaNTS}
                </h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${nts.TrangThai === "Đã duyệt" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                  {nts.TrangThai}
                </span>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <div>Thời gian: {nts.NgayBatDau} - {nts.NgayKetThuc}</div>
              <div>Số ngày nghỉ: {nts.TongSoNgayNghi}</div>
              <div>Phụ cấp thai sản: {nts.LuongNghiPhep}đ</div>
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
              <button onClick={() => handleEdit(nts)} className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center">
                <Edit className="w-4 h-4 mr-1" /> Sửa
              </button>
              <button onClick={() => handleDelete(nts.MaNTS)} className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center">
                <Trash2 className="w-4 h-4 mr-1" /> Xóa
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-gray-500">Chưa có kỳ nghỉ thai sản nào.</div>
      )}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">{editing ? "Chỉnh sửa" : "Thêm"} nghỉ thai sản</h2>
            <div className="mb-2">
              <label className="block text-sm">Ngày bắt đầu</label>
              <input type="date" className="border rounded px-2 py-1 w-full" value={form.NgayBatDau} onChange={e => setForm(f => ({ ...f, NgayBatDau: e.target.value }))} required />
            </div>
            <div className="mb-2">
              <label className="block text-sm">Ngày kết thúc</label>
              <input type="date" className="border rounded px-2 py-1 w-full" value={form.NgayKetThuc} onChange={e => setForm(f => ({ ...f, NgayKetThuc: e.target.value }))} required />
            </div>
            <div className="mb-2">
              <label className="block text-sm">Số ngày nghỉ</label>
              <input type="number" className="border rounded px-2 py-1 w-full" value={form.TongSoNgayNghi} onChange={e => setForm(f => ({ ...f, TongSoNgayNghi: e.target.value }))} required />
            </div>
            <div className="mb-2">
              <label className="block text-sm">Trạng thái</label>
              <select className="border rounded px-2 py-1 w-full" value={form.TrangThai} onChange={e => setForm(f => ({ ...f, TrangThai: e.target.value }))}>
                <option value="Chờ duyệt">Chờ duyệt</option>
                <option value="Đã duyệt">Đã duyệt</option>
                <option value="Đang nghĩ">Đang nghĩ</option>
                <option value="Đã kết thúc">Đã kết thúc</option>
              </select>
            </div>
            <div className="mb-2">
              <label className="block text-sm">Phụ cấp thai sản</label>
              <input type="number" className="border rounded px-2 py-1 w-full" value={form.LuongNghiPhep} onChange={e => setForm(f => ({ ...f, LuongNghiPhep: e.target.value }))} required />
            </div>
            <div className="mb-2">
              <label className="block text-sm">Upload giấy tờ</label>
              <input
                type="file"
                accept="image/*,application/pdf"
                className="border rounded px-2 py-1 w-full"
                disabled={uploading}
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setUploading(true);
                    try {
                      const res = await uploadGiayThaiSan(file);
                      setForm(f => ({ ...f, FileGiayThaiSan: res.data.filePath }));
                    } catch (err) {
                      alert("Lỗi upload file: " + (err?.response?.data?.error || err.message));
                    } finally {
                      setUploading(false);
                    }
                  }
                }}
                required={!editing}
              />
              {uploading && <div className="text-xs text-gray-500 mt-1">Đang upload...</div>}
              {form.FileGiayThaiSan && !uploading && (
                <a href={`/${form.FileGiayThaiSan}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-xs mt-1 inline-block">Xem file đã upload</a>
              )}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded bg-gray-200">Hủy</button>
              <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">Lưu</button>
            </div>
          </form>
        </div>
      )}
      <FileViewerModal
        show={showFileViewer}
        onClose={() => setShowFileViewer(false)}
        hopdong={selectedNTS ? {
          TenHD: `Giấy tờ nghỉ thai sản #${selectedNTS.MaNTS}`,
          File: selectedNTS.FileGiayThaiSan
        } : null}
      />  
    </div>
  );
}; 