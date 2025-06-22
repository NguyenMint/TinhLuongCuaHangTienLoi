import { X } from "lucide-react";

export const FileViewerModal = ({ show, onClose, hopdong }) => {
  if (!show || !hopdong) return null;
  const fileExtension = hopdong.File.split(".").pop().toLowerCase();
  const isImage = ["png", "jpg", "jpeg", "gif"].includes(fileExtension);
  const isPDF = fileExtension === "pdf";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg max-w-5xl w-full h-[90vh] p-4 overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{hopdong.TenHD}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 text-2xl"
          >
            <X />
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="flex-1 overflow-auto">
            {isImage ? (
              <img
                src={`${process.env.REACT_APP_BACKEND_URL}/${hopdong.File}`}
                alt={hopdong.TenHD}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.alt = "Không thể tải hình ảnh";
                  e.target.className =
                    "w-full h-full flex items-center justify-center text-gray-500";
                }}
              />
            ) : isPDF ? (
              <iframe
                src={`${process.env.REACT_APP_BACKEND_URL}/${hopdong.File}`}
                title={hopdong.TenHD}
                onError={(e) => {
                  e.target.alt = "Không thể tải hình ảnh";
                  e.target.className =
                    "w-full h-full flex items-center justify-center text-gray-500";
                }}
                className="w-full h-[80vh] border-0"
                style={{ overflow: "auto" }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                Định dạng tệp không được hỗ trợ: {fileExtension}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
