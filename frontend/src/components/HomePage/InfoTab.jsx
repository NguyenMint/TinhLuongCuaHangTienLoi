export const InfoTab = ({selectedEmployee}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <div className="bg-gray-100 p-4 flex items-center justify-center h-52 rounded-lg">
          <div className="h-40 w-40 rounded-full bg-gray-200 flex items-center justify-center">
            {selectedEmployee.Avatar ? (
              <img
                src={`${process.env.REACT_APP_BACKEND_URL}/${selectedEmployee.Avatar}`}
                alt={selectedEmployee.HoTen}
                className="h-40 w-40 rounded-full object-cover"
              />
            ) : (
              <span className="text-gray-500 text-4xl">
                {selectedEmployee.HoTen.charAt(0)}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="md:col-span-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Mã nhân viên:</p>
            <p className="font-medium">{selectedEmployee.MaNhanVien}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Tên nhân viên:</p>
            <p className="font-medium">{selectedEmployee.HoTen}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Chi nhánh trả lương:</p>
            <p className="font-medium">{selectedEmployee.MaCN_chi_nhanh.TenChiNhanh}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Tài khoản Ngân hàng:</p>
            <p className="font-medium">
              {selectedEmployee.STK} - {selectedEmployee.TenNganHang}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Ngày sinh:</p>
            <p className="font-medium">{selectedEmployee.NgaySinh}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Số điện thoại:</p>
            <p className="font-medium">{selectedEmployee.SoDienThoai}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Giới tính:</p>
            <p className="font-medium">{selectedEmployee.GioiTinh ? "Nam" : "Nữ"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email:</p>
            <p className="font-medium">{selectedEmployee.Email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Số CMND/CCCD:</p>
            <p className="font-medium">{selectedEmployee.CCCD}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Chức danh:</p>
            <p className="font-medium">
              {selectedEmployee.MaVaiTro_vai_tro.Quyen === "NhanVien"
                ? `Nhân Viên - ${selectedEmployee?.LoaiNV}`
                : "Quản Lý"}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-500">Địa chỉ:</p>
          <p className="font-medium">{selectedEmployee.DiaChi}</p>
        </div>
      </div>
    </div>
  );
};
