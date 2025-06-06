import React from "react";

export function EmployeeProfilePage() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow py-8 px-4 mt-8">
      <div className="flex items-center gap-6 mb-8">
        <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
          <img
            src={`${process.env.REACT_APP_BACKEND_URL}/${user.Avatar}`}
            alt="avatar"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <div className="font-bold text-2xl mb-1">{user.HoTen}</div>
          <div className="text-gray-500 text-sm">{user.Email}</div>
          <div className="text-gray-600 text-sm mt-1">
            <span className="mr-4">
              <b>Giới tính:</b> {user.GioiTinh ? "Nam" : "Nữ"}
            </span>
            <span>
              <b>Ngày sinh:</b> {user.NgaySinh}
            </span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="mb-2">
            <b>Địa chỉ:</b> {user.DiaChi}
          </div>
          <div className="mb-2">
            <b>Số điện thoại:</b> {user.SoDienThoai}
          </div>
          <div className="mb-2">
            <b>CCCD:</b> {user.CCCD}
          </div>
          <div className="mb-2">
            <b>Loại nhân viên:</b> {user.LoaiNV}
          </div>
        </div>
        <div>
          <div className="mb-2">
            <b>Ngân hàng:</b> {user.TenNganHang}
          </div>
          <div className="mb-2">
            <b>Số tài khoản:</b> {user.STK}
          </div>
          <div className="mb-2">
            <b>Chi nhánh:</b> {user.TenChiNhanh}
          </div>
          <div className="mb-2">
            <b>Địa chỉ chi nhánh:</b> {user.DiaChiCN}
          </div>
        </div>
      </div>
    </div>
  );
}