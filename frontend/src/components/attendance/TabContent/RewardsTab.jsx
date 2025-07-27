import { Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { deleteKTKL } from "../../../api/apiKTKL";
import { toast } from "react-toastify";

const rewardTypes = [
  "Đi làm đúng giờ",
  "Làm việc hiệu quả",
  "Nhân viên xuất sắc",
  "Hoàn thành dự án đúng hạn",
  "Sáng kiến cải tiến",
];

const RewardsTab = ({ rewards = [], onUpdate, formData }) => {
  const [newReward, setNewReward] = useState({
    LyDo: "",
    MucThuongPhat: 0,
    DuocMienThue: true,
  });
  const [currentRewards, setCurrentRewards] = useState(rewards);
  const [showRewards, setShowRewards] = useState(rewards);
  const [deletedDatabaseIds, setDeletedDatabaseIds] = useState(new Set()); //Xóa CSDL

  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null); // Chọn item xóa

  const handleAddReward = () => {
    if (!newReward.LyDo || newReward.MucThuongPhat < 0) return;

    const newItem = {
      ...newReward,
      MaKTKL: `temp_${Date.now()}`, // Temporary ID for new items
    };

    const updatedRewards = [...currentRewards, newItem];

    setCurrentRewards(updatedRewards);
    onUpdate(updatedRewards);

    setNewReward({ LyDo: "", DuocMienThue: true, value: "", MucThuongPhat: 0 });
    setIsAdding(false);
  };

  const handleDelete = async (MaKTKL, isFromDatabase = false) => {
    const confirmed = window.confirm("Bạn có chắc chắn muốn xóa vi phạm này?");
    if (!confirmed) return;

    setIsDeleting(MaKTKL);

    try {
      if (isFromDatabase && MaKTKL && !MaKTKL.toString().startsWith("temp_")) {
        await deleteKTKL(MaKTKL);
        setDeletedDatabaseIds((prev) => new Set([...prev, MaKTKL]));
      }

      const updatedRewards = currentRewards.filter((v) => v.MaKTKL !== MaKTKL);

      setCurrentRewards(updatedRewards);
      onUpdate(updatedRewards);
    } catch (error) {
      console.error("Error deleting reward:", error);
      toast.error("Lỗi khi xóa vi phạm: " + (error.message || "Lỗi không xác định"));
    } finally {
      setIsDeleting(null);
    }
  };

  const handleCancel = () => {
    setNewReward({ LyDo: "", DuocMienThue: 1, MucThuongPhat: 0 });
    setIsAdding(false);
  };
  useEffect(() => {
    const databaseViolations = formData?.khen_thuong_ky_luats
      ?.filter((item) => item.ThuongPhat === true)
      .filter((item) => !deletedDatabaseIds.has(item.MaKTKL)) || [];

    setShowRewards([...databaseViolations, ...currentRewards]);
  }, [currentRewards, formData, deletedDatabaseIds]);
  
  return (
    <div>
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-blue-50">
        <table className="min-w-full text-sm text-left">
          <thead>
            <tr className="text-left text-sm">
              <th className="p-3 w-1/4">Loại khen thưởng</th>
              <th className="p-3">Mức áp dụng</th>
              <th className="p-3">Được miễn thuế</th>
              <th className="p-3 w-12 text-center">Xóa</th>
            </tr>
          </thead>
          <tbody>
            {showRewards?.length > 0 ? (
              showRewards.map((reward, index) => {
                const isFromDatabase =
                  !reward.MaKTKL?.toString().startsWith("temp_") &&
                  formData?.khen_thuong_ky_luats?.some(
                    (item) => item.MaKTKL === reward.MaKTKL
                  );
                const isBeingDeleted = isDeleting === reward.MaKTKL;

                return (
                  <tr
                    key={`${reward.id || index}-${reward.LyDo}`}
                    className={`border-t border-blue-100 ${
                      isBeingDeleted ? "opacity-50" : ""
                    }`}
                  >
                    <td className="p-3">{reward.LyDo}</td>
                    <td className="p-3">{reward.MucThuongPhat}</td>
                    <td className="p-3">
                      {reward.DuocMienThue ? "Có" : "Không"}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() =>
                          handleDelete(reward.MaKTKL, isFromDatabase)
                        }
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
                  Không có dữ liệu khen thưởng
                </td>
              </tr>
            )}

            {isAdding && (
              <tr className="border-t border-blue-100">
                <td className="p-3">
                  <select
                    className="w-full border rounded-md p-2"
                    value={newReward.LyDo}
                    onChange={(e) =>
                      setNewReward({ ...newReward, LyDo: e.target.value })
                    }
                  >
                    <option value="">Chọn khen thưởng</option>
                    {rewardTypes.map((type) => (
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
                    value={newReward.MucThuongPhat}
                    onChange={(e) =>
                      setNewReward({
                        ...newReward,
                        MucThuongPhat: parseInt(e.target.value || 0),
                      })
                    }
                  />
                </td>
                <td className="p-3">
                  <input
                    type="checkbox"
                    className="w-full border rounded-md p-2"
                    checked={!!newReward.DuocMienThue}
                    onChange={(e) =>
                      setNewReward({
                        ...newReward,
                        DuocMienThue: e.target.checked,
                      })
                    }
                  />
                </td>
                <td className="p-3"></td>
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
            onClick={handleAddReward}
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

export default RewardsTab;
