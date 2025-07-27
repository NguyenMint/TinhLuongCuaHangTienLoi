import { Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { createPhuCap, deletePhuCap, updatePhuCap } from "../../api/apiPhuCap";
import { toast } from "react-toastify";

const allowanceTypes = [
  "Phụ cấp ăn trưa",
  "Phụ cấp đi lại",
  "Phụ cấp điện thoại",
  "Phụ cấp nhà ở",
  "Phụ cấp làm thêm giờ",
  "Phụ cấp trách nhiệm",
  "Phụ cấp khu vực",
  "Phụ cấp độc hại",
];
export const PhuCapTab = ({ phuCaps, onSuccess, selectedEmployee }) => {
  const [newPhuCap, setNewPhuCap] = useState({
    LoaiPhuCap: "",
    TrangThai: true,
    GiaTriPhuCap: 0,
    DuocMienThue: true,
    MaTK: selectedEmployee.MaTK,
  });

  const [isAdding, setIsAdding] = useState(false);

  const handleAddViolation = async () => {
    if (!newPhuCap.LoaiPhuCap || newPhuCap.GiaTriPhuCap < 0) return;
    try {
      await createPhuCap(newPhuCap);
      onSuccess();
      toast.success("Thêm thành công");
      setNewPhuCap({
        MaTK: selectedEmployee.MaTK,
        LoaiPhuCap: "",
        DuocMienThue: true,
        GiaTriPhuCap: 0,
        TrangThai: true,
      });
      setIsAdding(false);
    } catch (error) {
      console.error("Error deleting PhuCap:", error);
      toast.error("Lỗi khi xóa phụ cấp: " + (error.message || "Lỗi không xác định"));
    }
  };

  const handleDelete = async (MaPhuCap) => {
    const confirmed = window.confirm("Bạn có chắc chắn muốn xóa phụ cấp này?");
    if (!confirmed) return;
    try {
      const result = await deletePhuCap(MaPhuCap);
      if (result && result.success === false) {
        toast.error(result.message || "Xóa phụ cấp thất bại.");
      } else {
        onSuccess();
      }
    } catch (error) {
      console.error("Error deleting PhuCap:", error);
      toast.error("Lỗi khi xóa phụ cấp: " + (error.message || "Lỗi không xác định"));
    }
  };

  const handleCancel = () => {
    setNewPhuCap({
      MaTK: selectedEmployee.MaTK,
      LoaiPhuCap: "",
      DuocMienThue: true,
      GiaTriPhuCap: 0,
      TrangThai: true,
    });
    setIsAdding(false);
  };
  const handleUpdate = async (MaPhuCap) => {
    const confirmed = window.confirm(
      "Bạn có chắc chắn muốn cập nhật phụ cấp này?"
    );
    if (!confirmed) return;
    try {
      const result = await updatePhuCap(MaPhuCap);
      if (result && result.success === false) {
        toast.error(result.message || "Cập nhật phụ cấp thất bại.");
      } else {
        onSuccess();
      }
    } catch (error) {
      console.error("Error deleting PhuCap:", error);
      toast.error("Lỗi khi xóa phụ cấp: " + (error.message || "Lỗi không xác định"));
    }
  };

  return (
    <div>
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-blue-50">
        <table className="min-w-full text-sm text-left">
          <thead>
            <tr>
              <th className="p-3 w-1/3">Loại phụ cấp</th>
              <th className="p-3">Giá trị phụ cấp</th>
              <th className="p-3">Được miễn thuế</th>
              <th className="p-3">Trạng thái</th>
              <th className="p-3 w-14 text-center">Xóa</th>
            </tr>
          </thead>
          <tbody>
            {phuCaps.length > 0 ? (
              phuCaps.map((v, index) => {
                return (
                  <tr
                    key={`${v.MaPhuCap || index}`}
                    className="border-t border-blue-100"
                  >
                    <td className="p-3">{v.LoaiPhuCap}</td>
                    <td className="p-3">{v.GiaTriPhuCap ?? 0}</td>
                    <td className="p-3">{v.DuocMienThue ? "Có" : "Không"}</td>
                    <td className="p-3">
                      <button
                        className={
                          v.TrangThai ? "text-green-500" : "text-red-500"
                        }
                        onClick={() => handleUpdate(v.MaPhuCap)}
                      >
                        {v.TrangThai ? "Còn hiệu lực" : "Hết hiệu lực"}
                      </button>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleDelete(v.MaPhuCap)}
                        className={`text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed`}
                        title="Xóa khỏi cơ sở dữ liệu"
                      >
                        <Trash2 />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr className="border-t border-blue-100">
                <td colSpan={4} className="p-3 text-center text-gray-500">
                  Không có dữ liệu phụ cấp
                </td>
              </tr>
            )}

            {isAdding && (
              <tr className="border-t bg-blue-50">
                <td className="p-3">
                  <select
                    className="w-full border rounded-md p-2"
                    value={newPhuCap.LoaiPhuCap}
                    onChange={(e) =>
                      setNewPhuCap({
                        ...newPhuCap,
                        LoaiPhuCap: e.target.value,
                      })
                    }
                  >
                    <option value="">Chọn phụ cấp</option>
                    {allowanceTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-3">
                  <input
                    type="number"
                    className="w-full border rounded-md p-2"
                    min="0"
                    value={newPhuCap.GiaTriPhuCap}
                    onChange={(e) =>
                      setNewPhuCap({
                        ...newPhuCap,
                        GiaTriPhuCap: parseInt(e.target.value || 0),
                      })
                    }
                  />
                </td>
                <td className="p-3">
                  <input
                    type="checkbox"
                    className="w-full border rounded-md p-2"
                    checked={!!newPhuCap.DuocMienThue}
                    onChange={(e) =>
                      setNewPhuCap({
                        ...newPhuCap,
                        DuocMienThue: e.target.checked,
                      })
                    }
                  />
                </td>
                <td className="p-3">
                  <input
                    type="checkbox"
                    className="w-full border rounded-md p-2"
                    checked={!!newPhuCap.TrangThai}
                    onChange={(e) =>
                      setNewPhuCap({
                        ...newPhuCap,
                        TrangThai: e.target.checked,
                      })
                    }
                  />
                </td>
                <td className="p-3 text-center opacity-0">-</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!isAdding ? (
        <button
          onClick={() => setIsAdding(true)}
          className="mt-4 text-blue-600 hover:text-blue-800 flex items-center"
        >
          + Thêm phụ cấp
        </button>
      ) : (
        <div className="mt-4 flex gap-2">
          <button
            onClick={handleAddViolation}
            className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
          >
            Lưu
          </button>
          <button
            onClick={handleCancel}
            className="bg-gray-500 text-white px-4 py-1 rounded hover:bg-gray-600"
          >
            Bỏ qua
          </button>
        </div>
      )}
    </div>
  );
};
