import React from 'react';
import { CalendarIcon, DollarSignIcon, CoinsIcon } from 'lucide-react';
export const EmployeeDetail = ({
  employee,
  activeTab,
  setActiveTab
}) => {
  const handleUpdateEmployee = () => {
    console.log('Update employee clicked');
    // Implementation would go here
  };
  const handleStopWorking = () => {
    console.log('Stop working clicked');
    // Implementation would go here
  };
  const handleGetConfirmationCode = () => {
    console.log('Get confirmation code clicked');
    // Implementation would go here
  };
  return <div>
      {/* Tabs */}
      <div className="flex border-b">
        <button className={`px-4 py-2 text-sm font-medium ${activeTab === 'info' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab('info')}>
          <div className="flex items-center">
            <div className="h-4 w-4 mr-2" />
            <span>Thông tin</span>
          </div>
        </button>
        <button className={`px-4 py-2 text-sm font-medium ${activeTab === 'schedule' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab('schedule')}>
          <div className="flex items-center">
            <CalendarIcon className="h-4 w-4 mr-2" />
            <span>Lịch làm việc</span>
          </div>
        </button>
        <button className={`px-4 py-2 text-sm font-medium ${activeTab === 'salary' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab('salary')}>
          <div className="flex items-center">
            <DollarSignIcon className="h-4 w-4 mr-2" />
            <span>Thiết lập lương</span>
          </div>
        </button>
        <button className={`px-4 py-2 text-sm font-medium ${activeTab === 'debt' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab('debt')}>
          <div className="flex items-center">
            <CoinsIcon className="h-4 w-4 mr-2" />
            <span>Nợ và tạm ứng</span>
          </div>
        </button>
      </div>
      {/* Tab content */}
      <div className="p-4">
        {activeTab === 'info' && <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <div className="bg-gray-100 p-4 flex items-center justify-center h-52 rounded-lg">
                <div className="h-40 w-40 rounded-full bg-gray-200 flex items-center justify-center">
                  {employee.avatar ? <img src={employee.avatar} alt={employee.name} className="h-40 w-40 rounded-full" /> : <span className="text-gray-500 text-4xl">
                      {employee.name.charAt(0)}
                    </span>}
                </div>
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Mã nhân viên:</p>
                  <p className="font-medium">{employee.code}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">
                    Ngày bắt đầu làm việc:
                  </p>
                  <p className="font-medium">{employee.startDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tên nhân viên:</p>
                  <p className="font-medium">{employee.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Chi nhánh trả lương:</p>
                  <p className="font-medium">{employee.payrollBranch}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Mã chấm công:</p>
                  <p className="font-medium">{employee.timekeepingCode}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tài khoản KiotViet:</p>
                  <p className="font-medium">{employee.kiotVietAccount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ngày sinh:</p>
                  <p className="font-medium">{employee.birthDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Số điện thoại:</p>
                  <p className="font-medium">{employee.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Giới tính:</p>
                  <p className="font-medium">{employee.gender}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email:</p>
                  <p className="font-medium">{employee.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Số CMND/CCCD:</p>
                  <p className="font-medium">{employee.idNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Facebook:</p>
                  <p className="font-medium">{employee.facebook}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phòng ban:</p>
                  <p className="font-medium">{employee.department}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Địa chỉ:</p>
                  <p className="font-medium">{employee.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Chức danh:</p>
                  <p className="font-medium">{employee.position}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Thiết bị đi động:</p>
                  <p className="font-medium">{employee.mobileDevice}</p>
                </div>
              </div>
            </div>
          </div>}
        {activeTab === 'schedule' && <div className="p-4 text-gray-500">
            Thông tin lịch làm việc sẽ hiển thị ở đây.
          </div>}
        {activeTab === 'salary' && <div className="p-4 text-gray-500">
            Thông tin thiết lập lương sẽ hiển thị ở đây.
          </div>}
        {activeTab === 'debt' && <div className="p-4 text-gray-500">
            Thông tin nợ và tạm ứng sẽ hiển thị ở đây.
          </div>}
      </div>
      {/* Action buttons */}
      <div className="flex justify-end space-x-2 p-4 border-t">
        <button onClick={handleGetConfirmationCode} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
          Lấy mã xác nhận
        </button>
        <button onClick={handleUpdateEmployee} className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md">
          Cập nhật
        </button>
        <button onClick={handleStopWorking} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md">
          Ngừng làm việc
        </button>
      </div>
    </div>;
};