# Excel Export Utility

## Mô tả

File `excelExport.js` chứa các hàm utility để xuất dữ liệu ra file Excel sử dụng thư viện ExcelJS và file-saver.

## Hàm exportPayrollToExcel

### Mô tả

Hàm xuất danh sách bảng lương nhân viên ra file Excel với định dạng chuyên nghiệp.

### Tham số

- `phieuLuongs` (Object): Dữ liệu bảng lương từ API có cấu trúc:
  ```javascript
  {
    KyLuong: "01/05/2025 - 31/05/2025",
    employees: [
      {
        MaBangLuong: 232,
        MaNhanVien: "FT0003",
        HoTen: "Lê Văn Đạt",
        TongLuong: "0.00",
        TongPhuCap: "0.00",
        TongThuong: "0.00",
        TongPhat: "0.00",
        ThuePhaiDong: "0.00",
        LuongThucNhan: "0.00"
      }
      // ... các nhân viên khác
    ]
  }
  ```
- `selectedKyLuong` (string): Kỳ lương được chọn (tùy chọn)

### Tính năng

1. **Tiêu đề chuyên nghiệp**: Tiêu đề chính và thông tin kỳ lương
2. **Headers có màu sắc**: Headers với màu xanh dương và chữ trắng
3. **Định dạng số tiền**: Sử dụng định dạng số có dấu phẩy ngăn cách hàng nghìn
4. **Căn chỉnh dữ liệu**:
   - Cột STT và Mã nhân viên: căn giữa
   - Các cột số tiền: căn phải
5. **Dòng tổng cộng**: Tự động tính tổng các cột số tiền với màu xanh lá
6. **Border cho tất cả ô**: Tạo khung cho bảng dữ liệu
7. **Footer**: Thông tin ngày xuất báo cáo
8. **Tên file tự động**: Tên file dựa trên kỳ lương

### Cách sử dụng

```javascript
import { exportPayrollToExcel } from "../utils/excelExport";

// Trong component
const handleExport = async () => {
  try {
    await exportPayrollToExcel(phieuLuongs, selectedKyLuong);
    alert("Xuất file Excel thành công!");
  } catch (error) {
    console.error("Lỗi khi export file Excel:", error);
    alert("Có lỗi xảy ra khi xuất file Excel!");
  }
};
```

### Cấu trúc file Excel xuất ra

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    DANH SÁCH BẢNG LƯƠNG NHÂN VIÊN                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                        Kỳ lương: 01/05/2025 - 31/05/2025                   │
├─────┬─────────────┬──────────────────────────────┬─────────┬─────────┬─────┤
│ STT │ Mã nhân viên│ Họ tên                       │ Tổng    │ Tổng    │ ... │
│     │             │                              │ lương   │ phụ cấp │     │
├─────┼─────────────┼──────────────────────────────┼─────────┼─────────┼─────┤
│  1  │   FT0003    │ Lê Văn Đạt                   │    0    │    0    │ ... │
│  2  │   QL0001    │ Nguyễn Minh Trường           │    0    │    0    │ ... │
├─────┼─────────────┼──────────────────────────────┼─────────┼─────────┼─────┤
│     │ TỔNG CỘNG   │                              │    0    │    0    │ ... │
├─────────────────────────────────────────────────────────────────────────────┤
│              Xuất báo cáo ngày: 20/12/2024                                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Lưu ý

- Cần cài đặt thư viện `exceljs` và `file-saver`
- Hàm sẽ tự động download file Excel về máy người dùng
- Tên file sẽ có định dạng: `Bang_luong_01-05-2025---31-05-2025.xlsx`
