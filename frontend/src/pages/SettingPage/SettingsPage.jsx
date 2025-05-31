import React from "react";
import { useNavigate } from 'react-router-dom';
export function SettingsPage() {
  const navigate = useNavigate();
  return (
    <div className="w-full mt-8 max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-1">Thiết lập nhanh</h2>
      <p className="text-sm text-gray-500 mb-4">
        Chỉ vài bước cài đặt để quản lý nhân viên hiệu quả, tối ưu vận hành và
        tính lương chính xác
      </p>
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 border rounded hover:bg-gray-50 transition">
          <div className="flex items-center space-x-2">
            <span className="font-medium">Ca làm việc</span>
          </div>
          <button className="bg-gray-100 hover:bg-gray-200 text-sm px-3 py-1 rounded"
          onClick={()=>navigate('/settings/shift')}>
            Thiết lập
          </button>
        </div>
      </div>
    </div>
  );
}
