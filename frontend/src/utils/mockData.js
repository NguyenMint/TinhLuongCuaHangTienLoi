import { format } from "date-fns";

const mockEmployees = [
  { MaTK: 'NV001', HoTen: 'Nguyễn Văn An' },
  { MaTK: 'NV002', HoTen: 'Trần Thị Bình' },
  { MaTK: 'NV003', HoTen: 'Lê Văn Cường' },
];

const mockShifts = [
  {
    MaCa: 1,
    TenCa: 'Ca sáng',
    ThoiGianBatDau: '08:00',
    ThoiGianKetThuc: '12:00',
  },
  {
    MaCa: 2,
    TenCa: 'Ca chiều',
    ThoiGianBatDau: '13:00',
    ThoiGianKetThuc: '17:00',
  },
  {
    MaCa: 3,
    TenCa: 'Ca tối',
    ThoiGianBatDau: '18:00',
    ThoiGianKetThuc: '22:00',
  },
];

const mockSchedules = [
  {
    id: 'SCH001',
    employeeId: 'NV001',
    employeeName: 'Nguyễn Văn An',
    shiftTime: 'morning',
    day: format(new Date('2025-06-02'), 'yyyy-MM-dd'),
    checkInTime: '08:00',
    checkOutTime: '12:00',
    status: 'normal',
    lateMinutes: 0,
    earlyMinutes: 0,
    lateHours: 0,
    earlyHours: 0,
  },
  {
    id: 'SCH002',
    employeeId: 'NV001',
    employeeName: 'Nguyễn Văn An',
    shiftTime: 'afternoon',
    day: format(new Date('2025-06-03'), 'yyyy-MM-dd'),
    checkInTime: '13:15',
    checkOutTime: '17:00',
    status: 'late',
    lateMinutes: 15,
    earlyMinutes: 0,
    lateHours: 0,
    earlyHours: 0,
  },
  {
    id: 'SCH003',
    employeeId: 'NV002',
    employeeName: 'Trần Thị Bình',
    shiftTime: 'evening',
    day: format(new Date('2025-06-04'), 'yyyy-MM-dd'),
    checkInTime: '18:00',
    checkOutTime: '21:45',
    status: 'early',
    lateMinutes: 0,
    earlyMinutes: 15,
    lateHours: 0,
    earlyHours: 0,
  },
  {
    id: 'SCH004',
    employeeId: 'NV003',
    employeeName: 'Lê Văn Cường',
    shiftTime: 'morning',
    day: format(new Date('2025-06-05'), 'yyyy-MM-dd'),
    checkInTime: '08:05',
    checkOutTime: '12:00',
    status: 'late',
    lateMinutes: 5,
    earlyMinutes: 0,
    lateHours: 0,
    earlyHours: 0,
  },
];

export { mockEmployees, mockShifts, mockSchedules };