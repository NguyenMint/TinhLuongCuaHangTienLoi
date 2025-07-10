import { useEffect, useState } from "react";
import { Delete, Pencil, Trash2 } from "lucide-react";
import { getHeSoPhuCap, deleteHeSoPhuCap } from "../../api/apiHeSoPC";
import { AddAllowanceCoefficientForm } from "../../components/AllowanceCoefficient/AddNewAllowanceCoefficientModal";
import { UpdateAllowanceCoefficientForm } from "../../components/AllowanceCoefficient/UpdateAllowaceCoefficientModal,";
import { ConfirmDeleteModal } from "../../components/ModalDelete";
export function AllowanceCoefficientPage() {
  const [data, setData] = useState([]);
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [selectedAllowanceCoefficient, setSelectedAllowanceCoefficient] =
    useState(null);
  const [maHSN, setMaHSN] = useState({
    MaHSNCaDem: null,
    MaHSNCaThuong: null,
  });
  const fetchHeSoPhuCap = async () => {
    try {
      const response = await getHeSoPhuCap();
      const { cuoiTuan, ngayThuong, ngayLe } = response;
      const rows = [
        ...groupByLoaiNgay(cuoiTuan, "Cuối tuần"),
        ...groupByLoaiNgay(ngayThuong, "Ngày thường"),
        ...groupNgayLe(ngayLe),
      ];
      setData(rows);
      console.log(rows);
    } catch (error) {
      console.error("Lỗi lấy hệ số phụ cấp:", error);
    }
  };
  function groupByLoaiNgay(arr, loaiNgay) {
    if (!arr || arr.length === 0) return [];
    const caThuong = arr.find((item) => !item.isCaDem);
    const caDem = arr.find((item) => item.isCaDem);
    return [
      {
        ngay: "Tất cả",
        loaiNgay,
        caThuong,
        caDem,
      },
    ];
  }
  function groupNgayLe(arr) {
    if (!arr || arr.length === 0) return [];
    const grouped = {};
    arr.forEach((item) => {
      const key = item.Ngay;
      if (!grouped[key])
        grouped[key] = {
          ngay: item.Ngay,
          loaiNgay: "Ngày lễ",
          caThuong: null,
          caDem: null,
        };
      if (item.isCaDem) grouped[key].caDem = item;
      else grouped[key].caThuong = item;
    });
    return Object.values(grouped);
  }
  useEffect(() => {
    fetchHeSoPhuCap();
  }, []);
  const onDelete = async () => {
    try {
      const result = await deleteHeSoPhuCap(maHSN);
      if (!result.success) {
        alert(result.message || "Xóa Hệ số phụ cấp thất bại.");
        return;
      }
      alert("Xóa Hệ số phụ cấp thành công!");
      fetchHeSoPhuCap();
    } catch (error) {
      console.error("Lỗi không xác định:", error);
      alert("Lỗi không xác định. Vui lòng thử lại.");
    }
    setShowModalDelete(false);
  };
  return (
    <div>
      <div className="p-6 bg-gray-100 min-h-screen">
        {data ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Danh sách hệ số phụ cấp</h2>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                onClick={() => {
                  setShowModalAdd(true);
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
                      <td className="px-4 py-2 border text-center">
                        {index + 1}
                      </td>
                      <td className="px-4 py-2 border text-center">
                        {coefficient.ngay}
                      </td>
                      <td className="px-4 py-2 border text-center">
                        Ca thường: {coefficient.caThuong.HeSoLuong} - Ca đêm:{" "}
                        {coefficient.caDem.HeSoLuong}
                      </td>
                      <td className="px-4 py-2 border text-center">
                        {coefficient.loaiNgay}
                      </td>
                      <td className="p-3 border flex items-center justify-center gap-4">
                        <Pencil
                          className="w-5 h-5 cursor-pointer text-gray-600 hover:text-blue-500"
                          onClick={() => {
                            setShowModalUpdate(true);
                            setSelectedAllowanceCoefficient(coefficient);
                            console.log(coefficient);
                          }}
                        />
                        <Trash2
                          className="w-5 h-5 cursor-pointer text-gray-600 hover:text-red-500"
                          onClick={() => {
                            setShowModalDelete(true);
                             setMaHSN({
                              MaHSNCaDem:coefficient.caDem.MaHSN,
                              MaHSNCaThuong:coefficient.caThuong.MaHSN
                            });
                            console.log(coefficient.caDem.MaHSN,
                              coefficient.caThuong.MaHSN);
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="text-gray-600">Đang tải dữ liệu..</div>
        )}
      </div>
      {showModalAdd && (
        <AddAllowanceCoefficientForm
          setShowModalAdd={setShowModalAdd}
          getData={fetchHeSoPhuCap}
        ></AddAllowanceCoefficientForm>
      )}
      {showModalUpdate && (
        <UpdateAllowanceCoefficientForm
          setShowModalUpdate={setShowModalUpdate}
          getData={fetchHeSoPhuCap}
          allowanceCoefficient={selectedAllowanceCoefficient}
        ></UpdateAllowanceCoefficientForm>
      )}
      {showModalDelete && (
        <ConfirmDeleteModal
          onDelete={onDelete}
          setShowModalDelete={setShowModalDelete}
          Name={"Hệ số phụ cấp"}
        ></ConfirmDeleteModal>
      )}
    </div>
  );
}
