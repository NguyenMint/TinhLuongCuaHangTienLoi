import React, { useEffect, useState } from "react";
import { FilterSidebar } from "../components/Payroll/FilterSidebar";
import { PayrollTable } from "../components/Payroll/PayrollTable";
import { PayrollDetail } from "../components/Payroll/PayrollDetail";
import { Header } from "../components/Payroll/Header";
import { payrolls } from "../utils/mockData";
import { getAllBangLuong } from "../api/apiBangLuong";
import { getChiNhanh } from "../api/apiChiNhanh";
export function PayrollPage() {
  const [payrolls, setPayrolls] = useState([]);
  const [filteredPayrolls, setFilteredPayrolls] = useState(payrolls);
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDetail, setShowDetail] = useState(false);
  const [chinhanhs, setChiNhanhs] = useState([]);
  const [selectedChiNhanh, setSelectedChiNhanh] = useState("");

  const [statusFilters, setStatusFilters] = useState({
    creating: false,
    draft: false,
    finalized: false,
    cancelled: false,
  });
  const fetchAllBangLuong = async () => {
    try {
      const data = await getAllBangLuong();
      setPayrolls(data);
    } catch (error) {
      console.error("Lỗi khi lấy Bảng lương:", error);
    }
  };
  const fetchChiNhanh = async () => {
    try {
      const data = await getChiNhanh();
      setChiNhanhs(data);
    } catch (error) {
      console.error("Lỗi khi lấy Nhân viên:", error);
    }
  };
  useEffect(() => {
    // Fetch payroll data when component mounts
    fetchAllBangLuong();
    fetchChiNhanh();
  }, []);

  // Handle search
  useEffect(() => {
    const filtered = payrolls.filter((payroll) =>
      payroll.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPayrolls(filtered);
  }, [searchTerm]);
  // Handle status filter
  useEffect(() => {
    const filtered = payrolls.filter((payroll) => {
      if (payroll.status === "Đã chốt lương" && statusFilters.finalized)
        return true;
      if (payroll.status === "Tạm tính" && statusFilters.draft) return true;
      if (payroll.status === "Đang tạo" && statusFilters.creating) return true;
      if (payroll.status === "Đã hủy" && statusFilters.cancelled) return true;
      return false;
    });
    setFilteredPayrolls(filtered);
  }, [statusFilters]);
  const handleRowClick = (payroll) => {
    setSelectedPayroll(payroll);
  };
  const handleExport = () => {
    alert("Export functionality will be implemented here");
  };
  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel this payroll?")) {
      alert("Payroll cancelled");
    }
  };
  const handleSearch = (term) => {
    setSearchTerm(term);
  };
  const handleStatusFilterChange = (status, checked) => {
    setStatusFilters((prev) => ({
      ...prev,
      [status]: checked,
    }));
  };
  return (
    <div className="flex h-screen bg-gray-50">
      <FilterSidebar
        chinhanhs={chinhanhs}
        selectedChiNhanh={selectedChiNhanh}
        statusFilters={statusFilters}
        onStatusFilterChange={handleStatusFilterChange}
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header onSearch={handleSearch} onExport={handleExport} />
        <div className="flex-1 overflow-auto p-4">
          <PayrollTable
            // payrolls={filteredPayrolls}
            payrolls={payrolls}
            onRowClick={handleRowClick}
            selectedPayroll={selectedPayroll}
            setSelectedPayroll={setSelectedPayroll}
            setShowDetail={setShowDetail}
          />
          {showDetail && (
            <PayrollDetail
              payroll={selectedPayroll}
              onCancel={handleCancel}
              onExport={handleExport}
            />
          )}
        </div>
      </div>
    </div>
  );
}
