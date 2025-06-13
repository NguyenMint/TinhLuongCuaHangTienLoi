import { useState } from "react";
export function LeaveRequestForm() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Gọi API xin nghỉ phép ở đây
    setMessage("Gửi yêu cầu nghỉ phép thành công!");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded mt-2">
      <div className="mb-2">
        <label className="block mb-1">Từ ngày</label>
        <input
          type="date"
          className="w-full border rounded px-3 py-2"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          required
        />
      </div>
      <div className="mb-2">
        <label className="block mb-1">Đến ngày</label>
        <input
          type="date"
          className="w-full border rounded px-3 py-2"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          required
        />
      </div>
      <div className="mb-2">
        <label className="block mb-1">Lý do</label>
        <textarea
          className="w-full border rounded px-3 py-2"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
        />
      </div>
      {message && <div className="text-green-600 mb-2">{message}</div>}
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Gửi yêu cầu
      </button>
    </form>
  );
}
