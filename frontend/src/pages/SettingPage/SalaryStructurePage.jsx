import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { fetchAllThangLuong } from "../../api/apiThangLuong.js";
import { AddSalaryStructureForm } from "../../components/SalaryStructure/AddNewSalaryStructureModal.jsx";
import { UpdateSalaryStructureForm } from "../../components/SalaryStructure/UpdateSalaryStructureModal.jsx";
import { ConfirmDeleteModal } from "../../components/ModalDelete.jsx";
import { deleteThangLuong } from "../../api/apiThangLuong.js"; 
import { formatCurrency } from "../../utils/formatCurrency.js";
export function SalaryStructure() {
  const [data, setData] = useState([]);
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [selectedSalaryStructure, setSelectedSalaryStructure] = useState(null);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [maThangLuong, setMaThangLuong] = useState(null);
  const getAllThangLuong = async () => {
    try {
      const response = await fetchAllThangLuong();
      setData(response);
    } catch (error) {
      console.error("Lỗi lấy dữ liệu thang lương:", error);
    }
  };
  const onDelete = async ()=>{
      try {
        const result = await deleteThangLuong(maThangLuong);
        if (!result.success) {
          alert(result.message || "Xóa thang lương thất bại.");
          return;
        }
        alert("Xóa thang lương thành công!");
        getAllThangLuong();
      } catch (error) {
        console.error("Lỗi không xác định:", error);
        alert("Lỗi không xác định. Vui lòng thử lại.");
      }
      setShowModalDelete(false);
    }
  useEffect(() => {
    getAllThangLuong();
    console.log("token",localStorage.getItem("token"));
  }, []);
  const fullTime = data.filter((item) => item.LoaiNV === "FullTime");
  const partTime = data.filter((item) => item.LoaiNV === "PartTime");
  return (
    <div>
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Danh sách thang lương</h2>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={() => setShowModalAdd(true)}
          >
            + Thêm thang lương
          </button>
        </div>
        <div className="bg-white rounded shadow overflow-hidden mb-8">
          <h3 className="font-semibold text-base px-4 py-2 bg-blue-50">
            Full Time
          </h3>
          <table className="w-full text-left">
            <thead className="bg-blue-100">
              <tr>
                <th className="p-3 border text-center">Stt</th>
                <th className="p-3 border text-center">Lương cơ bản</th>
                <th className="p-3 border text-center">Bậc lương</th>
                <th className="p-3 border text-center">Số ngày phép</th>
                <th className="p-3 border text-center">Chức vụ</th>
                <th className="p-3 border text-center">Hoạt động</th>
              </tr>
            </thead>
            <tbody>
              {fullTime.map((salary, index) => (
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-2 border text-center">{index + 1}</td>
                  <td className="px-4 py-2 border text-center">
                    {formatCurrency(salary.LuongCoBan)}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {salary.BacLuong}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {salary.SoNgayPhep}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {salary.MaVaiTro === 2 ? "Nhân viên" : "Quản lý"}
                  </td>
                  <td className="p-3 border flex items-center justify-center gap-4">
                    <Pencil className="w-5 h-5 cursor-pointer text-gray-600 hover:text-blue-500"
                    onClick={() => {
                      setShowModalUpdate(true);
                      setSelectedSalaryStructure(salary);
                    }} />
                    <Trash2 className="w-5 h-5 cursor-pointer text-gray-600 hover:text-red-500" 
                      onClick={() => {
                        setShowModalDelete(true);
                        setMaThangLuong(salary.MaThangLuong);
                      }}
                    />
                  </td>
                </tr>
              ))}
              {fullTime.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center text-gray-500 py-4">
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="bg-white rounded shadow overflow-hidden">
          <h3 className="font-semibold text-base px-4 py-2 bg-blue-50">
            Part Time
          </h3>
          <table className="w-full text-left">
            <thead className="bg-blue-100">
              <tr>
                <th className="p-3 border text-center">Stt</th>
                <th className="p-3 border text-center">Lương theo giờ</th>
                <th className="p-3 border text-center">Chức vụ</th>
                <th className="p-3 border text-center">Hoạt động</th>
              </tr>
            </thead>
            <tbody>
              {partTime.map((salary, index) => (
                <tr className="hover:bg-gray-50" key={salary.id || index}>
                  <td className="px-4 py-2 border text-center">{index + 1}</td>
                  <td className="px-4 py-2 border text-center">
                    {formatCurrency(salary.LuongTheoGio)}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {salary.MaVaiTro === 2 ? "Nhân viên" : "Quản lý"}
                  </td>
                  <td className="p-3 border flex items-center justify-center gap-4">
                    <Pencil className="w-5 h-5 cursor-pointer text-gray-600 hover:text-blue-500" 
                      onClick={() => {
                      setShowModalUpdate(true);
                      setSelectedSalaryStructure(salary);
                    }}
                    />
                    <Trash2 className="w-5 h-5 cursor-pointer text-gray-600 hover:text-red-500" 
                      onClick={() => {
                        setShowModalDelete(true);
                        setMaThangLuong(salary.MaThangLuong);
                      }}
                    />
                  </td>
                </tr>
              ))}
              {partTime.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center text-gray-500 py-4">
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {showModalAdd && (
        <AddSalaryStructureForm
          setShowModalAdd={setShowModalAdd}
          getAllThangLuong={getAllThangLuong}
        ></AddSalaryStructureForm>
      )}
      {showModalUpdate && (
        <UpdateSalaryStructureForm
          setShowModalUpdate={setShowModalUpdate}
          getAllThangLuong={getAllThangLuong}
          salaryStructure={selectedSalaryStructure}
        ></UpdateSalaryStructureForm>
      )}
      {showModalDelete && (
        <ConfirmDeleteModal
          setShowModalDelete={setShowModalDelete}
          onDelete={onDelete}
          Name = {"Thang Lương"}
        />
      )}
    </div>
  );
}
