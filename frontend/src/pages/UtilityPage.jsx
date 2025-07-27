import { useState } from "react";
import { ChangePasswordForm } from "../components/Employee/ChangePassword";
export function UtilityPage() {
  const [showChangePassword, setShowChangePassword] = useState(false);
  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Tiện ích
      </h2>
      <div className="flex flex-col gap-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setShowChangePassword((v) => !v)}
        >
          Đổi mật khẩu
        </button>
        {showChangePassword && <ChangePasswordForm />}
      </div>
    </div>
  );
}
