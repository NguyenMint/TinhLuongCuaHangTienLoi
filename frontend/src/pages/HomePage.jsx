import React, { useState } from "react";
import { BellIcon } from "lucide-react";
import { FilterSidebar } from "../components/HomePage/FilterSidebar.jsx";
import { EmployeeTable } from "../components/HomePage/EmployeeTable.jsx";
import { EmployeeDetail } from "../components/HomePage/EmployeeDetail.jsx";
import Search from "../components/search.jsx";
import { fetchAllNhanVien, searchEmployee } from "../api/apiTaiKhoan.js";
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
  // 3 useState đóng mở thêm sửa nhân viên
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);

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

  const handleImportFile = () => {
    console.log("Import file clicked");
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
              {/* <button
                onClick={handleImportFile}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-2"
              >
                Nhập file
              </button>*/}
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
      </div>
    </div>
  );
}
