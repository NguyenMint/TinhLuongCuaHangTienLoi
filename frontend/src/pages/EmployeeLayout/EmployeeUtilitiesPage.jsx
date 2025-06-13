import { useState } from "react";
import { ChangePasswordForm} from "../../components/Employee/ChangePassword";
import {LeaveRequestForm}  from "../../components/Employee/LeaveRequestForm";
export function EmployeeUtilitiesPage() {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showLeaveRequest, setShowLeaveRequest] = useState(false);
  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Tiện ích nhân viên</h2>
      <div className="flex flex-col gap-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setShowChangePassword((v) => !v)}
        >
          Đổi mật khẩu
        </button>
        {showChangePassword && <ChangePasswordForm/>}
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={() => setShowLeaveRequest((v) => !v)}
        >
          Xin nghỉ phép
        </button>
        {showLeaveRequest && <LeaveRequestForm/>}
      </div>
    </div>
  );
}
