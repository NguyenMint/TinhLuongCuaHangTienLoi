import { Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { deleteKTKL } from "../../../api/apiKTKL";

const violationTypes = [
  "Ngủ gật trong giờ",
  "Đi muộn",
  "Về sớm",
  "Nghỉ không phép",
  "Không mặc đồng phục",
  "Vi phạm nội quy",
];

const ViolationsTab = ({ violations = [], onUpdate, formData }) => {
  const [currentViolations, setCurrentViolations] = useState(violations || []);
  const [showViolations, setShowViolations] = useState(violations);
  const [deletedDatabaseIds, setDeletedDatabaseIds] = useState(new Set()); //Xóa CSDL
  const [newViolation, setNewViolation] = useState({
    LyDo: "",
    MucThuongPhat: 0,
    DuocMienThue: true,
  });
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null); // Chọn item xóa

  const handleAddViolation = () => {
    if (!newViolation.LyDo || newViolation.MucThuongPhat < 0) return;
    console.log(newViolation.MucThuongPhat);
    
    const newItem = {
      ...newViolation,
      MaKTKL: `temp_${Date.now()}`, // Temporary ID for new items
    };

    const updatedViolations = [...currentViolations, newItem];

    setCurrentViolations(updatedViolations);
    onUpdate(updatedViolations);

    setNewViolation({ LyDo: "", DuocMienThue: true, MucThuongPhat: 0 });
    setIsAdding(false);
  };

  const handleDelete = async (MaKTKL, isFromDatabase = false) => {
    // Show confirmation dialog
    const confirmed = window.confirm("Bạn có chắc chắn muốn xóa vi phạm này?");
    if (!confirmed) return;

    setIsDeleting(MaKTKL);

    try {
      if (isFromDatabase && MaKTKL && !MaKTKL.toString().startsWith("temp_")) {
        await deleteKTKL(MaKTKL);
        setDeletedDatabaseIds((prev) => new Set([...prev, MaKTKL]));
      }

      const updatedViolations = currentViolations.filter(
        (v) => v.MaKTKL !== MaKTKL
      );

      setCurrentViolations(updatedViolations);
      onUpdate(updatedViolations);
    } catch (error) {
      console.error("Error deleting violation:", error);
      alert("Lỗi khi xóa vi phạm: " + (error.message || "Lỗi không xác định"));
    } finally {
      setIsDeleting(null);
    }
  };

  const handleCancel = () => {
    setNewViolation({ LyDo: "", DuocMienThue: true, MucThuongPhat: 0 });
    setIsAdding(false);
  };

  useEffect(() => {
    // Separate database violations from current violations
    const databaseViolations = formData.khen_thuong_ky_luats
      ?.filter((item) => item.ThuongPhat === false)
      .filter((item) => !deletedDatabaseIds.has(item.MaKTKL));

    setShowViolations([...databaseViolations, ...currentViolations]);
  }, [currentViolations, formData, deletedDatabaseIds]); // Add deletedDatabaseIds to dependencies

  return (
    <div>
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-blue-50">
        <table className="min-w-full text-sm text-left">
          <thead>
            <tr>
              <th className="p-3 w-1/4">Loại vi phạm</th>
              <th className="p-3">Mức áp dụng</th>
              <th className="p-3">Được miễn thuế</th>
              <th className="p-3 w-12 text-center">Xóa</th>
            </tr>
          </thead>
          <tbody>
            {showViolations.length > 0 ? (
              showViolations.map((v, index) => {
                const isFromDatabase =
                  !v.MaKTKL?.toString().startsWith("temp_") &&
                  formData.khen_thuong_ky_luats?.some(
                    (item) => item.MaKTKL === v.MaKTKL
                  );
                const isBeingDeleted = isDeleting === v.MaKTKL;

                return (
                  <tr
                    key={`${v.MaKTKL || index}-${v.LyDo}`}
                    className={`border-t border-blue-100 ${
                      isBeingDeleted ? "opacity-50" : ""
                    }`}
                  >
                    <td className="p-3">{v.LyDo}</td>
                    <td className="p-3">{v.MucThuongPhat ?? 0}</td>
                    <td className="p-3">{v.DuocMienThue ? "Có" : "Không"}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleDelete(v.MaKTKL, isFromDatabase)}
                        disabled={isBeingDeleted}
                        className={`text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed`}
                        title={
                          isFromDatabase
                            ? "Xóa khỏi cơ sở dữ liệu"
                            : "Xóa khỏi danh sách"
                        }
                      >
                        {isBeingDeleted ? (
                          <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Trash2 />
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr className="border-t border-blue-100">
                <td colSpan={4} className="p-3 text-center text-gray-500">
                  Không có dữ liệu vi phạm
                </td>
              </tr>
            )}

            {isAdding && (
              <tr className="border-t bg-blue-50">
                <td className="p-3">
                  <select
                    className="w-full border rounded-md p-2"
                    value={newViolation.LyDo}
                    onChange={(e) =>
                      setNewViolation({ ...newViolation, LyDo: e.target.value })
                    }
                  >
                    <option value="">Chọn vi phạm</option>
                    {violationTypes.map((type) => (
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
                    value={newViolation.MucThuongPhat}
                    onChange={(e) =>
                      setNewViolation({
                        ...newViolation,
                        MucThuongPhat: parseInt(e.target.value || 0),
                      })
                    }
                  />
                </td>
                <td className="p-3">
                  <input
                    type="checkbox"
                    className="w-full border rounded-md p-2"
                    checked={!!newViolation.DuocMienThue}
                    onChange={(e) =>
                      setNewViolation({
                        ...newViolation,
                        DuocMienThue: e.target.checked,
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
          + Thêm vi phạm
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
          <button
            onClick={handleCancel}
            className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
          >
            Hủy
          </button>
        </div>
      )}
    </div>
  );
};

export default ViolationsTab;
