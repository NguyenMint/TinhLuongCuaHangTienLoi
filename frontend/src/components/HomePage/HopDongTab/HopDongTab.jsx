import React, { useState } from "react";
import {
  Calendar,
  MapPin,
  FileText,
  Check,
  X,
  Download,
  Edit,
  Trash2,
  Plus,
  Save,
  XCircle,
} from "lucide-react";
import { formatDate } from "../../../utils/format";
import { Modal } from "./ModalComponent";
import { createChungChi, deleteChungChi } from "../../../api/apiChungChi";
import { FileViewerModal } from "./FileViewerModal";
import { EditHopDong } from "./EditHopDong";
import { AddHopDong } from "./AddHopDong";
import { deleteHopDong } from "../../../api/apiHopDong";
import { toast } from "react-toastify";

export const HopDongTab = ({
  hopDongs,
  onEdit,
  onDelete,
  selectedEmployee,
  onSuccess,
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFileViewer, setShowFileViewer] = useState(false);
  const [selectedHopDong, setSelectedHopDong] = useState(null);
  const [editingHopDong, setEditingHopDong] = useState({
    MaTK: selectedEmployee.MaTK,
    TenHD: "",
    NgayKy: "",
    NgayBatDau: "",
    FileCC: "",
    NgayKetThuc: "",
  });

  const handleEdit = (hopdong) => {
    setEditingHopDong({
      ...hopdong,
      NgayBatDau: hopdong.NgayBatDau
        ? new Date(hopdong.NgayBatDau).toISOString().split("T")[0]
        : "",
    });
    setShowEditModal(true);
  };

  const handleDelete = async (hopdong) => {
    if (
      window.confirm(`Bạn có chắc chắn muốn xóa hợp đồng "${hopdong.TenHD}"?`)
    ) {
      try {
        const result = await deleteHopDong(hopdong.MaHDLD);
        if (result && result.success === false) {
          toast.error(result.message || "Xóa hợp đồng thất bại.");
        } else {
          onSuccess();
        }
      } catch (error) {
        toast.error("Đã xảy ra lỗi khi xóa hợp đồng.");
        console.error(error);
      }
    }
  };

  const handleAddNew = () => {
    setEditingHopDong({
      MaTK: selectedEmployee.MaTK,
      TenHD: "",
      NgayKy: "",
      NgayBatDau: "",
      FileCC: "",
      NgayKetThuc: "",
    });
    setShowAddModal(true);
  };
  const handleDownload = async (hopdong) => {
    try {
      const fileUrl = `${process.env.REACT_APP_BACKEND_URL}/${hopdong.FileCC}`;
      const fileName = hopdong.TenHD;
      const response = await fetch(fileUrl, {
        method: "GET",
        headers: {
          // "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Không thể tải file.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi tải file: " + error.message);
      console.error(error);
    }
  };

  const handleViewFile = (hopdong) => {
    setSelectedHopDong(hopdong);
    setShowFileViewer(true);
  };

  return (
    <div className="grid gap-6 mx-3">
      {hopDongs?.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={handleAddNew}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Thêm hợp đồng mới
          </button>
        </div>
      )}
      {hopDongs?.length > 0 ? (
        hopDongs.map((hd) => (
          <div
            key={hd.MaHDLD}
            className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold text-lg truncate">
                  {hd.TenHD}
                </h3>
                <div className="flex items-center">
                  {hd.TrangThai ? (
                    <Check className="w-5 h-5 text-green-300" />
                  ) : (
                    <X className="w-5 h-5 text-red-300" />
                  )}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                <span className="text-sm">
                  {formatDate(hd.NgayBatDau)}
                  {hd.NgayKetThuc ? ` - ${formatDate(hd.NgayKetThuc)}` : ""}
                </span>
              </div>

              <div className="flex items-center text-gray-600">
                <FileText className="w-4 h-4 mr-2 text-gray-400" />
                <span
                  className="text-sm truncate flex-1 cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => handleViewFile(hd)}
                  title="Click để xem file"
                >
                  Xem file
                </span>
              </div>

              {hd.GhiChu && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {hd.GhiChu}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    hd.TrangThai
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {hd.TrangThai ? "Còn hiệu lực" : "Hết hiệu lực"}
                </span>
              </div>
            </div>

            <div className="px-4 pb-4 flex gap-2">
              <button
                onClick={() => handleEdit(hd)}
                className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center"
              >
                <Edit className="w-4 h-4 mr-1" />
                Sửa
              </button>
              <button
                onClick={() => handleDelete(hd)}
                className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Xóa
              </button>
              <button
                onClick={() => handleDownload(hd)}
                className="flex-1 bg-green-50 hover:bg-green-100 text-green-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center"
              >
                <Download className="w-4 h-4 mr-1" />
                Tải về
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8">
          <button
            onClick={handleAddNew}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center mx-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Thêm hợp đồng đầu tiên
          </button>
        </div>
      )}

      <Modal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Chỉnh sửa hợp đồng"
      >
        <EditHopDong
          editingHopDong={editingHopDong}
          setEditingHopDong={setEditingHopDong}
          setShowEditModal={() => setShowEditModal(false)}
          onSuccess={onSuccess}
        />
      </Modal>

      <Modal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Thêm hợp đồng mới"
      >
        <AddHopDong
          editingHopDong={editingHopDong}
          setEditingHopDong={setEditingHopDong}
          setShowEditModal={() => setShowAddModal(false)}
          onSuccess={onSuccess}
        />
      </Modal>

      <FileViewerModal
        show={showFileViewer}
        onClose={() => setShowFileViewer(false)}
        hopdong={selectedHopDong}
      />
    </div>
  );
};
