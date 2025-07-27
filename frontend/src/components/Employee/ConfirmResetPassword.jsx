export function ConfirmResetPassword({ setShowModalResetPass,onAccept }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-lg font-bold mb-4 text-center text-red-600">
          Bạn có chắc muốn reset mật khẩu cho nhân viên này?
        </h2>

        <p className="text-center mb-6 text-gray-700">
          Thao tác này không thể hoàn tác.
        </p>

        <div className="flex justify-between gap-4">
          <button
            onClick={()=>setShowModalResetPass(false)}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Hủy
          </button>
          <button
            onClick={onAccept}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}
