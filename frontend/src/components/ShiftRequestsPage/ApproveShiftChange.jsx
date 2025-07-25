import { CircleUserRound, IdCard, X } from "lucide-react";

export function ApproveShiftChange({ shift, onClose, onAccpet, onDeny }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold">Đăng ký ca</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X />
          </button>
        </div>
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <CircleUserRound />
              <span>{shift.MaTK_tai_khoan.HoTen}</span>
            </div>
            <div className="flex items-center gap-2">
              <IdCard />
              <span>{shift.MaTK_tai_khoan.MaNhanVien}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <div className="text-sm text-gray-500">Thời gian</div>
              <div className="font-medium">{shift.NgayLam}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Ca làm việc</div>
              <div className="font-medium">
                {shift.MaCaLam_ca_lam.TenCa} (
                {shift.MaCaLam_ca_lam.ThoiGianBatDau} -{" "}
                {shift.MaCaLam_ca_lam.ThoiGianKetThuc})
              </div>
            </div>
          </div>
          {shift.MaLLVCu_lich_lam_viec &&
            (shift.TrangThai === "Chuyển Ca" ||
              shift.TrangThai === "Chờ Duyệt Chuyển Ca") && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg border-l-4 border-orange-400">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  Thông tin ca làm cũ:
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-gray-500">Ngày làm cũ</div>
                    <div className="font-medium">
                      {shift.MaLLVCu_lich_lam_viec.NgayLam}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Ca làm việc</div>
                    <div className="font-medium">
                      {shift.MaLLVCu_lich_lam_viec.MaCaLam_ca_lam.TenCa} (
                      {shift.MaLLVCu_lich_lam_viec.MaCaLam_ca_lam.ThoiGianBatDau} -{" "}
                      {shift.MaLLVCu_lich_lam_viec.MaCaLam_ca_lam.ThoiGianKetThuc})
                    </div>
                  </div>
                </div>
              </div>
            )}
        </div>

        <div className="p-4 flex justify-center gap-2">
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={() => onAccpet(shift.MaLLV)}
          >
            Duyệt
          </button>
          <button
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
            onClick={onClose}
          >
            Bỏ qua
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            onClick={() => onDeny(shift.MaLLV)}
          >
            Từ chối
          </button>
        </div>
      </div>
    </div>
  );
}
