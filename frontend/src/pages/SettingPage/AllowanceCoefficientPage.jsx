import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { getHeSoPhuCap } from "../../api/apiHeSoPC";
import { AddAllowanceCoefficientForm } from "../../components/AllowanceCoefficient/AddNewAllowanceCoefficientModal";
import {ConfirmDeleteModal} from "../../components/ModalDelete";
export function AllowanceCoefficientPage() {
  const [data, setData] = useState([]);
  const [showModalAdd,setShowModalAdd] = useState(false);
  const [showModalDelete,setShowModalDelete] = useState(false);
  const fetchHeSoPhuCap = async () =>{
    try {
        const response = await getHeSoPhuCap();
        setData(response);
    } catch (error) {
         console.error("Lỗi lấy hệ số phụ cấp:", error);
    }
  }
  useEffect(()=>{
    fetchHeSoPhuCap();
  },[]);
  return (
    <div>
      <div className="p-6 bg-gray-100 min-h-screen">
      {data? (
        <>
          <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Danh sách hệ số phụ cấp</h2>
        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        onClick={()=>{
            setShowModalAdd(true);
            console.log(showModalAdd);
        }}
        >
          + Thêm hệ số phụ cấp
        </button>
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-blue-100">
            <tr>
              <th className="p-3 border text-center">Stt</th>
              <th className="p-3 border text-center">Ngày</th>
              <th className="p-3 border text-center">Hệ số lương</th>
              <th className="p-3 border text-center">Loại ngày</th>
              <th className="p-3 border text-center">Hoạt động</th>
            </tr>
          </thead>
          <tbody>
            {data.map((coefficient, index) => (
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-2 border text-center">{index + 1}</td>
                <td className="px-4 py-2 border text-center">{coefficient.Ngay?coefficient.Ngay:"All"}</td>
                <td className="px-4 py-2 border text-center">
                  {coefficient.HeSoLuong}
                </td>
                <td className="px-4 py-2 border text-center">{coefficient.LoaiNgay}</td>
                <td className="p-3 border flex items-center justify-center gap-4">
                  <Pencil className="w-5 h-5 cursor-pointer text-gray-600 hover:text-blue-500" 
                 
                  />
                  <Trash2 className="w-5 h-5 cursor-pointer text-gray-600 hover:text-red-500" 
                   
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
    {showModalAdd && <AddAllowanceCoefficientForm setShowModalAdd={setShowModalAdd} getData={getHeSoPhuCap}></AddAllowanceCoefficientForm>}
    </div>
  );
}
