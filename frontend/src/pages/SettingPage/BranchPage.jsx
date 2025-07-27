import React, { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { getChiNhanh } from "../../api/apiChiNhanh";
import { AddBranchForm } from "../../components/Branch/AddNewBranchModal";
import { UpdateBranchForm } from "../../components/Branch/UpdateBranchModal";
import { ConfirmDeleteModal } from "../../components/ModalDelete";
import { deleteChiNhanh } from "../../api/apiChiNhanh";
import { toast } from "react-toastify";
export function BranchPage() {
  const [data, setData] = useState();
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [selectedMaCN, setSelectedMaCN] = useState(null);
  const fetchAllBranch = async () => {
    try {
      const response = await getChiNhanh();
      setData(response);
    } catch (error) {
      console.error("Lỗi lấy Ca làm:", error);
    }
  };
  const onDelete = async () => {
    try {
      const result = await deleteChiNhanh(selectedMaCN);
      if (!result.success) {
        toast.error(result.message || "Xóa chi nhánh thất bại.");
        return;
      }
      toast.success("Xóa chi nhánh thành công!");
      fetchAllBranch();
    } catch (error) {
      console.error("Lỗi không xác định:", error);
      toast.error("Lỗi không xác định. Vui lòng thử lại.");
    }
    setShowModalDelete(false);
  };
  useEffect(() => {
    fetchAllBranch();
  }, []);
  return (
    <div>
      <div className="p-6 bg-gray-100 min-h-screen">
        {data ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Danh sách chi nhánh</h2>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                onClick={() => {
                  setShowModalAdd(true);
                }}
              >
                + Thêm chi nhánh
              </button>
            </div>

            <div className="bg-white rounded shadow overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-blue-100">
                  <tr>
                    <th className="p-3 border text-center">Stt</th>
                    <th className="p-3 border text-center">Tên chi nhánh</th>
                    <th className="p-3 border text-center">Địa chỉ</th>
                    <th className="p-3 border text-center">Hoạt động</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length > 0 ? (
                    data.map((branch, index) => (
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-2 border text-center">
                          {index + 1}
                        </td>
                        <td className="px-4 py-2 border text-center">
                          {branch.TenChiNhanh}
                        </td>
                        <td className="px-4 py-2 border text-center">
                          {branch.DiaChi}
                        </td>
                        <td className="p-3 border flex items-center justify-center gap-4">
                          <Pencil
                            className="w-5 h-5 cursor-pointer text-gray-600 hover:text-blue-500"
                            onClick={() => {
                              setSelectedBranch(branch);
                              setShowModalUpdate(true);
                            }}
                          />
                          <Trash2
                            className="w-5 h-5 cursor-pointer text-gray-600 hover:text-red-500"
                            onClick={() => {
                              setSelectedMaCN(branch.MaCN);
                              setShowModalDelete(true);
                            }}
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-gray-600 text-center py-2"
                      >
                        Không có dữ liệu
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="text-gray-600">Đang tải dữ liệu..</div>
        )}
      </div>
      {showModalAdd && (
        <AddBranchForm
          setShowModalAdd={setShowModalAdd}
          fetchAllBranch={fetchAllBranch}
        />
      )}
      {showModalUpdate && (
        <UpdateBranchForm
          setShowModalUpdate={setShowModalUpdate}
          fetchAllBranch={fetchAllBranch}
          branch={selectedBranch}
        />
      )}
      {showModalDelete && (
        <ConfirmDeleteModal
          setShowModalDelete={setShowModalDelete}
          onDelete={onDelete}
          Name={"Chi nhánh"}
        />
      )}
    </div>
  );
}
