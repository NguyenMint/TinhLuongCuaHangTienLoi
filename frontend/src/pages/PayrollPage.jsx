import React, { useEffect, useState } from 'react';
import { FilterSidebar } from '../components/Payroll/FilterSidebar';
import { PayrollTable } from '../components/Payroll/PayrollTable';
import { PayrollDetail } from '../components/Payroll/PayrollDetail';
import { Header } from '../components/Payroll/Header';
import { mockPayrolls } from '../utils/mockData';
export function PayrollPage() {
  const [payrolls, setPayrolls] = useState(mockPayrolls);
  const [filteredPayrolls, setFilteredPayrolls] = useState(mockPayrolls);
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilters, setStatusFilters] = useState({
    creating: true,
    draft: true,
    finalized: true,
    cancelled: false
  });
  // Handle search
  useEffect(() => {
    const filtered = mockPayrolls.filter(payroll => payroll.name.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredPayrolls(filtered);
  }, [searchTerm]);
  // Handle status filter
  useEffect(() => {
    const filtered = mockPayrolls.filter(payroll => {
      if (payroll.status === 'Đã chốt lương' && statusFilters.finalized) return true;
      if (payroll.status === 'Tạm tính' && statusFilters.draft) return true;
      if (payroll.status === 'Đang tạo' && statusFilters.creating) return true;
      if (payroll.status === 'Đã hủy' && statusFilters.cancelled) return true;
      return false;
    });
    setFilteredPayrolls(filtered);
  }, [statusFilters]);
  const handleRowClick = payroll => {
    setSelectedPayroll(payroll);
  };
  const handleExport = () => {
    alert('Export functionality will be implemented here');
  };
  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel this payroll?')) {
      alert('Payroll cancelled');
    }
  };
  const handleSearch = term => {
    setSearchTerm(term);
  };
  const handleStatusFilterChange = (status, checked) => {
    setStatusFilters(prev => ({
      ...prev,
      [status]: checked
    }));
  };
  return <div className="flex h-screen bg-gray-50">
      <FilterSidebar statusFilters={statusFilters} onStatusFilterChange={handleStatusFilterChange} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header onSearch={handleSearch} onExport={handleExport} />
        <div className="flex-1 overflow-auto p-4">
          <PayrollTable payrolls={filteredPayrolls} onRowClick={handleRowClick} selectedPayroll={selectedPayroll} />
          {selectedPayroll && <PayrollDetail payroll={selectedPayroll} onCancel={handleCancel} onExport={handleExport} />}
        </div>
      </div>
    </div>;
}