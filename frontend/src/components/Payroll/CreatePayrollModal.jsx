import { useEffect, useState } from "react";

export function CreatePayrollModal({
  setShowCreatePayroll,
  employees,
  onSave,
}) {
  const [form, setForm] = useState({
    MaTK: [],
    Thang: "",
    Nam: "",
  });

  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle employee selection
  const handleEmployeeSelect = (employeeMaTK) => {
    setForm((prev) => ({
      ...prev,
      MaTK: prev.MaTK.includes(employeeMaTK)
        ? prev.MaTK.filter((id) => id !== employeeMaTK)
        : [...prev.MaTK, employeeMaTK],
    }));
  };

  // Handle select all employees
  const handleSelectAll = () => {
    const filteredEmployees = getFilteredEmployees();
    const allSelected = filteredEmployees.every((emp) =>
      form.MaTK.includes(emp.MaTK)
    );

    if (allSelected) {
      // Bỏ chọn tất cả nhân viên đã lọc
      setForm((prev) => ({
        ...prev,
        MaTK: prev.MaTK.filter(
          (id) => !filteredEmployees.some((emp) => emp.MaTK === id)
        ),
      }));
    } else {
      // Chọn tất cả nhân viên đã lọc
      const newSelections = filteredEmployees
        .filter((emp) => !form.MaTK.includes(emp.MaTK))
        .map((emp) => emp.MaTK);

      setForm((prev) => ({
        ...prev,
        MaTK: [...prev.MaTK, ...newSelections],
      }));
    }
  };

  const getFilteredEmployees = () => {
    if (!employees || !Array.isArray(employees)) {
      return [];
    }
    return employees.filter(
      (employee) =>
        employee.HoTen?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.Email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.MaTK.length === 0) {
      alert("Vui lòng chọn ít nhất một nhân viên!");
      return;
    }

    if (!form.Thang || !form.Nam) {
      alert("Vui lòng chọn tháng và năm!");
      return;
    }

    onSave(form);
  };

  const handleClickOutside = () => {
    setShowEmployeeDropdown(false);
  };

  const filteredEmployees = getFilteredEmployees();
  const selectedCount = form.MaTK.length;

  // Fixed: Use MaTK instead of id for consistency
  const allFilteredSelected =
    filteredEmployees.length > 0 &&
    filteredEmployees.every((emp) => form.MaTK.includes(emp.MaTK));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="relative w-full max-w-4xl mx-auto">
        <form
          className="bg-white p-6 rounded shadow-lg relative z-10 max-h-[90vh] overflow-y-auto"
          onSubmit={handleSubmit}
        >
          <h2 className="text-xl font-bold mb-4 text-center">
            Tạo bảng lương mới
          </h2>

          {/* Employee Selection */}
          <div className="mb-4 relative">
            <label className="block mb-1 font-medium">
              Chọn nhân viên ({selectedCount} đã chọn)
            </label>

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm nhân viên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setShowEmployeeDropdown(true)}
                className="w-full border rounded px-3 py-2 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowEmployeeDropdown(!showEmployeeDropdown)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showEmployeeDropdown ? "▲" : "▼"}
              </button>
            </div>

            {/* Employee Dropdown */}
            {showEmployeeDropdown && (
              <div className="absolute z-30 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {/* Select All Option */}
                {filteredEmployees.length > 0 && (
                  <div className="px-3 py-2 border-b border-gray-200 bg-gray-50">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={allFilteredSelected}
                        onChange={handleSelectAll}
                        className="mr-2"
                      />
                      <span className="font-medium">
                        {allFilteredSelected
                          ? "Bỏ chọn tất cả "
                          : "Chọn tất cả "}
                        ({filteredEmployees.length} nhân viên)
                      </span>
                    </label>
                  </div>
                )}

                {/* Employee List */}
                {filteredEmployees.length === 0 ? (
                  <div className="px-3 py-2 text-gray-500">
                    {employees && employees.length > 0
                      ? "Không tìm thấy nhân viên nào"
                      : "Không có nhân viên nào"}
                  </div>
                ) : (
                  filteredEmployees.map((employee) => (
                    <div
                      key={employee.MaTK}
                      className="px-3 py-2 hover:bg-gray-100"
                    >
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.MaTK.includes(employee.MaTK)}
                          onChange={() => handleEmployeeSelect(employee.MaTK)}
                          className="mr-2"
                        />
                        <div className="flex-1">
                          <div className="font-medium">{employee.HoTen}</div>
                          <div className="text-sm text-gray-500">
                            {employee.Email} • {employee.LoaiNV || "N/A"}
                          </div>
                        </div>
                      </label>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Selected Employees Display */}
            {selectedCount > 0 ? (
              <div className="mt-2">
                <div className="text-sm text-gray-600 mb-1">
                  Nhân viên đã chọn:
                </div>
                <div className="flex flex-wrap gap-1">
                  {form.MaTK.map((employeeMaTK) => {
                    const employee = employees?.find(
                      (emp) => emp.MaTK === employeeMaTK
                    );

                    return employee ? (
                      <span
                        key={employeeMaTK}
                        className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {employee.HoTen}
                        <button
                          type="button"
                          onClick={() => handleEmployeeSelect(employeeMaTK)}
                          className="ml-1 text-blue-600 hover:text-blue-800 font-bold"
                          title="Bỏ chọn nhân viên này"
                        >
                          ×
                        </button>
                      </span>
                    ) : (
                      <div key={employeeMaTK}></div>
                    );
                  })}
                </div>
              </div>
            ) : (
              // Add spacing if there are no selected employees
              <div className="mt-2" />
            )}
          </div>

          {/* Period Selection */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Chọn kì hạn</label>
            <div className="flex gap-4">
              {/* Select Month */}
              <div className="flex-1">
                <label className="block text-sm text-gray-600 mb-1">
                  Tháng
                </label>
                <select
                  name="Thang"
                  value={form.Thang}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  required
                >
                  <option value="">-- Chọn tháng --</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m}>
                      Tháng {m}
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Year */}
              <div className="flex-1">
                <label className="block text-sm text-gray-600 mb-1">Năm</label>
                <select
                  name="Nam"
                  value={form.Nam}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  required
                >
                  <option value="">-- Chọn năm --</option>
                  {Array.from(
                    { length: 10 },
                    (_, i) => new Date().getFullYear() - 5 + i
                  ).map((y) => (
                    <option key={y} value={y}>
                      Năm {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-between">
            <button
              type="button"
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded transition-colors"
              onClick={() => setShowCreatePayroll(false)}
            >
              Thoát
            </button>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={selectedCount === 0}
            >
              Tạo bảng lương ({selectedCount} nhân viên)
            </button>
          </div>
        </form>

        {/* Click outside to close dropdown */}
        {showEmployeeDropdown && (
          <div className="fixed inset-0 " onClick={handleClickOutside} />
        )}
      </div>
    </div>
  );
}
