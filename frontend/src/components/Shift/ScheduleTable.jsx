import React from 'react';
import { format, addDays, startOfWeek } from 'date-fns';
import { vi } from 'date-fns/locale';
import { PlusIcon, InfoIcon } from 'lucide-react';
import { mockEmployees, mockScheduleData } from '../../utils/mockData.ts';
export const ScheduleTable = ({
  currentDate,
  onAddShift
}) => {
  const startDate = startOfWeek(currentDate, {
    weekStartsOn: 1
  });
  const weekDays = Array.from({
    length: 7
  }, (_, i) => addDays(startDate, i));
  const getShiftForDay = (employeeId, date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return mockScheduleData[employeeId]?.[dateKey];
  };
  const renderShift = (employee, date) => {
    const shift = getShiftForDay(employee.id, date);
    const bgColors = {
      'Ca sáng': 'bg-blue-50 text-blue-700',
      'Ca chiều': 'bg-green-50 text-green-700',
      'Ca tối': 'bg-orange-50 text-orange-700'
    };
    return <div className="group relative h-full min-h-[40px] flex items-center">
        {shift ? <div className={`p-2 rounded w-full ${bgColors[shift]}`}>{shift}</div> : <button onClick={() => onAddShift(employee, date)} className="flex items-center text-blue-600 hover:text-blue-800 opacity-0 group-hover:opacity-100 transition-opacity absolute inset-0 justify-center">
            <PlusIcon className="h-4 w-4 mr-1" />
            <span>Thêm ca</span>
          </button>}
      </div>;
  };
  return <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nhân viên
            </th>
            {weekDays.map((day, index) => <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {format(day, 'EEEE d', {
              locale: vi
            })}
              </th>)}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex items-center">
                Lương dự kiến
                <InfoIcon className="h-4 w-4 ml-1 text-gray-400" />
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {mockEmployees.map(employee => <tr key={employee.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {employee.name}
                  </div>
                  <div className="text-sm text-gray-500">{employee.id}</div>
                </div>
              </td>
              {weekDays.map((day, index) => <td key={index} className="px-6 py-4 whitespace-nowrap">
                  {renderShift(employee, day)}
                </td>)}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                Chưa thiết lập lương
              </td>
            </tr>)}
        </tbody>
      </table>
    </div>;
};