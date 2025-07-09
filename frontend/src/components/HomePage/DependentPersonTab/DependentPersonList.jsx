import React, { useEffect, useState } from "react";
import { Trash2, Pencil } from "lucide-react";
import { getNguoiPhuThuocByNV } from "../../../api/apiNguoiPhuThuoc";
import { AddDependentPersonForm } from "./AddNewDependentPersonModal";
import { UpdateDependentPersonForm } from "./UpdateDependentPersonModal";
import { ConfirmDeleteModal } from "../../ModalDelete";
import { deleteNguoiPhuThuoc } from "../../../api/apiNguoiPhuThuoc";
export const DependentPersonList = ({ employee }) => {
  const [dependentPersons, setDependentPersons] = useState([]);
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [selectedDenpendentPerson, setSelectedDenpendentPerson] =
    useState(null);
  const [selectedMaNPT, setSelectedMaNPT] = useState(null);
  const fetchNguoiPhuThuocByNV = async () => {
    try {
      const response = await getNguoiPhuThuocByNV(employee.MaTK);
      setDependentPersons(response);
    } catch (error) {
      console.log("Lỗi khi lấy dữ liệu người phụ thuộc: ", error);
    }
  };
  const handleDelete = async () => {
    try {
      const result = await deleteNguoiPhuThuoc(selectedMaNPT);
      if (!result.success) {
        alert(result.message || "Xóa người phụ thuộc thất bại.");
        return;
      }
      alert("Xóa người phụ thuộc thành công!");
      fetchNguoiPhuThuocByNV();
    } catch (error) {
      console.error("Lỗi không xác định:", error);
      alert("Lỗi không xác định. Vui lòng thử lại.");
    }
    setShowModalDelete(false);
  };
  useEffect(() => {
    fetchNguoiPhuThuocByNV();
  }, []);
  return (
    <div>
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-blue-50">
        <table className="min-w-full text-sm text-left">
          <thead>
            <tr>
              <th className="p-3">Họ tên</th>
              <th className="p-3">Ngày sinh</th>
              <th className="p-3">Địa chỉ</th>
              <th className="p-3">Số điện thoại</th>
              <th className="p-3">CCCD</th>
              <th className="p-3">Trường hợp phụ thuộc</th>
              <th className="p-3">Quan hệ</th>
              <th className="p-3 w-14 text-center">Hoạt động</th>
            </tr>
          </thead>
          <tbody>
            {dependentPersons.length > 0 ? (
              dependentPersons.map((item, index) => {
                return (
                  <tr className="border-t border-blue-100">
                    <td className="p-3">{item.HoTen}</td>
                    <td className="p-3">{item.NgaySinh}</td>
                    <td className="p-3">{item.DiaChi}</td>
                    <td className="p-3">
                      {item.SoDienThoai ? item.SoDienThoai : "Không có"}
                    </td>
                    <td className="p-3">
                      {item.CCCD ? item.CCCD : "Không có"}
                    </td>
                    <td className="p-3">{item.TruongHopPhuThuoc}</td>
                    <td className="p-3">{item.QuanHe}</td>
                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedDenpendentPerson(item);
                          setShowModalUpdate(true);
                        }}
                        className={`text-blue-500 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <Pencil />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedMaNPT(item.MaNPT);
                          setShowModalDelete(true);
                        }}
                        className={`text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <Trash2 />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr className="border-t border-blue-100">
                <td colSpan={8} className="p-3 text-center text-gray-500">
                  Không có dữ liệu người phụ thuộc
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-4">
        <button
          onClick={() => {
            setShowModalAdd(true);
          }}
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          + Thêm người phụ thuộc
        </button>
      </div>
      {showModalAdd && (
        <AddDependentPersonForm
          employee={employee}
          setShowModalAdd={setShowModalAdd}
          fetchNguoiPhuThuoc={fetchNguoiPhuThuocByNV}
        />
      )}
      {showModalUpdate && (
        <UpdateDependentPersonForm
          employee={employee}
          setShowModalUpdate={setShowModalUpdate}
          fetchNguoiPhuThuoc={fetchNguoiPhuThuocByNV}
          dependentPerson={selectedDenpendentPerson}
        />
      )}
      {showModalDelete && (
        <ConfirmDeleteModal
          setShowModalDelete={setShowModalDelete}
          onDelete={handleDelete}
          Name={"người phụ thuộc"}
        />
      )}
    </div>
  );
};
