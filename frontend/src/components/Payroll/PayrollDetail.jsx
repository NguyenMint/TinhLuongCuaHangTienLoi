import React, { useState } from 'react';
import { FileIcon, TrashIcon } from 'lucide-react';
export function PayrollDetail({
  payroll,
  onCancel,
  onExport
}) {
  const [activeTab, setActiveTab] = useState('information');
  return <div className="bg-white rounded shadow mt-4 overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b">
        <button className={`px-6 py-3 font-medium ${activeTab === 'information' ? 'border-b-2 border-green-500 text-green-500' : 'text-gray-500'}`} onClick={() => setActiveTab('information')}>
          Thông tin
        </button>
        <button className={`px-6 py-3 font-medium ${activeTab === 'payslip' ? 'border-b-2 border-green-500 text-green-500' : 'text-gray-500'}`} onClick={() => setActiveTab('payslip')}>
          Phiếu lương
        </button>
        <button className={`px-6 py-3 font-medium ${activeTab === 'history' ? 'border-b-2 border-green-500 text-green-500' : 'text-gray-500'}`} onClick={() => setActiveTab('history')}>
          Lịch sử thanh toán
        </button>
      </div>
      {/* Tab Content */}
      <div className="p-4">
        {activeTab === 'information' && <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex">
                <div className="w-1/3 text-gray-600">Mã:</div>
                <div className="w-2/3 font-medium">{payroll.code}</div>
              </div>
              <div className="flex">
                <div className="w-1/3 text-gray-600">Tên:</div>
                <div className="w-2/3 font-medium">{payroll.name}</div>
              </div>
              <div className="flex">
                <div className="w-1/3 text-gray-600">Kỳ hạn trả:</div>
                <div className="w-2/3">{payroll.paymentCycle}</div>
              </div>
              <div className="flex">
                <div className="w-1/3 text-gray-600">Kỳ làm việc:</div>
                <div className="w-2/3">{payroll.workPeriod}</div>
              </div>
              <div className="flex">
                <div className="w-1/3 text-gray-600">Ngày tạo:</div>
                <div className="w-2/3">{payroll.creationDate}</div>
              </div>
              <div className="flex">
                <div className="w-1/3 text-gray-600">Người tạo:</div>
                <div className="w-2/3">{payroll.creator}</div>
              </div>
              <div className="flex">
                <div className="w-1/3 text-gray-600">Người lập bảng:</div>
                <div className="w-2/3">{payroll.creator}</div>
              </div>
              <div className="flex">
                <div className="w-1/3 text-gray-600">Người chốt lương:</div>
                <div className="w-2/3">{payroll.approver}</div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex">
                <div className="w-1/3 text-gray-600">Trạng thái:</div>
                <div className="w-2/3 font-medium">{payroll.status}</div>
              </div>
              <div className="flex">
                <div className="w-1/3 text-gray-600">Chi nhánh:</div>
                <div className="w-2/3">{payroll.branch}</div>
              </div>
              <div className="flex">
                <div className="w-1/3 text-gray-600">Phạm vi áp dụng:</div>
                <div className="w-2/3">{payroll.scope}</div>
              </div>
              <div className="flex">
                <div className="w-1/3 text-gray-600">Tổng số nhân viên:</div>
                <div className="w-2/3">{payroll.totalEmployees}</div>
              </div>
              <div className="flex">
                <div className="w-1/3 text-gray-600">Tổng lương:</div>
                <div className="w-2/3">{payroll.totalSalary}</div>
              </div>
              <div className="flex">
                <div className="w-1/3 text-gray-600">Đã trả nhân viên:</div>
                <div className="w-2/3">{payroll.totalPaid}</div>
              </div>
              <div className="flex">
                <div className="w-1/3 text-gray-600">Còn cần trả:</div>
                <div className="w-2/3">{payroll.amountDue}</div>
              </div>
            </div>
          </div>}
        {activeTab === 'payslip' && <div className="p-4 text-center text-gray-500">
            Payslip information will be displayed here
          </div>}
        {activeTab === 'history' && <div className="p-4 text-center text-gray-500">
            Payment history will be displayed here
          </div>}
      </div>
      {/* Footer */}
      <div className="flex justify-between p-4 border-t">
        <div className="text-gray-500">
          Dữ liệu được tải lại vào: {payroll.lastUpdated}
        </div>
        <div className="flex space-x-2">
          <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded flex items-center" onClick={onExport}>
            <FileIcon size={18} className="mr-1" />
            <span>Xuất file</span>
          </button>
          <button className="bg-red-500 text-white px-4 py-2 rounded flex items-center" onClick={onCancel}>
            <TrashIcon size={18} className="mr-1" />
            <span>Hủy bỏ</span>
          </button>
        </div>
      </div>
    </div>;
}