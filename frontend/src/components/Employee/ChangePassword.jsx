import { useState } from "react";
import { changePassword } from "../../api/apiTaiKhoan";
export function ChangePasswordForm() {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const handleSubmit = async(e) => {
    e.preventDefault();
    if (newPassword !== confirmPass) {
      alert("Nhập lại mật khẩu không khớp");
      return;
    }
    const result = await changePassword(user.MaTK,password,newPassword);
    console.log(result)
    if (!result.success) {
      alert(result.message || "Đổi mật khẩu thất bại.");
      return;
    }
    alert("đổi mật khẩu thành công");
  };
  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded mt-2">
      <div className="mb-2">
        <label className="block mb-1">Mật khẩu cũ</label>
        <input
          type="password"
          className="w-full border rounded px-3 py-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div className="mb-2">
        <label className="block mb-1">Mật khẩu mới</label>
        <input
          type="password"
          className="w-full border rounded px-3 py-2"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
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
      <div className="mt-2 flex justify-center">
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Đổi mật khẩu
      </button>
      </div>
    </form>
  );
}
