export const mockEmployees = [{
  id: 'NV000001',
  name: 'Nhân viên 1',
  avatar: null
}, {
  id: 'NV000002',
  name: 'Nhân viên 2',
  avatar: null
}, {
  id: 'NV000003',
  name: 'Nhân viên 3',
  avatar: null
}];
export const mockShiftData = [{
  id: 1,
  employeeName: 'Nhân viên 1',
  employeeId: 'NV000001',
  day: 1,
  // Tuesday
  shiftTime: 'afternoon',
  shiftName: 'Ca chiều',
  shiftStartTime: '13:00',
  shiftEndTime: '17:00',
  checkInTime: '15:59',
  checkOutTime: '16:00',
  lateHours: 2,
  lateMinutes: 59,
  earlyHours: 1,
  earlyMinutes: 0,
  date: 'Thứ 2, 02/06/2025',
  status: 'late',
  attendanceType: 'working',
  attendanceHistory: [{
    timestamp: '02/06/2025 15:59',
    status: 'Đã chấm công vào',
    method: 'Trình duyệt web điện thoại',
    details: 'Giờ vào: 15:59'
  }, {
    timestamp: '02/06/2025 16:00',
    status: 'Đã chấm công ra',
    method: 'Trình duyệt web điện thoại',
    details: 'Giờ vào: 15:59, đi muộn: 2 giờ 59 phút. Giờ ra: 16:00, về sớm: 1 giờ'
  }],
  violations: [{
    id: 1,
    type: 'Đi muộn',
    count: 1,
    level: 'Khiển trách',
    amount: 50000
  }],
  rewards: []
}, {
  id: 2,
  employeeName: 'Nhân viên 1',
  employeeId: 'NV000001',
  day: 2,
  // Wednesday
  shiftTime: 'evening',
  shiftName: 'Ca tối',
  shiftStartTime: '18:00',
  shiftEndTime: '22:00',
  checkInTime: '18:00',
  checkOutTime: '22:00',
  lateHours: 0,
  lateMinutes: 0,
  earlyHours: 0,
  earlyMinutes: 0,
  date: 'Thứ 3, 03/06/2025',
  status: 'present',
  attendanceType: 'working',
  attendanceHistory: [{
    timestamp: '03/06/2025 18:00',
    status: 'Đã chấm công vào',
    method: 'Trình duyệt web điện thoại',
    details: 'Giờ vào: 18:00'
  }, {
    timestamp: '03/06/2025 22:00',
    status: 'Đã chấm công ra',
    method: 'Trình duyệt web điện thoại',
    details: 'Giờ ra: 22:00'
  }],
  violations: [],
  rewards: [{
    id: 1,
    type: 'Đi làm đúng giờ',
    count: 1,
    value: 'Khen thưởng',
    amount: 50000
  }]
}];