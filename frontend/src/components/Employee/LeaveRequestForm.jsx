import { useState, useEffect } from "react";
import { xinNghiPhep, getDonXinNghiByNV } from "../../api/apiNgayNghiPhep";
import { fetchNhanVien } from "../../api/apiTaiKhoan";
import { toast } from "react-toastify";

export function LeaveRequestForm() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [form, setForm] = useState({
    NgayBatDau: "",
    NgayKetThuc: "",
    MaTK: user.MaTK,
  });
  const [DonXinNghi, setDonXinNghi] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (new Date(form.NgayKetThuc) <= new Date(form.NgayBatDau)) {
        toast.warning("Ngày kết thúc phải sau ngày bắt đầu!");
        return;
      }
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (new Date(form.NgayBatDau) < today || new Date(form.NgayKetThuc) < today) {
        toast.warning("Ngày bắt đầu hoặc ngày kết thúc không được ở quá khứ!");
        return;
      }
      const response = await xinNghiPhep(form);
      if (!response.success) {
        toast.error(response.message);
        return;
      }
      toast.success("Gửi yêu cầu thành công");
      setForm({
        NgayBatDau: "",
        NgayKetThuc: "",
        MaTK: user.MaTK,
      });
      fetchDonXinNghi();
    } catch (error) {
      console.log("Lỗi gửi yêu cầu xin nghĩ phép: " + error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchDonXinNghi = async () => {
    try {
      const response = await getDonXinNghiByNV(user.MaTK);
      setDonXinNghi(response);
    } catch (error) {
      console.log("Lỗi fetch đơn chờ duyệt: " + error);
    }
  };
  const refeshInfo = async () => {
    try {
      const res = await fetchNhanVien(user.MaTK);
      setUser(res);
    } catch (error) {
      console.log("Lỗi: ", error);
    }
  };
  useEffect(() => {
    refeshInfo();
    fetchDonXinNghi();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Chờ duyệt":
        return "text-yellow-600 bg-yellow-100";
      case "Đã duyệt":
        return "text-green-600 bg-green-100";
      case "Từ chối":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded mt-2">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Gửi đơn xin nghỉ phép năm
        </h3>
        <h6 className="mb-6"> Số ngày nghĩ còn lại: {user.SoNgayChuaNghi}</h6>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Từ ngày
              </label>
              <input
                type="date"
                name="NgayBatDau"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.NgayBatDau}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Đến ngày
              </label>
              <input
                type="date"
                name="NgayKetThuc"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.NgayKetThuc}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors"
            >
              Gửi yêu cầu
            </button>
          </div>
        </form>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Lịch sử đơn xin nghỉ phép
        </h3>
        {DonXinNghi.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Chưa có đơn xin nghỉ phép nào</p>
          </div>
        ) : (
          <div className="space-y-3">
            {DonXinNghi.map((don) => (
              <div
                key={don.MaNNP}
                className="bg-white p-4 rounded-lg shadow-sm border"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">
                          Từ ngày:
                        </span>
                        <p className="text-gray-800">
                          {formatDate(don.NgayBatDau)}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">
                          Đến ngày:
                        </span>
                        <p className="text-gray-800">
                          {formatDate(don.NgayKetThuc)}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">
                          Số ngày:
                        </span>
                        <p className="text-gray-800">{don.SoNgayNghi} ngày</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">
                          Ngày đăng ký:
                        </span>
                        <p className="text-gray-800">
                          {formatDate(don.NgayDangKy)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        don.TrangThai
                      )}`}
                    >
                      {don.TrangThai}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
