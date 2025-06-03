import React from 'react';
const CheckInTab = ({
  formData,
  employees,
  onChange
}) => {
  const handleAttendanceTypeChange = type => {
    onChange('attendanceType', type);
  };
  const handleSubstituteChange = employeeId => {
    onChange('substituteId', employeeId);
  };
  const handleTimeChange = (field, value) => {
    onChange(field, value);
    // Calculate late or early minutes based on check-in/out times
    if (field === 'checkInTime' || field === 'checkOutTime') {
      const [hours, minutes] = value.split(':').map(Number);
      if (field === 'checkInTime') {
        const shiftStart = formData.shiftStartTime.split(':').map(Number);
        const lateMinutes = hours * 60 + minutes - (shiftStart[0] * 60 + shiftStart[1]);
        if (lateMinutes > 0) {
          const lateHours = Math.floor(lateMinutes / 60);
          const remainingMinutes = lateMinutes % 60;
          onChange('lateHours', lateHours);
          onChange('lateMinutes', remainingMinutes);
        } else {
          onChange('lateHours', 0);
          onChange('lateMinutes', 0);
        }
      }
      if (field === 'checkOutTime') {
        const shiftEnd = formData.shiftEndTime.split(':').map(Number);
        const earlyMinutes = shiftEnd[0] * 60 + shiftEnd[1] - (hours * 60 + minutes);
        if (earlyMinutes > 0) {
          const earlyHours = Math.floor(earlyMinutes / 60);
          const remainingMinutes = earlyMinutes % 60;
          onChange('earlyHours', earlyHours);
          onChange('earlyMinutes', remainingMinutes);
        } else {
          onChange('earlyHours', 0);
          onChange('earlyMinutes', 0);
        }
      }
    }
  };
  return <div>
      <div className="mb-6">
        <div className="font-medium mb-3">Chấm công</div>
        <div className="space-y-3">
          <label className="flex items-center">
            <input type="radio" name="attendanceType" checked={formData.attendanceType === 'working'} onChange={() => handleAttendanceTypeChange('working')} className="h-4 w-4 text-green-600" />
            <span className="ml-2">Đi làm</span>
          </label>
          <label className="flex items-center">
            <input type="radio" name="attendanceType" checked={formData.attendanceType === 'absent-approved'} onChange={() => handleAttendanceTypeChange('absent-approved')} className="h-4 w-4 text-green-600" />
            <span className="ml-2">Nghỉ có phép</span>
          </label>
          <label className="flex items-center">
            <input type="radio" name="attendanceType" checked={formData.attendanceType === 'absent-unapproved'} onChange={() => handleAttendanceTypeChange('absent-unapproved')} className="h-4 w-4 text-green-600" />
            <span className="ml-2">Nghỉ không phép</span>
          </label>
        </div>
      </div>
      {formData.attendanceType === 'absent-approved' && <div className="mb-6">
          <div className="relative">
            <input type="text" placeholder="Chọn nhân viên làm thay ca (nếu có)" className="w-full border rounded-md p-2 pl-8" value={formData.substituteId ? employees.find(e => e.id === formData.substituteId)?.name || '' : ''} onChange={e => {}} onClick={() => {}} />
            <svg className="w-5 h-5 text-gray-400 absolute left-2 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            {/* Dropdown for selecting substitute */}
            <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
              {employees.filter(e => e.id !== formData.employeeId).map(employee => <div key={employee.id} className="flex items-center p-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleSubstituteChange(employee.id)}>
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                      {employee.avatar ? <img src={employee.avatar} alt={employee.name} className="w-8 h-8 rounded-full" /> : <span className="text-sm">
                          {employee.name.charAt(0)}
                        </span>}
                    </div>
                    <div>
                      <div className="font-medium">{employee.name}</div>
                      <div className="text-xs text-gray-500">{employee.id}</div>
                    </div>
                  </div>)}
            </div>
          </div>
        </div>}
      {formData.attendanceType === 'working' && <>
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <label className="flex items-center">
                  <input type="checkbox" checked={formData.checkInTime !== undefined} onChange={e => {
                if (e.target.checked) {
                  onChange('checkInTime', formData.shiftStartTime);
                } else {
                  onChange('checkInTime', undefined);
                  onChange('lateHours', 0);
                  onChange('lateMinutes', 0);
                }
              }} className="h-4 w-4 text-green-600 rounded" />
                  <span className="ml-2">Vào</span>
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="time" value={formData.checkInTime || ''} onChange={e => handleTimeChange('checkInTime', e.target.value)} disabled={!formData.checkInTime} className="border rounded-md p-2" />
                <button className="text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                  </svg>
                </button>
              </div>
              {formData.lateMinutes > 0 && <div className="flex items-center">
                  <label className="flex items-center">
                    <input type="checkbox" checked={true} className="h-4 w-4 text-green-600 rounded" />
                    <span className="ml-2">Đi muộn</span>
                  </label>
                  <div className="flex items-center ml-4">
                    <input type="number" value={formData.lateHours || 0} onChange={e => onChange('lateHours', parseInt(e.target.value))} className="border rounded-md p-2 w-16" min="0" />
                    <span className="mx-2">giờ</span>
                    <input type="number" value={formData.lateMinutes || 0} onChange={e => onChange('lateMinutes', parseInt(e.target.value))} className="border rounded-md p-2 w-16" min="0" max="59" />
                    <span className="ml-2">phút</span>
                  </div>
                </div>}
            </div>
          </div>
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <label className="flex items-center">
                  <input type="checkbox" checked={formData.checkOutTime !== undefined} onChange={e => {
                if (e.target.checked) {
                  onChange('checkOutTime', formData.shiftEndTime);
                } else {
                  onChange('checkOutTime', undefined);
                  onChange('earlyHours', 0);
                  onChange('earlyMinutes', 0);
                }
              }} className="h-4 w-4 text-green-600 rounded" />
                  <span className="ml-2">Ra</span>
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="time" value={formData.checkOutTime || ''} onChange={e => handleTimeChange('checkOutTime', e.target.value)} disabled={!formData.checkOutTime} className="border rounded-md p-2" />
                <button className="text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                  </svg>
                </button>
              </div>
              {formData.earlyMinutes > 0 && <div className="flex items-center">
                  <label className="flex items-center">
                    <input type="checkbox" checked={true} className="h-4 w-4 text-green-600 rounded" />
                    <span className="ml-2">Về sớm</span>
                  </label>
                  <div className="flex items-center ml-4">
                    <input type="number" value={formData.earlyHours || 0} onChange={e => onChange('earlyHours', parseInt(e.target.value))} className="border rounded-md p-2 w-16" min="0" />
                    <span className="mx-2">giờ</span>
                    <input type="number" value={formData.earlyMinutes || 0} onChange={e => onChange('earlyMinutes', parseInt(e.target.value))} className="border rounded-md p-2 w-16" min="0" max="59" />
                    <span className="ml-2">phút</span>
                  </div>
                </div>}
            </div>
          </div>
        </>}
    </div>;
};
export default CheckInTab;