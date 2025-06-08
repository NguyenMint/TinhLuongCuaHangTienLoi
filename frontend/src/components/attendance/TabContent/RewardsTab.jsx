import { Trash2 } from "lucide-react";
import React, { useState } from "react";

const rewardTypes = [
  "Đi làm đúng giờ",
  "Làm việc hiệu quả",
  "Nhân viên xuất sắc",
  "Hoàn thành dự án đúng hạn",
  "Sáng kiến cải tiến",
];

const RewardsTab = ({ rewards = [], onUpdate }) => {
  const [newReward, setNewReward] = useState({
    type: "",
    count: 1,
    amount: 0,
  });
  const [currentRewards, setCurrentRewards] = useState(rewards);

  const [isAdding, setIsAdding] = useState(false);

  const handleAddReward = () => {
    if (!newReward.type || newReward.count < 1 || newReward.amount < 0) return;

    const total = newReward.count * newReward.amount;
    const newItem = {
      ...newReward,
      total,
    };

    const updatedRewards = [...currentRewards, newItem];

    setCurrentRewards(updatedRewards);
    onUpdate(updatedRewards);

    setNewReward({ type: "", count: 1, value: "", amount: 0 });
    setIsAdding(false);
  };

  const handleDeleteReward = (id) => {
    const updated = rewards.filter((r) => r.id !== id);
    setCurrentRewards(updated);
    onUpdate(updated);
  };

  const handleCancel = () => {
    setNewReward({ type: "", count: 1, amount: 0 });
    setIsAdding(false);
  };

  return (
    <div>
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-blue-50">
        <table className="min-w-full text-sm text-left">
          <thead>
            <tr className="text-left text-sm">
              <th className="p-3 w-1/4">Loại khen thưởng</th>
              <th className="p-3">Số lần</th>
              <th className="p-3">Mức áp dụng</th>
              <th className="p-3">Thành tiền</th>
              <th className="p-3 w-12 text-center">Xóa</th>
            </tr>
          </thead>
          <tbody>
            {rewards?.length > 0 ? (
              rewards.map((reward) => (
                <tr key={reward.id} className="border-t border-blue-100">
                  <td className="p-3">{reward.type}</td>
                  <td className="p-3">{reward.count}</td>
                  <td className="p-3">{reward.amount.toLocaleString()}</td>
                  <td className="p-3">{reward.total.toLocaleString()}</td>
                  <td className="p-3">
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteReward(reward.id)}
                    >
                      <Trash2 />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="border-t border-blue-100">
                <td colSpan={5} className="p-3 text-center text-gray-500">
                  Không có dữ liệu khen thưởng
                </td>
              </tr>
            )}

            {/* Input row */}
            {isAdding && (
              <tr className="border-t border-blue-100">
                <td className="p-3">
                  <select
                    className="w-full border rounded-md p-2"
                    value={newReward.type}
                    onChange={(e) =>
                      setNewReward({ ...newReward, type: e.target.value })
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
                    min="1"
                    value={newReward.count}
                    onChange={(e) =>
                      setNewReward({
                        ...newReward,
                        count: parseInt(e.target.value || 1),
                      })
                    }
                  />
                </td>
                <td className="p-3">
                  <input
                    type="text"
                    className="w-full border rounded-md p-2"
                    value={newReward.amount}
                    onChange={(e) =>
                      setNewReward({ ...newReward, amount: e.target.value })
                    }
                  />
                </td>
                <td className="p-3 text-gray-700">
                  {(newReward.count * newReward.amount).toLocaleString()}
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
