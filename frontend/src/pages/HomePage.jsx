import React, { useState } from "react";
import { BellIcon } from "lucide-react";
import { FilterSidebar } from "../components/HomePage/FilterSidebar.jsx";
import { EmployeeTable } from "../components/HomePage/EmployeeTable.jsx";
import { EmployeeDetail } from "../components/HomePage/EmployeeDetail.jsx";
import Search from "../components/search.jsx";
import {
  createEmployee,
  fetchAllNhanVien,
  searchEmployee,
} from "../api/apiTaiKhoan.js";
import { useEffect } from "react";
import { getChiNhanh } from "../api/apiChiNhanh.js";
import { AddEmployeeModal } from "../components/Employee/AddNewEmployeeModal.jsx";
import { UpdateEmployeeModal } from "../components/Employee/UpdateEmployeeModal.jsx";
import { Pagination } from "../components/Pagination.jsx";
import { getChungChi } from "../api/apiChungChi.js";
import { getAllPhuCap } from "../api/apiPhuCap.js";
import { getHopDong } from "../api/apiHopDong.js";
import { getDonXinNghi } from "../api/apiNgayNghiPhep.js";
import { resetPassword } from "../api/apiTaiKhoan.js";
import { LeaveRequestListModal } from "../components/LeaveRequestList.jsx";
import { ConfirmResetPassword } from "../components/Employee/ConfirmResetPassword.jsx";
import { toast } from "react-toastify";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import * as XLSX from "xlsx";
import { getAllThangLuongFullTime, getAllThangLuongPartTime } from "../api/apiThangLuong";
export function HomePage() {
  // State for filters
  const [statusFilter, setStatusFilter] = useState("working");
  const [payrollBranch, setPayrollBranch] = useState("");
  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");
  const [showDetail, setShowDetail] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [chinhanhs, setChiNhanhs] = useState([]);
  const [chungChis, setChungChis] = useState([]);
  const [phuCaps, setPhuCaps] = useState([]);
  const [hopDongs, setHopDongs] = useState([]);
  const [selectedChiNhanh, setSelectedChiNhanh] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [donXinNghis, setDonXinNghis] = useState([]);
  const [showModalListDonXinNghis, setShowModalListDonXinNghis] =
    useState(false);
  const [showModalResetPass, setShowModalResetPass] = useState(false);
  // 4 useState đóng mở thêm sửa nhân viên, xem trước dữ liệu nhập file
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [importedEmployees, setImportedEmployees] = useState([]);
  const [showImportPreview, setShowImportPreview] = useState(false);

  // Tính toán phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const nhanVienInPage = 5;
  const indexLast = currentPage * nhanVienInPage;
  const indexFirst = indexLast - nhanVienInPage;
  const employeeCurrent = filteredEmployees.slice(indexFirst, indexLast);
  const totalPage = Math.ceil(filteredEmployees.length / nhanVienInPage);

  const user = JSON.parse(localStorage.getItem("user"));

  const handlePageChange = (pagenumber) => {
    setCurrentPage(pagenumber);
  };

  const getAllNhanVien = async () => {
    try {
      const data = await fetchAllNhanVien();
      setEmployees(data);
    } catch (error) {
      console.error("Lỗi khi lấy Nhân viên:", error);
    }
  };

  const fetchChiNhanh = async () => {
    try {
      const data = await getChiNhanh();
      setChiNhanhs(data);
    } catch (error) {
      console.error("Lỗi khi lấy Chi nhánh:", error);
    }
  };
  const fetchChungChi = async (MaTK) => {
    try {
      const data = await getChungChi(MaTK);
      setChungChis(data);
    } catch (error) {
      console.error("Lỗi khi lấy Chứng chỉ:", error);
    }
  };
  const fetchHopDong = async (MaTK) => {
    try {
      const data = await getHopDong(MaTK);
      setHopDongs(data);
    } catch (error) {
      console.error("Lỗi khi lấy Chứng chỉ:", error);
    }
  };
  const fetchPhuCap = async (MaTK) => {
    try {
      const data = await getAllPhuCap(MaTK);
      setPhuCaps(data);
    } catch (error) {
      console.error("Lỗi khi lấy Phụ cấp:", error);
    }
  };
  const fetchDonXinNghi = async () => {
    try {
      const response = await getDonXinNghi();
      setDonXinNghis(response);
    } catch (error) {
      console.error("Lỗi khi lấy đơn xin nghĩ:", error);
    }
  };
  const handleResetPassword = async () => {
    try {
      if (!selectedEmployee) {
        toast.error("Vui lòng chọn nhân viên để đặt lại mật khẩu");
        return;
      }
      const response = await resetPassword(selectedEmployee.MaTK);
      if (response.success) {
        setShowModalResetPass(false);
        toast.success("Đặt lại mật khẩu thành công");
      } else {
        toast.error(response.message || "Lỗi khi đặt lại mật khẩu");
      }
    } catch (error) {
      console.error("Lỗi khi reset mật khẩu:", error);
    }
  };
  useEffect(() => {
    getAllNhanVien();
    fetchChiNhanh();
    fetchDonXinNghi();
  }, []);

  useEffect(() => {
    if (selectedEmployee) {
      fetchPhuCap(selectedEmployee.MaTK);
      fetchChungChi(selectedEmployee.MaTK);
      fetchHopDong(selectedEmployee.MaTK);

    }
  }, [selectedEmployee]);

  useEffect(() => {
    let filtered = Array.isArray(employees) ? [...employees] : [];

    if (user.MaVaiTro === 1) {
      filtered = filtered.filter((emp) => emp.MaCN === Number(user.MaCN));
    } else {
      // Lọc theo chi nhánh
      if (selectedChiNhanh) {
        filtered = filtered.filter(
          (emp) => emp.MaCN === Number(selectedChiNhanh.MaCN)
        );
      }
    }

    // Lọc theo trạng thái
    if (statusFilter === "working") {
      filtered = filtered.filter((emp) => emp.TrangThai === "Đang làm");
    } else if (statusFilter === "resigned") {
      filtered = filtered.filter((emp) => emp.TrangThai === "Ngừng làm việc");
    }
    setFilteredEmployees(filtered);
  }, [employees, selectedChiNhanh, statusFilter]);

  const refreshEmployeeData = async () => {
    try {
      const data = await fetchAllNhanVien();
      setEmployees(data);

      // Update selected employee with fresh data if one is selected
      if (selectedEmployee) {
        const updatedEmployee = data.find(
          (emp) => emp.MaTK === selectedEmployee.MaTK
        );
        if (updatedEmployee) {
          setSelectedEmployee(updatedEmployee);
        }
      }
    } catch (error) {
      console.error("Lỗi khi làm mới dữ liệu nhân viên:", error);
    }
  };

  const handleAddEmployee = () => {
    console.log("Add employee clicked");
  };

  const columnMapping = {
    "Họ tên": "HoTen",
    Email: "Email",
    "Số điện thoại": "SoDienThoai",
    "Ngày sinh": "NgaySinh",
    "Địa chỉ": "DiaChi",
    "Mã chi nhánh": "MaCN",
    CCCD: "CCCD",
    "Tên ngân hàng": "TenNganHang",
    STK: "STK",
    "Loại NV": "LoaiNV",
    "Bậc lương": "BacLuong",
    "Lương cơ bản hiện tại": "LuongCoBanHienTai",
    "Lương theo giờ hiện tại": "LuongTheoGioHienTai",
    "Số ngày nghỉ phép": "SoNgayNghiPhep",
    "Mã vai trò": "MaVaiTro",
    "Trạng thái": "TrangThai",
    "Giới tính": "GioiTinh",
    "Quản lý bởi": "QuanLyBoi"
  };

  const handleImportFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      let data = XLSX.utils.sheet_to_json(ws, { defval: "" });
      data = data.map((row) => {
        const mapped = {};
        Object.entries(row).forEach(([key, value]) => {
          const mappedKey = columnMapping[key] || key;
          mapped[mappedKey] = value;
        });
        return mapped;
      });
      setImportedEmployees(data);
      setShowImportPreview(true);
    };
    reader.readAsBinaryString(file);
  };

  const handleSubmitImport = async () => {
    let successCount = 0;
    let failCount = 0;
    let errorRows = [];
    // Lấy dữ liệu thang lương và tài khoản quản lý
    let thangLuongFullTime = [];
    let thangLuongPartTime = [];
    let allAccounts = [];
    try {
      thangLuongFullTime = await getAllThangLuongFullTime();
      thangLuongPartTime = await getAllThangLuongPartTime();
      allAccounts = await fetchAllNhanVien();
    } catch (err) {
      toast.error("Không thể lấy dữ liệu thang lương hoặc tài khoản quản lý");
      return;
    }
    for (let idx = 0; idx < importedEmployees.length; idx++) {
      const emp = importedEmployees[idx];
      // Kiểm tra trường bắt buộc
      if (
        !emp.HoTen ||
        !emp.Email ||
        !emp.SoDienThoai ||
        !emp.NgaySinh ||
        !emp.DiaChi ||
        !emp.MaCN ||
        !emp.CCCD ||
        !emp.TenNganHang ||
        !emp.STK ||
        !emp.GioiTinh ||
        !emp.QuanLyBoi
      ) {
        failCount++;
        errorRows.push({ idx: idx + 1, error: "Thiếu trường bắt buộc" });
        continue;
      }
      try {
        // Mapping mã quản lý (QuanLyBoi: mã nhân viên => MaTK)
        let maQuanLy = emp.QuanLyBoi;
        let foundManager = allAccounts.find(acc => acc.MaNhanVien === maQuanLy);
        if (!foundManager) {
          failCount++;
          errorRows.push({ idx: idx + 1, error: `Không tìm thấy mã quản lý: ${maQuanLy}` });
          continue;
        }
        emp.QuanLyBoi = foundManager.MaTK;
        // Mapping lương từ bảng thang lương
        let bacLuong = emp.BacLuong || 1;
        let loaiNV = emp.LoaiNV || "FullTime";
        let maVaiTro = emp.MaVaiTro || 2;
        let thangLuong;
        if (loaiNV === "FullTime") {
          thangLuong = thangLuongFullTime.find(tl => Number(tl.BacLuong) === Number(bacLuong) && Number(tl.MaVaiTro) === Number(maVaiTro));
        } else {
          thangLuong = thangLuongPartTime.find(tl => Number(tl.BacLuong) === Number(bacLuong) && Number(tl.MaVaiTro) === Number(maVaiTro));
        }
        if (!thangLuong) {
          failCount++;
          errorRows.push({ idx: idx + 1, error: `Không tìm thấy thang lương phù hợp (Bậc: ${bacLuong}, Loại: ${loaiNV}, Vai trò: ${maVaiTro})` });
          continue;
        }
        emp.LuongCoBanHienTai = thangLuong.LuongCoBan || 0;
        emp.LuongTheoGioHienTai = thangLuong.LuongTheoGio || 0;
        // Chuẩn hóa giới tính
        if (emp.GioiTinh === "Nam" || emp.GioiTinh === true) emp.GioiTinh = true;
        else if (emp.GioiTinh === "Nữ" || emp.GioiTinh === false) emp.GioiTinh = false;
        // Chuẩn hóa các trường khác nếu cần
        const formData = new FormData();
        Object.entries(emp).forEach(([key, value]) => {
          formData.append(key, value);
        });
        if (!formData.get("LoaiNV")) formData.set("LoaiNV", "FullTime");
        if (!formData.get("MaVaiTro")) formData.set("MaVaiTro", 2);
        if (!formData.get("TrangThai")) formData.set("TrangThai", "Đang làm");
        const result = await createEmployee(formData);
        if (result.success) {
          successCount++;
        } else {
          failCount++;
          errorRows.push({ idx: idx + 1, error: result.message || "Lỗi không xác định" });
        }
      } catch (err) {
        failCount++;
        errorRows.push({ idx: idx + 1, error: err.message || "Lỗi không xác định" });
      }
    }
    let msg = `Nhập thành công ${successCount} nhân viên, thất bại ${failCount}`;
    if (errorRows.length > 0) {
      msg += ":\n" + errorRows.map(e => `Dòng ${e.idx}: ${e.error}`).join("\n");
    }
    toast[msg.includes('thất bại') ? 'error' : 'success'](msg, {autoClose: 5000});
    setShowImportPreview(false);
    setImportedEmployees([]);
    await getAllNhanVien();
  };

  const handleExportFile = async () => {
    console.log(filteredEmployees);
    try {
      if (!filteredEmployees || filteredEmployees.length === 0) {
        toast.warning("Không có dữ liệu để xuất!");
        return;
      }
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("DanhSachNhanVien");
      worksheet.mergeCells("A1:K1");
      const titleRow = worksheet.getRow(1);
      titleRow.height = 30;
      titleRow.getCell(1).value = "DANH SÁCH NHÂN VIÊN";
      titleRow.getCell(1).font = {
        bold: true,
        size: 16,
        name: "Arial",
        color: { argb: "000000" },
      };
      titleRow.getCell(1).alignment = {
        horizontal: "center",
        vertical: "middle",
      };
      const headers = [
        "STT",
        "Mã NV",
        "Họ tên",
        "Giới tính",
        "Ngày sinh",
        "Địa chỉ",
        "SĐT",
        "Email",
        "Trạng thái",
        "Loại NV",
        "Chi nhánh",
      ];
      const headerRow = worksheet.addRow(headers);
      headerRow.eachCell({ includeEmpty: true }, (cell) => {
        cell.font = {
          bold: true,
          color: { argb: "FFFFFF" },
          size: 12,
        };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "4472C4" },
        };
        cell.alignment = {
          horizontal: "center",
          vertical: "middle",
        };
      });
      let stt = 1;
      filteredEmployees.forEach((emp) => {
        worksheet.addRow([
          stt++,
          emp.MaNhanVien,
          emp.HoTen,
          emp.GioiTinh ? "Nam" : "Nữ",
          emp.NgaySinh,
          emp.DiaChi,
          emp.SoDienThoai,
          emp.Email,
          emp.TrangThai,
          emp.LoaiNV,
          emp.MaCN_chi_nhanh.TenChiNhanh || emp.MaCN || "",
        ]);
      });
      worksheet.columns = [
        { width: 6 },
        { width: 12 },
        { width: 20 },
        { width: 8 },
        { width: 12 },
        { width: 25 },
        { width: 15 },
        { width: 22 },
        { width: 15 },
        { width: 12 },
        { width: 18 },
      ];
      worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
          if (rowNumber > 2) {
            cell.alignment = { horizontal: "center", vertical: "middle" };
          }
        });
      });
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const fileName = `DanhSachNhanVien.xlsx`;
      saveAs(blob, fileName);
      toast.success("Xuất file Excel thành công!");
    } catch (error) {
      console.error("Lỗi khi export file Excel:", error);
      toast.error("Có lỗi xảy ra khi xuất file Excel!");
    }
  };

  const handleSearch = async (query) => {
    try {
      if (!query.trim()) {
        await getAllNhanVien();
        return;
      }
      const results = await searchEmployee(query);
      setEmployees(results);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
    }
  };

  const handleDownloadTemplate = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("TemplateImportNhanVien");
    const headers = [
      "Họ tên",
      "Email",
      "Số điện thoại",
      "Ngày sinh",
      "Địa chỉ",
      "Mã chi nhánh",
      "CCCD",
      "Tên ngân hàng",
      "STK",
      "Loại NV",
      "Bậc lương",
      "Mã vai trò",
      "Số ngày nghỉ phép",
      "Trạng thái",
      "Giới tính",
      "Quản lý bởi"
    ];
    worksheet.addRow(headers);
    // Ví dụ
    worksheet.addRow([
      "Nguyễn Văn A",
      "a@example.com",
      "0912345678",
      "1990-01-01",
      "123 Đường ABC, Quận 1",
      "1",
      "123456789",
      "Vietcombank",
      "0122456789",
      "FullTime",
      "1",
      "2",
      "12",
      "Đang làm",
      "Nam",
      "QL0001"
    ]);
    worksheet.columns = headers.map(() => ({ width: 18 }));
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "Template_Import_NhanVien.xlsx");
  };

  return (
    <div className="flex">
      <div className="md:flex flex-1">
        <FilterSidebar
          chinhanhs={chinhanhs}
          selectedChiNhanh={selectedChiNhanh}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          setSelectedChiNhanh={setSelectedChiNhanh}
          payrollBranch={payrollBranch}
          setPayrollBranch={setPayrollBranch}
          department={department}
          setDepartment={setDepartment}
          position={position}
          setPosition={setPosition}
        />
        {donXinNghis.length > 0 && (
          <button
            onClick={() => setShowModalListDonXinNghis(true)}
            className="fixed top-2 right-6 flex items-center px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
          >
            <BellIcon className="h-4 w-4 mr-2" />
            {donXinNghis.length} xin nghĩ phép năm chờ duyệt
          </button>
        )}
        <div className="flex-1 px-6 md:p-6">
          <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
            <Search
              placeholder="Tìm kiếm nhân viên..."
              onSearch={handleSearch}
              setQuery={setSearchQuery}
            />

            {/* Create Nhan Vien */}
            <div className="">
              <button
                onClick={() => setShowModalAdd(true)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Thêm nhân viên
              </button>
              <button
                onClick={() =>
                  document.getElementById("import-employee-input").click()
                }
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-2"
              >
                Nhập file
              </button>
              <button
                onClick={handleDownloadTemplate}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 ml-2"
              >
                Tải file mẫu
              </button>
              <input
                id="import-employee-input"
                type="file"
                accept=".xlsx, .xls"
                style={{ display: "none" }}
                onChange={handleImportFile}
              />
              <button
                onClick={handleExportFile}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-yellow-600 ml-2"
              >
                Xuất file nhân viên
              </button>
            </div>
          </div>

          <div className="mt-6">
            <EmployeeTable
              employees={employeeCurrent}
              selectedEmployee={selectedEmployee}
              setSelectedEmployee={setSelectedEmployee}
              setShowDetail={setShowDetail}
            />
          </div>

          {Array.isArray(employeeCurrent) && employeeCurrent.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPage}
              onPageChange={handlePageChange}
            />
          )}
        </div>

        {/* Modals */}
        {showModalAdd && (
          <AddEmployeeModal
            setShowModalAdd={setShowModalAdd}
            getAllEmployees={getAllNhanVien}
            chiNhanhs={chinhanhs}
          />
        )}

        {showModalUpdate && (
          <UpdateEmployeeModal
            setShowModalUpdate={setShowModalUpdate}
            refreshEmployeeData={refreshEmployeeData}
            chiNhanhs={chinhanhs}
            employee={selectedEmployee}
          />
        )}

        {/* Employee Detail Modal */}
        {selectedEmployee && (
          <EmployeeDetail
            hopDongs={hopDongs}
            phuCaps={phuCaps}
            chungChis={chungChis}
            selectedEmployee={selectedEmployee}
            setSelectedEmployee={setSelectedEmployee}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onEmployeeStatusChange={refreshEmployeeData}
            setShowModalUpdate={setShowModalUpdate}
            showDetail={showDetail}
            setShowDetail={setShowDetail}
            setShowModalResetPass={setShowModalResetPass}
            onSuccess={() => {
              if (selectedEmployee) {
                fetchPhuCap(selectedEmployee.MaTK);
                fetchChungChi(selectedEmployee.MaTK);
                fetchHopDong(selectedEmployee.MaTK);
              }
            }}
          />
        )}
        {showModalListDonXinNghis && (
          <LeaveRequestListModal
            setShowModalDonXinNghis={setShowModalListDonXinNghis}
            requests={donXinNghis}
            fecthRequests={fetchDonXinNghi}
          />
        )}
        {showModalResetPass && (
          <ConfirmResetPassword
            setShowModalResetPass={setShowModalResetPass}
            onAccept={handleResetPassword}
          />
        )}
        {showImportPreview && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-2xl w-full">
              <h2 className="text-lg font-bold mb-4">
                Xem trước dữ liệu import
              </h2>
              <div className="overflow-x-auto max-h-96">
                <table className="min-w-full border">
                  <thead>
                    <tr>
                      {Object.keys(importedEmployees[0] || {}).map((key) => (
                        <th key={key} className="border px-2 py-1">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {importedEmployees.map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-100">
                        {Object.values(row).map((val, i) => (
                          <td key={i} className="border px-2 py-1">
                            {val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setShowImportPreview(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSubmitImport}
                  className="px-4 py-2 bg-green-500 text-white rounded"
                >
                  Nhập dữ liệu
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
