import React, { useState } from 'react';
const RewardsTab = ({
  rewards,
  onUpdate
}) => {
  const [newReward, setNewReward] = useState({
    type: '',
    count: 1,
    value: '',
    amount: 0
  });
  const rewardTypes = ['Đi làm đúng giờ', 'Làm việc hiệu quả', 'Nhân viên xuất sắc', 'Hoàn thành dự án đúng hạn', 'Sáng kiến cải tiến'];
  const handleAddReward = () => {
    if (!newReward.type) return;
    const updatedRewards = [...rewards, {
      ...newReward,
      id: Date.now()
    }];
    onUpdate(updatedRewards);
    setNewReward({
      type: '',
      count: 1,
      value: '',
      amount: 0
    });
  };
  const handleDeleteReward = id => {
    const updatedRewards = rewards.filter(r => r.id !== id);
    onUpdate(updatedRewards);
  };
  return <div>
      <div className="bg-blue-50 rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="text-left text-sm">
              <th className="p-3">Loại khen thưởng</th>
              <th className="p-3">Số lần</th>
              <th className="p-3">Giá trị</th>
              <th className="p-3">Thành tiền</th>
              <th className="p-3 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {rewards && rewards.length > 0 ? rewards.map(reward => <tr key={reward.id} className="border-t border-blue-100">
                  <td className="p-3">{reward.type}</td>
                  <td className="p-3">{reward.count}</td>
                  <td className="p-3">{reward.value}</td>
                  <td className="p-3">{reward.amount}</td>
                  <td className="p-3">
                    <button className="text-red-500 hover:text-red-700" onClick={() => handleDeleteReward(reward.id)}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </td>
                </tr>) : <tr className="border-t border-blue-100">
                <td colSpan={5} className="p-3 text-center text-gray-500">
                  Không có dữ liệu khen thưởng
                </td>
              </tr>}
            <tr className="border-t border-blue-100">
              <td className="p-3">
                <select className="w-full border rounded-md p-2" value={newReward.type} onChange={e => setNewReward({
                ...newReward,
                type: e.target.value
              })}>
                  <option value="">Chọn khen thưởng</option>
                  {rewardTypes.map(type => <option key={type} value={type}>
                      {type}
                    </option>)}
                </select>
              </td>
              <td className="p-3">
                <input type="number" className="w-full border rounded-md p-2" value={newReward.count} onChange={e => setNewReward({
                ...newReward,
                count: parseInt(e.target.value)
              })} min="1" />
              </td>
              <td className="p-3">
                <input type="text" className="w-full border rounded-md p-2" value={newReward.value} onChange={e => setNewReward({
                ...newReward,
                value: e.target.value
              })} placeholder="Giá trị" />
              </td>
              <td className="p-3">
                <input type="number" className="w-full border rounded-md p-2" value={newReward.amount} onChange={e => setNewReward({
                ...newReward,
                amount: parseInt(e.target.value)
              })} min="0" />
              </td>
              <td className="p-3">
                <button className="text-red-500 hover:text-red-700 opacity-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <button className="mt-4 text-blue-600 hover:text-blue-800 flex items-center" onClick={handleAddReward}>
        <span>Thêm khen thưởng</span>
      </button>
    </div>;
};
export default RewardsTab;