import React from 'react';
const HistoryTab = ({
  attendanceHistory
}) => {
  return <div className="overflow-x-auto">
      <table className="min-w-full bg-blue-50 rounded-lg">
        <thead>
          <tr className="text-left text-sm">
            <th className="p-3 w-1/4">Thời gian</th>
            <th className="p-3 w-1/4">Trạng thái</th>
            <th className="p-3 w-1/4">Hình thức</th>
            <th className="p-3 w-1/4">Nội dung</th>
          </tr>
        </thead>
        <tbody>
          {attendanceHistory && attendanceHistory.length > 0 ? attendanceHistory.map((record, index) => <tr key={index} className="border-t border-blue-100">
                <td className="p-3">{record.timestamp}</td>
                <td className="p-3">{record.status}</td>
                <td className="p-3">{record.method}</td>
                <td className="p-3">{record.details}</td>
              </tr>) : <tr className="border-t border-blue-100">
              <td colSpan={4} className="p-3 text-center text-gray-500">
                Không có dữ liệu lịch sử chấm công
              </td>
            </tr>}
        </tbody>
      </table>
    </div>;
};
export default HistoryTab;