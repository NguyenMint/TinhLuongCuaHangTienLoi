import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { deleteCaLam, fetchCaLam } from "../../api/apiCaLam.js";
import {AddShiftForm} from "../../components/Shift/AddNewShiftModal";
import {ConfirmDeleteModal} from "../../components/ModalDelete";
import {UpdateShiftForm} from "../../components/Shift/UpdateShiflModal";
import { toast } from "react-toastify";
export function ShiftPage() {
  const [data, setData] = useState();
  const [showModalAdd,setShowModalAdd] = useState(false);
  const [showModalDelete,setShowModalDelete] = useState(false);
  const [showModalUpdate,setShowModalUpdate] = useState(false);
  const [selectedShift,setSelectedShift] = useState(null);
  const [maCa,setMaCa] = useState(null);
  const getDataShift = async () => {
    try {
      const response = await fetchCaLam();
      setData(response);
    } catch (error) {
      console.error("Lỗi lấy Ca làm:", error);
    }
  };
  const onDelete = async ()=>{
    try {
      const result = await deleteCaLam(maCa);
      if (!result.success) {
        toast.error(result.message || "Xóa ca làm thất bại.");
        return;
      }
      toast.success("Xóa ca làm thành công!");
      getDataShift();
    } catch (error) {
      console.error("Lỗi không xác định:", error);
      toast.error("Lỗi không xác định. Vui lòng thử lại.");
    }
    setShowModalDelete(false);
  }
  useEffect(() => {
    getDataShift();
  }, []);
  return (
    <div>
      <div className="p-6 bg-gray-100 min-h-screen">
      {data? (
        <>
          <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Danh sách ca làm việc</h2>
        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        onClick={()=>{setShowModalAdd(true)}}>
          + Thêm ca làm việc
        </button>
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-blue-100">
            <tr>
              <th className="p-3 border text-center">Stt</th>
              <th className="p-3 border text-center">Ca làm việc</th>
              <th className="p-3 border text-center">Thời gian</th>
              <th className="p-3 border text-center">Mô tả</th>
              <th className="p-3 border text-center">Loại ca</th>
              <th className="p-3 border text-center">Hoạt động</th>
            </tr>
          </thead>
          <tbody>
            {data.map((shift, index) => (
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-2 border text-center">{index + 1}</td>
                <td className="px-4 py-2 border text-center">{shift.TenCa}</td>
                <td className="px-4 py-2 border text-center">
                  {shift.ThoiGianBatDau} - {shift.ThoiGianKetThuc}
                </td>
                <td className="px-4 py-2 border text-center">{shift.MoTa}</td>
                <td className="px-4 py-2 border text-center">
                  {shift.isCaDem? "Ca đêm" : "Ca thường"}
                </td>
                <td className="p-3 border flex items-center justify-center gap-4">
                  <Pencil className="w-5 h-5 cursor-pointer text-gray-600 hover:text-blue-500" 
                    onClick={()=>{
                      setShowModalUpdate(true);
                      setSelectedShift(shift);
                    }}
                  />
                  <Trash2 className="w-5 h-5 cursor-pointer text-gray-600 hover:text-red-500" 
                    onClick={()=>{
                      setShowModalDelete(true);
                      setMaCa(shift.MaCa);
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        </>
      ): <div className="text-gray-600">Đang tải dữ liệu..</div>}
    </div>
      {showModalAdd && <AddShiftForm setShowModalAdd={setShowModalAdd} getDataShift={getDataShift}></AddShiftForm>}
      {showModalDelete && <ConfirmDeleteModal setShowModalDelete={setShowModalDelete} onDelete={onDelete} Name={"Ca làm"}></ConfirmDeleteModal>}
      {showModalUpdate && selectedShift && <UpdateShiftForm setShowModalUpdate={setShowModalUpdate} getDataShift={getDataShift} shift={selectedShift}/>}
    </div>
  );
}
