import React, { useState } from 'react';
const ViolationsTab = ({
  violations,
  onUpdate
}) => {
  const [newViolation, setNewViolation] = useState({
    type: '',
    count: 1,
    level: '',
    amount: 0
  });
  const violationTypes = ['Đi muộn', 'Về sớm', 'Nghỉ không phép', 'Không mặc đồng phục', 'Vi phạm nội quy'];
  const handleAddViolation = () => {
    if (!newViolation.type) return;
    const updatedViolations = [...violations, {
      ...newViolation,
      id: Date.now()
    }];
    onUpdate(updatedViolations);
    setNewViolation({
      type: '',
      count: 1,
      level: '',
      amount: 0
    });
  };
  const handleDeleteViolation = id => {
    const updatedViolations = violations.filter(v => v.id !== id);
    onUpdate(updatedViolations);
  };
  return <div>
      <div className="bg-blue-50 rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="text-left text-sm">
              <th className="p-3">Loại vi phạm</th>
              <th className="p-3">Số lần</th>
              <th className="p-3">Mức áp dụng</th>
              <th className="p-3">Thành tiền</th>
              <th className="p-3 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {violations && violations.length > 0 ? violations.map(violation => <tr key={violation.id} className="border-t border-blue-100">
                  <td className="p-3">{violation.type}</td>
                  <td className="p-3">{violation.count}</td>
                  <td className="p-3">{violation.level}</td>
                  <td className="p-3">{violation.amount}</td>
                  <td className="p-3">
                    <button className="text-red-500 hover:text-red-700" onClick={() => handleDeleteViolation(violation.id)}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </td>
                </tr>) : <tr className="border-t border-blue-100">
                <td colSpan={5} className="p-3 text-center text-gray-500">
                  Không có dữ liệu vi phạm
                </td>
              </tr>}
            <tr className="border-t border-blue-100">
              <td className="p-3">
                <select className="w-full border rounded-md p-2" value={newViolation.type} onChange={e => setNewViolation({
                ...newViolation,
                type: e.target.value
              })}>
                  <option value="">Chọn vi phạm</option>
                  {violationTypes.map(type => <option key={type} value={type}>
                      {type}
                    </option>)}
                </select>
              </td>
              <td className="p-3">
                <input type="number" className="w-full border rounded-md p-2" value={newViolation.count} onChange={e => setNewViolation({
                ...newViolation,
                count: parseInt(e.target.value)
              })} min="1" />
              </td>
              <td className="p-3">
                <input type="text" className="w-full border rounded-md p-2" value={newViolation.level} onChange={e => setNewViolation({
                ...newViolation,
                level: e.target.value
              })} placeholder="Mức áp dụng" />
              </td>
              <td className="p-3">
                <input type="number" className="w-full border rounded-md p-2" value={newViolation.amount} onChange={e => setNewViolation({
                ...newViolation,
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
      <button className="mt-4 text-blue-600 hover:text-blue-800 flex items-center" onClick={handleAddViolation}>
        <span>Thêm vi phạm</span>
      </button>
    </div>;
};
export default ViolationsTab;