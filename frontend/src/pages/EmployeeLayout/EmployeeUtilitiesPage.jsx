import { useState } from "react";

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
        {showChangePassword && <ChangePasswordForm />}
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={() => setShowLeaveRequest((v) => !v)}
        >
          Xin nghỉ phép
        </button>
        {showLeaveRequest && <LeaveRequestForm />}
      </div>
    </div>
  );
}

function ChangePasswordForm() {
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      setMessage("Mật khẩu mới không khớp!");
      return;
    }
    // TODO: Gọi API đổi mật khẩu ở đây
    setMessage("Đổi mật khẩu thành công!");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded mt-2">
      <div className="mb-2">
        <label className="block mb-1">Mật khẩu cũ</label>
        <input
          type="password"
          className="w-full border rounded px-3 py-2"
          value={oldPass}
          onChange={(e) => setOldPass(e.target.value)}
          required
        />
      </div>
      <div className="mb-2">
        <label className="block mb-1">Mật khẩu mới</label>
        <input
          type="password"
          className="w-full border rounded px-3 py-2"
          value={newPass}
          onChange={(e) => setNewPass(e.target.value)}
          required
        />
      </div>
      <div className="mb-2">
        <label className="block mb-1">Nhập lại mật khẩu mới</label>
        <input
          type="password"
          className="w-full border rounded px-3 py-2"
          value={confirmPass}
          onChange={(e) => setConfirmPass(e.target.value)}
          required
        />
      </div>
      {message && <div className="text-red-500 mb-2">{message}</div>}
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Đổi mật khẩu
      </button>
    </form>
  );
}

function LeaveRequestForm() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Gọi API xin nghỉ phép ở đây
    setMessage("Gửi yêu cầu nghỉ phép thành công!");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded mt-2">
      <div className="mb-2">
        <label className="block mb-1">Từ ngày</label>
        <input
          type="date"
          className="w-full border rounded px-3 py-2"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          required
        />
      </div>
      <div className="mb-2">
        <label className="block mb-1">Đến ngày</label>
        <input
          type="date"
          className="w-full border rounded px-3 py-2"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          required
        />
      </div>
      <div className="mb-2">
        <label className="block mb-1">Lý do</label>
        <textarea
          className="w-full border rounded px-3 py-2"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
        />
      </div>
      {message && <div className="text-green-600 mb-2">{message}</div>}
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Gửi yêu cầu
      </button>
    </form>
  );
}