import React from "react";

const Shift = ({ shifts , setSelectedShifts, selectedShifts }) => {
  // const [shifts, setShifts] = useState([]);
//   const [selectedShifts, setSelectedShifts] = useState({});

  const handleCheckboxChange = (MaCa) => (e) => {
    setSelectedShifts((prev) => ({
      ...prev,
      [MaCa]: e.target.checked,
    }));
  };

    // useEffect(() => {
    //     console.log("Selected shifts:", selectedShifts);
    // }, [selectedShifts]);

  return (
    <div className="space-y-4">
      {shifts.map((shift) => (
        <label key={shift.MaCa} className="flex items-center">
          <input
            type="checkbox"
            checked={!!selectedShifts[shift.MaCa]}
            onChange={handleCheckboxChange(shift.MaCa)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="ml-3">
            <span className="text-sm font-medium text-gray-900">
              {shift.TenCa}
            </span>
            <span className="text-sm text-gray-500 ml-2">
              {shift.ThoiGianBatDau} - {shift.ThoiGianKetThuc}
            </span>
          </span>
        </label>
      ))}
    </div>
  );
};

export default Shift;
